import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import SignInWithFacebook from '../utils/signInWithFacebook';
import { Text } from 'native-base';
export default class FBLoginButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
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
        }} onPress={SignInWithFacebook}>
            <Text style={{fontFamily:"Roboto_medium", color: '#ffffff' }}>Continue with Facebook</Text>
        </TouchableOpacity>
    );
  }
}
