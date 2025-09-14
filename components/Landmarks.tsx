import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  landmarkContainer: {
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
  // All 26 static landmark positions defined separately with a scattered layout.
  landmark1Style: { top: '35%', left: '48%' },
  landmark2Style: { top: '35%', left: '27%' },
  landmark3Style: { top: '95%', left: '45%' },
  landmark4Style: { top: '75%', left: '44%' },
  landmark5Style: { top: '20%', left: '48%' },
  landmark6Style: { top: '99%', left: '22%' },
  landmark7Style: { top: '101%', left: '28%' },
  landmark8Style: { top: '46%', left: '51%' },
  landmark9Style: { top: '52%', left: '32%' },
  landmark10Style: { top: '50%', left: '1%' },
  landmark11Style: { top: '10%', left: '34%' },
  landmark12Style: { top: '86%', left: '67%' },
  landmark13Style: { top: '18%', left: '39%' },
  landmark14Style: { top: '23%', left: '25%' },
  landmark15Style: { top: '60%', left: '41%' },
  landmark16Style: { top: '76%', left: '62%' },
  landmark17Style: { top: '53%', left: '6%' },
  landmark18Style: { top: '78%', left: '7%' },
  landmark19Style: { top: '109%', left: '10%' },
  landmark20Style: { top: '101%', left: '52%' },
  landmark21Style: { top: '73%', left: '13%' },
  landmark22Style: { top: '68%', left: '71%' },
  landmark23Style: { top: '110%', left: '63%' },
  landmark24Style: { top: '87%', left: '21%' },
  landmark25Style: { top: '119%', left: '32%' },
  landmark26Style: { top: '115%', left: '37%' },
   landmark27Style: { top: '55%', left: '69%' },
});

// The data array now references the separately defined styles.
// const landmarksData = [
//   { key: 'landmark_1', source: require('@/assets/images/Landmarks/Group 163248.png'), style: styles.landmark1Style },
//   { key: 'landmark_2', source: require('@/assets/images/Landmarks/Group 163250.png'), style: styles.landmark2Style },
//   { key: 'landmark_3', source: require('@/assets/images/Landmarks/Group 163251.png'), style: styles.landmark3Style },
//   { key: 'landmark_4', source: require('@/assets/images/Landmarks/Group 163252.png'), style: styles.landmark4Style },
//   { key: 'landmark_5', source: require('@/assets/images/Landmarks/Group 163254.png'), style: styles.landmark5Style },
//   { key: 'landmark_6', source: require('@/assets/images/Landmarks/Group 163255-1.png'), style: styles.landmark6Style },
//   { key: 'landmark_7', source: require('@/assets/images/Landmarks/Group 163255.png'), style: styles.landmark7Style },
//   { key: 'landmark_8', source: require('@/assets/images/Landmarks/Group 163257-1.png'), style: styles.landmark8Style },
//   { key: 'landmark_9', source: require('@/assets/images/Landmarks/Group 163257.png'), style: styles.landmark9Style },
//   { key: 'landmark_10', source: require('@/assets/images/Landmarks/Group 163258.png'), style: styles.landmark10Style },
//   { key: 'landmark_11', source: require('@/assets/images/Landmarks/Group 163259.png'), style: styles.landmark11Style },
//   { key: 'landmark_12', source: require('@/assets/images/Landmarks/Group 163260.png'), style: styles.landmark12Style },
//   { key: 'landmark_13', source: require('@/assets/images/Landmarks/Group 163262.png'), style: styles.landmark13Style },
//   { key: 'landmark_14', source: require('@/assets/images/Landmarks/Group 163264.png'), style: styles.landmark14Style },
//   { key: 'landmark_15', source: require('@/assets/images/Landmarks/Group 163265.png'), style: styles.landmark15Style },
//   { key: 'landmark_16', source: require('@/assets/images/Landmarks/Group 163266.png'), style: styles.landmark16Style },
//   { key: 'landmark_17', source: require('@/assets/images/Landmarks/Group 163267.png'), style: styles.landmark17Style },
//   { key: 'landmark_18', source: require('@/assets/images/Landmarks/Group 163268.png'), style: styles.landmark18Style },
//   { key: 'landmark_19', source: require('@/assets/images/Landmarks/Group 163269.png'), style: styles.landmark19Style },
//   { key: 'landmark_20', source: require('@/assets/images/Landmarks/Group 163270.png'), style: styles.landmark20Style },
//   { key: 'landmark_21', source: require('@/assets/images/Landmarks/Group 163271.png'), style: styles.landmark21Style },
//   { key: 'landmark_22', source: require('@/assets/images/Landmarks/Group 163272-1.png'), style: styles.landmark22Style },
//   { key: 'landmark_23', source: require('@/assets/images/Landmarks/Group 163285.png'), style: styles.landmark23Style },
//   { key: 'landmark_24', source: require('@/assets/images/Landmarks/Group 163287.png'), style: styles.landmark24Style },
//   { key: 'landmark_25', source: require('@/assets/images/Landmarks/Group 163300.png'), style: styles.landmark25Style },
//   { key: 'landmark_26', source: require('@/assets/images/Landmarks/Group 163301.png'), style: styles.landmark26Style },
//    { key: 'landmark_27', source: require('@/assets/images/Landmarks/Group 163302.png'), style: styles.landmark27Style },
// ];

const Landmarks = () => {
  return (
    // <View style={styles.container}>
    //   {/* Map over the landmarksData array to render each landmark */}
    //   {landmarksData.map(item => (
    //     <TouchableOpacity
    //       key={item.key}
    //       style={[styles.landmarkContainer, item.style]}
    //       onPress={()=>{router.replace('/detailed-screen')}}
    //     >
    //       <Image source={item.source} style={styles.image} />
    //     </TouchableOpacity>
    //   ))}
    // </View>
    <View></View>
  );
};

export default Landmarks;