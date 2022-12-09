import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useBLE } from "../contexts/BluetoothContext";
import FindDevice from "@screens/FindDevice";
import HomeScreen from "@screens/Home";
import DeviceList from "@screens/DeviceList";
import { SCREENS } from "@constants/index";
import { useColorScheme } from "react-native";
import { DarkTheme, LightTheme } from "~/theme/themes";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const theme = useColorScheme();
  const { connectedDevice, allDevices, status } = useBLE();

  if (status === "idle" || (!connectedDevice && allDevices.length <= 0)) {
    return <FindDevice />;
  } else if (!connectedDevice && allDevices.length > 0) {
    return <DeviceList />;
  }

  return (
    <NavigationContainer theme={theme === "dark" ? DarkTheme : LightTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name={SCREENS.HOME} component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
