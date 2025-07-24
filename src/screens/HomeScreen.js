import React, { useState, useRef } from 'react';
import { View, Text, Linking, Pressable, Animated, FlatList, TouchableOpacity, Modal } from 'react-native';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import data from '../data/restaurants.json';
import FoodBackGround from '../assets/images/FoodBackGround.png';
import Slider from '@react-native-community/slider';
import styles from './HomeScreen.styles';
import FoodTypePicker from '../components/FoodTypePicker';
import DistanceSlider from '../components/DistanceSlider';
import SlotMachine from '../components/SlotMachine';
import ResultBox from '../components/ResultBox';
import TopImageButton from '../components/TopImageButton';
import MainButton from '../components/MainButton';
import ClearButton from '../components/ClearButton';
import { SafeAreaView } from 'react-native-safe-area-context';


const getUniqueFoodTypes = () => {
  const types = data.map(item => item.foodType);
  return [...new Set(types)];
};

const ITEM_HEIGHT = 48;
const VISIBLE_ITEMS = 5;

const haversine = (lat1, lon1, lat2, lon2) => {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const HomeScreen = () => {
  const [selected, setSelected] = useState(null);
  const [selectedFoodTypes, setSelectedFoodTypes] = useState([]); // agora array
  const [fadeAnim] = useState(new Animated.Value(0));
  const [modalVisible, setModalVisible] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState(null);
  const [currentName, setCurrentName] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [spinScale] = useState(new Animated.Value(1));
  const [maxDistance, setMaxDistance] = useState(10); // valor padrão 10km
  const scrollY = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);
    })();
  }, []);

  const filtered = selectedFoodTypes.length > 0
    ? data.filter(item => selectedFoodTypes.includes(item.foodType))
    : data;

  // Calcular distâncias reais
  const restaurantsWithDistance = filtered.map(r => {
    let distance = null;
    if (userLocation && r.latitude && r.longitude) {
      distance = haversine(userLocation.latitude, userLocation.longitude, r.latitude, r.longitude);
    }
    return { ...r, distance };
  }).filter(r => r.distance === null || r.distance <= maxDistance);
  const restaurantNames = restaurantsWithDistance.map(item => item.name);

  const handleSpin = () => {
    if (restaurantNames.length > 0) {
      Animated.sequence([
        Animated.timing(spinScale, {
          toValue: 0.92,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(spinScale, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        })
      ]).start();
      const randomIndex = Math.floor(Math.random() * restaurantNames.length);
      setWinnerIndex(randomIndex);
      setSpinning(true);
      setCurrentName('');
      let i = 0;
      let speed = 40;
      let totalCycles = 40 + Math.floor(Math.random() * 10); // total de trocas
      function animateNames() {
        if (i < totalCycles) {
          setCurrentName(restaurantNames[i % restaurantNames.length]);
          i++;
          // Aumenta o delay para desacelerar
          if (i > totalCycles - 10) speed += 30;
          setTimeout(animateNames, speed);
        } else {
          setCurrentName(restaurantNames[randomIndex]);
          setTimeout(() => {
            setSelected(restaurantsWithDistance[randomIndex]);
            setSpinning(false);
            fadeAnim.setValue(0);
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }).start();
          }, 500);
        }
      }
      animateNames();
    }
  };

  // Lista estendida para simular rolagem infinita
  const extendedList = Array(15).fill(restaurantNames).flat();

  const handleFoodTypeSelect = (item) => {
    if (selectedFoodTypes.includes(item)) {
      setSelectedFoodTypes(selectedFoodTypes.filter(t => t !== item));
    } else {
      setSelectedFoodTypes([...selectedFoodTypes, item]);
    }
    setSelected(null); // Limpa o resultado ao mudar filtro
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#b0e0ff' }} edges={['top', 'bottom', 'left', 'right']}>
      <LinearGradient
        colors={['#b0e0ff', '#a1c4fd', '#c2e9fb']}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <View style={{ alignItems: 'center', marginTop: 24 }}>
          <TopImageButton
            onPress={() => {
              setSelectedFoodTypes([]);
              setSelected(null);
              setTimeout(() => {
                if (restaurantNames.length > 0) {
                  handleSpin();
                }
              }, 100);
            }}
            FoodBackGround={FoodBackGround}
            styles={styles}
          />
          <Text style={[styles.title, { fontSize: 20, marginTop: 8 }]}>Onde comer hoje?</Text>
        </View>

        {/* Card de filtros flutuante */}
        <View style={{
          backgroundColor: 'rgba(255,255,255,0.92)',
          borderRadius: 22,
          marginHorizontal: 18,
          marginTop: 18,
          padding: 18,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.10,
          shadowRadius: 16,
          elevation: 6,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text style={[styles.label, { marginBottom: 0 }]}>Tipos de comida:</Text>
            <Pressable
              onPress={() => {
                setSelected(null);
                setSelectedFoodTypes([]);
              }}
              style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, backgroundColor: '#f0f0f0', marginLeft: 8 }}
              accessibilityLabel="Limpar filtros"
            >
              <Text style={{ color: '#3478F6', fontWeight: 'bold', fontSize: 14 }}>Limpar</Text>
            </Pressable>
          </View>
          <Pressable style={styles.input} onPress={() => setModalVisible(true)}>
            <Text style={{ color: selectedFoodTypes.length ? '#000' : '#888' }}>
              {selectedFoodTypes.length === 0 && 'Todos os tipos'}
              {selectedFoodTypes.length === 1 && selectedFoodTypes[0]}
              {selectedFoodTypes.length === 2 && `${selectedFoodTypes[0]}, ${selectedFoodTypes[1]}`}
              {selectedFoodTypes.length > 2 && `${selectedFoodTypes[0]}, ${selectedFoodTypes[1]}, ... +${selectedFoodTypes.length - 2}`}
            </Text>
          </Pressable>
          <View style={{ marginTop: 18 }}>
            <Text style={[styles.label, { marginBottom: 0 }]}>Distância máxima: <Text style={{ color: '#3478F6', fontWeight: 'bold' }}>{maxDistance} km</Text></Text>
            <View style={{ marginTop: 4 }}>
              <DistanceSlider maxDistance={maxDistance} setMaxDistance={setMaxDistance} styles={styles} />
            </View>
          </View>
        </View>

        {/* Botão girar grande e centralizado */}
        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <MainButton onPress={handleSpin} disabled={spinning} spinScale={spinScale} styles={styles} />
        </View>

        {/* Slot machine animado */}
        {spinning && (
          <View style={{ alignItems: 'center', marginVertical: 6 }}>
            <SlotMachine spinning={spinning} currentName={currentName} styles={styles} />
          </View>
        )}

        {/* Resultado em card flutuante */}
        {selected && (
          <View style={{ alignItems: 'center' }}>
            <ResultBox selected={selected} fadeAnim={fadeAnim} styles={styles} />
          </View>
        )}

        {/* Modal de tipos de comida (mantido para acessibilidade extra) */}
        <FoodTypePicker
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          foodTypes={getUniqueFoodTypes()}
          selectedFoodTypes={selectedFoodTypes}
          onSelectType={handleFoodTypeSelect}
          styles={styles}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

export default HomeScreen;
