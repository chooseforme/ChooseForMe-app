import { StyleSheet } from "react-native";
import { View, Platform, StatusBar } from "react-native";

export default StyleSheet.create({
  headerDark: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#3c3c3c"
  },
  headerLight: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#f7f7f7"
  },
  footerDark: {
    backgroundColor: "#3c3c3c"
  },
  footerLight: {
    backgroundColor: "#f7f7f7"
  },  
  tabDark: {
    backgroundColor: "#3c3c3c"
  },
  tabLight: {
    backgroundColor: "#f7f7f7"
  },
  priceList:{
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
  },
  priceNumber:{
    fontSize: 40,
    fontWeight: 'bold',
  }
});
