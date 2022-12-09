import React, { useContext } from "react";
import { useState, Context, createContext } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { BleManager, Device } from "react-native-ble-plx";
import { atob } from "react-native-quick-base64";
import DeviceInfo from "react-native-device-info";
import { PERMISSIONS, requestMultiple } from "react-native-permissions";

type PermissionCallback = (result: boolean) => void;
type BLEStatus =
  | "idle"
  | "scanning"
  | "connecting"
  | "connected"
  | "error"
  | "disconnecting";

export const SERVICE_UUID = "1f2d8a07-458d-44f0-a1b2-ecb92f5d3802";
export const CHARACTERISTIC_UUID_TX = "7719d3cf-bb84-4bc3-a705-fa06e2ccd285";
export const CHARACTERISTIC_UUID_RX = "593122f1-bc31-46ae-9521-2f86e2ea2740";

const bleManager = new BleManager();

interface BluetoothLowEnergyAPI {
  status: BLEStatus;
  requestPermissions(callback: PermissionCallback): Promise<void>;
  connectToDevice(device: Device): Promise<void>;
  disconnectFromDevice(): Promise<void>;
  scanForDevices(): void;
  allDevices: Device[];
  connectedDevice: Device | null;
  currentValue: number;
  bleManager: BleManager;
  resetToDeviceScan: () => void;
}

let BluetoothContext: Context<BluetoothLowEnergyAPI>;

interface Props {
  children: React.ReactNode;
}

const BluetoothContextProvider = ({ children }: Props) => {
  const [status, setStatus] = useState<BLEStatus>("idle");
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [currentValue, setCurrentValue] = useState<number>(0);

  const requestPermissions = async (callback: PermissionCallback) => {
    if (Platform.OS === "android") {
      const apiLevel = await DeviceInfo.getApiLevel();

      if (apiLevel < 31) {
        const grantedStatus = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "Bluetooth Low Energy needs access to your location.",
            buttonNegative: "Cancel",
            buttonPositive: "Ok",
            buttonNeutral: "Ask Me Later",
          },
        );

        callback(grantedStatus === PermissionsAndroid.RESULTS.GRANTED);
      } else {
        const result = await requestMultiple([
          PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
          PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ]);

        const isAllPermissionsGranted =
          result["android.permission.BLUETOOTH_SCAN"] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          result["android.permission.BLUETOOTH_CONNECT"] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          result["android.permission.ACCESS_FINE_LOCATION"] ===
            PermissionsAndroid.RESULTS.GRANTED;

        callback(isAllPermissionsGranted);
      }
    } else {
      callback(true);
    }
  };

  const isDuplicateDevice = (devices: Device[], nextDevice: Device) => {
    return devices.some((device) => nextDevice.id === device.id);
  };

  const scanForDevices = () => {
    setStatus("scanning");
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
      }

      if (device && device.name && device.name.includes("CamSlider")) {
        setTimeout(
          () => {
            setAllDevices((prev) => {
              if (!isDuplicateDevice(prev, device)) {
                return [...prev, device];
              }

              return prev;
            });
          },
          allDevices.length <= 0 ? 1000 : 0,
        );
      }
    });
  };

  const connectToDevice = async (device: Device) => {
    setStatus("connecting");
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection);
      bleManager.stopDeviceScan();
      await deviceConnection.discoverAllServicesAndCharacteristics();
      startStreamingData(deviceConnection);
      //setStatus("connected");

      deviceConnection.onDisconnected(() => {
        resetToDeviceScan();
        setConnectedDevice(null);
      });
    } catch (e) {
      console.log("ERROR CONNECTING TO DEVICE", e);
      setStatus("error");
      resetToDeviceScan();
    }
  };

  const disconnectFromDevice = async () => {
    setStatus("disconnecting");
    setAllDevices([]);
    if (connectedDevice && (await connectedDevice.isConnected())) {
      await connectedDevice.cancelConnection();
    }
    setConnectedDevice(null);
    setStatus("idle");
  };

  const startStreamingData = async (device: Device) => {
    if (device) {
      const subscription = device.monitorCharacteristicForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID_TX,
        (error, characteristic) => {
          if (!characteristic) return;

          if (error) {
            console.error(error);
            return;
          } else if (!characteristic?.value) {
            console.error("No characteristic value");
            return;
          }

          setStatus("connected");

          const rawData = atob(characteristic.value);
          setCurrentValue(parseFloat(rawData));
        },
      );

      device.onDisconnected(() => {
        subscription.remove();
      });
    } else {
      console.error("NO DEVICE CONNECTED");
    }
  };

  const resetToDeviceScan = () => {
    setStatus("idle");
    setAllDevices([]);
  };

  const output: BluetoothLowEnergyAPI = {
    status,
    requestPermissions,
    scanForDevices,
    allDevices,
    connectToDevice,
    connectedDevice,
    currentValue,
    disconnectFromDevice,
    resetToDeviceScan,
    bleManager,
  };

  if (!BluetoothContext) BluetoothContext = createContext(output);

  return (
    <BluetoothContext.Provider value={output}>
      {children}
    </BluetoothContext.Provider>
  );
};

export const useBLE = () => {
  return useContext(BluetoothContext);
};

export default BluetoothContextProvider;
