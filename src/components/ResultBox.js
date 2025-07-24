import React from 'react';
import { Animated, Text, Pressable, Linking, View, ActionSheetIOS, Platform, Alert } from 'react-native';

const openNavigation = (latitude, longitude) => {
  const urlGoogle = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  const urlWaze = `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;
  const urlApple = `http://maps.apple.com/?daddr=${latitude},${longitude}`;

  if (Platform.OS === 'ios') {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancelar', 'Google Maps', 'Waze', 'Apple Maps'],
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex === 1) Linking.openURL(urlGoogle);
        if (buttonIndex === 2) Linking.openURL(urlWaze);
        if (buttonIndex === 3) Linking.openURL(urlApple);
      }
    );
  } else {
    Alert.alert(
      'Escolha o app',
      '',
      [
        { text: 'Google Maps', onPress: () => Linking.openURL(urlGoogle) },
        { text: 'Waze', onPress: () => Linking.openURL(urlWaze) },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  }
};

const ResultBox = ({ selected, fadeAnim, styles }) => (
  <Animated.View style={[styles.resultBox, { opacity: fadeAnim }]}> 
    <Text style={styles.resultName}>{String(selected.name)}</Text>
    <Text style={styles.resultRow}>
      <Text style={styles.resultLabel}>Tipo: </Text>
      <Text style={styles.resultValue}>{String(selected.type)}</Text>
    </Text>
    <Text style={styles.resultRow}>
      <Text style={styles.resultLabel}>Tipo de comida: </Text>
      <Text style={styles.resultValue}>{String(selected.foodType)}</Text>
    </Text>
    <Text style={styles.resultRow}>
      <Text style={styles.resultLabel}>Distância: </Text>
      <Text style={styles.resultValue}>{selected.distance !== undefined && selected.distance !== null ? `${selected.distance.toFixed(2)} km` : 'Indisponível'}</Text>
    </Text>
    {(selected.link || (selected.latitude && selected.longitude)) && (
      <View style={{ flexDirection: 'row', width: '100%', gap: 8, marginTop: 12 }}>
        {selected.link && (
          <Pressable style={[styles.resultLinkButton, { flex: 1, marginTop: 0, marginRight: 6 }]} onPress={() => Linking.openURL(selected.link)}>
            <Text style={styles.link}>🔗 Visitar página</Text>
          </Pressable>
        )}
        {selected.latitude && selected.longitude && (
          <Pressable style={[styles.fullWidthButton, { flex: 1, marginTop: 0 }]} onPress={() => openNavigation(selected.latitude, selected.longitude)}>
            <Text style={[styles.link, { color: '#fff', textAlign: 'center', width: '100%' }]}>🗺️ Como chegar</Text>
          </Pressable>
        )}
      </View>
    )}
  </Animated.View>
);

export default ResultBox;
