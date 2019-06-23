import React from "react";
import { Platform, StyleSheet,  } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";
import { Icon } from "native-base";
import TabBarIcon from "../components/TabBarIcon";
import PublicScreen from "../screens/PublicScreen";
import TrendingScreen from "../screens/TrendingScreen";
import AddPollScreen from "../screens/AddPollScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import TabBar from "../components/TabBar";

const activeTintColor = "#29a1a3";
const inactiveTintColor =  "#1c253c";

const PublicStack = createStackNavigator(
  {
    Public: PublicScreen
  },
  {
    initialRouteName: "Public",
    headerMode: "none"
  }
);

PublicStack.navigationOptions = {
  tabBarIcon: ({ focused }) => (
    <Icon style={{ color: focused ? activeTintColor : inactiveTintColor }} name="ios-radio" />
  )
};

const AddPollStack = createStackNavigator({
  Poll: AddPollScreen
},
{
  headerMode: "none"
});

AddPollStack.navigationOptions = {
  tabBarIcon: ({ focused }) => 
  <Icon style={{ color: focused ? activeTintColor : inactiveTintColor }} name="add-circle" />
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

const TrendingStack = createStackNavigator({
  Hot: TrendingScreen
},
{
  headerMode: "none"
});

TrendingStack.navigationOptions = {
  tabBarIcon: ({ focused }) => 
  <Icon style={{ color: focused ? activeTintColor : inactiveTintColor }} name="ios-flame" />
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

const SearchStack = createStackNavigator({
  Search: SettingsScreen
},
{
  headerMode: "none"
});

SearchStack.navigationOptions = {
  tabBarIcon: ({ focused }) => (
    <Icon style={{ color: focused ? activeTintColor : inactiveTintColor }} name="ios-search" />
  )
};

export default createBottomTabNavigator(
  {
    TrendingStack: TrendingStack,
    PublicStack: PublicStack,
    AddPollStack: AddPollStack, //add poll
    SearchStack: SearchStack,
    ProfileStack: ProfileStack
  },
  {
    //tabBarComponent: TabBar,
    tabBarOptions: {
      showLabel: false
    }
  }
);
