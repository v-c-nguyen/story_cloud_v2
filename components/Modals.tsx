import { Image } from "expo-image";
import { Modal, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import StepIndicator_Focus from "./parent/learning/focus/StepIndecator";
import StepIndicator_Pathway from "./parent/learning/pathway/StepIndecator";
import GradientText from "./ui/GradientText";

const finishedImage = require("@/assets/images/icons/modal1.png");
const watchAgainIcon = require("@/assets/images/icons/rePlay.png");
const NextIcon = require("@/assets/images/icons/new.png");

export function CreatPathwayModal({ mode, modalVisible, onRemove }: { mode: any, modalVisible: boolean, onRemove: (() => void) }) {

    return (
        <Modal
            visible={modalVisible}
            transparent
            style={{ width: '100%', height: '100%' }}
            animationType="fade"
            onRequestClose={onRemove}
        >
            {/* Modal content */}
            <ThemedView style={styles.modalOverlay}>
                <ThemedView style={styles.modalContainer}>
                    <ThemedView style={styles.modalHeader}>
                        <StepIndicator_Pathway mode={mode} currentStep={mode == 0 ? 6 : 4}></StepIndicator_Pathway>
                    </ThemedView>
                    <ThemedView style={styles.modalContent}>
                        <GradientText text="You've Successfully Created Pathway" style={styles.mainText}/>
                        <ThemedText style={styles.desText}>
                            Edit and view from your Pathway Dashboard
                        </ThemedText>
                    </ThemedView>
                    <TouchableOpacity
                        style={styles.modalButton}
                        onPress={onRemove}>
                        <ThemedText style={styles.modalButtonText}>Continue to Dashboard</ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </ThemedView>
        </Modal>
    )
}

export function CreatFocusModal({ mode, modalVisible, onRemove }: { mode: any, modalVisible: boolean, onRemove: (() => void) }) {

    return (
        <Modal
            visible={modalVisible}
            transparent
            style={{ width: '100%', height: '100%' }}
            animationType="fade"
            onRequestClose={onRemove}
        >
            {/* Modal content */}
            <ThemedView style={styles.modalOverlay}>
                <ThemedView style={styles.modalContainer}>
                    <ThemedView style={styles.modalHeader}>
                        <StepIndicator_Focus currentStep={5}></StepIndicator_Focus>
                    </ThemedView>
                    <ThemedView style={styles.modalContent}>
                        <GradientText text="You've Successfully Created Focus Mode" style={styles.mainText}/>
                        <ThemedText style={styles.desText}>
                            Edit and view from your Focus Mode Dashboard
                        </ThemedText>
                    </ThemedView>
                    <TouchableOpacity
                        style={styles.modalButton}
                        onPress={onRemove}>
                        <ThemedText style={styles.modalButtonText}>Continue to Dashboard</ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </ThemedView>
        </Modal>
    )
}

export function Finished({ onWatchAgain, onNext }: { onWatchAgain: (() => void), onNext: (() => void) }) {

    return (
        <ThemedView style={styles.finishContent}>
            <Image source={finishedImage} style={styles.finishedImageStyle} />
            <TouchableOpacity style={styles.againButton} onPress={onWatchAgain}>
                <Image source={watchAgainIcon} style={styles.againBtnImage}></Image>
                <ThemedText style={styles.againBtnText} > Watch Again </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextButton} onPress={onNext}>
                <Image source={NextIcon} style={styles.nextBtnImage}></Image>
                <ThemedText style={styles.nextBtnText} > Next Adventure </ThemedText>
            </TouchableOpacity>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'rgba(5, 59, 74, 1)',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        borderWidth: 1,
        borderColor: 'rgba(122, 193, 198, 0.5)',
        borderRadius: 10,
        zIndex: 999,
        paddingBottom: 24
    },
    modalHeader: {
        paddingVertical: 50,
        borderBottomWidth: 1,
        borderColor: 'rgba(122, 193, 198, 0.2)'
    },
    modalContent: {
        padding: 24,
        height: "100%"
    },
    mainText: {
        fontSize: 20,
        fontWeight: 700,
        textAlign: 'center',
        marginBottom: 10,
        width: "100%",
        height: "100%"
    },
    desText: {
        fontSize: 14,
        fontStyle: 'italic',
        textAlign: 'center',
        color: 'rgba(173, 215, 218, 1)',
    },
    modalButton: {
        marginTop: 36,
        width: 200,
        marginHorizontal: 'auto',
        backgroundColor: 'rgba(244, 166, 114, 1)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 30,
        alignItems: 'center'
    },
    modalButtonText: {
        textAlign: 'center',
        color: 'rgba(5, 59, 74, 1)',
        fontSize: 14
    },

    // Finished Modal CSS
    finishContent: {
        width: 300,
        position: 'relative'
    },
    finishedImageStyle: {
        width: 300,
        height: 250
    },
    againButton: {
        backgroundColor: 'rgba(244, 166, 114, 1)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 70,
        position: 'absolute',
        width: 300,
        top: 200,
        left: 0,
        gap: 10,
        paddingVertical: 10,
    },
    againBtnImage: {
        width: 50,
        height: 50
    },
    againBtnText: {
        color: 'rgba(5, 59, 74, 1)',
        fontSize: 20,
        fontWeight: 400
    },
    nextButton: {
        backgroundColor: 'rgba(173, 215, 218, 1)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 70,
        width: 300,
        marginTop: 25,
        gap: 10,
        paddingVertical: 10,
    },
    nextBtnImage: {
        width: 50,
        height: 50
    },
    nextBtnText: {
        color: 'rgba(5, 59, 74, 1)',
        fontSize: 20,
        fontWeight: 400
    }
})