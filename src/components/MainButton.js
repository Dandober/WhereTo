import React from 'react';
import { Pressable, Text, Animated } from 'react-native';

const MainButton = ({ onPress, disabled, spinScale, styles }) => (
  <Animated.View style={{ transform: [{ scale: spinScale }] }}>
    <Pressable style={styles.spinButton} onPress={onPress} disabled={disabled}>
      <Text style={styles.spinText}>GIRAR</Text>
    </Pressable>
  </Animated.View>
);

export default MainButton;
