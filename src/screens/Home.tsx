import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useBLE } from "@contexts/BluetoothContext";
import Button from "~/components/Button";
import { palette } from "~/theme/themes";
import SafeAreaView from "~/components/SafeAreaView";

const HomeScreen = () => {
  const { currentValue, connectedDevice, disconnectFromDevice, status } =
    useBLE();

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>{connectedDevice?.name ?? "Unknown"}</Text>

          {status === "connected" || status === "disconnecting" ? (
            <Text
              style={{ color: "#7765da", fontSize: 40, fontWeight: "bold" }}
            >
              {currentValue}
            </Text>
          ) : (
            <ActivityIndicator />
          )}
        </View>

        <Button
          onPress={() => {
            disconnectFromDevice();
          }}
          style={{
            backgroundColor: palette.red,
          }}
          textStyle={{ color: "#fff" }}
          title="Disconnect"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },

  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 36,
    textAlign: "center",
    marginVertical: 25,
  },
});

export default HomeScreen;
