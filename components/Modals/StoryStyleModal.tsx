import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { Image } from 'expo-image';

import IconStar from "@/assets/images/icons/icon-mark-modal.svg"
import IconMusic from "@/assets/images/parent/music_outline.svg"
import IconMoon from "@/assets/images/parent/moon.svg"
import { ModalContent } from '@/app/(parent)/(profiles)/(content)';

interface StoryStyleModalProps { 
    activeStyle: string;
    setActiveStyle: (style: string) => void;
    goBack: () => void;
}

const StoryStyleModal = ({ 
    activeStyle,
    setActiveStyle,
    goBack }: StoryStyleModalProps) => {
    const [style, setStyle] = React.useState(0);
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#053B4A' }}>
            {/* Header */}

            <ThemedView style={styles.modalIconContainer}>

                <Image
                    source={require("@/assets/images/parent/parent-back-pattern.png")}
                    style={styles.backPattern}
                    contentFit="cover"
                />
                <ThemedView style={{ position: "relative", width: 145, height: 150, marginVertical: 60, marginHorizontal: "auto" }}>
                    <IconStar width={145} height={150} color={"white"} style={{ zIndex: 1 }} />
                    <ThemedView style={{ position: "absolute", top: 0, right: 0, zIndex: 0, width: 100, height: 100, borderRadius: 50, backgroundColor: "#F4A672" }}></ThemedView>
                </ThemedView>
            </ThemedView>
            <ThemedView style={{ paddingHorizontal: 16 }}>
                <ThemedView>
                    <ThemedView style={styles.setTabStyle}>
                        <TouchableOpacity
                            style={[styles.setTabItem]}
                            onPress={() => setActiveStyle("story")}
                        >
                            <IconMoon width={24} height={24} color={"black"} style={activeStyle == "story" ? styles.activeTab : {}} />
                            <ThemedText style={{color: "black"}}>Story Time</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.setTabItem}
                            onPress={() => setActiveStyle("play")}
                        >
                            <IconMusic width={24} height={24} color={"black"} style={activeStyle == "play" ? styles.activeTab : {}} />
                            <ThemedText style={{color: "black"}}>Play Time</ThemedText>
                        </TouchableOpacity>
                    </ThemedView>
                </ThemedView>
                <ThemedText style={styles.modalTitle}>Story Style</ThemedText>
                <ThemedText style={styles.modalBody}><ModalContent /></ThemedText>
                <ThemedView style={styles.modalButtons}>
                    <TouchableOpacity style={styles.modalButton} onPress={() => goBack()}>
                        <ThemedText style={styles.modalButtonText}>Back to Listen</ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </ThemedView>
        </SafeAreaView>
    );
};

export default StoryStyleModal;

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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: "#F4A672",
        padding: 8,
        borderRadius: "50%",
        borderColor: "#000",
        borderWidth: 2
    },
    setTabStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        backgroundColor: "#ADD7DA",
        marginHorizontal: "auto",
        borderRadius: 30,
        paddingVertical: 5,
        marginBottom: 24,
        paddingHorizontal: 5
    },
    setTabItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    modalContent: {
        width: '96%',
        height: 'auto',
        maxHeight: '100%',
        backgroundColor: 'rgba(252, 252, 252, 0.95)',
        borderRadius: 30,
        borderWidth: 2,
        borderColor: 'rgba(122, 193, 198, 0.2)',
        elevation: 10,
    },
    modalIconContainer: {
        position: 'relative',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderColor: 'rgba(122, 193, 198, 0.2)',
        marginBottom: 36
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 700,
        color: 'white',
        marginBottom: 10,
        textAlign: 'center',
        lineHeight: 28,

    },
    modalBody: {
        fontSize: 18,
        marginTop: 16,
        color: 'white',
        fontWeight: 400,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 36
    },
    modalButton: {
        width: 200,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        backgroundColor: 'rgba(244, 166, 114, 1)',
    },
    modalButtonText: {
        textAlign: 'center',
        fontSize: 14,
        color: 'rgba(5, 59, 74, 1)',
        fontWeight: 400,
    },
    backPattern: {
        position: "absolute", width: "100%", height: "100%", top: 0
    },
    topBackPattern: {
        width: "100%",
        height: 220,
        position: "absolute",
        top: 0,
        left: 0,
    },

});
