import React, { Component } from 'react';
import { View, TouchableOpacity,DeviceEventEmitter, Alert  } from 'react-native';
import { Text } from 'native-base';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import { setLoggingIn } from '../redux/app-redux';


const mapStateToProps = (state) => {
  return {

  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setLoggingIn: (logging) => { dispatch(setLoggingIn(logging)) }
  };
}

class GoogleLoginButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  onSetLoggingIn = (loggingin) => {
    this.props.setLoggingIn(loggingin);
  }

  async _loginWithGoogle() {
    this.onSetLoggingIn(true);
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
            DeviceEventEmitter.emit('showToast', error.message);
            console.log("firebase cred err:", error);
          });
        }).catch(error=> {
          DeviceEventEmitter.emit('showToast', error.message);
          console.log(error)
        });
       
      } else {
        //DeviceEventEmitter.emit('showToast', "Login Cancelled");
        this.onSetLoggingIn(false);
        return { cancelled: true };
      }
    } catch (err) {
      DeviceEventEmitter.emit('showToast', err.message);
      console.log("err:", err);
      this.onSetLoggingIn(false);
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


export default connect(mapStateToProps, mapDispatchToProps)( GoogleLoginButton );