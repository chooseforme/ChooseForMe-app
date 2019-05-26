import React from 'react';
import { Platform, StatusBar, StyleSheet, View, DeviceEventEmitter } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import * as firebase from 'firebase'  // Should not be used elsewhere in the project
import twitter from 'react-native-simple-twitter';
import Toast, { DURATION } from 'react-native-easy-toast';
import { Provider } from 'react-redux';
import { store } from './redux/app-redux';


export default class App extends React.Component {
  componentWillMount() {
    firebase.initializeApp(Expo.Constants.manifest.extra.firebase);
  }

  state = {
    isLoadingComplete: false,
  };


  componentWillUnmount() {
    // Don't forget to unsubscribe when the component unmounts
    if (this.listener) {
      this.listener.remove();
    }
  }
  componentDidMount() {
    this.listener = DeviceEventEmitter.addListener('showToast', (text) => {
      this.refs.toast.show(text, 5000);
    });
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <Provider store={store}>
          <View style={styles.container}>
            {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
            <AppNavigator />
            <Toast ref="toast" />
          </View>
        </Provider>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
        require('./assets/images/logo.png'),
        require('./assets/images/bg-logo.png'),
        require('./assets/images/logo-2.png'),
        require('./assets/images/app_logo-2.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        'Roboto_medium': require("native-base/Fonts/Roboto_medium.ttf"),
        'Concert_one': require('./assets/fonts/ConcertOne-Regular.ttf')
      }),
      twitter.setConsumerKey(Expo.Constants.manifest.extra.twitter.consumerKey, Expo.Constants.manifest.extra.twitter.consumerKeySecret),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
