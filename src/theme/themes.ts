import { DefaultTheme, Theme } from "@react-navigation/native";

export const palette = {
  primary: "#0564d4",
  secondary: "#ff6a00",
  background: "#111111",
  white: "#fff",
  black: "#000",
  red: "#942b2b",
  bluetooth: "#0082FC",
  borderRadius: 5,
};

export const LightTheme: Theme = {
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    ...palette,
  },
};

export const DarkTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...LightTheme.colors,
    background: palette.background,
  },
};
