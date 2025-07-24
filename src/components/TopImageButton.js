import React from 'react';
import { Pressable, Animated, Image, Text } from 'react-native';

const TopImageButton = ({ onPress, FoodBackGround, styles }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
    accessibilityLabel="Buscar em todos os tipos de comida"
  >
    <Animated.Image
      source={FoodBackGround}
      style={styles.slotImage}
      resizeMode="contain"
    />
  </Pressable>
);

export default TopImageButton;
