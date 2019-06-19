import React from "react";
import { Image, View, ActivityIndicator, FlatList } from "react-native";
import * as firebase from "firebase";
import { connect } from "react-redux";
import { setLoggingIn, watchPublicPolls } from "../redux/app-redux";
import { Header, Container, Content, Text, Button, List } from "native-base";
import HomeHeader from "../components/common/HomeHeader";
import PollCard from "../components/poll/pollcard";


const mapStateToProps = state => {
  return {
    loggingIn: state.loggingIn,
    publicPolls: state.publicPolls
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setLoggingIn: logging => {
      dispatch(setLoggingIn(logging));
    },
    watchPublicPolls : () => {
      dispatch(watchPublicPolls());
    }
  };
};

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggingIn: false,
      pollsdata: [],
    };
    this.props.watchPublicPolls();
  }

  componentDidMount() {
    this.props.setLoggingIn(false);
  }

  _getAuthorName(uid) {
    var db = firebase.firestore();
    var docRef = db.collection("users").doc(uid);

    docRef.get().then(function (doc) {
      if (doc.exists) {
        console.log("Document data:", doc.data().displayName);
        return doc.data().displayName;
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        return "unknown";
      }
    }).catch(function (error) {
      console.log("Error getting document:", error);
      return "unknown";
    });

  }

  _renderRow = poll => {
    // console.log(poll)
    return (
      <PollCard
        multipleChoice={poll.item.multipleChoice}
        reward={poll.item.reward}
        author={poll.item.authorName}
        createdAt={new Date(poll.item.createdAt).toLocaleDateString()}
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
            data={this.props.publicPolls}
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
