import { Dimensions, StyleSheet } from "react-native";

export const themeStyles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    width: Dimensions.get("screen").width - 50,
    alignSelf: "center",
  },
});
