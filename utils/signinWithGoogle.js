//import firebase from './firebase'
import * as firebase from 'firebase' 
export default async function _loginWithGoogle() {
  try {
    const result = await Expo.Google.logInAsync({
      androidClientId: Expo.Constants.manifest.extra.ios.clientId,
      iosClientId: Expo.Constants.manifest.extra.android.clientId,
      scopes: ["profile", "email"]
    });

    if (result.type === "success") {
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(function(){
      const { idToken, accessToken } = result;
      const credential = firebase.auth.GoogleAuthProvider.credential(idToken, accessToken);
      firebase
        .auth()
        .signInWithCredential(credential)
        .then(res => {
          // user res, create your user, do whatever you want
        })
        .catch(error => {
          console.log("firebase cred err:", error);
        });
      }).catch(error=> console.log(error))
    } else {
      return { cancelled: true };
    }
  } catch (err) {
    console.log("err:", err);
  }
};