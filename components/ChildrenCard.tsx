import { Image } from "react-native";
import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import IconDefaultAvatar from "@/assets/images/icons/icon-parent-3.svg"


const itemIcon = require('@/assets/images/parent/item.png')
const activeItemIcon = require('@/assets/images/parent/activeItem.png')

interface Child {
    id: string,
    name: string,
    age: number,
    mode: string,
    avatar_url?: string
}

// ChildrenCard component
export function ChildrenCard({
    child,
    isActive,
    onPress
}: {
    child: Child,
    isActive: boolean,
    onPress: (child: Child) => void
}) {
    return (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => onPress(child)}>
            {isActive ?
                <Image source={activeItemIcon} style={styles.itemIcon} />
                :
                <Image source={itemIcon} style={styles.itemIcon} />
            }
            <ThemedView style={styles.item}>
                {
                    child.avatar_url ?
                        <Image source={{ uri: child.avatar_url }} style={styles.childIcon} />
                        :
                        <IconDefaultAvatar width={56} height={56} />

                }
                <ThemedText style={[styles.childText, isActive && { color: 'rgba(5, 59, 74, 1)' }]}>{child?.name}</ThemedText>
            </ThemedView>
        </TouchableOpacity>
    );

}


const styles = StyleSheet.create({
    childIcon: {
        width: 56,
        height: 56,
        borderRadius: 50
    },
    childText: {
        fontSize: 14,
        fontWeight: 600,
        textAlign: 'center',
        color: 'rgba(122, 193, 198, 1)'
    },
    itemIcon: {
        width: 170,
        height: 160
    },
    item: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        borderRadius: 20,
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translate(-50%, -20%)'
    },
    itemContainer: {
        position: 'relative',
        marginRight: 8
    }
})