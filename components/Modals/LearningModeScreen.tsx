import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';

const learningIcon = require("@/assets/images/parent/footer/icon-learning.png")
const cancelIcon = require("@/assets/images/parent/icon-cancel.png")
const focusIcon = require("@/assets/images/parent/dashboard/mode-focus.png")
const freeIcon = require("@/assets/images/parent/dashboard/mode-free.png")
const pathwayIcon = require("@/assets/images/parent/dashboard/mode-pathway.png")
const orangeCircle = require("@/assets/images/parent/dashboard/orange-circle.png")

const LearningModeScreen = ({ onCancel }: { onCancel: (() => void) }) => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(5, 59, 74, 1)' }}>
            <ThemedView style={styles.container}>
                {/* Header */}
                <ThemedView style={styles.header}>
                    <ThemedView style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                        <Image source={learningIcon} style={styles.learningIcon} />
                        <ThemedText style={styles.headerText}>Learning Mode</ThemedText>
                    </ThemedView>
                    <TouchableOpacity onPress={onCancel} >
                        <Image source={cancelIcon} style={styles.cancelIcon} />
                    </TouchableOpacity>
                </ThemedView>

                <ScrollView contentContainerStyle={styles.contentContainer}>
                    {/* Free Mode */}
                    <ThemedView style={styles.modeBlock}>
                        <ThemedView style={styles.iconBox}>
                            <Image
                                source={freeIcon} // Replace with your own image path
                                style={styles.icon}
                            />
                            <Image
                                source={orangeCircle} // Replace with your own image path
                                style={styles.circle}
                            />
                        </ThemedView>
                        <ThemedText style={{ color: 'white', fontSize: 18 }}><ThemedText style={styles.modeTitle}>Free </ThemedText>Mode</ThemedText>
                        <ThemedText style={styles.modeDescription}>
                            Children explore freely, choosing any story, series, or adventure from the full Learning Library. Ideal for curiosity-driven discovery or relaxed screen time: no filters, no guidance, just open-ended storytelling.
                        </ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.divider} />


                    {/* Focus Mode */}
                    <ThemedView style={styles.modeBlock}>
                        <ThemedView style={styles.iconBox}>
                            <Image
                                source={focusIcon} // Replace with your own image path
                                style={styles.icon}
                            />
                            <Image
                                source={orangeCircle} // Replace with your own image path
                                style={styles.circle}
                            />
                        </ThemedView>
                        <ThemedText style={{ color: 'white', fontSize: 18 }}><ThemedText style={styles.modeTitle}>Focus </ThemedText>Mode</ThemedText>
                        <ThemedText style={styles.modeDescription}>
                            Stealth learning, guided by you. In Focus Mode, all content – Featured, Watch Next, Continue Watching, and even the Explore region, is quietly filtered according to the parent or teacher’s chosen learning preferences.
                        </ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.divider} />

                    {/* Pathway Mode */}
                    <ThemedView style={styles.modeBlock}>
                        <ThemedView style={styles.iconBox}>
                            <Image
                                source={pathwayIcon} // Replace with your own image path
                                style={styles.icon}
                            />
                            <Image
                                source={orangeCircle} // Replace with your own image path
                                style={styles.circle}
                            />
                        </ThemedView>
                        <ThemedText style={{ color: 'white', fontSize: 18 }}><ThemedText style={styles.modeTitle}>Pathway </ThemedText>Mode</ThemedText>
                        <ThemedText style={styles.modeDescription}>
                            Tailored, personalised learning pathways designed by you – or generated in seconds by StoryEngine. Each pathway is made up of curated story steps that build toward a specific developmental goal, such as empathy, resilience, or environmental awareness. Parents can either:
                            {"\n\n"}
                            Create a <ThemedText style={styles.bold}>Custom Pathway</ThemedText> by selecting stories, series, or collections from the Learning Library, or{" "}
                            <ThemedText style={styles.bold}>Generate a Quick Pathway</ThemedText> by setting a topic and time, letting StoryEngine build the journey for you.
                            {"\n\n"}
                            Children simply see an exciting sequence of adventures – visually connected and beautifully presented. Behind the scenes, each step is intentional, with learning woven into the story arc. Progress is tracked in real time, and pathways can be easily edited or reassigned based on each child’s needs.
                        </ThemedText>
                    </ThemedView>
                </ScrollView>
            </ThemedView>
        </SafeAreaView>
    );
};

export default LearningModeScreen;

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
    learningIcon: {
        width: 24,
        height: 24,
        tintColor: 'rgba(122, 193, 198, 1)'
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
        fontStyle: 'italic',
        lineHeight: 20,
    },
    bold: {
        fontWeight: '600',
        color: 'rgba(173, 215, 218, 1)',
    },

});
