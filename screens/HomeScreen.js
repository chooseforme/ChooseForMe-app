import React from "react";
import { Image, View, ActivityIndicator, FlatList } from "react-native";
import * as firebase from "firebase";
import { connect } from "react-redux";
import { setLoggingIn } from "../redux/app-redux";
import { Header, Container, Content, Text, Button, List } from "native-base";
import HomeHeader from "../components/common/HomeHeader";
import PollCard from "../components/poll/pollcard";
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

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggingIn: false,
      pollsdata: [
        {
          id: 1,
          read: true,
          author: "IO",
          createdAt: "today",
          question: "Help!!!",
          options: [
            { key: 1, word: "home" },
            { key: 2, word: "school31231" },
          ]
        },
        { id: 2,
          read: false,
          author: "IO2",
          createdAt: "yesterday",
          question: "Help!!!Me!!!!!!!",
          options: [
            { key: 1, word: "home" },
            { key: 2, word: "school" },
            { key: 3, word: "idk go find it yourself ssssssssssssss" }
          ]
        }
      ]
    };
  }

  componentDidMount() {
    this.props.setLoggingIn(false);
  }

  _renderRow = poll => {
    return (
      <PollCard
        author={poll.item.author}
        createdAt={poll.item.createdAt}
        question={poll.item.question}
        options={poll.item.options}
      />
    );
  };

  render() {
    return (
      <Container>
        <HomeHeader navigation={this.props.navigation} />
        <Content>
          <List style={{ flex: 0 }}>
            <FlatList
              data={this.state.pollsdata}
              renderItem={this._renderRow}
              keyExtractor={item => item.id.toString()}
              extraData={this.state}
            />
          </List>
        </Content>
      </Container>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);
