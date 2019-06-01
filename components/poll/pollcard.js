import React, { Component } from "react";
import { Image, View, FlatList, StyleSheet } from "react-native";
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
  Radio
} from "native-base";

export default class pollCard extends Component {
  constructor(props) {
    super(props);
    const data = this.props.options.map(item => {
      item.isSelect = false;
      item.selectedClass = styles.list;
      return item;
    });
    this.state = {
      dataSource: data,
      showOptions: false
    };
  }

  _renderOptions = () => {
    if (this.state.showOptions) {
      return (
        <View>
          <FlatList
            data={this.state.dataSource}
            renderItem={this._renderRow}
            keyExtractor={item => item.key.toString()}
            extraData={this.state}
          />
          <CardItem button>
            <Body style={{ flexDirection: "row", justifyContent: "center" }}>
              <Icon name="add" />
            </Body>
          </CardItem>
        </View>
      );
    } else {
      return;
    }
  };

  _selectItem = data => {
    const index = this.state.dataSource.findIndex(
      item => data.item.key === item.key
    );
    this.state.dataSource.forEach(function(item, itemIndex) {
      if (itemIndex == index) {
        item.isSelect = !item.isSelect;
        item.selectedClass = item.isSelect ? styles.selected : styles.list;
      } else {
        item.isSelect = false;
        item.selectedClass = item.isSelect ? styles.selected : styles.list;
      }
    });
    this.setState({
      dataSource: this.state.dataSource
    });
  };

  _onOptionPress = option => {
    alert(option.item.word);
  };

  _renderRow = option => {
    return (
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
          <Text numberOfLines={1}>{option.item.word}</Text>
        </Left>

        <Right style={{ flex: 0.1 }}>
          <Icon name="ios-thumbs-up" />
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
                uri:
                  "https://cdn-profiles.tunein.com/s230250/images/bannerx.jpg?t=635652353820970000"
              }}
            />
            <Body>
              <Text>{this.props.author}</Text>
              <Text note>{this.props.createdAt}</Text>
            </Body>
          </Left>
        </CardItem>
        {/* <CardItem bordered>
          <Body>
            <Text numberOfLines={3}>{this.props.summary}</Text>
          </Body>
        </CardItem> */}
        <CardItem bordered header button onPress={()=>{
          this.setState({showOptions : !this.state.showOptions})
          }}>
          <Left>
            <Title numberOfLines={2}>{this.props.question}</Title>
          </Left>
          <Right>
            <Icon name= {this.state.showOptions ? "arrow-up": "arrow-down"}  />
          </Right>
        </CardItem>
        {this._renderOptions()}
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: "#ffffff"
  },
  selected: { backgroundColor: "#29a1a3" }
});
