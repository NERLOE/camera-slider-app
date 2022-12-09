import React from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { palette } from "~/theme/themes";

interface Props {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const Button = ({
  onPress,
  title,
  disabled,
  loading,
  style,
  textStyle,
}: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
      style={{
        ...styles.buttonContainer,
        ...(disabled ? styles.disabled : {}),
        ...(style as object),
      }}
    >
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Text style={{ ...styles.buttonText, ...(textStyle as object) }}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 32,
    elevation: 3,
    borderRadius: palette.borderRadius,
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "100%",
  },

  disabled: {
    opacity: 0.1,
  },

  buttonText: {
    color: "#000",
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
  },
});
