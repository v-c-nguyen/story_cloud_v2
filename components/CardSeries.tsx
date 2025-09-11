import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';



interface Card {
  color: string,
  icon: any,
  text: string
}

interface CardProps extends Card {
  selected: boolean;
  onPress: () => void;
}

const Card = ({ color, icon, text, selected, onPress }: CardProps) => (
  <ThemedView style={[styles.card, { backgroundColor: color }, selected && styles.selectedCard]}>
    <ThemedView style={[styles.circle, !selected && { display: 'none' }]} />
    <Image source={icon} style={[styles.icon, selected && styles.selectedIcon]} tintColor={selected ? '#ffffff' : color == '#053B4A' ? '#ADD7DA' : '#053B4A'} />
    <ThemedText style={[styles.text, color == "#053B4A" && { color: '#ADD7DA' }, selected && { color: '#053B4A' }]}>{text}</ThemedText>
    <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onPress} />
  </ThemedView>
);

const CardSeries = ({ data, active }: { data: Card[], active: string }) => {
  const [scrollX, setScrollX] = React.useState(0);
  const router = useRouter();
  const scrollRef = React.useRef<ScrollView>(null);
  const params = useLocalSearchParams();
  const initialScrollX = Number(params.scrollX) || 0;

  // Find the index of the active card
  React.useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ x: initialScrollX, animated: false });
      }, 0);
    }
  }, [initialScrollX]);

  function handleSelectedItem({ index, card }: { index: number, card: Card }) {
    // Redirect based on card.text
    switch (card.text.toLowerCase()) {
      case 'series':
        router.replace({ pathname: './', params: { scrollX: String(scrollX) } });
        break;
      case 'collections':
        router.replace({ pathname: './collections', params: { crollX: String(scrollX) } });
        break;
      case 'map':
        router.replace({ pathname: './map', params: { scrollX: String(scrollX) } });
        break;
      case 'themes':
        router.replace({ pathname: './themes', params: { scrollX: String(scrollX) } });
        break;
      case 'characters':
        router.replace({ pathname: './characters', params: { scrollX: String(scrollX) } });
        break;
      default:
        break;
    }
  }
  return (
    <ThemedView style={styles.rootContainer}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.container}
        onScroll={e => setScrollX(e.nativeEvent.contentOffset.x)}
        scrollEventThrottle={16}
      >
        {data?.map((card, index) => (
          <Card
            key={index}
            {...card}
            selected={card.text === active}
            onPress={() => handleSelectedItem({ index, card })}
          />
        ))}
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    marginTop: 0,
    marginLeft: 10,
  },
  container: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  card: {
    width: 120,
    height: 170,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginRight: 10,
    overflow: 'hidden',
  },
  selectedCard: {
    backgroundColor: '#fba864',
    width: 145,
    height: 190,
    marginTop: -7
  },
  circle: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 15,
    height: 15,
    backgroundColor: '#ffffff',
    borderRadius: 50,
  },
  text: {
    marginTop: 10,
    color: '#053B4A',
    fontSize: 14,
    fontWeight: '400',
  },
  icon: {
    width: 60,
    height: 60,
  },
  selectedIcon: {
    tintColor: '#ffffff',
  },
});

export default CardSeries;
