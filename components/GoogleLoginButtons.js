import React, { Component } from 'react';
import { View, TouchableOpacity,DeviceEventEmitter, Alert  } from 'react-native';
import { Text } from 'native-base';
import * as firebase from 'firebase';

export default class FBLoginButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  async _loginWithGoogle() {
    try {
      const result = await Expo.Google.logInAsync({
        androidClientId: Expo.Constants.manifest.extra.ios.clientId,
        iosClientId: Expo.Constants.manifest.extra.android.clientId,
        scopes: ["profile", "email"]
      });
  
      if (result.type === "success") {
        this.props._isLoggingIn(true);
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
            this.props._isLoggingIn(false);
            DeviceEventEmitter.emit('showToast', error.message);
            console.log("firebase cred err:", error);
          });
        }).catch(error=> {
          this.props._isLoggingIn(false);
          DeviceEventEmitter.emit('showToast', error.message);
          console.log(error)
        });
       
      } else {
        DeviceEventEmitter.emit('showToast', "Login Cancelled");
        return { cancelled: true };
      }
    } catch (err) {
      DeviceEventEmitter.emit('showToast', err.message);
      console.log("err:", err);
    }
  }

  render() {
    return (
        <TouchableOpacity style={{
            width: 300,
            height: 60,
            backgroundColor: "#ffffff",
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 15,
            borderRadius:30,
        }} onPress={()=>this._loginWithGoogle()}>
            <Text style={{fontFamily:"Roboto_medium", color: '#000000' }}>Continue with Google</Text>
        </TouchableOpacity>
    );
  }
}

