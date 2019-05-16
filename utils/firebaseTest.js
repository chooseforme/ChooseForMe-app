/**
 * External dependencies
 */
import { auth } from 'react-native-twitter';
import * as firebase from 'firebase';
import Expo, { AuthSession } from 'expo';

/**
 * Internal dependencies
 */

/**
 * Set Firebase's authentication persistence
 *
 * @param  {Function} onSuccess
 * @param  {Function} onError
 *
 * @return {Void}
 */
export const authPersist = (onSuccess, onError) =>
	firebase
		.auth()
		.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
		.then(onSuccess)
		.catch(onError);

/**
 * Sign up with email and password using Firebase
 *
 * @param  {String}   email
 * @param  {String}   password
 * @param  {Function} onSuccess
 * @param  {Function} onError
 *
 * @return {Void}
 */
export const authSignUp = (email, password, onSuccess, onError) =>
	authPersist(_ =>
		firebase
			.auth()
			.createUserWithEmailAndPassword(email, password)
			.then(onSuccess)
			.catch(onError)
	);

/**
 * Login with email and password using Firebase
 *
 * @param  {String}   email
 * @param  {String}   password
 * @param  {Function} onSuccess
 * @param  {Function} onError
 *
 * @return {Void}
 */
export const authLogin = (email, password, onSuccess, onError) =>
	authPersist(_ =>
		firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.then(onSuccess)
			.catch(onError)
	);

/**
 * Detect Firebase's authentication status
 *
 * @param  {Function} onSuccess
 *
 * @return {Void}
 */
export const authDetect = onSuccess =>
	firebase.auth().onAuthStateChanged(user => onSuccess(user));

/**
 * Sign out using Firebase
 *
 * @param  {Function} onSuccess
 * @param  {Function} onError
 *
 * @return {Void}
 */
export const authSignOut = (onSuccess, onError) =>
	firebase
		.auth()
		.signOut()
		.then(onSuccess)
		.catch(onError);

/**
 * Delete user from Firebase
 *
 * @param  {Function} onSuccess
 * @param  {Function} onError
 *
 * @return {Void}
 */
export const authDelete = (onSuccess, onError) => {
	const user = firebase.auth().currentUser;

	user.delete()
		.then(onSuccess)
		.catch(onError);
};

/**
 * Send password reset email using Firebase
 *
 * @param  {String}   email
 * @param  {Function} onSuccess
 * @param  {Function} onError
 *
 * @return {Void}
 */
export const sendPasswordResetEmail = (email, onSuccess, onError) =>
	firebase
		.auth()
		.sendPasswordResetEmail(email)
		.then(onSuccess)
		.catch(onError);

/**
 * Login with Google and keep the session in Firebase
 *
 * @param  {Function} onSuccess
 * @param  {Function} onError
 *
 * @return {Void}
 */
export const authWithGoogle = async (onSuccess, onError) => {
	// prettier-ignore
	const iosClientId = '<IOS_CLIENT_ID>';

	// prettier-ignore
	const androidCliendId = '<ANDROID_CLIENT_ID>';

	try {
		const result = await Expo.Google.logInAsync({
			androidCliendId,
			iosClientId,
			scopes: ['profile', 'email']
		});

		if (result.type === 'success') {
			const { idToken, accessToken } = result;
			const credential = firebase.auth.GoogleAuthProvider.credential(
				idToken,
				accessToken
			);

			firebase
				.auth()
				.signInAndRetrieveDataWithCredential(credential)
				.then(onSuccess)
				.catch(onError);
		} else {
			onError({
				cancelled: true
			});
		}
	} catch (error) {
		onError(error);
	}
};

/**
 * Login with Facebook and keep the session in Firebase
 *
 * @param  {Function} onSuccess
 * @param  {Function} onError
 *
 * @return {Void}
 */
export const authWithFacebook = async (onSuccess, onError) => {
	try {
		const result = await Expo.Facebook.logInWithReadPermissionsAsync(
			'<APP_ID>',
			{
				permissions: ['public_profile', 'email']
			}
		);

		if (result.type === 'success') {
			const { token } = result;
			const credential = firebase.auth.FacebookAuthProvider.credential(
				token
			);

			firebase
				.auth()
				.signInAndRetrieveDataWithCredential(credential)
				.then(onSuccess)
				.catch(onError);
		}
	} catch (error) {
		onError(error);
	}
};

/**
 * Login with Twitter and keep the session in Firebase
 *
 * @param  {Function} onSuccess
 * @param  {Function} onError
 *
 * @return {Void}
 */
export const authWithTwitter = (onSuccess, onError) => {
	const consumerKey = '<API_CONSUMER_KEY>';
	const consumerSecret = '<API_CONSUMER_SECRET>';
	const callbackUrl = AuthSession.getRedirectUrl();

	auth({ consumerKey, consumerSecret }, callbackUrl)
		.then(result => {
			const { accessToken, accessTokenSecret } = result;
			const credential = firebase.auth.TwitterAuthProvider.credential({
				token: accessToken,
				secret: accessTokenSecret
			});

			firebase
				.auth()
				.signInAndRetrieveDataWithCredential(credential)
				.then(onSuccess)
				.catch(onError);
		})
		.catch(error => onError(error));
};