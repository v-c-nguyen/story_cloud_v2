import supabase from '@/app/lib/supabase';
import { useLocationsStore } from '@/store/locationsStore';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedView } from './ThemedView';
import { SvgUri } from 'react-native-svg';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  landmarkContainer: {
    borderRadius: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 600,
  },
  image: {
  },
});

const Landmarks = () => {
  const landmarksData = useLocationsStore((s) => s.locations)
  const [loading, setLoading] = React.useState(false);
  const currentLocation = useLocationsStore((s) => s.currentLocation);
  const setCurrentLocation = useLocationsStore((s) => s.setCurrentLocation);

  function handleStoryItem(item: string) {
    if (!setCurrentLocation) return;
    const found = landmarksData.find((t: any) => t.name === item || t.id === item);
    if (
      currentLocation &&
      ((currentLocation as any).name === item || (currentLocation as any).id === item)
    ) {
      setCurrentLocation(null);
    } else if (found) {
      setCurrentLocation(found as any);
    } else {
      setCurrentLocation({ id: item, name: item } as any);
    }
  }
  return (
    <View style={styles.container}>
      {/* Map over the landmarksData array to render each landmark */}
      {landmarksData.map((item, index) => (
        item.top && item.left &&
        <TouchableOpacity
          key={index}
          style={[item.style, { top: item.top, left: item.left, position: "absolute" }]}
          onPress={() => { handleStoryItem(item.name) }}
        >
          {/* Display SVG from avatar_url */}
          <ThemedView style={styles.landmarkContainer}>
            {item.avatar_url ? (
              // Use SvgUri to render SVG from URL
              <SvgUri uri={item.map_image} style={styles.image} />

            ) : null}
          </ThemedView>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Landmarks;