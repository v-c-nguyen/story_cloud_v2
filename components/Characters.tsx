import supabase from '@/app/lib/supabase';
import { useCharactersStore } from '@/store/charactersStore';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { ThemedView } from './ThemedView';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  characterContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#7A4FF4",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "white",
    borderWidth: 2,
    zIndex: 600,
  },
  image: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
  },
  // Static styles for 10 character positions with 'top' values in the 30-80 range
});

const Characters = () => {
  const charactersData = useCharactersStore((s) => s.characters)
  const [loading, setLoading] = React.useState(false);
  const currentCharacter = useCharactersStore((s) => s.currentCharacter);
  const setCurrentCharacter = useCharactersStore((s) => s.setCurrentCharacter);

  function handleStoryItem(item: string) {
    if (!setCurrentCharacter) return;
    const found = charactersData.find((t: any) => t.name === item || t.id === item);
    if (
      currentCharacter &&
      ((currentCharacter as any).name === item || (currentCharacter as any).id === item)
    ) {
      setCurrentCharacter(null);
    } else if (found) {
      setCurrentCharacter(found as any);
    } else {
      setCurrentCharacter({ id: item, name: item } as any);
    }
  }
  return (
    <View style={styles.container}>
      {/* Map over the charactersData array to render each character */}
      {charactersData.map((item, index) => (
        item.top  && item.left && 
          <TouchableOpacity
          key={index}
          style={[item.style, { top: item.top, left: item.left, position: "absolute" }]}
          onPress={() => { handleStoryItem(item.name) }}
        >
          {/* Display SVG from avatar_url */}
          <ThemedView style={styles.characterContainer}>
            {item.avatar_url ? (
              // Use SvgUri to render SVG from URL
              <SvgUri width="44" height="44" uri={item.avatar_url} style={styles.image} />

            ) : null}
          </ThemedView>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Characters;