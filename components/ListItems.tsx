import { Image } from 'expo-image';
import React from "react";
import { ImageSourcePropType, StyleSheet, TouchableOpacity, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import IconDefaultAvatar from "@/assets/images/icons/icon-parent-3.svg"



type ItemProps = {
    name: string,
    avatar: ImageSourcePropType | undefined,
    active: boolean,
    onPress?: () => void // Add onPress prop
}

type ModeItemProps = {
    name: string,
    avatar: ImageSourcePropType | undefined,
    active: boolean,
    onPress?: () => void // Add onPress prop
}

const gradient = ['#2AEBEB', '#E5DDA3', '#E29E6E'] as const;
const gradient2 = ['#7ac1c63a', '#7ac1c63a'] as const

export function ItemWithImage({ name, avatar, active, onPress }: ItemProps) {
    return (
        <TouchableOpacity onPress={onPress}>
            <LinearGradient
                colors={active ? gradient : gradient2}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientBorder}
            >
                <View style={styles.innerCardWrap}>
                    <View style={[styles.itemStyleLeft, active && styles.itemActiveStyleLeft]}>
                        <LinearGradient
                            colors={active ? gradient : gradient2}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{ ...styles.gradientBorder }}
                        >
                            {
                                avatar ?
                                    <Image
                                        source={typeof avatar === 'string' ? { uri: avatar } : avatar}
                                        style={[styles.avatar_left, !active && {
                                            borderColor: '#7AC1C6',
                                            borderWidth: 2
                                        }]}

                                        contentFit="cover"
                                    />
                                    :
                                    <IconDefaultAvatar width={50} height={50} />

                            }
                        </LinearGradient>
                        <ThemedText style={[styles.nameTextLeft, active && styles.activeNameTextLeft]}>{name}</ThemedText>
                    </View>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
}

export function ItemWithRightImage({ name, avatar }: { name: string, avatar: string }) {
    return (
        <TouchableOpacity>

            <ThemedView
                style={styles.itemActiveStyle}
            >
                {
                    avatar ?
                        <Image source={{ uri: avatar }} style={styles.avatar} contentFit="cover"/>
                        :
                        <IconDefaultAvatar width={40} height={40} />

                }
                <ThemedText style={styles.nameText}>{name}</ThemedText>
            </ThemedView>
        </TouchableOpacity>

    );
}


export function ModeItem({ name, avatar, active, onPress }: ModeItemProps) {
    return (
        <TouchableOpacity onPress={onPress}>
            <ThemedView style={[styles.modeItemStyle, active && styles.activeMIS]}>
                <ThemedView style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <ThemedView style={styles.modeAvatarStyle}>
                        <Image source={avatar} style={[styles.modeAvatariconStyle, active && styles.activeMAIS]} />
                        <Image source={require("@/assets/images/parent/dashboard/white-circle.png")} style={[styles.modeAvatarCircleStyle, active && styles.activeMACS]} />
                    </ThemedView>
                    <ThemedText style={[{ color: "#ffffff", fontSize: 18, fontWeight: 700 }, active && { color: "rgba(5, 59, 74, 1)", fontSize: 18, fontWeight: 700 }]}>{name}</ThemedText>
                    <ThemedText style={[{ color: "#ffffff", fontSize: 18 }, active && { color: 'rgba(5, 59, 74, 1)', fontSize: 18 }]}>Mode</ThemedText>
                </ThemedView>
                {active ?
                    <Image source={require("@/assets/images/parent/dashboard/selected.png")} />
                    :
                    <Image source={require("@/assets/images/parent/dashboard/selectable.png")} />
                }
            </ThemedView>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    gradientBorder: {
        borderRadius: 50,
        padding: 1,
        marginRight: 8,
        marginLeft: 0,
        marginVertical: 0,
    },
    itemStyle: {
        display: 'flex',
        height: 60,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(252, 252, 252, 0.2)',
        borderRadius: 50,
    },
    itemStyleLeft: {
        display: 'flex',
        minWidth: 140,
        height: 60,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderRadius: 48,
        paddingLeft: 3,

    },
    innerCardWrap: {
        flex: 1,
        backgroundColor: '#053B4A', // or your card background
        borderRadius: 48,
        overflow: 'hidden',
    },
    itemActiveStyle: {
        // display: 'flex',
        // height: 40,
        // flexDirection: 'row-reverse',
        // justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'rgba(252, 252, 252, 0.3)',
        borderRadius: 48, // Slightly smaller than the LinearGradient border radius
        flexDirection: 'row-reverse'
    },
    itemActiveStyleLeft: {
        display: 'flex',
        height: 60,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'rgba(252, 252, 252, 0.3)',
        borderRadius: 48, // Slightly smaller than the LinearGradient border radius
        paddingLeft: 3
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(252, 252, 252, 0.2)',
    },
    avatar_left: {
        width: 50,
        height: 50,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(252, 252, 252, 0.2)',

    },
    nameText: {
        fontSize: 12,
        fontWeight: '700',
        textAlign: 'center',
        color: 'rgba(248, 236, 174, 1)',
        padding: 12,
    },
    nameTextLeft: {
        fontSize: 18,
        fontWeight: '700',
        color: 'rgba(122, 193, 198, 1)',
        padding: 16,
    },
    activeNameTextLeft: {
        fontSize: 18,
        fontWeight: '700',
        color: 'white',
        padding: 16,
    },
    modeItemStyle: {
        height: 72,
        paddingHorizontal: 26,
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(5, 59, 74, 1)',
        borderWidth: 1,
        borderRadius: 20,
        borderColor: 'rgba(255, 255, 255, 0.2)'
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
    activeMIS: {
        height: 72,
        paddingHorizontal: 26,
        display: "flex",
        flexDirection: 'row',
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
