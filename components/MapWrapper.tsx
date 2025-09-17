
import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector, ScrollView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import Characters from './Characters';
import Landmarks from './Landmarks';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';


interface MapWrapperProps {
  activeTab: string;
  setActiveTab: (tab: string) => void
}

const MapWrapper = ({
  activeTab, setActiveTab
}: MapWrapperProps
) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const mapWidth = 1440;
  const mapHeight = 1048;
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const savedX = useSharedValue(0);
  const savedY = useSharedValue(0);
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  // const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  // useEffect(() => {
  //   Image.getSize(require('@/assets/images/maps/Central.png'), (width, height) => {
  //     setImageSize({ width, height });
  //   });
  // }, []);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      const minScale = 1;
      const maxScale = 2;
      scale.value = Math.max(minScale, Math.min(savedScale.value * e.scale, maxScale));
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      // After zoom, recenter if needed
      resetPanLimits();
    });

  function resetPanLimits() {
    // Center the map after zoom or on mount
    const scaledWidth = mapWidth * scale.value;
    const scaledHeight = mapHeight * scale.value;
    // If map is smaller than window, center it
    x.value = 0;
    y.value = 0;
    savedX.value = 0;
    savedY.value = 0;
  }

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      const scaledWidth = mapWidth * scale.value;
      const scaledHeight = mapHeight * scale.value;
      const newX = savedX.value + e.translationX;

      // Calculate max/min so map edges never go past window edges
      const maxX = Math.max(0, scaledWidth);
      const minX = -(scaledWidth - windowWidth);

      x.value = Math.max(minX, Math.min(newX, maxX));
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
      <ThemedView style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'characters' && styles.activeTabButton]}
          onPress={() => setActiveTab('characters')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'characters' && styles.activeTabText]}>Characters</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'landmarks' && styles.activeTabButton]}
          onPress={() => setActiveTab('landmarks')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'landmarks' && styles.activeTabText]}>Landmarks</ThemedText>
        </TouchableOpacity>
      </ThemedView>
      <ThemedView style={{ flex: 1 }}>
        {/* <GestureDetector gesture={composedGesture}> */}
            <ScrollView horizontal={true} contentContainerStyle={{ flexGrow: 1 }}>
              <Image
                source={{ uri: "https://fzmutsehqndgqwprkxrm.supabase.co/storage/v1/object/sign/resources/locations_map/Map1.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iNjNkYWNiNy1lYWJiLTQyOTQtOGY2My03YjVlYTk2Y2JiOWQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJyZXNvdXJjZXMvbG9jYXRpb25zX21hcC9NYXAxLnBuZyIsImlhdCI6MTc1NzY5Nzg1NCwiZXhwIjoxNzg5MjMzODU0fQ.e0QPcHD9_5WULG1jLvSjbkkY8VZvYkLjAIQvBzLGRgw" }}
                style={styles.mapImage}
              />
              {activeTab === 'characters' && < Characters />}
              {activeTab === 'landmarks' && <Landmarks />}
            </ScrollView>
        {/* </GestureDetector> */}
      </ThemedView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
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