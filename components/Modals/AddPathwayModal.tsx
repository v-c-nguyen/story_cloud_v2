import { Modal, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";

import IconPathway from "@/assets/images/parent/icon-pathway.svg";
import IconPlus from "@/assets/images/parent/icon-plus.svg";
import IconPathwayYellow from '@/assets/images/parent/footer/icon-pathway.svg';
import { useEffect, useState } from "react";
import { fetchPathways } from "@/app/lib/supabasePathways";
import { ScrollView } from "react-native-gesture-handler";
import { Pathway, usePathwayStore } from "@/store/pathwayStore";
import supabase from "@/app/lib/supabase";

export default function AddPathwahModal({ showAddStoryModal, setShowAddStoryModal, handleAddStory }:
    {
        showAddStoryModal: boolean,
        setShowAddStoryModal: (value: boolean) => void,
        handleAddStory: (id: number) => void
    }) {
    const pathways = usePathwayStore((state) => state.pathways);


    return (
            <Modal
                visible={showAddStoryModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowAddStoryModal(false)}
            >
                <TouchableOpacity
                    onPress={() => setShowAddStoryModal(false)}
                    style={{
                        position: 'absolute',
                        top: -50,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={{ width: "100%" }}
                        contentContainerStyle={{ margin: "auto", justifyContent: "center", flexDirection: "row", width: "100%" }}
                    >
                        <ThemedView style={{ backgroundColor: '#053B4A', borderRadius: 16, borderColor: '#add7da4d', borderWidth: 1, padding: 24, width: "90%", maxWidth: 350 }}>
                            <ThemedView style={styles.sectionContainer}>
                                <ThemedText style={styles.title}>Adding to Pathway</ThemedText>
                            </ThemedView>
                            <ThemedView style={styles.sectionContainer}>
                                {
                                    pathways && pathways.length > 0 && pathways.map((item, index) => (
                                        <TouchableOpacity key={index} style={styles.button} onPress={() => handleAddStory(item.id)}>
                                            <ThemedView style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                                                <ThemedView style={styles.iconContaner}>
                                                    <IconPathway width={20} height={20} />
                                                </ThemedView>
                                                <ThemedText style={styles.buttonText2}>{item.name}</ThemedText>
                                            </ThemedView>
                                        </TouchableOpacity>
                                    ))
                                }

                            </ThemedView>


                            <ThemedView style={[styles.sectionContainer, { borderBottomWidth: 0 }]}>
                                <ThemedView style={styles.button}>
                                    <ThemedView style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                                        <ThemedView style={styles.iconContaner}>
                                            <IconPathwayYellow width={20} height={20} color={"#F8ECAE"} />
                                        </ThemedView>
                                        <ThemedText style={styles.buttonText}>Add to New Pathway</ThemedText>
                                    </ThemedView>
                                    <TouchableOpacity>
                                        <IconPlus width={24} height={24} color={"#F8ECAE"} />
                                    </TouchableOpacity>
                                </ThemedView>
                            </ThemedView>
                        </ThemedView>
                    </ScrollView>
                </TouchableOpacity>
            </Modal>
    )
}


const styles = StyleSheet.create({
    title: {
        color: "white",
        fontWeight: 600,
        fontSize: 24
    },
    sectionContainer: {
        paddingBottom: 24,
        borderColor: "#7ac1c67a",
        borderBottomWidth: 1
    },
    buttonText: {
        color: "#F8ECAE",
        fontSize: 16
    },
    buttonText2: {
        color: "#7AC1C6",
        fontSize: 16
    },
    button: {
        paddingTop: 24,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    iconContaner: {
        padding: 12,
        borderRadius: "50%",
        borderWidth: 1,
        borderColor: "#add7da38"
    }
});
