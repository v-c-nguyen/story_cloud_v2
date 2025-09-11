import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { Component } from 'react';
import { Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { ModalContent } from '@/app/(parent)/(profiles)/(content)';

interface PlanUpdatedModalProps {
    visible: boolean;
    title: string,
    content: any,
    buttonText: string,
    onClose: () => void;
    starIcon: any;
}

const MyModal: React.FC<PlanUpdatedModalProps> = ({
    visible,
    title,
    content,
    buttonText,
    onClose,
    starIcon }
) => (
    <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
    >
        <ThemedView style={styles.modalOverlay}>
            <ThemedView style={styles.modalContent}>
                <ThemedView style={styles.modalIconContainer}>

                    <Image
                        source={require("@/assets/images/auth/back-pattern.png")}
                        style={[[styles.backPattern]]}
                        contentFit="cover"
                    />
                    <Image source={starIcon} style={{ width: 145, height: 150, margin:60 }} />
                </ThemedView>
                <ThemedText style={styles.modalTitle}>{title}</ThemedText>
                <ThemedText style={styles.modalBody}>{content}</ThemedText>
                <ThemedView style={styles.modalButtons}>
                    <TouchableOpacity onPress={onClose} style={styles.modalButton}>
                        <ThemedText style={styles.modalButtonText}>{buttonText}</ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </ThemedView>
        </ThemedView>
    </Modal>
);

const styles = StyleSheet.create({

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
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
        color: 'rgba(5, 59, 74, 1)',
        marginBottom: 10,
        textAlign: 'center'
    },
    modalBody: {
        fontSize: 18,
        color: 'rgba(5, 59, 74, 1)',
        fontWeight: 400,
        textAlign: 'center',
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
        position: "absolute", width: "100%", height: "100%", tintColor: "#053b4a10", top:0
    },
    topBackPattern: {
        width: "100%",
        height: 220,
        position: "absolute",
        top: 0,
        left: 0,
    },
});

export default MyModal;
