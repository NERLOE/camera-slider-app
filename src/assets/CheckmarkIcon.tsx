import React from "react";
import { StyleSheet, View } from "react-native";
import { Path, Svg, SvgProps } from "react-native-svg";

const CheckmarkIcon = (props: SvgProps) => {
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        { alignItems: "center", justifyContent: "center" },
      ]}
    >
      <Svg viewBox="0 0 36 36" {...props}>
        <Path d="M34.459 1.375a2.999 2.999 0 0 0-4.149.884L13.5 28.17l-8.198-7.58a2.999 2.999 0 1 0-4.073 4.405l10.764 9.952s.309.266.452.359a2.999 2.999 0 0 0 4.15-.884L35.343 5.524a2.999 2.999 0 0 0-.884-4.149z" />
      </Svg>
    </View>
  );
};

export default CheckmarkIcon;
