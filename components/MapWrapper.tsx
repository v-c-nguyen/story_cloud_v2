import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector, ScrollView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import Characters from './Characters';
import Landmarks from './Landmarks';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

const MapWrapper = () => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const savedX = useSharedValue(0);
  const savedY = useSharedValue(0);
  const scale = useSharedValue(0.6);
  const savedScale = useSharedValue(0.6);
  const [activeTab, setActiveTab] = useState('Characters');
  // const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  // useEffect(() => {
  //   Image.getSize(require('@/assets/images/maps/Central.png'), (width, height) => {
  //     setImageSize({ width, height });
  //   });
  // }, []);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      const minScale = 0.1;
      const maxScale = 2;
      scale.value = Math.max(minScale, Math.min(savedScale.value * e.scale, maxScale));
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      const newX = savedX.value + e.translationX;
      const newY = savedY.value + e.translationY;

      const maxX = (2500 * 1.2 - windowWidth) / 2;
      const minX = -maxX;

      const maxY = (1200 * 1.2 - windowHeight) / 2;
      const minY = -maxY;

      x.value = Math.max(minX, Math.min(newX, maxX));
      y.value = Math.max(minY, Math.min(newY, maxY));
    })
    .onEnd(() => {
      savedX.value = x.value;
      savedY.value = y.value;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }, { scale: scale.value }],
  }));

  const nativeGesture = Gesture.Native();
  const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture, nativeGesture);

  return (

    <View style={styles.container}>
      {/* <Image
          source={require('@/assets/images/kid/map-cloud.png')}
          style={styles.cloudImage}
        /> */}
      <ThemedView style={styles.tabContainer}>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'Characters' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('Characters')}
        >
          <ThemedText
            style={[
              styles.tabText,
              activeTab === 'Characters' && styles.activeTabText
            ]}
          >
            Characters
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'Landmarks' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('Landmarks')}
        >
          <ThemedText
            style={[
              styles.tabText,
              activeTab === 'Landmarks' && styles.activeTabText
            ]}
          >
            Landmarks
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
      {/* <Image
          source={require('@/assets/images/kid/map-cloud.png')}
          style={styles.cloudImage}
        /> */}
      <ScrollView>
        <ThemedView >
          <GestureDetector gesture={composedGesture}>
            <Animated.View style={[styles.animatedView]}>
              <Image
                source={require('@/assets/images/maps/Map1.png')}
                style={styles.mapImage}
              />
              {activeTab === 'Characters' && < Characters />}
              {/* Conditionally render Landmarks for Landmarks tab */}
              {activeTab === 'Landmarks' && <Landmarks />}

            </Animated.View>
          </GestureDetector>
        </ThemedView>
      </ScrollView>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  imgCloudFar: {
    width: "100%",
    height: 278,
    position: "absolute",
    top: 0,
    left: 0,
  },

  tabContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 50,
    // bottom: -170,
    // marginBottom: 20,
    borderRadius: 999, // Makes it a full pill shape
    borderWidth: 1,
    borderColor: 'white',
    // backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white
    padding: 2,
    zIndex: 900,
    width: 288
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 999,
  },
  activeTabButton: {
    backgroundColor: '#F4A672', // White background for the active button
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  tabText: {
    fontSize: 14,
    color: '#fff', // White text for inactive
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#053B4A', // Dark text for active
  },
  mapImage: {
    width: 1440,
    height: 1048,
  },
  mapImage3: {
    width: "40%",
    height: "80%",
    resizeMode: 'cover',

    top: "-100%",
    left: "1%",
  },
  animatedView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 1450,
    minHeight: 1050,
  },
  characterImage: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  cloudImage: {
    position: 'absolute',
    top: 70,
    left: 0,
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 90,
  },
});

export default MapWrapper;