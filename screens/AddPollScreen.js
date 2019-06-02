import React, { Component } from "react";
import { View, FlatList, Image } from "react-native";
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
  Right
} from "native-base";
import { Grid, Col, Row } from "react-native-easy-grid";
import AppStyle from "../components/common/AppStyle";
class AddPollScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        question: "",
        options: []
      }
    };
  }

  _addOption = () => {
    const newData = this.state.data;
    newData.options.push({ id: Math.random() });
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

  _renderRow = option => {
    return (
      <Item stackedLabel>
        <View style={{ flexDirection: "row" }}>
          <Left>
            <Text style={{ fontSize: 14 }}>Options {option.index}</Text>
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
        <Input />
      </Item>
    );
  };

  render() {
    return (
      <Container>
        <Header hasTabs style={AppStyle.headerLight}>
          <Left style={{ flex: 1 }}>
            <Button
              transparent
              onPress={() => {
                this._addOption();
              }}
            >
              <Icon name="add" style={{ color: "#1c253c" }} />
            </Button>
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
                this._addOption();
              }}
            >
              <Icon name="md-send" style={{ color: "#1c253c"}} />
            </Button>
          </Right>
        </Header>
        <Content>
          <Form>
            <Item stackedLabel>
              <Label style={{ color: "black" }}>Question</Label>
              <Input />
            </Item>
            <FlatList
              data={this.state.data.options}
              renderItem={this._renderRow}
              keyExtractor={item => item.id.toString()}
              extraData={this.state}
            />
          </Form>
        </Content>
      </Container>
    );
  }
}

export default AddPollScreen;
