import React, { Component } from "react";
import { Image, View, FlatList, StyleSheet, Dimensions } from "react-native";
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
import { Col, Row, Grid } from "react-native-easy-grid";
import ProgressBarAnimated from "react-native-progress-bar-animated";

const barColor = "#29a1a3";

export default class pollCard extends Component {
  constructor(props) {
    super(props);
    const data = this.props.options.map(item => {
      item.isSelect = false;
      item.selectedClass = styles.list;
      item.selectedButton = styles.button;
      return item;
    });
    this.state = {
      dataSource: data,
      showOptions: false
    };
  }

  //render theron options
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
          {this._renderBottomFunctionButton()}
        </View>
      );
    } else {
      return;
    }
  };

  _renderBottomFunctionButton = () => {
    if (!this.props.voted) {
      return (
        <CardItem>
          <Left>
            <Button transparent small>
              <Icon name="create" style={{ color: "#1c253c" }} />
            </Button>
          </Left>
          <Right>
            <Button transparent small>
              <Icon name="md-send" style={{ color: "#1c253c" }} />
            </Button>
          </Right>
        </CardItem>
      );
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
    this.setState({
      dataSource: this.state.dataSource
    });
  };

  _onOptionPress = option => {
    alert(option.item.word);
  };

  //render each option
  _renderRow = option => {
    //if voted
    if (this.props.voted) {
      //voted option
      if (option.item.UserVoted) {
        return (
          <View>
            <CardItem bordered style={styles.selected}>
              <Grid>
                <Row style={{ paddingBottom: 5 }}>
                  <Left>
                    <Text numberOfLines={1}>{option.item.word}</Text>
                  </Left>
                  <Right style={{ flex: 0.1 }}>
                    <Icon name="md-checkmark" style={[styles.selectedButton]} />
                  </Right>
                </Row>
                <Row>
                  <ProgressBarAnimated
                    width={Dimensions.get("screen").width - 30}
                    height={20}
                    borderRadius={8}
                    value={(option.item.votes / this.props.totalVotes) * 100}
                    backgroundColor={barColor}
                  />
                  <Text
                    style={{
                      fontSize: 13,
                      position: "absolute",
                      top: 2,
                      left: 10,
                      right: 0,
                      bottom: 0,
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#666666"
                    }}
                  >
                    {option.item.votes} support
                  </Text>
                </Row>
                <Row>
                  <Left />
                </Row>
              </Grid>
            </CardItem>
          </View>
        );
      }
      //not the voted option
      return (
        <View>
          <CardItem bordered style={styles.list}>
            <Grid>
              <Row style={{ paddingBottom: 5 }}>
                <Left>
                  <Text numberOfLines={1}>{option.item.word}</Text>
                </Left>
                <Right style={{ flex: 0.1 }}>
                  <Icon name="md-checkmark" style={[styles.Button]} />
                </Right>
              </Row>
              <Row>
                <ProgressBarAnimated
                  width={Dimensions.get("screen").width - 30}
                  height={20}
                  borderRadius={8}
                  value={(option.item.votes / this.props.totalVotes) * 100}
                  backgroundColor={barColor}
                />
                <Text
                  style={{
                    fontSize: 13,
                    position: "absolute",
                    top: 2,
                    left: 10,
                    right: 0,
                    bottom: 0,
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#666666"
                  }}
                >
                  {option.item.votes} support
                </Text>
              </Row>
              <Row>
                <Left />
              </Row>
            </Grid>
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
          <Text numberOfLines={1}>{option.item.word}</Text>
        </Left>

        <Right style={{ flex: 0.1 }}>
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
        <CardItem
          bordered
          header
          button
          onPress={() => {
            this.setState({ showOptions: !this.state.showOptions });
          }}
        >
          <Left style={{ flex: 0.9 }}>
            <Text style={{ fontWeight: "bold" }} numberOfLines={3}>
              {this.props.question}
            </Text>
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
    backgroundColor: "#e6e6e6"
  },
  button: {
    color: "#cccccc"
  },
  selectedButton: {
    color: "#00b300"
  }
});
