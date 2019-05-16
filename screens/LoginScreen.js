import React from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    StatusBar,
    Alert
} from 'react-native';
import { Container, Header, Content, Text, Button } from 'native-base';
import FBLoginButton from '../components/FBLoginButton';
import TwitterButton from '../components/TwitterLoginButton';
import GoogleButton from '../components/GoogleLoginButtons';
import * as firebase from 'firebase';
import Toast, {DURATION} from 'react-native-easy-toast'
import { DeviceEventEmitter } from 'react-native';

export default class LoginScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };
    
    componentDidMount() {
        this.listener = DeviceEventEmitter.addListener('showToast', (text) => {
        this.refs.toast.show(text);
        });
        }
        
    componentWillMount() {
        // Add listener here
        this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
            if (!user) {
                console.log("Not Logged In");
            }
            else {
                console.log("Logged In");
                this.props.navigation.navigate('Main');
            }
        });
    }

    componentWillUnmount() {
        // Don't forget to unsubscribe when the component unmounts
        if (this.listener) {
            this.listener.remove();
        }
        this.unsubscribe();
    }

    render() {
        return (
            <Container style={{marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,}}>
                <View style={{
                    flex: 1,
                    backgroundColor: '#281c3c',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                        <Image
                            style={{ width: 500, height: 150, resizeMode: 'contain' }}
                            source={require('../assets/images/app_logo-2.png')
                            }
                        />
                    </View>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                        }}
                    >
                        <FBLoginButton refs={this.refs}/>
                        <TwitterButton />
                        <GoogleButton />
                        <Text note>Hard to choose one...</Text>
                    </View>
                </View>
                <Toast ref="toast"/>
            </Container>
        );
    }
}