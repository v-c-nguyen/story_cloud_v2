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
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#7A4FF4",
    borderColor: "white",
    borderWidth: 2,
    zIndex: 600,
  },
  image: {
    width: 44,
    height: 44,
    resizeMode: 'contain',
  },
  // Static styles for 10 character positions with 'top' values in the 30-80 range

  chirpStyle: { top: 69, left: 929, width: 84, height: 94 },
  ollieStyle: { top: 157, left: 863, width: 76, height: 80 },
  winstonStyle: { top: 169, left: 749, width: 93, height: 80 },
  lunaStyle: { top: 119, left: 554, width: 69, height: 80 },
  mojoStyle: { top: 163, left: 387, width: 62, height: 80 },
  zaraStyle: { top: 239, left: 59, width: 115, height: 48 },
  esiStyle: { top: 352, left: 301, width: 59, height: 80 },
  dashStyle: { top: 338, left: 381, width: 109, height: 48 },
  waddlesStyle: { top: 229, left: 1063, width: 57, height: 81 },
  laraStyle: { top: 399, left: 1085, width: 54, height: 80 },
  danoStyle: { top: 335, left: 982, width: 57, height: 80 },
  ziggyStyle: { top: 386, left: 900, width: 61, height: 80 },
  sukiStyle: { top: 489, left: 812, width: 67, height: 80 },
  captainStyle: { top: 497, left: 606, width: 91, height: 94 },
  daisyStyle: { top: 498, left: 466, width: 73, height: 80 },
  marloStyle: { top: 574, left: 209, width: 63, height: 80 },
  echoStyle: { top: 629, left: 278, width: 69, height: 80 },
  bindiStyle: { top: 690, left: 365, width: 90, height: 80 },
  nedStyle: { top: 618, left: 207, width: 52, height: 80 },
  kaiStyle: { top: 680, left: 620, width: 94, height: 94 },
  miloStyle: { top: 616, left: 1047, width: 73, height: 80 },
  willowStyle: { top: 582, left: 848, width: 86, height: 78 },
  professorStyle: { top: 643, left: 763, width: 114, height: 80 },
  marmaladeStyle: { top: 523, left: 1126, width: 74, height: 79 },
  kikiStyle: { top: 529, left: 1242, width: 103, height: 80 },
  pippaStyle: { top: 620, left: 1325, width: 64, height: 80 },
  stellaStyle: { top: 842, left: 1216, width: 83, height: 80 },
  rileyStyle: { top: 842, left: 1047, width: 68, height: 80 },
  zorbyStyle: { top: 861, left: 988, width: 85, height: 80 },
  cyberStyle: { top: 741, left: 849, width: 91, height: 80 },
  longweiStyle: { top: 749, left: 726, width: 72, height: 80 },
  tillyStyle: { top: 794, left: 643, width: 95, height: 94 },
  nickStyle: { top: 849, left: 584, width: 70, height: 80 },
  lilyStyle: { top: 918, left: 191, width: 79, height: 80 },
  emberStyle: { top: 884, left: 82, width: 88, height: 80 }
});

// An array to hold the data for each character
const characterStyles = [
  styles.chirpStyle,
  styles.ollieStyle,
  styles.winstonStyle,
  styles.lunaStyle,
  styles.mojoStyle,
  styles.zaraStyle,
  styles.esiStyle,
  styles.dashStyle,
  styles.waddlesStyle,
  styles.laraStyle,
  styles.danoStyle,
  styles.ziggyStyle,
  styles.sukiStyle,
  styles.captainStyle,
  styles.daisyStyle,
  styles.marloStyle,
  styles.echoStyle,
  styles.bindiStyle,
  styles.nedStyle,
  styles.kaiStyle,
  styles.professorStyle,
  styles.willowStyle,
  styles.miloStyle,
  styles.marmaladeStyle,
  styles.kikiStyle,
  styles.pippaStyle,
  styles.stellaStyle,
  styles.rileyStyle,
  styles.zorbyStyle,
  styles.cyberStyle,
  styles.longweiStyle,
  styles.tillyStyle,
  styles.nickStyle,
  styles.lilyStyle,
  styles.emberStyle
];

// const charactersData = characterSources.map((source, idx) => ({
//   key: `char_${idx + 1}`,
//   source,
//   style: characterStyles[idx]
// }));

const Characters = () => {
  const [charactersData, setCharactersData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const currentCharacter = useCharactersStore((s) => s.currentCharacter);
  const setCurrentCharacter = useCharactersStore((s) => s.setCurrentCharacter);

  useEffect(() => {
    async function fetchCharacters() {
      setLoading(true);
      try {
        const jwt = supabase.auth.getSession && (await supabase.auth.getSession())?.data?.session?.access_token;
        const { data, error } = await supabase.functions.invoke('stories/characters', {
          method: 'GET',
          headers: {
            Authorization: jwt ? `Bearer ${jwt}` : '',
          },
        });
        if (error) {
          console.error('Error fetching characters:', error.message);

        } else if (data && Array.isArray(data)) {
          setCharactersData(data);
        }
      } catch (e) {
        console.error('Error fetching characters:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchCharacters();
  }, []);
  return (
    <View style={styles.container}>
      {/* Map over the charactersData array to render each character */}
      {charactersData.map((item, index) => (
        <TouchableOpacity
          key={item.key}
          style={[item.style, { top: item.top, left: item.left, position: "absolute" }]}
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