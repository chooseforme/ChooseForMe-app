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
          multipleChoice: false,
          reward: 10,
          voted: true,
          author: "IO",
          createdAt: "today",
          question: "Help!!!Help!!!Help!!!Help!!!Help!!!Help!!!Help!!!Help!!!Help!!!Help!!!Help!!!Help!!!",
          totalVotes: 90,
          options: [
            { key: 1, word: "home", votes: 80, UserVoted: true },
            { key: 2, word: "school31231", votes: 10, UserVoted: false }
          ]
        },
        {
          id: 2,
          multipleChoice: true,
          reward: 0.26,
          voted: false,
          author: "IO2",
          createdAt: "yesterday",
          question: "Help!!!Me!!!!!!!",
          totalVotes: 2000,
          options: [
            { key: 1, word: "home", votes: 400, UserVoted: true },
            { key: 2, word: "school", votes: 1000, UserVoted: false },
            {
              key: 3,
              word: "idk go find it yourself ssssssssssssss",
              votes: 600,
              UserVoted: true
            }
          ]
        },        
        {
          id: 3,
          multipleChoice: false,
          reward: 0.26,
          voted: false,
          author: "IO2",
          createdAt: "yesterday",
          question: "食屎定係飲尿好",
          totalVotes: 2000,
          options: [
            { key: 1, word: "屎", votes: 400, UserVoted: true },
            { key: 2, word: "尿", votes: 1000, UserVoted: false },
            {
              key: 3,
              word: "why not both？",
              votes: 600,
              UserVoted: true
            },        
            {
              key: 4,
              word: "我全都要！！！！！！！！！！！！！！！！！！！！！！！！！！！！",
              votes: 600,
              UserVoted: true
            }
          ]
        },
        
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
)(HomeScreen);
