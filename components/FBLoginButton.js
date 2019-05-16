import React, { Component } from 'react';
import { View, TouchableOpacity, DeviceEventEmitter} from 'react-native';
import SignInWithFacebook from '../utils/signInWithFacebook';
import { Text } from 'native-base';
import * as firebase from 'firebase';

export default class FBLoginButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  async signInWithFacebook() {
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
        this.props._isLoggingIn(true);
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(function () {
          const credential = firebase.auth.FacebookAuthProvider.credential(token);
          firebase.auth().signInWithCredential(credential).then(res => {
            // user res, create your user, do whatever you want
          })
            .catch(error => {
              this.props._isLoggingIn(false);
              console.log("firebase cred err:", error);
              DeviceEventEmitter.emit('showToast', error.message);
            })  // Sign in with Facebook credential
          // Do something with Facebook profile data
          // OR you have subscribed to auth state change, authStateChange handler will process the profile data
        })
          .catch(error => {
            this.props._isLoggingIn(false);
            console.log(error);
            DeviceEventEmitter.emit('showToast', error.message);
          })
      }
      case 'cancel': {
      }
    }
  }

  render() {
    return (
        <TouchableOpacity style={{
            width: 300,
            height: 60,
            backgroundColor: "#3C5A99",
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 15,
            borderRadius:30,
        }} onPress={()=>this.signInWithFacebook()}>
            <Text style={{fontFamily:"Roboto_medium", color: '#ffffff' }}>Continue with Facebook</Text>
        </TouchableOpacity>
    );
  }
}
