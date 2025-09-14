import supabase from "@/app/lib/supabase";
import BottomNavBar from "@/components/BottomNavBar";
import Header from "@/components/Header";
import AddPathway_Fifth from "@/components/parent/learning/pathway/AddPathway_Fifth";
import AddPathway_First from "@/components/parent/learning/pathway/AddPathway_First";
import AddPathway_Fourth from "@/components/parent/learning/pathway/AddPathway_Fourth";
import AddPathway_Second from "@/components/parent/learning/pathway/AddPathway_Second";
import AddPathway_Third from "@/components/parent/learning/pathway/AddPathway_Third";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from "react-native";

import IconPathway from "@/assets/images/parent/icon-pathway.svg";
import IconArrowLeft from "@/assets/images/icons/arrow-left.svg"

interface Child {
    id: number,
    name: string,
    age: number,
    mode: string,
    avatar_url: string
}
export default function AddPathway() {
    const router = useRouter();
    const [step, setStep] = React.useState(1);
    const [mode, setMode] = React.useState(0);
    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [length, setLength] = React.useState('');
    const [targets, setTargets] = React.useState<{ id: string, name: string }[]>([]);
    const [children, setChildren] = React.useState<any[]>([]);

    function handleCreateButtonClicked(mode: number) {
        setStep(2);
        setMode(mode);
    }

    function handleSecondNext(name: string, description: string) {
        if (name && description) {
            setStep(3);
            setName(name);
            setDescription(description);
        }
        else {
            Alert.alert("Please input all values");
        }
    }
    function handleThirdNext(length: string, targets: { id: string, name: string }[]) {
        if (!length || !targets || targets.length == 0) {
            Alert.alert("Please input all values");
            return;
        }
        else {
            setStep(4);
            setLength(length);
            setTargets(targets);
        }
    }

    function handleFourthNext(children: Child[]) {
        if (mode == 0) {
            setStep(5);
            setChildren(children)
        }
        else {
            handleFinal()
        }
    }

    async function handleFinal() {
        setStep(6)
        // Prepare data
        const targetIds = targets.map((target: any) => target.id)
        const childIds = children.map((child: any) => child.id)
        const focusData = {
            name,
            description,
            targets: targetIds,
            children: childIds,
        };
        try {
            const jwt = supabase.auth.getSession && (await supabase.auth.getSession())?.data?.session?.access_token;
            const response = await fetch('https://fzmutsehqndgqwprkxrm.supabase.co/functions/v1/pathway-modes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: jwt ? `Bearer ${jwt}` : '',
                },
                body: JSON.stringify(focusData),
            });
            const result = await response.json();
            if (!response.ok) {
                alert(result?.error || 'Failed to save focus mode');
                return;
            }
        } catch (e) {
            alert('Failed to save focus mode');
            return;
        }
        router.replace({
            pathname: '/(parent)/(learning)/(pathway)',
            params: { showModal: 'true', mode: mode }
        });
    }
    function handleBackBtn() {
        router.back()
    }

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={{ flex: 1, display: "flex", height: 500 }}>
                <ScrollView
                    style={styles.rootContainer}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                >

                    <Image
                        source={require("@/assets/images/parent/parent-back-pattern.png")}
                        style={[styles.topBackPattern, {
                            height: '100%'
                        }
                        ]}
                        resizeMode="cover"
                    />

                    <Header role="parent" theme="dark"></Header>

                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={handleBackBtn}>
                        <IconArrowLeft width={21} height={21} color={"rgba(122, 193, 198, 1)"} />
                        <ThemedText style={styles.backBtnText}>Back to Learning</ThemedText>
                    </TouchableOpacity>

                    <ThemedView style={styles.mainContainer}>
                        <ThemedView style={styles.titleContainer}>
                            <IconPathway width={24} height={24}/>
                            <ThemedText style={styles.title}>New Pathway</ThemedText>
                        </ThemedView>

                        {step == 1 && <AddPathway_First onPress={handleCreateButtonClicked} />}
                        {step == 2 &&
                            <AddPathway_Second
                                mode={mode}
                                currentStep={2}
                                onPress={handleSecondNext}
                            />
                        }
                        {step == 3 && mode == 0 &&
                            <AddPathway_Third
                                mode={mode}
                                currentStep={3}
                                onPress={handleThirdNext}
                            />
                        }
                        {step == 3 && mode == 1 &&
                            <AddPathway_Fourth
                                mode={mode}
                                currentStep={3}
                                onPress={handleFourthNext}
                            />
                        }

                        {step == 4 &&
                            <AddPathway_Fourth
                                mode={mode}
                                currentStep={4}
                                onPress={handleFourthNext}
                            />
                        }
                        {step == 5 &&
                            <AddPathway_Fifth
                                mode={mode}
                                data={{
                                    name,
                                    description,
                                    length,
                                    targets,
                                    children
                                }}
                                currentStep={5}
                                onPress={handleFinal}
                            />
                        }
                    </ThemedView>
                </ScrollView>
                <ThemedView
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: 178,
                        zIndex: 1000,
                    }}
                >
                    <BottomNavBar role="parent" active="Learning" subActive="Pathway" />
                </ThemedView>
            </SafeAreaView>
        </>
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
        height: "100%",
        maxHeight: 1200,
        position: "absolute",
    },
    mainContainer: {
        marginBottom: 100
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