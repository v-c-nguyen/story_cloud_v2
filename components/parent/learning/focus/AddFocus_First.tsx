import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import StepIndicator_Focus from "./StepIndecator";
import GradientText from "@/components/ui/GradientText";

import IconFocus from "@/assets/images/parent/icon-focus.svg"
import IconDoc from "@/assets/images/parent/icon-doc.svg"
import IconArrowRight from "@/assets/images/icons/arrow-right.svg"
const steps = [1, 2, 3, 4, 5];

export default function AddFocus_First( {
    name,
    description,
    setName,
    setDescription,
    currentStep,
    onPress }: {
        name: string, 
        description: string, 
        setName: (name: string) => void, setDescription: (des: string) => void, currentStep: number, onPress: (name: string, des: string) => void }) {
    const router = useRouter();
    return (
        <ThemedView style={styles.container}>
            {/* Step Indicators */}
            <StepIndicator_Focus currentStep={currentStep}/>

            {/* Custom Pathway Card */}
            <ThemedView style={styles.card}>
                <ThemedText style={[styles.subtitle]}>General Informaion</ThemedText>
                {/* Form */}
                <ThemedView style={styles.formInput}>
                    <ThemedView style={styles.label}>
                        <ThemedView style={styles.iconContainer}>
                            <IconFocus width={21} height={21} style={styles.labelIcon} />
                        </ThemedView>
                        <GradientText text="Focus Mode Name" />
                    </ThemedView>
                    <TextInput
                        value={name}
                        placeholder="Focus Name"
                        placeholderTextColor={'#7ac1c679'}
                        editable={true}
                        onChangeText={setName}
                        style={styles.input}
                    />
                </ThemedView>

                <ThemedView style={styles.formInput}>
                    <ThemedView style={styles.label}>
                        <ThemedView style={styles.iconContainer}><IconDoc width={21} height={21} style={styles.labelIcon} /></ThemedView>
                        <GradientText text="Description" />
                    </ThemedView>
                    <TextInput
                        value={description}
                        placeholder="Description"
                        placeholderTextColor={'#7ac1c679'}
                        editable={true}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={5}
                        style={styles.textarea}
                    />
                </ThemedView>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onPress(name, description)}
                >
                    <ThemedText style={styles.buttonText}>Next</ThemedText>
                    <IconArrowRight width={24} height={24} color={"#053B4A"} />
                </TouchableOpacity>
            </ThemedView>
        </ThemedView>
    )
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
        paddingVertical: 10,
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
    formInput: {
        flexDirection: 'column',
        marginBottom: 30,
        gap: 10
    },
    label: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
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
    labelText: {
        fontSize: 16,
        fontWeight: 700,
        color: 'rgba(122, 193, 198, 1)'
    },
    input: {
        borderWidth: 1,
        borderColor: 'rgba(122, 193, 198, 0.5)',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 12,
        outlineWidth: 0,
        color: 'rgba(122, 193, 198, 1)',
        fontSize: 16
    },
    textarea: {
        borderWidth: 1,
        borderColor: 'rgba(122, 193, 198, 0.2)',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 12,
        outlineWidth: 0,
        color: 'rgba(122, 193, 198, 1)',
        fontSize: 16
    },
    circle: {
      width: 28,
      height: 28,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: '#445D65',
      backgroundColor: '#1C3E46',
      justifyContent: 'center',
      alignItems: 'center',
    },
    completedCircle: {
      backgroundColor: '#F7A866',
      borderColor: '#F7A866',
    },
    activeCircle: {
      borderColor: '#F7A866',
      backgroundColor: '#0C3C4C',
    },
    stepText: {
      color: '#445D65',
      fontWeight: 'bold',
    },
    completedText: {
      color: '#fff',
    },
    activeText: {
      color: '#F7A866',
    },
    line: {
      height: 2,
      width: 20,
      backgroundColor: '#445D65',
      marginHorizontal: 4,
    },
})