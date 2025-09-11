import { Image } from "expo-image";
import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";



export function LearningTargetCard({ target, isSelected, onPress, checkIcon: IconCheck, informationIcon: IconInformation }: {
    target: { id: string, name: string },
    isSelected: boolean,
    onPress: () => void,
    checkIcon: any,
    informationIcon: any
}) {
    return (
        <TouchableOpacity key={target.id} onPress={onPress}>
            <ThemedView style={[styles.targetCard, isSelected && styles.activeTargetCard]}>
                <ThemedView style={{ borderWidth: 2, borderColor: 'rgba(252, 252, 252, 0.2)', borderRadius: '50%' }}>
                    <ThemedView style={[styles.circle, isSelected && styles.checkCircle]}>
                        {isSelected && (
                            <IconCheck
                                style={[styles.checkMark] }
                            />
                        )}
                    </ThemedView>
                </ThemedView>
                <ThemedText style={[styles.cardTitle, isSelected && { color: 'rgba(5, 59, 74, 1)' }]}>
                    {target.name.split('&')[0] + (target.name.includes('&') ? ' &\n' + target.name.split('&')[1] : '')}
                </ThemedText>
                <IconInformation style={[styles.cardInfoIcon, isSelected && { color: 'rgba(5, 59, 74, 1)' }]} />
            </ThemedView>
        </TouchableOpacity>
    );
}



const styles = StyleSheet.create({
    indicatorsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0C3C4C',
        marginBottom: 20
    },
    container: {
        paddingHorizontal: 5,
        paddingVertical: 20,
    },
    card: {
        backgroundColor: 'rgba(5, 59, 74, 1)',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'rgba(173, 215, 218, 0.2)',
        padding: 16,
        justifyContent: 'space-between',
    },
    subtitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 700,
        marginBottom: 30
    },
    button: {
        backgroundColor: '#fba864',
        borderRadius: 30,
        paddingVertical: 5,
        paddingHorizontal: 12,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 'auto',
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
    },
    section: {
        width: '100%',
        marginBottom: 16,
    },
    labelContainer: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        marginBottom: 10
    },
    label: {
        color: '#B1DAEC',
        fontSize: 16,
        fontWeight: 'bold',
    },
    labelIcon: {
        width: 20,
        height: 20
    },
    iconContainer: {
        borderWidth: 1,
        borderColor: 'rgba(122, 193, 198, 0.5)',
        borderRadius: '50%',
        padding: 5
    },
    input: {
        backgroundColor: '#124151',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        color: '#fff',
    },
    timeOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        gap: 5,
        marginBottom: 30,
    },
    timeButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(173, 215, 218, 0.5)',
        backgroundColor: 'rgba(122, 193, 198, 0.2)',
        margin: 5,
    },
    selectedTimeButton: {
        backgroundColor: '#B1DAEC',
    },
    timeText: {
        color: '#ccc',
        fontWeight: '500',
    },
    selectedTimeText: {
        color: '#062F3F',
        fontWeight: 'bold',
    },
    learningHeader: {
        color: '#5CE1E6',
        fontSize: 18,
        fontWeight: 'bold',
    },
    targetCard: {
        backgroundColor: 'rgba(5, 59, 74, 1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 20,
        width: 225,
        height: 175,
        padding: 16,
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 25,
        alignItems: 'center',
        position: 'relative',
        marginBottom: 10,
    },
    activeTargetCard: {
        backgroundColor: '#F7A866',
        width: 225,
        height: 175,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        position: 'relative',
        marginBottom: 10,
    },
    circle: {
        width: 48,
        height: 48,
        borderRadius: '50%',
        borderWidth: 2,
        borderColor: '#F7A866',
        backgroundColor: 'rgba(5, 59, 74, 1)',
    },
    checkCircle: {
        backgroundColor: 'rgba(248, 236, 174, 1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkMark: {
        width: 30,
        height: 30,
        color: "#FCFCFC"
    },
    cardTitle: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        fontWeight: '600',
    },
    activeCardTitle: {
        color: '#062F3F',
    },
    cardInfoIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 16,
        height: 16
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 50,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: '50%',
        borderWidth: 2,
        borderColor: 'rgba(122, 193, 198, 1)',
        margin: 4,
    },
    activeDot: {
        backgroundColor: 'rgba(122, 193, 198, 1)',
    },
    scrollConainer: {
        // width: '100%',
        gap: 15,
        padding: 5,
        alignItems: 'center',
    }
})