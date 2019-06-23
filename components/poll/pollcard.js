import React, { Component } from "react";
import {
  Image,
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from "react-native";
import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Button,
  Icon,
  Left,
  Body,
  Right,
  Title,
  Radio,
} from "native-base";
import { Col, Row, Grid } from "react-native-easy-grid";
import ProgressBarAnimated from "react-native-progress-bar-animated";
import * as firebase from "firebase";
import { connect } from "react-redux";
import { refreshPublicPolls, setPublicPolls } from "../../redux/app-redux";
const barColor = "#29a1a3";

class pollCard extends Component {
  constructor(props) {
    super(props);
    const data = this.props.poll.options.map(item => {
      item.isSelect = false;
      item.selectedClass = styles.list;
      item.selectedButton = styles.button;
      return item;
    });

    this.state = {
      dataSource: data,
      showOptions: false,
      optionVoted: this._getVotedOptions(),
      publicPolls: [],
    };
  }

  timeDifference =(previous) => {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = Date.now() - previous;

    if (elapsed < msPerMinute) {
         return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else{
        return new Date(previous).toLocaleDateString(); 
    }
}

  _getVotedOptions = () => {
    var options = this.props.poll.votedUsers.filter((votedUser) => {
      return votedUser.userId === firebase.auth().currentUser.uid;
    }
    )
    return options;
  }

  _submitVotes = () => {
    selectedOptions = this.state.dataSource.filter((option) => {
      return option.isSelect
    })
    var results = selectedOptions.map(option => option.id);
    //console.log(results);
    var db = firebase.firestore();
    var voteRef = db.collection("polls").doc(this.props.poll.id);

    var promises = [];
    var polls = this.props.publicPolls;
    var now = Date.now();
    results.forEach((result) => {
      promises.push(voteRef.set({
        "votedUsers": firebase.firestore.FieldValue.arrayUnion({
          userId: firebase.auth().currentUser.uid,
          votedOption: result,
          votedAt: now,
        })
      }, { merge: true }).then(() => {
        console.log("added user to vote!");

        //update poll locally
        votedPoll = polls.find((element) => {
          return element.id === this.props.poll.id;
        });
        votedPoll.votedUsers.push({
          userId: firebase.auth().currentUser.uid,
          votedOption: result,
          votedAt: now,
        }
        )
      })
        .catch(function (error) {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        }))
    })
    promises.push(db.collection("users").doc(firebase.auth().currentUser.uid).set({
      votedPolls : firebase.firestore.FieldValue.arrayUnion({
        pollId: this.props.poll.id,
        votedAt: now,
      })
    }, { merge: true })
      .then(function () {
        console.log("added vote to user!");
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      }));



    Promise.all(promises).then(
      () => {
        console.log("voted!");
        this.props.setPublicPolls(polls);
        const data = this.props.poll.options.map(item => {
          item.isSelect = false;
          item.selectedClass = styles.list;
          item.selectedButton = styles.button;
          return item;
        });
        this.setState({
          optionVoted: this._getVotedOptions(),
          dataSource: data
        });
      }
    ).catch((error) => {
      console.log(error);
    })
  }

  //render the options
  _renderOptions = () => {
    if (this.state.showOptions) {
      return (
        <View>
          <FlatList
            data={this.state.dataSource}
            renderItem={this._renderRow}
            keyExtractor={item => item.id.toString()}
            extraData={this.state}
          />
          {this._renderBottomFunctionButton()}
        </View>
      );
    } else {
      return;
    }
  };

  _renderBottomFunctionButton = () => {
    //render bottom function button if not voted
    if (!this._isVoted()) {
      return (
        <CardItem>
          <Left>
            <Button transparent small>
              <Icon name="ios-chatbubbles" style={{ color: "#1c253c" }} />
            </Button>
          </Left>
          <Right>
            <Button transparent small onPress={() => { this._submitVotes() }}>
              <Icon name="md-send" style={{ color: "#1c253c" }} />
            </Button>
          </Right>
        </CardItem>
      );
    }
    else{
      return (
        <CardItem>
          <Left>
            <Button transparent small>
              <Icon name="ios-chatbubbles" style={{ color: "#1c253c" }} />
            </Button>
          </Left>
          <Right>
          </Right>
        </CardItem>
      )
    }
  };


  //UI: highlight the selected Item
  _selectItem = data => {
    const index = this.state.dataSource.findIndex(
      item => data.item.id === item.id
    );
    if (!this.props.poll.multipleChoice) {
      //singleChoice
      this.state.dataSource.forEach(function (item, itemIndex) {
        if (itemIndex == index) {
          item.isSelect = !item.isSelect;
          item.selectedClass = item.isSelect ? styles.selected : styles.list;
          item.selectedButton = item.isSelect
            ? styles.selectedButton
            : styles.button;
        } else {
          item.isSelect = false;
          item.selectedClass = item.isSelect ? styles.selected : styles.list;
          item.selectedButton = item.isSelect
            ? styles.selectedButton
            : styles.button;
        }
      });
    } else {
      //MultipleChoice
      data.item.isSelect = !data.item.isSelect;
      data.item.selectedClass = data.item.isSelect
        ? styles.selected
        : styles.list;
      data.item.selectedButton = data.item.isSelect
        ? styles.selectedButton
        : styles.button;
      this.state.dataSource[index] = data.item;
    }
    this.setState({
      dataSource: this.state.dataSource
    });
  };

  //check it if it is voted
  _isVoted = () => {
    return this.props.poll.votedUsers.some(function (el) {
      return el.userId === firebase.auth().currentUser.uid;
    });
  }

  _isThisOptionVoted = (id) => {
    return this.state.optionVoted.some(function (el) {
      return el.votedOption === id;
    });
  }

  _votesForOption = (id) => {
    var count = this.props.poll.votedUsers.reduce(function (n, val) {
      return n + (val.votedOption === id);
    }, 0);
    return count;
  }

  //render each option
  _renderRow = option => {
    //if voted
    if (this._isVoted()) {
      //voted option
      if (this._isThisOptionVoted(option.item.id)) {
        return (
          <View>
            <CardItem bordered style={styles.selected}>
              <Left style={{ flex: 0.9 }}>
                <ProgressBarAnimated
                  width={Dimensions.get("screen").width - 25}
                  height={30}
                  borderRadius={15}
                  value={(this._votesForOption(option.item.id) / this.props.poll.votedUsers.length) * 100}
                  backgroundColor={barColor}
                />
                <Text
                  numberOfLines={1}
                  style={styles.OptionText}
                >
                  {option.item.option}
                </Text>
              </Left>

              <Right
                style={{
                  flex: 0.2,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-end"
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: "#666666",
                    paddingRight: 5
                  }}
                >
                  {this._votesForOption(option.item.id)}
                </Text>
                <Icon name="md-checkmark" style={styles.selectedButton} />
              </Right>
            </CardItem>
          </View>
        );
      }
      //not the voted option
      return (
        <View>
          <CardItem bordered style={styles.list}>
            <Left style={{ flex: 0.9 }}>
              <ProgressBarAnimated
                width={Dimensions.get("screen").width - 25}
                height={30}
                borderRadius={15}
                value={(this._votesForOption(option.item.id) / this.props.poll.votedUsers.length) * 100}
                backgroundColor={barColor}
              />
              <Text
                numberOfLines={1}
                style={styles.OptionText}
              >
                {option.item.option}
              </Text>
            </Left>

            <Right
              style={{
                flex: 0.2,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end"
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: "#666666",
                  paddingRight: 5
                }}
              >
                {this._votesForOption(option.item.id)}
              </Text>
              <Icon name="md-checkmark" style={styles.button} />
            </Right>
          </CardItem>
        </View>
      );
    }
    return (
      //not voted yet
      <CardItem
        bordered
        button
        style={[styles.list, option.item.selectedClass]}
        onPress={() => {
          this._selectItem(option);
          //this._onOptionPress(option);
        }}
      >
        <Left style={{ flex: 0.9 }}>
          <ProgressBarAnimated
            width={Dimensions.get("screen").width - 25}
            height={30}
            borderRadius={15}
            value={0}
            backgroundColor={barColor}
          />
          <Text
            numberOfLines={1}
            style={styles.OptionText}
          >
            {option.item.option}
          </Text>
        </Left>

        <Right style={{ flex: 0.2 }}>
          <Icon
            name="md-checkmark"
            style={[styles.button, option.item.selectedButton]}
          />
        </Right>
      </CardItem>
    );
  };

  render() {
    return (
      <Card>
        <CardItem bordered>
          <Left>
            <Thumbnail
              small
              source={{
                uri: this.props.poll.photoURL
              }}
            />
            <Body>
              <Text>{this.props.poll.authorName}</Text>
              <Text note>{this.timeDifference(this.props.poll.createdAt)}</Text>
            </Body>
          </Left>
          <Right>
            <Image
              source={require("../../assets/images/logo-2.png")}
              resizeMode="contain"
              style={{ width: 30, height: 20 }}
            />
            {/* <Text>{this.props.poll.reward.toFixed(2)}</Text> */}
          </Right>
        </CardItem>
        <CardItem
          bordered
          header
          button
          onPress={() => {
            this.setState({ showOptions: !this.state.showOptions });
          }}
        >
          <Left style={{ flex: 0.9 }}>
            <Icon
              name={this.props.poll.multipleChoice ? "more" : "radio-button-on"}
            />
            <Body>
              <Text style={{ fontWeight: "bold" }} numberOfLines={2}>
                {this.props.poll.question}
              </Text>
            </Body>
          </Left>
          <Right style={{ flex: 0.1 }}>
            <Icon
              name={this.state.showOptions ? "ios-arrow-up" : "ios-arrow-down"}
            />
          </Right>
        </CardItem>
        {this._renderOptions()}
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: "#f2f2f2"
  },
  selected: {
    backgroundColor: "#d6f5d6"
  },
  button: {
    color: "#cccccc"
  },
  selectedButton: {
    color: "#00b300"
  },
  OptionText: {
    fontSize: 16,
    position: "absolute",
    top: 5,
    left: 7,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    color: "#666666"
  }
});

const mapStateToProps = state => {
  return {
    publicPolls: state.publicPolls,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    refreshPublicPolls: () => {
      dispatch(refreshPublicPolls());
    },
    setPublicPolls: (polls) => {
      dispatch(setPublicPolls(polls));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(pollCard);
