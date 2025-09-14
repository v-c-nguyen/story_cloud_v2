import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';

import IconLearning from "@/assets/images/parent/footer/icon-learning.svg"
import IconCancel from "@/assets/images/parent/icon-cancel.svg"

const LearningModuleModal = ({ target, onCancel }: { target: any, onCancel: (() => void) }) => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(5, 59, 74, 1)' }}>
            <ThemedView style={styles.container}>
                {/* Header */}
                <ThemedView style={styles.header}>
                    <ThemedView style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                        <IconLearning
                            width={24}
                            height={24}
                            color={'rgba(122, 193, 198, 1)'} />
                    </ThemedView>
                    <ThemedView style={{ width: "70%" }}>
                        <ThemedText style={[styles.headerText, { textAlign: "center", lineHeight: 30 }]}>{target?.name}</ThemedText>
                    </ThemedView>
                    <TouchableOpacity onPress={onCancel} >
                        <IconCancel 
                            width={24}
                            height={24}
                            color={'rgba(122, 193, 198, 1)'} />
                    </TouchableOpacity>
                </ThemedView>

                <ScrollView contentContainerStyle={styles.contentContainer}>
                    {/* Free Mode */}
                    <ThemedView style={styles.modeBlock}>

                        <ThemedText style={{ color: 'white', fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Learning Focus</ThemedText>
                        <ThemedText style={styles.modeDescription}>
                            {target?.learning_focus}
                        </ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.divider} />


                    {/* Focus Mode */}
                    <ThemedView style={styles.modeBlock}>

                        <ThemedText style={{ color: 'white', fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Learning Outcomes</ThemedText>
                        {
                            target?.learning_outcomes && target?.learning_outcomes?.length > 0 && target?.learning_outcomes
                                .map((item: any, index: number) => (
                                    <ThemedText style={[styles.modeDescription, { marginBottom: 5 }]}>
                                        {item}
                                    </ThemedText>
                                ))
                        }
                    </ThemedView>
                    <ThemedView style={styles.divider} />

                    {/* Pathway Mode */}
                    <ThemedView style={styles.modeBlock}>
                        <ThemedText style={{ color: 'white', fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Learning Modules</ThemedText>
                        {
                            target?.learning_modules && target?.learning_modules?.length > 0 && target?.learning_modules
                                .map((item: any, index: number) => (
                                    <ThemedText style={[styles.modeDescription, { marginBottom: 5 }]}>
                                        {item}
                                    </ThemedText>
                                ))
                        }
                    </ThemedView>
                </ScrollView>
            </ThemedView>
        </SafeAreaView>
    );
};

export default LearningModuleModal;

const styles = StyleSheet.create({
    divider: {
        height: 1,
        backgroundColor: 'rgba(122, 193, 198, 0.3)',
        marginVertical: 18,
        width: '100%',
    },
    container: {
        flex: 1,
        backgroundColor: '#003d4d',
        paddingTop: 40,
        paddingHorizontal: 30
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#003d4d',
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#0b505f',
    },
    headerText: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 700,
    },
    contentContainer: {
        paddingTop: 20,
        paddingBottom: 40,
    },
    modeBlock: {
        marginBottom: 30,
    },
    cancelIcon: {
        width: 24,
        height: 24,
        tintColor: 'rgba(122, 193, 198, 1)'
    },
    iconBox: {
        width: 60,
        height: 60,
        marginBottom: 10,
        position: 'relative'
    },
    icon: {
        width: 60,
        height: 60,
        tintColor: 'white',
        resizeMode: 'contain',
    },
    circle: {
        position: 'absolute',
        right: 0,
        top: '50%',
        transform: 'translate(0, -50%)',
        zIndex: -10
    },
    modeTitle: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 700,
        marginBottom: 6,
    },
    modeDescription: {
        fontSize: 13,
        color: 'rgba(173, 215, 218, 1)',
        fontWeight: 400,
        lineHeight: 20,
    },
    bold: {
        fontWeight: '600',
        color: 'rgba(173, 215, 218, 1)',
    },

});
