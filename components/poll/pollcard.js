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

  //render the options
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
    //render bottom function button if not voted
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
    if (!this.props.multipleChoice) {
      //singleChoice
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
              <Left style={{ flex: 0.9 }}>
                <ProgressBarAnimated
                  width={Dimensions.get("screen").width - 25}
                  height={30}
                  borderRadius={15}
                  value={(option.item.votes / this.props.totalVotes) * 100}
                  backgroundColor={barColor}
                />
                <Text
                  numberOfLines={1}
                  style={styles.OptionText}
                >
                  {option.item.word}
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
                  {option.item.votes}
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
                value={(option.item.votes / this.props.totalVotes) * 100}
                backgroundColor={barColor}
              />
              <Text
                numberOfLines={1}
                style={styles.OptionText}
              >
                {option.item.word}
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
                {option.item.votes}
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
            {option.item.word}
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
                uri:
                  "https://cdn-profiles.tunein.com/s230250/images/bannerx.jpg?t=635652353820970000"
              }}
            />
            <Body>
              <Text>{this.props.author}</Text>
              <Text note>{this.props.createdAt}</Text>
            </Body>
          </Left>
          <Right>
            <Image
              source={require("../../assets/images/logo-2.png")}
              resizeMode="contain"
              style={{ width: 30, height: 20 }}
            />
            <Text>{this.props.reward.toFixed(2)}</Text>
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
              name={this.props.multipleChoice ? "more" : "radio-button-on"}
            />
            <Body>
              <Text style={{ fontWeight: "bold" }} numberOfLines={2}>
                {this.props.question}
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
    backgroundColor: "#e6e6e6"
  },
  button: {
    color: "#cccccc"
  },
  selectedButton: {
    color: "#00b300"
  },
  OptionText: {
    fontSize: 18,
    position: "absolute",
    top: 5,
    left: 7,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    color: "#000000"
  }
});
