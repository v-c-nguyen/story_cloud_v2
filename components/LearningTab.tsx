import { ThemedView } from "./ThemedView";

import IconLibrary from '@/assets/images/parent/footer/icon-library.svg';
import IconPathway from '@/assets/images/parent/footer/icon-pathway.svg';
import IconFocus from '@/assets/images/parent/footer/icon-focus.svg';
import { ThemedText } from "./ThemedText";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function LearningTab({ activeItem }: { activeItem: string }) {
    const router = useRouter();
    return (
        <ThemedView style={{ flexDirection: "row", gap: 10, alignItems: "center", borderColor: 'rgba(173, 215, 218, 0.46)', borderWidth: 1, borderRadius: 30, paddingVertical: 2, paddingHorizontal: 2 }}>
            <TouchableOpacity 
                style={{ flexDirection: "row", gap: 10, alignItems: "center", marginRight: 10 }}
                onPress={() => router.push("/(parent)/(learning)/(library)")}
                >
                <ThemedView style={activeItem === "Libaray" && styles.activeContainer}>
                    <IconLibrary width={20} height={20} color={activeItem === "Libaray" ? "#053B4A" : "rgba(173, 215, 218, 1)"} />
                </ThemedView>
                <ThemedText style={{ color: "'rgba(173, 215, 218, 1)'" }}>Library</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
                style={{ flexDirection: "row", gap: 10, alignItems: "center", marginRight: 10 }}
                onPress={() => router.push("/(parent)/(learning)/(pathway)")}
                >
                <ThemedView style={activeItem === "Pathway" && styles.activeContainer}>
                    <IconPathway width={20} height={20} color={activeItem === "Pathway" ? "#053B4A" : "rgba(173, 215, 218, 1)"} />
                </ThemedView>
                <ThemedText style={{ color: "'rgba(173, 215, 218, 1)'" }}>Pathway</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
                style={{ flexDirection: "row", gap: 10, alignItems: "center", marginRight: 10}}
                onPress={() => router.push("/(parent)/(learning)/(focus)")}
                >
                <ThemedView style={activeItem === "Focus" && styles.activeContainer}>
                    <IconFocus width={20} height={20} color={activeItem === "Focus" ? "#053B4A" : "rgba(173, 215, 218, 1)"} />
                </ThemedView>
                <ThemedText style={{ color: "'rgba(173, 215, 218, 1)'" }}>Focus</ThemedText>
            </TouchableOpacity>
        </ThemedView>
    )
}


const styles = StyleSheet.create({
    activeContainer: {
        padding: 10,
        borderRadius: "50%",
        backgroundColor: "#F4A672"
    }
});