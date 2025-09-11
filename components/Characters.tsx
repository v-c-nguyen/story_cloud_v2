import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  characterContainer: {
    position: 'absolute',
    width: 160,
    height: 160,
    zIndex: 600,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  // Static styles for 10 character positions with 'top' values in the 30-80 range

  char11Style: { top: '28%', left: '37%' },
  char12Style: { top: '58%', left: '57%' },
  char13Style: { top: '48%', left: '53%' },
  char14Style: { top: '45%', left: '57%' },
  char15Style: { top: '59%', left: '28%' },
  char16Style: { top: '68%', left: '32%' },
  char17Style: { top: '20%', left: '52%' },
  char18Style: { top: '72%', left: '10%' },
  char19Style: { top: '72%', left: '60%' },
  char20Style: { top: '67%', left: '55%' },
  char21Style: { top: '33%', left: '8%' },
  char22Style: { top: '89%', left: '34%' },
  char23Style: { top: '107%', left: '31%' },
  char24Style: { top: '101%', left: '35%' },
  char25Style: { top: '17%', left: '46%' },
  char26Style: { top: '90%', left: '45%' },
  char27Style: { top: '25%', left: '31%' },
  char28Style: { top: '28%', left: '25%' },
  char29Style: { top: '76%', left: '48%' },
  char30Style: { top: '67%', left: '43%' },
  char31Style: { top: '36%', left: '42%' },
  char32Style: { top: '38%', left: '20%' },
  char33Style: { top: '49%', left: '14%' },
  char34Style: { top: '76%', left: '14%' },
  char35Style: { top: '104%', left: '54%' },
  char36Style: { top: '93%', left: '21%' },
  char37Style: { top: '79%', left: '27%' },
  char38Style: { top: '104%', left: '61%' },
  char39Style: { top: '108%', left: '66%' },
  char40Style: { top: '105%', left: '2%' },
  char41Style: { top: '113%', left: '10%' },
  char42Style: { top: '70%', left: '70%' },
  char43Style: { top: '79%', left: '72%' },
});

// An array to hold the data for each character
const charactersData = [

  { key: 'char_11', source: require('@/assets/images/Characters/Group 163305.png'), style: styles.char11Style },
  { key: 'char_12', source: require('@/assets/images/Characters/Group 163306.png'), style: styles.char12Style },
  { key: 'char_13', source: require('@/assets/images/Characters/Group 163307.png'), style: styles.char13Style },
  { key: 'char_14', source: require('@/assets/images/Characters/Group 163308.png'), style: styles.char14Style },
  { key: 'char_15', source: require('@/assets/images/Characters/Group 163309.png'), style: styles.char15Style },
  { key: 'char_16', source: require('@/assets/images/Characters/Group 163310.png'), style: styles.char16Style },
  { key: 'char_17', source: require('@/assets/images/Characters/Group 163311.png'), style: styles.char17Style },
  { key: 'char_18', source: require('@/assets/images/Characters/Group 163312.png'), style: styles.char18Style },
  { key: 'char_19', source: require('@/assets/images/Characters/Group 163313.png'), style: styles.char19Style },
  { key: 'char_20', source: require('@/assets/images/Characters/Group 163314.png'), style: styles.char20Style },
  { key: 'char_21', source: require('@/assets/images/Characters/Group 163315-1.png'), style: styles.char21Style },
  { key: 'char_22', source: require('@/assets/images/Characters/Group 163315.png'), style: styles.char22Style },
  { key: 'char_23', source: require('@/assets/images/Characters/Group 163316.png'), style: styles.char23Style },
  { key: 'char_24', source: require('@/assets/images/Characters/Group 163317.png'), style: styles.char24Style },
  { key: 'char_25', source: require('@/assets/images/Characters/Group 163319.png'), style: styles.char25Style },
  { key: 'char_26', source: require('@/assets/images/Characters/Group 163321.png'), style: styles.char26Style },
  { key: 'char_27', source: require('@/assets/images/Characters/Group 163323.png'), style: styles.char27Style },
  { key: 'char_28', source: require('@/assets/images/Characters/Group 163324.png'), style: styles.char28Style },
  { key: 'char_29', source: require('@/assets/images/Characters/Group 163325.png'), style: styles.char29Style },
  { key: 'char_30', source: require('@/assets/images/Characters/Group 163326.png'), style: styles.char30Style },
  { key: 'char_31', source: require('@/assets/images/Characters/Group 163327.png'), style: styles.char31Style },
  { key: 'char_32', source: require('@/assets/images/Characters/Group 163328.png'), style: styles.char32Style },
  { key: 'char_33', source: require('@/assets/images/Characters/Group 163329.png'), style: styles.char33Style },
  { key: 'char_34', source: require('@/assets/images/Characters/Group 163330.png'), style: styles.char34Style },
  { key: 'char_35', source: require('@/assets/images/Characters/Group 163331.png'), style: styles.char35Style },
  { key: 'char_36', source: require('@/assets/images/Characters/Group 163332.png'), style: styles.char36Style },
  { key: 'char_37', source: require('@/assets/images/Characters/Group 163333.png'), style: styles.char37Style },
  { key: 'char_38', source: require('@/assets/images/Characters/Group 163334.png'), style: styles.char38Style },
  { key: 'char_39', source: require('@/assets/images/Characters/Group 163335.png'), style: styles.char39Style },
  { key: 'char_40', source: require('@/assets/images/Characters/Group 163336.png'), style: styles.char40Style },
  { key: 'char_41', source: require('@/assets/images/Characters/Group 163337.png'), style: styles.char41Style },
  { key: 'char_42', source: require('@/assets/images/Characters/Group 163338.png'), style: styles.char42Style },
  { key: 'char_43', source: require('@/assets/images/Characters/Group 163339.png'), style: styles.char43Style },

];

const Characters = () => {
  return (
    <View style={styles.container}>
      {/* Map over the charactersData array to render each character */}
      {charactersData.map(item => (
        <TouchableOpacity
          key={item.key}
          style={[styles.characterContainer, item.style]}
          onPress={() => { router.replace('/detailed-screen') }}

        >
          <Image source={item.source} style={styles.image} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Characters;