import React from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';

const DistanceSlider = ({ maxDistance, setMaxDistance, styles }) => (
  <View style={styles.filterRow}>
    <Slider
      style={{ width: '100%', height: 32 }}
      minimumValue={1}
      maximumValue={50}
      step={1}
      value={maxDistance}
      onValueChange={setMaxDistance}
      minimumTrackTintColor="#3478F6"
      maximumTrackTintColor="#b0e0ff"
      thumbTintColor="#3478F6"
    />
  </View>
);

export default DistanceSlider;
