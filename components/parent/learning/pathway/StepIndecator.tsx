import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet } from "react-native";

const checkIcon = require('@/assets/images/parent/dashboard/selected.png')

const steps = [1, 2, 3, 4, 5];

export default function StepIndicator_Pathway({ mode, currentStep }: {mode: number, currentStep: number }) {
    const router = useRouter();
    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');
    const steps = mode == 0? [1, 2, 3, 4, 5] : [1, 2, 3];

    return (
        <ThemedView style={styles.indicatorsContainer}>
            {steps.map((step, index) => {
                const isCompleted = step < currentStep;
                const isActive = step === currentStep;

                return (
                    <React.Fragment key={step}>
                        <ThemedView style={styles.circleContainer}>
                            <ThemedView
                                style={[
                                    styles.circle,
                                    isCompleted && styles.completedCircle,
                                    isActive && styles.activeCircle,
                                ]}
                            >
                                {
                                    isCompleted ?
                                        <Image source={checkIcon} style={{ width: 24, height: 24 }} />
                                        :
                                        <ThemedText style={[
                                            styles.stepText,
                                            isActive && styles.activeText
                                        ]}>
                                            {step}
                                        </ThemedText>
                                }
                            </ThemedView>
                        </ThemedView>
                        {index < steps.length - 1 && (
                            <ThemedView style={styles.line} />
                        )}
                    </React.Fragment>
                );
            })}
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
    circleContainer: {
        borderRadius: '50%',
        borderWidth: 2,
        borderColor: 'rgba(173, 215, 218, 0.2)'
    },
    circle: {
        width: 35,
        height: 35,
        borderRadius: '50%',
        backgroundColor: 'rgba(173, 215, 218, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    completedCircle: {
        backgroundColor: '#F7A866',
        borderColor: 'rgba(252, 252, 252, 0.2)',
    },
    activeCircle: {
        borderColor: '#F7A866',
        borderWidth: 2,
        backgroundColor: '#0C3C4C',
    },
    stepText: {
        fontSize: 20,
        color: 'rgba(5, 59, 74, 1)',
        fontWeight: 'bold',
    },
    completedText: {
        color: '#fff',
    },
    activeText: {
        color: 'white',
    },
    line: {
        height: 2,
        width: 20,
        backgroundColor: '#445D65',
        marginHorizontal: 4,
    },
})