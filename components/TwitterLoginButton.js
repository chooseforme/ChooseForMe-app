import twitter, { TWLoginButton, decodeHTMLEntities, getRelativeTime } from 'react-native-simple-twitter';
import React from 'react';
import {
  View,
  Alert,
  StyleSheet,
  AsyncStorage,
  DeviceEventEmitter,
} from 'react-native';
import * as firebase from 'firebase';
import { Button, Text } from 'native-base';

export default class TwitterLoginButton extends React.Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props);
  }

  async componentDidMount() {

  }

  onGetAccessToken = ({ oauth_token: token, oauth_token_secret: tokenSecret }) => {
    this.props._isLoggingIn(true);
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(function () {
      const credential = firebase.auth.TwitterAuthProvider.credential(token, tokenSecret);
      firebase.auth().signInWithCredential(credential).then().catch(error => {
        console.log(error);
        this.props._isLoggingIn(false);
        DeviceEventEmitter.emit('showToast', error.message);
      });

    }).catch(error => {
      console.log(error);
      this.props._isLoggingIn(false);
    });
  }

  onSuccess = async (user) => {

  }

  onPress = (e) => {
  }

  onClose = (e) => {
    this.props._isLoggingIn(false);
    DeviceEventEmitter.emit('showToast', "Login Cancelled");

    console.log('press close button');
  }

  onError = (err) => {
    
    this.props._isLoggingIn(false);
    DeviceEventEmitter.emit('showToast', err.message);
    console.log(err);
  }

  render() {
    return (
      <TWLoginButton rounded
        style={{
          width: 300,
          height: 60,
          backgroundColor: "#1dcaff",
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 15,
          borderRadius: 30,
        }}
        type="TouchableOpacity"
        onPress={this.onPress}
        onGetAccessToken={this.onGetAccessToken}
        onSuccess={this.onSuccess}
        onClose={this.onClose}
        onError={this.onError}
      >
        <Text style={{ fontFamily: "Roboto_medium", color: '#ffffff' }}>Continue with Twitter</Text>
      </TWLoginButton>
    );
  }
}