import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { Image, StyleSheet } from "react-native";

import IconCheck from "@/assets/images/parent/icon-check.svg"


export default function StepIndicator_Focus({  currentStep }: { currentStep: number }) {
    const steps = [1, 2, 3, 4];

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
                                        <IconCheck width={18} height={19} color={"#F8ECAE"}/>
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