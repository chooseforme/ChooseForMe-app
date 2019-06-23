import React, { Component } from 'react';
import { View, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import SignInWithFacebook from '../../utils/signInWithFacebook';
import { Text } from 'native-base';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import { setLoggingIn } from '../../redux/app-redux';


const mapStateToProps = (state) => {
  return {

  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setLoggingIn: (logging) => { dispatch(setLoggingIn(logging)) }
  };
}


class FBLoginButton extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  onSetLoggingIn = (loggingin) => {
    this.props.setLoggingIn(loggingin);
  }

  async signInWithFacebook() {
    this.onSetLoggingIn(true);
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
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
          const credential = firebase.auth.FacebookAuthProvider.credential(token);
          firebase.auth().signInWithCredential(credential).then(res => {
            // user res, create your user, do whatever you want
            // console.log(res);
            var db = firebase.firestore();
            db.collection("users").doc(res.user.uid).set({
              displayName: res.user.displayName,
              email: res.user.providerData[0].email,
              photoURL: res.user.photoURL,
          },{ merge: true})
          .then(function() {
              console.log("Document successfully written!");
          })
          .catch(function(error) {
              console.error("Error writing document: ", error);
          });
          
          })
            .catch(error => {
              console.log("firebase cred err:", error);
              DeviceEventEmitter.emit('showToast', error.message);

              this.onSetLoggingIn(false);
            })  // Sign in with Facebook credential
          // Do something with Facebook profile data
          // OR you have subscribed to auth state change, authStateChange handler will process the profile data
        })
          .catch(error => {
            console.log(error);
            DeviceEventEmitter.emit('showToast', error.message);

            this.onSetLoggingIn(false);
          })
      }
      case 'cancel': {
        this.onSetLoggingIn(false);
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
        borderRadius: 30,
      }} onPress={() => this.signInWithFacebook()}>
        <Text style={{ fontFamily: "Roboto_medium", color: '#ffffff' }}>Continue with Facebook</Text>
      </TouchableOpacity>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FBLoginButton);