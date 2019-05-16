//import firebase from './firebase'
import * as firebase from 'firebase'
import { DeviceEventEmitter,Alert } from 'react-native';
export default async function signInWithFacebook() {
  const appId = Expo.Constants.manifest.extra.facebook.appId;
  const permissions = ['public_profile', 'email'];  // Permissions required, consult Facebook docs

  const {
    type,
    token,
  } = await Expo.Facebook.logInWithReadPermissionsAsync(
    appId,
    { permissions }
  );
  switch (type) {
    case 'success': {
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(function () {
        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        firebase.auth().signInWithCredential(credential).then(res => {
          // user res, create your user, do whatever you want
        })
          .catch(error => {
            console.log("firebase cred err:", error);
            Alert.alert("Login Failed", error.message);
          })  // Sign in with Facebook credential
        // Do something with Facebook profile data
        // OR you have subscribed to auth state change, authStateChange handler will process the profile data
      })
        .catch(error => {
          console.log(error);
          Alert.alert("Login Failed", error.message);
        })
    }
    case 'cancel': {
      DeviceEventEmitter.emit('showToast', "Login Failed");
      console.log("Login canceled by user");
    }
  }
}