import React from "react";
import { Platform } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";
import { Icon } from "native-base";
import TabBarIcon from "../components/TabBarIcon";
import HomeScreen from "../screens/HomeScreen";
import LinksScreen from "../screens/LinksScreen";
import SettingsScreen from "../screens/SettingsScreen";
import TabBar from "../components/TabBar";

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
    <Icon style={{ color: focused ? "blue" : "black" }} name="home" />
  )
};

const PollStack = createStackNavigator({
  Poll: LinksScreen
});

PollStack.navigationOptions = {
  tabBarIcon: ({ focused }) => <Icon style={{ color: "black" }} name="stats" />
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen
});

SettingsStack.navigationOptions = {
  tabBarIcon: ({ focused }) => (
    <Icon style={{ color: "black" }} name="options" />
  )
};

const PublicStack = createStackNavigator({
  Friends: SettingsScreen
});

PublicStack.navigationOptions = {
  tabBarIcon: ({ focused }) => <Icon style={{ color: "black" }} name="radio" />
};

const ProfileStack = createStackNavigator({
  Profile: SettingsScreen
});

ProfileStack.navigationOptions = {
  tabBarIcon: ({ focused }) => (
    <Icon style={{ color: "black" }} name="notifications" />
  )
};

const ChatStack = createStackNavigator({
  Chat: SettingsScreen
});

ChatStack.navigationOptions = {
  tabBarIcon: ({ focused }) => (
    <Icon style={{ color: "black" }} name="chatbubbles" />
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
      activeTintColor: "#4F4F4F",
      inactiveTintColor: "#ddd",
      showLabel: false
    }
  }
);
