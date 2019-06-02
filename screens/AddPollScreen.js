import React, { Component } from "react";
import { View, FlatList } from "react-native";
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
import HomeHeader from "../components/common/HomeHeader";
import { Grid, Col, Row } from "react-native-easy-grid";

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
    newData.options.splice(index,1);
    this.setState({
        data: newData,
    });
  }


  _renderRow = option => {
    return (
      <Item stackedLabel>
        <View style={{flexDirection:'row'}}>
        <Left>
          <Text style={{fontSize : 14}}>Options {option.item.id}</Text>
          </Left>
          <Button transparent small onPress={()=>{this._removeItem(option)}}>
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
        <HomeHeader navigation={this.props.navigation} />
        <Content>
          <Form>
            <Item stackedLabel>
              <Label style={{color:'black'}}>Question</Label>
              <Input />
            </Item>
            <FlatList
              data={this.state.data.options}
              renderItem={this._renderRow}
              keyExtractor={item => item.id.toString()}
              extraData={this.state}
            />
            <Item>
              <Left>
                <Button
                  transparent
                  onPress={() => {
                    this._addOption();
                  }}
                >
                  <Icon name="add" />
                </Button>
              </Left>
              <Right>
                <Button
                  transparent
                  onPress={() => {
                    this._addOption();
                  }}
                >
                  <Icon name="send" />
                </Button>
              </Right>
            </Item>
          </Form>
        </Content>
      </Container>
    );
  }
}

export default AddPollScreen;
