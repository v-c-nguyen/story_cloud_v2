import React from 'react';
import { View, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';

export default function GradientSlider({
  value,
  minimumValue,
  maximumValue,
  onSlidingComplete,
  onValueChange,
  style,
  ...props
}: any) {
  return (
    <View style={[styles.container, style]}>
      {/* Background bar */}
      <View style={[styles.backgroundTrack, {left: 12}]} />
      {/* Gradient progress bar (full width, masked to value) */}
      {/* Calculate thumb size and adjust gradient bar to align with thumb center */}
      {(() => {
        const thumbSize = 24; // px, from styles.thumb
        const percent = (value - minimumValue) / (maximumValue - minimumValue);
        // Assume the slider track width is the container width minus thumb size
        // We'll use a ref and state to measure the container width
        const [containerWidth, setContainerWidth] = React.useState(0);
        const progressWidth =
          containerWidth > 0
            ? Math.max(0, percent * (containerWidth - thumbSize))
            : 0;
        return (
          <View
            style={{ flex: 1 }}
            onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}
          >
            <View
              style={{
                position: 'absolute',
                left: thumbSize / 2,
                top: 6,
                height: 8,
                borderRadius: 8,
                overflow: 'hidden',
                width: progressWidth,
                zIndex: 1,
                backgroundColor: 'transparent',
              }}
              pointerEvents="none"
            >
              <LinearGradient
                colors={['#2AEBEB', '#E5DDA3', '#E29E6E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ width: '100%', height: '100%' }}
              />
            </View>
          </View>
        );
      })()}
      {/* Slider (transparent track, custom thumb) */}
      <Slider
        style={StyleSheet.absoluteFill}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        value={value}
        minimumTrackTintColor="transparent"
        maximumTrackTintColor="transparent"
        thumbTintColor="#F4A672"
        onSlidingComplete={onSlidingComplete}
        onValueChange={onValueChange}
        thumbStyle={styles.thumb}
        {...props}
      />
      {/* Custom thumb overlay
      // <View
      //   style={[
      //     styles.thumb,
      //     {
      //       left: `${((value - minimumValue) / (maximumValue - minimumValue)) * 100}%`,
      //       position: 'absolute',
      //       marginLeft: -10,
      //     },
      //   ]}
      //   pointerEvents="none"
      // /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 24,
    justifyContent: 'center',
  },
  gradientTrack: {
    position: 'absolute',
    height: 8,
    borderRadius: 8,
    left: 0,
    top: 6,
    zIndex: 1,
  },
  backgroundTrack: {
    position: 'absolute',
    height: 4,
    borderRadius: 8,
    backgroundColor: '#07324A',
    left: 0,
    right: 0,
    top: 8,
    zIndex: 0,
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F4A672',
    borderWidth: 4,
    borderColor: '#FFE7A0',
    transform: [{ translateY: "-50%" }],
    zIndex: 999,
  }
});