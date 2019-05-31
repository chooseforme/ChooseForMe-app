import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const S = StyleSheet.create({
  container: { flexDirection: "row", height: 52, elevation: 2 , marginBottom: 20,},
  tabButton: { flex: 1, justifyContent: "center", alignItems: "center" }
});

const TabBar = props => {
  const {
    renderIcon,
    getLabelText,
    activeTintColor,
    inactiveTintColor,
    onTabPress,
    onTabLongPress,
    getAccessibilityLabel,
    navigation
  } = props;

  const { routes, index: activeRouteIndex } = navigation.state;

  return (
    <View style={S.container}>
      {routes.map((route, routeIndex) => {
        const isRouteActive = routeIndex === activeRouteIndex;
        const tintColor = isRouteActive ? activeTintColor : inactiveTintColor;

        return (
          <TouchableOpacity
            key={routeIndex}
            style={S.tabButton}
            onPress={() => {
              onTabPress({ route });
            }}
            onLongPress={() => {
              onTabLongPress({ route });
            }}
            accessibilityLabel={getAccessibilityLabel({ route })}
          >
            {renderIcon({ route, focused: isRouteActive, tintColor })}

            {/* <Text>{getLabelText({ route })}</Text> */}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TabBar;