import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { themeStyles } from "~/theme/styles";

const SafeAreaView = ({ children }: { children?: React.ReactNode }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        ...themeStyles.safeAreaView,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      {children}
    </View>
  );
};

export default SafeAreaView;
