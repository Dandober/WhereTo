import React from 'react';
import { Pressable, Text } from 'react-native';

const ClearButton = ({ onPress, styles }) => (
  <Pressable style={styles.clearButton} onPress={onPress}>
    <Text style={styles.clearText}>Limpar</Text>
  </Pressable>
);

export default ClearButton;
