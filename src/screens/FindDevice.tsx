import React, { useRef } from "react";
import { useEffect } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useBLE } from "@contexts/BluetoothContext";
import { Dimensions } from "react-native";
import BluetoothIcon from "@assets/BluetoothIcon";
import { useState } from "react";
import { palette } from "~/theme/themes";
import SafeAreaView from "~/components/SafeAreaView";
import { Easing } from "react-native";

const FindDevice = () => {
  const { requestPermissions, scanForDevices } = useBLE();
  const [dots, setDots] = useState("");
  const searchAnim = useRef(new Animated.Value(0)).current;
  const tooLongSearch = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(searchAnim, {
          useNativeDriver: false,
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(searchAnim, {
          useNativeDriver: false,
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
        }),
      ]),
    ).start();

    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length === 3) {
          return "";
        }

        return prev + ".";
      });
    }, 750);

    return () => clearInterval(interval);
  }, [searchAnim]);

  useEffect(() => {
    // Request for bluetooth permissions
    requestPermissions((isGranted) => {
      if (isGranted) {
        // Start scanning for devices
        scanForDevices();
      }
    });
  }, [requestPermissions, scanForDevices]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.timing(tooLongSearch, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }, 10000);

    return () => clearTimeout(timeout);
  }, [tooLongSearch]);

  return (
    <SafeAreaView>
      <Text style={styles.searchingText}>Searching for devices{dots}</Text>

      <Animated.View
        style={{
          ...styles.bluetoothCircleContainer,
          ...{
            transform: [
              {
                scale: searchAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.75, 1],
                }),
              },
            ],
          },
        }}
      >
        <View
          style={{
            ...styles.bluetoothCircle,
            ...styles.bluetoothCircleSmall,
          }}
        >
          <BluetoothIcon height="50%" width="50%" />
        </View>

        <View
          style={{
            ...styles.bluetoothCircle,
            ...styles.bluetoothCircleMedium,
          }}
        />
        <View
          style={{
            ...styles.bluetoothCircle,
            ...styles.bluetoothCircleLarge,
          }}
        />
      </Animated.View>

      <Animated.Text
        style={{
          ...styles.longSearch,
          opacity: tooLongSearch,
        }}
      >
        Search is taking too long... Make sure the device is on and in range.
      </Animated.Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  longSearch: {
    position: "absolute",
    color: palette.red,
    textAlign: "center",
    alignSelf: "center",
    fontSize: 16,
    paddingHorizontal: 30,
    fontWeight: "bold",
    bottom: 150,
  },

  searchingText: {
    color: palette.white,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    top: Dimensions.get("screen").height / 6,
  },

  bluetoothCircleContainer: {
    top: Dimensions.get("screen").height / 2,
    alignSelf: "center",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },

  bluetoothCircle: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: palette.bluetooth,
  },

  bluetoothCircleSmall: {
    width: 115,
    height: 115,
    borderRadius: 115 / 2,
    zIndex: 10,
  },

  bluetoothCircleMedium: {
    width: 256,
    height: 256,
    borderRadius: 256 / 2,
    opacity: 0.75,
    zIndex: 5,
  },
  bluetoothCircleLarge: {
    width: 320,
    height: 320,
    borderRadius: 320 / 2,
    opacity: 0.5,
    zIndex: 0,
  },
});

export default FindDevice;
