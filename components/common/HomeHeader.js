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
        break;
      case 1:
        // About
        break;
      case 2:
        // cancel
      break;
      default:
        // code block
    }
  }
  _renderIcon(){
      return <Image source={require('../../assets/images/logo-2.png')} resizeMode="contain" style={{ width: 150, height: 40}}  />
  }
  render() {
    return (
      <View>
        <Header
          hasTabs
          style={AppStyle.headerLight} 
            >
          <Left style={{flex :1}}>
          
          </Left>
          <Body style={{flex :1}}> 
          {this._renderIcon()}
          </Body>
          <Right style={{flex :1}}>
            <Button
              transparent
              onPress={this.showActionSheet}
            >
              <Icon name='more' style={{color:"black"}}/>
            </Button>
          </Right>
        </Header>
        <ActionSheet
          ref={o => this.ActionSheet = o}
          //title={'Which one do you like ?'}
          options={['Settings1', 'Settings2', 'Cancel']}
          cancelButtonIndex={2}
          //destructiveButtonIndex={1}
          onPress={this._onPressActionList}
        />
      </View>
    );
  }
}
