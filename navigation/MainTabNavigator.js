import React from "react";
import { Platform, StyleSheet,  } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";
import { Icon } from "native-base";
import TabBarIcon from "../components/TabBarIcon";
import HomeScreen from "../screens/HomeScreen";
import PublicScreen from "../screens/PublicScreen";
import AddPollScreen from "../screens/AddPollScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import TabBar from "../components/TabBar";

const activeTintColor = "#29a1a3";
const inactiveTintColor =  "#1c253c";

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen
  },
  {
    initialRouteName: "Home",
    headerMode: "none"
  }
);

HomeStack.navigationOptions = {
  tabBarIcon: ({ focused }) => (
    <Icon style={{ color: focused ? activeTintColor : inactiveTintColor }} name="ios-contacts" />
  )
};

const PollStack = createStackNavigator({
  Poll: AddPollScreen
},
{
  headerMode: "none"
});

PollStack.navigationOptions = {
  tabBarIcon: ({ focused }) => <Icon style={{ color: focused ? activeTintColor : inactiveTintColor }} name="ios-stats" />
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen
},
{
  headerMode: "none"
});

SettingsStack.navigationOptions = {
  tabBarIcon: ({ focused }) => (
    <Icon style={{ color: focused ? activeTintColor : inactiveTintColor }} name="ios-options" />
  )
};

const PublicStack = createStackNavigator({
  Public: PublicScreen
},
{
  headerMode: "none"
});

PublicStack.navigationOptions = {
  tabBarIcon: ({ focused }) => <Icon style={{ color: focused ? activeTintColor : inactiveTintColor }} name="ios-radio" />
};

const ProfileStack = createStackNavigator({
  Profile: ProfileScreen
},
{
  headerMode: "none"
});

ProfileStack.navigationOptions = {
  tabBarIcon: ({ focused }) => (
    <Icon style={{ color: focused ? activeTintColor : inactiveTintColor }} name="ios-contact" />
  )
};

const ChatStack = createStackNavigator({
  Chat: SettingsScreen
},
{
  headerMode: "none"
});

ChatStack.navigationOptions = {
  tabBarIcon: ({ focused }) => (
    <Icon style={{ color: focused ? activeTintColor : inactiveTintColor }} name="ios-chatbubbles" />
  )
};

export default createBottomTabNavigator(
  {
    HomeStack: HomeStack,
    PublicStack: PublicStack,
    PollStack: PollStack,
    ChatStack: ChatStack,
    ProfileStack: ProfileStack
  },
  {
    //tabBarComponent: TabBar,
    tabBarOptions: {
      showLabel: false
    }
  }
);
