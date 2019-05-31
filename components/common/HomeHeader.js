import React, { Component } from 'react';
import { View , Platform, StatusBar, Image} from 'react-native';
import { Header, Left, Right, Body, Title, Button, Icon, Text } from 'native-base';
import ActionSheet from 'react-native-actionsheet';
import AppStyle from "./AppStyle";

export default class HomeHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  showActionSheet = () => {
    this.ActionSheet.show()
  }

  _onPressActionList = (index) =>{
    
    switch(index) {
      case 0:
        // Login
      this.props.navigation.navigate('Auth');
        break;
      case 1:
        // About
      this.props.navigation.navigate('About');
        break;
      case 2:
        // cancel
      break;
      default:
        // code block
    }
  }
  _renderIcon(){
      return <Image source={require('../../assets/images/logo-2.png')} resizeMode="contain" style={{ width: 130, height: 30}}  />
  }
  render() {
    return (
      <View>
        <Header
          hasTabs
          style={AppStyle.headerLight} 
            >
          <Left >
          
          </Left>
          <Body>
          {this._renderIcon()}
          </Body>
          <Right>
          <Button
              transparent
              onPress={()=>this.props.navigation.navigate("Search")}
            >
              <Icon name='search' />
            </Button>
            <Button
              transparent
              onPress={()=>this.props.navigation.navigate("Wall")}
            >
              <Icon name='notifications' />
            </Button>
            <Button
              transparent
              onPress={this.showActionSheet}
            >
              <Icon name='more' />
            </Button>
          </Right>
        </Header>
        <ActionSheet
          ref={o => this.ActionSheet = o}
          //title={'Which one do you like ?'}
          options={['Login/Sign Up', 'About deeqBloq', 'Cancel']}
          cancelButtonIndex={2}
          //destructiveButtonIndex={1}
          onPress={this._onPressActionList}
        />
      </View>
    );
  }
}
