import supabase from '@/app/lib/supabase';
import { ChildrenCard } from '@/components/ChildrenCard';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import StepIndicator_Focus from "./StepIndecator";
import GradientText from '@/components/ui/GradientText';

import IconHappy from "@/assets/images/parent/icon-happy.svg"
import IconArrowRight from "@/assets/images/icons/arrow-right.svg"

interface Child {
    id: string,
    name: string,
    age: number,
    mode: string,
    avatar_url: string
}

export default function AddFocus_Third({ mode, currentStep, onPress }: { mode: number, currentStep: number, onPress: (children: Child[]) => void }) {
    const [children, setChildren] = React.useState<Child[]>([]);
    const [activeChildren, setActiveChildren] = React.useState<Child[]>([]);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        async function fetchChildren() {
            setLoading(true);
            try {
                const jwt = supabase.auth.getSession && (await supabase.auth.getSession())?.data?.session?.access_token;
                const { data, error } = await supabase.functions.invoke('children', {
                    method: 'GET',
                    headers: {
                        Authorization: jwt ? `Bearer ${jwt}` : '',
                    },
                });
                if (error) {
                    console.error('Error fetching children:', error.message);
                } else if (data && Array.isArray(data.data)) {
                    setChildren(data.data);
                }
            } catch (e) {
                console.error('Error fetching children:', e);
            } finally {
                setLoading(false);
            }
        }
        fetchChildren();
    }, []);

    function handleChildSelected(child: Child) {
        setActiveChildren(prev => {
            const exists = prev.some(t => t.id === child.id);
            if (exists) {
                return prev.filter(t => t.id !== child.id);
            } else {
                return [...prev, child];
            }
        });
    }


    return (
        <ThemedView style={styles.container}>
            {/* Step Indicators */}
            <StepIndicator_Focus currentStep={currentStep} />

            {/* Custom Pathway Card */}
            <ThemedView style={styles.card}>
                <ThemedText style={[styles.subtitle]}>Assign Focus</ThemedText>
                {/* Form */}
                <ThemedView style={styles.label}>
                    <ThemedView style={styles.iconContainer}>
                        <IconHappy width={21} height={21} style={styles.labelIcon} />
                    </ThemedView>
                    <GradientText text="Children" />
                    <ThemedText style={styles.labelText}>| {activeChildren.length} Child</ThemedText>
                </ThemedView>

                <FlatList
                    horizontal
                    data={children}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <ChildrenCard
                            key={item.id}
                            child={item}
                            isActive={activeChildren.includes(item)}
                            onPress={() => handleChildSelected(item)}
                        />
                    )}
                    style={styles.scrollConainer}
                    showsHorizontalScrollIndicator={false}
                />


                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onPress(activeChildren)}
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
        marginTop: 50,
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
    scrollConainer: {
        width: '100%',
        gap: 10,
        padding: 5,
        marginTop: 20
    },
    childIcon: {
        width: 56,
        height: 56
    },
    childText: {
        fontSize: 14,
        fontWeight: 600,
        textAlign: 'center',
        color: 'rgba(122, 193, 198, 1)'
    },
    itemIcon: {

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
        position: 'relative'
    }
})