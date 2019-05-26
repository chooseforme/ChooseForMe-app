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

class TwitterLoginButton extends React.Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props);
  }

  onSetLoggingIn = (loggingin) => {
    this.props.setLoggingIn(loggingin);
  }

  onGetAccessToken = ({ oauth_token: token, oauth_token_secret: tokenSecret }) => {
    this.onSetLoggingIn(true);
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(()=> {
      const credential = firebase.auth.TwitterAuthProvider.credential(token, tokenSecret);
      firebase.auth().signInWithCredential(credential).then().catch(error => {
        console.log(error);
        DeviceEventEmitter.emit('showToast', error.message);
        this.onSetLoggingIn(false);
      });

    }).catch(error => {
      console.log(error);
      this.onSetLoggingIn(false);
    });
  }

  onSuccess = async (user) => {

  }

  onPress = (e) => {

  }

  onClose = (e) => {
    //DeviceEventEmitter.emit('showToast', "Login Cancelled");
    console.log('press close button');
  }

  onError = (err) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(TwitterLoginButton);