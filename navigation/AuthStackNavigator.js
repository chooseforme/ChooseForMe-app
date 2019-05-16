import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator} from 'react-navigation';
import LoginScreen from '../screens/LoginScreen';

const LoginStack = createStackNavigator(
    {
        Login: {
            screen: LoginScreen,
        },
    },
    {
        initialRouteName: 'Login',
        headerMode: "none",
    }
);

export default LoginStack;
