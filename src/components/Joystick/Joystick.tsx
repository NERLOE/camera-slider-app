import React, { useState } from "react";
import { useRef } from "react";
import {
  Animated,
  View,
  Touchable,
  NativeTouchEvent,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from "react-native";

interface Props {
  children?: React.ReactNode;
  lockX?: boolean;
  lockY?: boolean;
  width?: number;
  step?: number;
  resetOnRelease?: boolean;
  onValue?: ({ x, y }: { x: number; y: number }) => void;
  wrapperStyle?: StyleProp<ViewStyle>;
  handlerStyle?: StyleProp<ViewStyle>;
}

const Joystick = ({
  children,
  lockX,
  lockY,
  width = 300,
  step = 0,
  resetOnRelease = true,
  onValue,
  wrapperStyle,
  handlerStyle,
}: Props) => {
  const wrapperElement = useRef<View>(null);

  const [pX, setPX] = useState(0);
  const [pY, setPY] = useState(0);
  const [sX, setSX] = useState(0);
  const [sY, setSY] = useState(0);

  const [currentIdentifier, setIdentifier] = useState<string | undefined>(
    undefined,
  );

  const limitter = (input: number) => {
    const minimised = (input / width) * 2;
    const stepped = (x: number) => (step ? Math.floor(x / step) * step : x);
    const limited = (x: number) => Math.min(1, Math.max(-1, x));
    return (stepped(limited(minimised)) * width) / 2;
  };

  const setPosition = (pageX: number, pageY: number) => {
    wrapperElement.current?.measure((fx, fy, w, h, px, py) => {
      const cx = px + w / 2;
      const cy = py + h / 2;

      const newPX = limitter(lockX ? 0 : pageX - cx);
      const newPY = limitter(lockY ? 0 : pageY - cy);

      setPX(newPX);
      setPY(newPY);

      sendValue(newPX, newPY);

      setSX(cx);
      setSY(cy);
    });
  };

  const sendValue = (x: number, y: number) => {
    if (onValue) {
      onValue({ x: (x / width) * 2, y: (y / width) * 2 });
    }
  };

  const getTouchPoint = (touches: NativeTouchEvent[], identifier: string) => {
    return touches.find((item) => item.identifier === identifier);
  };

  const onTouchMove: Touchable["onTouchMove"] = (e) => {
    if (!currentIdentifier) return;
    const touchItem = getTouchPoint(e.nativeEvent.touches, currentIdentifier);
    if (touchItem) {
      const { pageX, pageY } = touchItem;

      const newPX = limitter(lockX ? 0 : pageX - sX);
      const newPY = limitter(lockY ? 0 : pageY - sY);

      setPX(newPX);
      setPY(newPY);

      sendValue(newPX, newPY);
    }
  };

  const onTouchStart: Touchable["onTouchStart"] = (e) => {
    const identifier = e.nativeEvent.identifier;
    const touchItem = getTouchPoint(e.nativeEvent.touches, identifier);

    if (typeof identifier === "number" && touchItem) {
      const { pageX, pageY } = touchItem;
      setIdentifier(identifier);
      setPosition(pageX, pageY);
    }
  };

  const onTouchEnd: Touchable["onTouchEnd"] = () => {
    if (resetOnRelease) {
      setPX(0);
      setPY(0);
    }

    sendValue(0, 0);
  };

  const onTouchCancel: Touchable["onTouchCancel"] = () => {
    setPX(0);
    setPY(0);
  };

  return (
    <View
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchCancel}
      ref={wrapperElement}
      style={[styles.wrapper, wrapperStyle, { width, height: width }]}
    >
      <Animated.View
        style={[
          styles.handler,
          handlerStyle,
          {
            transform: [
              {
                translateX: pX,
              },
              {
                translateY: pY,
              },
            ],
          },
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 150,
    height: 150,
    borderRadius: 300,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000033",
  },
  handler: {
    width: "60%",
    height: "60%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 300,
    backgroundColor: "#00000066",
  },
});

export default Joystick;
