import React from "react";
import { Image, View, ActivityIndicator } from "react-native";
import * as firebase from "firebase";
import { connect } from "react-redux";
import { setLoggingIn } from "../redux/app-redux";
import { Header, Container, Content, Text, Button } from "native-base";
import HomeHeader from '../components/common/HomeHeader';

const mapStateToProps = state => {
  return {
    loggingIn: state.loggingIn
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setLoggingIn: logging => {
      dispatch(setLoggingIn(logging));
    }
  };
};

class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loggingIn : false};
  }

  componentDidMount() {
    this.props.setLoggingIn(false);
  }

  render() {
    return (
      <Container>
      <HomeHeader navigation={this.props.navigation}/>
      <Content>
        <Text>{firebase.auth().currentUser.displayName}</Text>
        <Image
          style={{ width: 50, height: 50 }}
          source={{ uri: firebase.auth().currentUser.photoURL }}
        />
        <Button
          onPress={() => {
            firebase
              .auth()
              .signOut()
              .then(() => {
                // Sign-out successful.
                this.props.navigation.navigate("Auth");
              })
              .catch(function(error) {
                // An error happened.
              });
          }}
        >
          <Text>SignOut</Text>
        </Button>
        </Content>
      </Container>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileScreen);
