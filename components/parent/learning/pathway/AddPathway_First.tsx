import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";

const pathwayIcon = require('@/assets/images/parent/icon-pathway.png')
const backIcon = require('@/assets/images/parent/icon-left.png')
const quickIcon = require('@/assets/images/parent/quick_pathway.png')
const customIcon = require('@/assets/images/parent/custom_pathway.png')
const rightButton = require('@/assets/images/parent/icon-right.png')


export default function AddPathway_First({ onPress } : { onPress: (mode: number) => void }) {
    const router = useRouter();

    return (
        <ScrollView
            horizontal
            contentContainerStyle={styles.container}
            showsHorizontalScrollIndicator={false}
        >
            {/* Quick Pathway Card */}
            <ThemedView style={styles.card}>
                <Image
                    source={quickIcon} // Replace with your icon image
                    style={styles.icon}
                />
                <ThemedText style={[styles.title, { textAlign: 'center', marginTop: 30 }]}>Quick Pathway</ThemedText>
                <ThemedText style={styles.description}>
                    Let our <ThemedText style={styles.highlight}>StoryEngine</ThemedText> do the work!{"\n"}
                    Choose a learning goal and a duration or length you want the pathway to be and we’ll build a fun story-filled
                    learning pathway for you – no prep needed. It’s the fastest way to start learning with StoryCloud.
                </ThemedText>
                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => onPress(0)}
                    >
                    <ThemedText style={styles.buttonText}>Generate Quick Pathway</ThemedText>
                    <Image source={rightButton}></Image>
                </TouchableOpacity>
            </ThemedView>

            {/* Custom Pathway Card */}
            <ThemedView style={styles.card}>
                <Image
                    source={customIcon} // Replace with your icon image
                    style={styles.icon}
                />
                <ThemedText style={[styles.title, { textAlign: 'center', marginTop: 30 }]}>Custom Pathway</ThemedText>
                <ThemedText style={styles.description}>
                    Build your own learning journey.{"\n"}
                    Hand-pick specific series and stories from the Learning Library to create a pathway tailored exactly to your child’s
                    interests or needs. Perfect for parents or educators who want full control over the learning experience.
                </ThemedText>
                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => onPress(1)}
                >
                    <ThemedText style={styles.buttonText}>Create Custom Pathway</ThemedText>
                    <Image source={rightButton}></Image>
                </TouchableOpacity>
            </ThemedView>
        </ScrollView>
    )
}


const styles = StyleSheet.create({

    rootContainer: {
        flex: 1,
        backgroundColor: "rgba(5, 59, 74, 1)",
        position: "relative",
        paddingBottom: 60
    },
    topBackPattern: {
        width: "100%",
        height: 220,
        position: "absolute",
        top: 0,
        left: 0,
    },
    mainContainer: {
        padding: 16,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    titleIcon: {
        width: 24,
        height: 24,
        tintColor: 'rgba(122, 193, 198, 1)'
    },
    title: {
        fontSize: 24,
        fontWeight: 700,
        color: 'white'
    },
    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        justifyContent: 'center',
        top: -35,
    },
    backBtnIcon: {

    },
    backBtnText: {
        color: 'rgba(122, 193, 198, 1)',
        fontSize: 14,
        fontWeight: 400
    },
    container: {
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    card: {
        backgroundColor: 'rgba(5, 59, 74, 1)',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'rgba(173, 215, 218, 0.2)',
        width: 300,
        height: 475,
        marginRight: 16,
        padding: 16,
        justifyContent: 'space-between',
    },
    icon: {
        width: 80,
        height: 80,
        alignSelf: 'center',
        marginBottom: 12,
        marginTop: 20
    },
    description: {
        marginTop: 25,
        color: 'white',
        fontWeight: 400,
        textAlign: 'center',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 16,
    },
    highlight: {
        fontWeight: 'bold',
        color: '#ffffff',
    },
    button: {
        backgroundColor: '#fba864',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 'auto',
        marginBottom: 20,
        gap: 10
    },
    buttonText: {
        color: '#003b4f',
        fontWeight: '400',
        fontSize: 16,
    },
    arrow: {
        color: '#003b4f',
        marginLeft: 8,
        fontSize: 16,
        fontWeight: 'bold',
    }
})