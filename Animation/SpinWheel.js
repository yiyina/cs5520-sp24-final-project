import React from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';
import Svg, { Circle, Ellipse, Rect } from 'react-native-svg';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export default function SpinWheel() {
  const spinValue = new Animated.Value(0);

  const startSpinning = () => {
    spinValue.setValue(0);
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }

  startSpinning();

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View style={styles.container}>
      <AnimatedSvg
        height="100%"
        width="100%"
        style={{ transform: [{ rotate: spin }] }}
      >
        <Circle cx="50%" cy="50%" r="20%" stroke="black" strokeWidth="2.5" fill="transparent" />
      </AnimatedSvg>  
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:100,
    height:100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
