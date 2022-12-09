import React from "react";
import { StatusBar, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import BluetoothContextProvider from "./contexts/BluetoothContext";
import Navigation from "./navigation";
import { palette } from "./theme/themes";

const App = () => {
  return (
    <SafeAreaProvider style={styles.theme}>
      <BluetoothContextProvider>
        <Navigation />
      </BluetoothContextProvider>
      <StatusBar barStyle={"light-content"} />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  theme: {
    backgroundColor: palette.background,
  },
});

export default App;
