
import { modesData } from "@/data/parent/dashboardData";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

import IconSelectable from "@/assets/images/icons/icon-selectable.svg"
import IconSelected from "@/assets/images/parent/icon-check.svg"
import useIsMobile from "@/hooks/useIsMobile";

const modes = modesData;
interface ModeListProps {
    mode?: string,
    active: any,
    selectActiveChild?: any
}
export function ModeList({ mode = "dark", active, selectActiveChild }: ModeListProps) {

    const isMobile = useIsMobile();
    const handleModeSelect = (newMode: any) => {
        const newChild = { ...active, ...{ mode: newMode.id } }
        selectActiveChild(newChild)
    };
    return (
        <ThemedView style={{ display: 'flex', width: "100%", flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 20 : 30 }}>
            {modes.map((item, index) => (
                <TouchableOpacity
                    key={index}
                    style={{width: isMobile ? "100%" : "30%"}}
                    onPress={() => handleModeSelect(item)}>
                    {
                        isMobile &&
                        <ThemedView style={[styles.modeItemStyle, mode == 'light' && styles.lightIS, item.id == active?.mode && styles.activeMIS]}>
                            <ThemedView style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <ThemedView style={styles.modeAvatarStyle}>
                                    <item.avatar
                                        color={item.id == active?.mode ? "rgba(5, 59, 74, 1)" : mode == "light" ? "rgba(5, 59, 74, 1)" : "#ffffff"}
                                        style={[styles.modeAvatariconStyle, item.id == active?.mode && styles.activeMAIS]}
                                    />
                                    <Image
                                        source={require("@/assets/images/parent/dashboard/white-circle.png")}
                                        style={[styles.modeAvatarCircleStyle, item.id == active?.mode && styles.activeMACS]}
                                    />
                                </ThemedView>
                                <ThemedText style={[styles.modeName, (item.id == active?.mode || mode == "light") && styles.activeModeName]}>{item.name}</ThemedText>
                                <ThemedText style={[styles.modeName, (item.id == active?.mode || mode == "light") && styles.activeModeName, { fontWeight: 400 }]}>Mode</ThemedText>
                            </ThemedView>
                            {item.id == active?.mode ?
                                <ThemedView style={{ width: 40, height: 40 }}>
                                    <IconSelected width={28} height={28} color={"#FCFCFC"} style={{ margin: 'auto' }} />
                                </ThemedView>
                                :
                                <ThemedView style={{ width: 43, height: 43, borderColor: "#bfbfbf4d", borderWidth: 3, borderRadius: 25 }} >
                                    <ThemedView style={styles.selectable}></ThemedView>
                                </ThemedView>
                            }
                        </ThemedView>
                    }

                    {
                        !isMobile &&
                        <ThemedView style={[styles.modeItemTabletStyle, mode == 'light' && styles.lightIS, item.id == active?.mode && styles.activeMIS]}>

                            {item.id == active?.mode ?
                                <ThemedView style={{ width: 40, height: 40 }}>
                                    <IconSelected width={28} height={28} color={"#FCFCFC"} style={{ margin: 'auto' }} />
                                </ThemedView>
                                :
                                <ThemedView style={{ width: 43, height: 43, borderColor: "#bfbfbf4d", borderWidth: 3, borderRadius: 25 }} >
                                    <ThemedView style={styles.selectable}></ThemedView>
                                </ThemedView>
                            }
                            <ThemedView style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <ThemedView style={styles.modeAvatarStyle}>
                                    <item.avatar
                                        color={item.id == active?.mode ? "rgba(5, 59, 74, 1)" : mode == "light" ? "rgba(5, 59, 74, 1)" : "#ffffff"}
                                        style={[styles.modeAvatariconStyle, item.id == active?.mode && styles.activeMAIS]}
                                    />
                                    <Image
                                        source={require("@/assets/images/parent/dashboard/white-circle.png")}
                                        style={[styles.modeAvatarCircleStyle, item.id == active?.mode && styles.activeMACS]}
                                    />
                                </ThemedView>
                                <ThemedText style={[styles.modeName, (item.id == active?.mode || mode == "light") && styles.activeModeName]}>{item.name}</ThemedText>
                                <ThemedText style={[styles.modeName, (item.id == active?.mode || mode == "light") && styles.activeModeName, { fontWeight: 400 }]}>Mode</ThemedText>
                            </ThemedView>
                        </ThemedView>
                    }
                </TouchableOpacity >
            ))}
        </ThemedView>
    )
}



const styles = StyleSheet.create({
    selectable: {
        width: 37,
        height: 37,
        borderWidth: 3,
        borderColor: "#F4A672",
        borderRadius: 20
    },
    modeItemStyle: {
        height: 72,
        paddingHorizontal: 26,
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(5, 59, 74, 0)',
        borderWidth: 1,
        borderRadius: 20,
        borderColor: 'rgba(255, 255, 255, 0.2)'
    },

    modeItemTabletStyle: {
        height: 154,
        paddingHorizontal: 26,
        paddingVertical: 20,
        display: "flex",
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(5, 59, 74, 0)',
        borderWidth: 1,
        borderRadius: 20,
        borderColor: 'rgba(255, 255, 255, 0.2)'
    },
    lightIS: {
        borderColor: 'rgba(5, 59, 74, 0.2)'
    },
    modeAvatarStyle: {
        position: 'relative',
        width: 60,
        height: 60,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    modeAvatarCircleStyle: {
        position: 'absolute',
        right: 0,
        tintColor: 'rgba(244, 166, 114, 1)'
    },
    modeAvatariconStyle: {
        position: 'absolute',
        left: 0,
        zIndex: 10,
        tintColor: 'white'
    },
    lightMAIS: {
        tintColor: 'rgba(5, 59, 74, 1)'
    },
    modeName: { color: "#ffffff", fontSize: 18, fontWeight: 700 },
    activeModeName: { color: "rgba(5, 59, 74, 1)", fontSize: 18, fontWeight: 700 },
    activeMIS: {
        paddingHorizontal: 26,
        display: "flex",
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(244, 166, 114, 1)',
        borderWidth: 1,
        borderRadius: 20,
        borderColor: 'rgba(255, 255, 255, 0.2)'
    },
    activeMACS: {
        position: 'absolute',
        right: 0,
        tintColor: 'white'
    },
    activeMAIS: {
        position: 'absolute',
        left: 0,
        zIndex: 10,
        tintColor: 'rgba(5, 59, 74, 1)'
    }
});