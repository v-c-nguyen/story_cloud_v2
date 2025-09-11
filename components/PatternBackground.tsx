import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from './ThemedView';

interface PatternBackgroundProps {
    children: React.ReactNode;
}

export const PatternBackground: React.FC<PatternBackgroundProps> = ({ children }) => {
    return (
        <ThemedView style={styles.container}>
            <Image
                source={require('@/assets/images/auth/back-pattern.png')}
                style={styles.backgroundPattern}
                contentFit="cover"
                tintColor="rgba(122, 193, 198, 1)"
            />
            <ThemedView style={styles.overlay}>
                {children}
            </ThemedView>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        backgroundColor: 'rgba(5, 59, 74, 1)',
    },
    backgroundPattern: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.08,
        zIndex: 0,
        width:'auto',
    },
    overlay: {
        flex: 1,
        zIndex: 1,
    },
});