import React, { Component } from "react";
import { View, FlatList, Image, Platform, DeviceEventEmitter } from "react-native";
import {
  Header,
  Container,
  Content,
  Text,
  Button,
  List,
  Form,
  Item,
  Input,
  Label,
  Icon,
  Left,
  Body,
  Right,
  Tab,
  Tabs,
  FooterTab,
  Footer,
  CheckBox,
  ListItem
} from "native-base";
import { Grid, Col, Row } from "react-native-easy-grid";
import AppStyle from "../components/common/AppStyle";
import * as firebase from "firebase";


class AddPollScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: "",
      data: {
        options: []
      },
      multipleChoice: false,
    };
  }

  componentDidMount() {
    for (var i = 0; i < 2; i++) {
      this._addOption();
    }
  }

  _addPoll = () => {
    const newData = this.state.data;
    if (newData.options.length < 2) {
      DeviceEventEmitter.emit('showToast', "you need to have at least 2 options!");
      return;
    }
    if (this.state.question.length >= 40 || this.state.question.length <= 6) {
      DeviceEventEmitter.emit('showToast', "The length of question must between 6 to 40");
      return;
    }
    // console.log(newData.options);
    for(option in newData.options) {
      if (newData.options[option].option.length >= 40 || newData.options[option].option.length <= 6) {
        DeviceEventEmitter.emit('showToast', "The length of option must between 6 to 40");
        return;
      }
    }
    var db = firebase.firestore();
    db.collection("polls").add({
      author: firebase.auth().currentUser.uid,
      multipleChoice: this.state.multipleChoice,
      dailyTrending: 0,
      createdAt: Date.now(),
      question: this.state.question,
      options: this.state.data.options,
      votedUsers: [],
    })
      .then((docRef)=> {
        console.log("Document written with ID: ", docRef.id);
        this.setState(
          {
            question: "",
            data: {
              options: []
            },
            multipleChoice: false,
          }
        )
        DeviceEventEmitter.emit('showToast', "You started a poll succesfully!");
        for (var i = 0; i < 2; i++) {
          this._addOption();
        }
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
  }

  _addOption = () => {
    const newData = this.state.data;
    if (newData.options.length >= 5) {
      DeviceEventEmitter.emit('showToast', "you cant add more than 5 options!");
      return;
    }
    newData.options.push({ id: Math.random().toString(36).substr(2, 9), option: "" });
    this.setState({
      data: newData
    });
  };

  _removeItem = option => {
    const index = this.state.data.options.findIndex(
      item => option.item.id === item.id
    );
    const newData = this.state.data;
    newData.options.splice(index, 1);
    this.setState({
      data: newData
    });
  };

  _editOption = (option, word) => {
    const index = this.state.data.options.findIndex(
      item => option.item.id === item.id
    );
    const newData = this.state.data;
    newData.options[index].option = word;
    this.setState({
      data: newData
    });
  }


  _renderRow = option => {
    return (
      <Item stackedLabel>
        <View style={{ flexDirection: "row" }}>
          <Left>
            <Text style={{ fontSize: 14 }}>Options {option.index + 1}</Text>
          </Left>
          <Button
            transparent
            small
            onPress={() => {
              this._removeItem(option);
            }}
          >
            <Icon name="remove" />
          </Button>
        </View>
        <Input
          placeholder="Your option here..."
          onChangeText={q => this._editOption(option, q)}
        />
      </Item>
    );
  };

  render() {
    return (
      <Container>
        <Header hasTabs style={AppStyle.headerLight}>
          <Left style={{ flex: 1 }}>
          </Left>
          <Body style={{ flex: 1 }}>
            <Image
              source={require("../assets/images/logo-2.png")}
              resizeMode="contain"
              style={{ width: 150, height: 40 }}
            />
          </Body>
          <Right style={{ flex: 1 }}>
            <Button
              transparent
              onPress={() => {
                this._addPoll();
              }}
            >
              <Icon name="md-send" style={{ color: "#1c253c" }} />
            </Button>
          </Right>
        </Header>

        <Content>
          <Form>
            <Item stackedLabel>
              <Label style={{ color: "black" }}>Question</Label>
              <Input placeholder="Your question here..."
                onChangeText={q => this.setState({ question: q })}
                value={this.state.question} />
            </Item>
            <ListItem selected={this.state.multipleChoice} onPress={() => { this.setState({ multipleChoice: !this.state.multipleChoice }) }}>
              <CheckBox checked={this.state.multipleChoice} />
              <Body>
                <Text>Multiple Choice</Text>
              </Body>
            </ListItem>
            <FlatList
              data={this.state.data.options}
              renderItem={this._renderRow}
              keyExtractor={item => item.id.toString()}
              extraData={this.state}
            />
          </Form>
        </Content>
        <Footer>
          <FooterTab>
            <Button
              transparent
              full
              onPress={() => {
                this._addOption();
              }}
            >
              <Icon name="add" style={{ color: "#1c253c" }} />
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

export default AddPollScreen;
