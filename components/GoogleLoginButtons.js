import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import SignInWithGoogle from '../utils/signinWithGoogle';
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
            backgroundColor: "#ffffff",
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 15,
            borderRadius:30,
        }} onPress={SignInWithGoogle}>
            <Text style={{fontFamily:"Roboto_medium", color: '#000000' }}>Continue with Google</Text>
        </TouchableOpacity>
    );
  }
}
