import { ItemWithRightImage } from "@/components/ListItems";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { childrenData } from "@/data/childrenData";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import StepIndicator_Pathway from "./StepIndecator";
import GradientText from "@/components/ui/GradientText";

const pathwayIcon = require('@/assets/images/parent/icon-pathway.png')
const checkIcon = require('@/assets/images/parent/dashboard/selected.png')
const rightButton = require('@/assets/images/parent/icon-right.png')

const steps = [1, 2, 3, 4, 5];

interface PathwayData {
    name: string;
    description: string;
    length: string;
    targets: { id: string; name: string; }[];
    children: typeof childrenData;
}


export default function AddPathway_Fifth({ mode, data, currentStep, onPress }: { mode: number, data: PathwayData, currentStep: number, onPress: () => void }) {
    const router = useRouter();
    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');

    return (
        <ThemedView style={styles.container}>
            {/* Step Indicators */}
            <StepIndicator_Pathway mode={mode} currentStep={currentStep} />

            {/* Custom Pathway Card */}
            <ThemedView style={styles.card}>
                <ThemedText style={[styles.subtitle]}>Review</ThemedText>
                {/* Form */}
                <ThemedView style={styles.formInput}>
                    <ThemedView style={styles.label}>
                        <GradientText text="Pathway Name" />
                    </ThemedView>
                    <ThemedView style={{ flexDirection: 'row' }}>
                        <ThemedText style={[styles.valueText, styles.value]}>{data.name}</ThemedText>
                    </ThemedView>
                </ThemedView>


                <ThemedView style={styles.formInput}>
                    <ThemedView style={styles.label}>
                        <GradientText text="Pathway Duration" />
                    </ThemedView>
                    <ThemedView style={{ flexDirection: 'row' }}>
                        <ThemedView style={styles.value}>
                            <ThemedText style={styles.valueText}>
                                {data.length} |
                            </ThemedText>
                            <ThemedView style={[styles.circle, styles.checkCircle]}>
                                <Image
                                    source={checkIcon}
                                    style={{ width: 24, height: 24 }}
                                ></Image>
                            </ThemedView>
                        </ThemedView>
                    </ThemedView>
                </ThemedView>

                <ThemedView style={styles.formInput}>
                    <ThemedView style={styles.label}>
                        <GradientText text="Learning Categories" />
                    </ThemedView>
                    <ThemedView style={{ flexDirection: 'column', gap: 5 }}>
                        {
                            data.targets?.map((target, index) => (
                                <ThemedView key={index} style={{ flexDirection: 'row' }}>
                                    <ThemedView style={styles.value}>
                                        <ThemedText style={styles.valueText}>
                                            { target?.name } |
                                        </ThemedText>
                                        <ThemedView style={[styles.circle, styles.checkCircle]}>
                                            <Image
                                                source={checkIcon}
                                                style={{ width: 24, height: 24 }}
                                            ></Image>
                                        </ThemedView>
                                    </ThemedView>
                                </ThemedView>
                            ))
                        }
                    </ThemedView>
                </ThemedView>

                <ThemedView style={styles.formInput}>
                    <ThemedView style={styles.label}>
                        <GradientText text="Assigned Children" />
                    </ThemedView>
                    <ThemedView style={{ flexDirection: 'row', gap: 10 }}>
                        {
                            data.children?.map((child, index) => (
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
                    <Image source={rightButton}></Image>
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
        borderRadius: 10,
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