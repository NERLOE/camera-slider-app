import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useBLE } from "@contexts/BluetoothContext";
import { Device } from "react-native-ble-plx";
import CheckmarkIcon from "@assets/CheckmarkIcon";
import { palette } from "~/theme/themes";
import Button from "~/components/Button";
import SafeAreaView from "~/components/SafeAreaView";

const DeviceList = () => {
  const { allDevices, connectToDevice, status } = useBLE();

  const [selectedDeviced, setSelectedDevice] = React.useState<Device | null>(
    null,
  );

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View>
          <View style={styles.titles}>
            <Text style={styles.title}>
              Found {allDevices.length}{" "}
              {allDevices.length === 1 ? "device" : "devices"}
            </Text>
            <Text style={styles.subtitle}>
              Select the device you want to control
            </Text>
          </View>

          <View style={styles.deviceList}>
            {allDevices.map((device) => {
              const isDeviceSelected = selectedDeviced?.id === device.id;

              return (
                <View key={device.id}>
                  <View
                    onTouchEnd={() => {
                      if (isDeviceSelected) {
                        setSelectedDevice(null);
                      } else {
                        setSelectedDevice(device);
                      }
                    }}
                    style={{
                      ...styles.device,
                      ...(isDeviceSelected ? styles.selectedDevice : {}),
                    }}
                  >
                    <Text style={styles.deviceText}>
                      {device.name ?? "Unknown"}
                    </Text>

                    {isDeviceSelected && (
                      <View style={styles.checkmark}>
                        <CheckmarkIcon
                          fill="#000"
                          height={"50%"}
                          width={"50%"}
                        />
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.connectButton}>
          <Button
            title="Connect to device"
            disabled={!selectedDeviced}
            loading={status === "connecting"}
            onPress={() => {
              if (!selectedDeviced) return;

              connectToDevice(selectedDeviced);
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },

  titles: {
    marginTop: 50,
  },

  checkmark: {
    position: "absolute",
    height: 20,
    width: 20,
    right: 25,
    backgroundColor: "#fff",
    borderRadius: 20,
  },

  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    color: "#ABABAB",
    fontSize: 20,
    fontWeight: "normal",
    textAlign: "center",
  },

  deviceList: {
    marginTop: 25,
  },

  device: {
    backgroundColor: "#000",
    height: 100,
    width: "100%",
    alignSelf: "center",
    marginTop: 20,
    padding: 25,
    borderRadius: palette.borderRadius,
    justifyContent: "center",
    borderWidth: 2,
  },

  selectedDevice: {
    borderColor: "#fff",
  },

  deviceText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },

  connectButton: {},
});

export default DeviceList;
