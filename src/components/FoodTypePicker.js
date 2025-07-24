import React from 'react';
import { View, Text, Pressable, FlatList, TouchableOpacity, Modal } from 'react-native';

const FoodTypePicker = ({
  visible,
  onClose,
  foodTypes,
  selectedFoodTypes,
  onSelectType,
  styles
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onClose}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <FlatList
          data={foodTypes}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ ...styles.modalItem, flexDirection: 'row', alignItems: 'center' }}
              onPress={() => onSelectType(item)}
            >
              <View style={{
                width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#4E9F3D', marginRight: 12,
                backgroundColor: selectedFoodTypes.includes(item) ? '#4E9F3D' : '#fff',
                alignItems: 'center', justifyContent: 'center',
              }}>
                {selectedFoodTypes.includes(item) && (
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>✓</Text>
                )}
              </View>
              <Text style={{ fontSize: 18, color: '#000' }}>{String(item)}</Text>
            </TouchableOpacity>
          )}
        />
        <Pressable style={styles.modalClose} onPress={onClose}>
          <Text style={{ color: '#3478F6', fontWeight: 'bold', fontSize: 16 }}>Fechar</Text>
        </Pressable>
      </View>
    </View>
  </Modal>
);

export default FoodTypePicker;
