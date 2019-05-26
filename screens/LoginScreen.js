import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, TouchableOpacity, View, StatusBar, Alert, ActivityIndicator, } from 'react-native';
import { Container, Header, Content, Text, Button } from 'native-base';
import FBLoginButton from '../components/FBLoginButton';
import TwitterButton from '../components/TwitterLoginButton';
import GoogleButton from '../components/GoogleLoginButtons';
import * as firebase from 'firebase';
import { DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';


const mapStateToProps = (state) => {
    return {
        loggingin: state.loggingin,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
    };
}

class LoginScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loggingIn: this.props.loggingin,
        };
    }

    static navigationOptions = {
        header: null,
    };

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
        this.unsubscribe();
    }

    _renderbutton() {
        if (!this.props.loggingin) {
            return <View
                style={{
                    flex: 1,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                }}
            >
                <FBLoginButton />
                <TwitterButton />
                <GoogleButton />
                <Text note>Hard to choose one...</Text>
            </View>
        }
        else {
            return <View
                style={{
                    flex: 1,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                }}
            >
                <ActivityIndicator size="large" color="#ffffff" />
                <Text note>Logging In...</Text>
            </View>
        }
    }

    render() {
        return (
            <Container style={{ marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, }}>
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
                    {this._renderbutton()}
                </View>
            </Container>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);