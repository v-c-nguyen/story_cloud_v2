import { ItemWithRightImage } from "@/components/ListItems";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import StepIndicator_Focus from "./StepIndecator";
import GradientText from "@/components/ui/GradientText";

import IconCheck from "@/assets/images/parent/icon-check.svg"
import IconArrowRight from "@/assets/images/icons/arrow-right.svg"

const steps = [1, 2, 3, 4, 5];

interface FocusData {
    name: string;
    description: string;
    targets: string[];
    children: any
}

export default function AddFocus_Final({
    data,
    currentStep,
    onPress }: { data: FocusData, currentStep: number, onPress: () => void }) {
    return (
        <ThemedView style={styles.container}>
            {/* Step Indicators */}
            <StepIndicator_Focus currentStep={currentStep} />

            {/* Custom Focus Card */}
            <ThemedView style={styles.card}>
                <ThemedText style={[styles.subtitle]}>Review</ThemedText>
                {/* Form */}
                <ThemedView style={styles.formInput}>
                    <ThemedView style={styles.label}>
                        <GradientText text="Focus Mode Name" />
                    </ThemedView>
                    <ThemedView style={{ flexDirection: 'row' }}>
                        <ThemedText style={[styles.valueText, styles.value]}>{data.name}</ThemedText>
                    </ThemedView>
                </ThemedView>

                <ThemedView style={styles.formInput}>
                    <ThemedView style={styles.label}>
                        <GradientText text="Learning Categories" />
                    </ThemedView>
                    <ThemedView style={{ flexDirection: 'column', gap: 5 }}>
                        {
                            data.targets?.length > 0 && data.targets.map((target: any, index) => (
                                <ThemedView key={index} style={{ flexDirection: 'row' }}>
                                    <ThemedView style={styles.value}>
                                        <ThemedText style={styles.valueText}>
                                            {target.name} |
                                        </ThemedText>
                                        <ThemedView style={[styles.circle, styles.checkCircle]}>
                                            <IconCheck
                                                color={"#F8ECAE"}
                                                width={15}
                                                height={15}
                                            />
                                        </ThemedView>
                                    </ThemedView>
                                </ThemedView>
                            ))
                        }
                    </ThemedView>
                </ThemedView>

                <ThemedView style={styles.formInput}>
                    <ThemedView style={styles.label}>
                        <GradientText text="Learning Modules" />
                    </ThemedView>
                    <ThemedView style={{ flexDirection: 'row' }}>
                        <ThemedView style={styles.value}>
                            <ThemedText style={[styles.valueText, { maxWidth: 260 }]}>
                                Module 1: Phonemic Awareness & Phonics
                            </ThemedText>
                            <ThemedText style={styles.valueText}>
                                |
                            </ThemedText>
                            <ThemedView style={[styles.circle, styles.checkCircle]}>
                                <IconCheck
                                    color={"#F8ECAE"}
                                    width={15}
                                    height={15}
                                />
                            </ThemedView>
                        </ThemedView>
                    </ThemedView>
                </ThemedView>

                <ThemedView style={styles.formInput}>
                    <ThemedView style={styles.label}>
                        <GradientText text="Assigned Children" />
                    </ThemedView>
                    <ThemedView style={{ flexDirection: 'row', gap: 10 }}>
                        {
                            data.children?.map((child: any, index: number) => (
                                <ItemWithRightImage key={index} name={child.name} avatar={child.avatar_url} ></ItemWithRightImage>
                            ))
                        }
                    </ThemedView>
                </ThemedView>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onPress()}
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
        gap: 20
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
    value: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 10,
        paddingVertical: 12,
        backgroundColor: 'rgba(122, 193, 198, 0.2)',
        borderWidth: 1,
        borderColor: 'rgba(173, 215, 218, 0.5)',
        borderRadius: 15,
    },
    valueText: {
        color: 'rgba(173, 215, 218, 1)',
        fontSize: 14,
        fontWeight: 700
    },
    input: {
        borderWidth: 1,
        borderColor: 'rgba(122, 193, 198, 0.5)',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 12,
        outlineWidth: 0,
        color: 'white',
        fontSize: 16
    },
    textarea: {
        borderWidth: 1,
        borderColor: 'rgba(122, 193, 198, 0.2)',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 12,
        outlineWidth: 0,
        color: 'rgba(122, 193, 198, 0.5)',
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
    checkCircle: {
        backgroundColor: 'rgba(244, 166, 114, 1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
})