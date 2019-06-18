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

class PublicScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggingIn: false,
      pollsdata: [
      ]
    };
  }

  componentDidMount() {
    this.props.setLoggingIn(false);
  }

  _renderRow = poll => {
    return (
      <PollCard
        multipleChoice={poll.item.multipleChoice}
        reward={poll.item.reward}
        author={poll.item.author}
        createdAt={poll.item.createdAt}
        question={poll.item.question}
        options={poll.item.options}
        totalVotes={poll.item.totalVotes}
        voted={poll.item.voted}
      />
    );
  };

  render() {
    return (
      <Container>
        <HomeHeader navigation={this.props.navigation} />
        <Content>
            <FlatList
              data={this.state.pollsdata}
              renderItem={this._renderRow}
              keyExtractor={item => item.id.toString()}
              extraData={this.state}
            />
        </Content>
      </Container>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PublicScreen);
