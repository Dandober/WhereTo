import React from 'react';
import { View, Animated, Text } from 'react-native';

const SlotMachine = ({ spinning, currentName, styles }) => (
  <View style={styles.slotCircle}>
    {spinning && (
      <Animated.Text style={[styles.slotText, { fontSize: 16 }]}>{currentName ? String(currentName) : ''}</Animated.Text>
    )}
  </View>
);

export default SlotMachine;
