import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import {
  CHARACTERISTIC_UUID_RX,
  SERVICE_UUID,
  useBLE,
} from "@contexts/BluetoothContext";
import Button from "~/components/Button";
import { palette } from "~/theme/themes";
import SafeAreaView from "~/components/SafeAreaView";
import Joystick from "~/components/Joystick";
import { btoa } from "react-native-quick-base64";

const HomeScreen = () => {
  const {
    currentValue,
    connectedDevice,
    disconnectFromDevice,
    status,
    bleManager,
  } = useBLE();
  const motorSpeed = React.useRef(0);

  if (!connectedDevice) return null;

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>{connectedDevice.name ?? "Unknown"}</Text>

          {status === "connected" || status === "disconnecting" ? (
            <View
              style={{
                height: 50,
                width: "100%",
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                borderRadius: palette.borderRadius,
              }}
            >
              <View
                style={{
                  backgroundColor: palette.white,
                  height: 50,
                  width: `${currentValue}%`,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: palette.borderRadius,
                }}
              >
                <Text
                  style={{
                    color: "#7765da",
                    fontSize: 24,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {currentValue}%
                </Text>
              </View>
            </View>
          ) : (
            <ActivityIndicator />
          )}
        </View>

        <View style={styles.joystick}>
          <Joystick
            lockY={true}
            width={150}
            onValue={async (value) => {
              // This prints out the value of the joystick,
              // left is -1, centered is 0, right is 1

              if (motorSpeed.current !== value.x) {
                bleManager.writeCharacteristicWithResponseForDevice(
                  connectedDevice.id,
                  SERVICE_UUID,
                  CHARACTERISTIC_UUID_RX,
                  btoa(value.x.toString()),
                );
              }

              motorSpeed.current = value.x;
            }}
          />
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

  joystick: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
