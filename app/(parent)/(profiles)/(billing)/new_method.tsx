import BottomNavBar from "@/components/BottomNavBar";
import Header from "@/components/Header";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Image, SafeAreaView, ScrollView, StyleSheet, TextInput, TouchableOpacity } from "react-native";



const refeshIcon = require('@/assets/images/parent/icon-refresh.png');
const checkCircleIcon = require('@/assets/images/parent/check-circle-icon.png')
const trashIcon = require('@/assets/images/parent/trash-icon.png')
const plusIcon = require('@/assets/images/parent/icon-plus.png')
const stripeIcon = require('@/assets/images/parent/stripe.png')
const backIcon = require('@/assets/images/parent/icon-left.png')

export default function newMethod() {
    const router = useRouter();
    const [activeTab, setActiveTab] = React.useState('account');
    const [cardNumber, setCardNumber] = React.useState('');

    const handleTabPress = (tabId: string) => {
        setActiveTab(tabId);
    };

    function handleBackBtn() {
        router.back()
    }

    function handleSubmit() {

    }

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={{ flex: 1, display: "flex", height: 500 }}>
                <ThemedView style={{ flex: 1, backgroundColor: 'rgba(5, 59, 74, 1)' }}>
                    <ScrollView
                        style={styles.rootContainer}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 55 }}
                    >
                        {/* Header */}
                        <Header
                            role="parent"
                            theme="dark"
                        ></Header>

                        <TouchableOpacity
                            style={styles.backBtn}
                            onPress={handleBackBtn}>
                            <Image source={backIcon} style={styles.backBtnIcon}></Image>
                            <ThemedText style={styles.backBtnText}>To Payment Method</ThemedText>
                        </TouchableOpacity>

                        {/* Cloud Image */}
                        <ThemedView style={styles.headerRocketWrap}>
                            <Image
                                source={require("@/assets/images/kid/cloud-group-far.png")}
                                style={styles.imgCloudFar}
                                resizeMode="cover"
                            />
                            <Image
                                source={require("@/assets/images/kid/cloud-group-near.png")}
                                style={styles.imgCloudNear}
                                resizeMode="cover"
                            />
                        </ThemedView>

                        {/* Main Content */}
                        <ThemedView style={styles.settingContentStyle}>
                            <ThemedView style={styles.tabContent}>
                                <ThemedView style={styles.container}>

                                    <ThemedView style={[styles.flexRow, { justifyContent: 'center', gap: 10, marginTop: 50 }]}>
                                        <ThemedText style={styles.sectionTitle}>Add New Method</ThemedText>
                                    </ThemedView>

                                    {/* Email Section */}
                                    <ThemedView style={{ flexDirection: 'column', gap: 15 }}>
                                        <ThemedView>
                                            <ThemedText style={styles.subLabel}>Card Number</ThemedText>
                                            <ThemedView style={[styles.flexRow, {gap: 5}, styles.inputContainer]}>
                                                <TextInput
                                                    value={cardNumber}
                                                    placeholder="2345 2345 2345 2345"
                                                    style={[styles.input2, {flex: 1}]}
                                                />

                                                <Image
                                                    source={require('@/assets/images/parent/icon-paymentCard.png')}
                                                    style={styles.cardIcon}
                                                />
                                            </ThemedView>
                                        </ThemedView>

                                        <ThemedView style={styles.flexRow}>
                                            <ThemedView>
                                                <ThemedText style={styles.subLabel}>Expiry Date</ThemedText>
                                                <ThemedView style={[styles.flexRow, { gap: 10 }]}>
                                                    <TextInput
                                                        value={cardNumber}
                                                        placeholder="12"
                                                        style={[styles.input, { width: 60 }]}
                                                    />
                                                    <TextInput
                                                        value={cardNumber}
                                                        placeholder="12"
                                                        style={[styles.input, { width: 60 }]}
                                                    />
                                                </ThemedView>
                                            </ThemedView>

                                            <ThemedView>
                                                <ThemedText style={styles.subLabel}>CVV</ThemedText>
                                                <TextInput
                                                    value={cardNumber}
                                                    placeholder="..."
                                                    style={[styles.input, { width: 60 }]}
                                                />
                                            </ThemedView>

                                        </ThemedView>
                                        <ThemedView>
                                            <ThemedText style={styles.subLabel}>Name</ThemedText>
                                            <TextInput
                                                value={cardNumber}
                                                placeholder="Van Cong Nguyen"
                                                style={styles.input}
                                            />
                                        </ThemedView>
                                    </ThemedView>


                                    {/* Save Button */}
                                    <TouchableOpacity onPress={handleSubmit}>
                                        <ThemedView style={styles.button} >
                                            <Image source={refeshIcon}></Image>
                                            <ThemedText style={styles.buttonText}> Save</ThemedText>
                                        </ThemedView>
                                    </TouchableOpacity>
                                </ThemedView>
                            </ThemedView>

                        </ThemedView>
                    </ScrollView>

                    <BottomNavBar
                        role="parent"
                        image={true}
                        theme="darkImage"
                        active="Profile" />
                </ThemedView>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    settingContainer: {},
    rootContainer: {
        flex: 1,
        position: "relative",
    },
    headerRocketWrap: {
        width: '100%',
        height: 300,
        paddingLeft: 36,
        marginTop: -56,
        position: "relative",
    },
    imgCloudFar: {
        width: '110%',
        height: '100%',
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: -100,
    },
    imgCloudNear: {
        width: '110%',
        height: '100%',
        position: "absolute",
        top: 42,
        left: 0,
        zIndex: -10
    },
    settingContentStyle: {
        backgroundColor: '#fff',
        paddingHorizontal: 3,
        zIndex: 10,
        paddingBottom: 150,
        marginTop: -100
    },
    profileFrontBox: {
        position: "absolute",
        top: 180,
        zIndex: 0,
        tintColor: 'white'
    },
    sectionTitle: { fontSize: 24, color: "rgba(5, 59, 74, 1)", fontWeight: '700', marginBottom: 30 },
    card: {
        backgroundColor: '#fff',
        minHeight: 160,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(5, 59, 74, 0.2)',
        padding: 20,
        marginBottom: 8,
        elevation: 3,
    },
    mainSettingStyle: {
        display: 'flex',
        flexDirection: 'column'
    },
    cardRow: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardIcon: { width: 30, height: 30, resizeMode: 'contain' },
    cardText: { fontSize: 16, fontWeight: '400', color: 'rgba(5, 59, 74, 1)', flex: 1, marginLeft: 10 },
    changeButton: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        gap: 10,
        borderWidth: 1,
        borderColor: 'rgba(5, 59, 74, 0.2)',
        borderRadius: 30
    },
    changeBtnText: {
        fontSize: 16,
        fontWeight: 400,
        color: 'rgba(5, 59, 74, 1)'
    },
    cardExpiry: { marginTop: 30, fontSize: 16, color: 'rgba(5, 59, 74, 1)' },
    tabContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginTop: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        borderWidth: 1,
        padding: 4,
    },
    tabItem: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    activeTabItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    tabText: {
        color: 'rgba(5, 59, 74, 1)',
        fontSize: 16,
        fontWeight: '600',
    },
    activeTabText: {
        color: 'rgba(5, 59, 74, 1)',
        fontWeight: '700',
    },
    tabContent: {
        minHeight: 500,
        marginHorizontal: 1,
        paddingVertical: 30,
        paddingHorizontal: 10,
        borderWidth: 2,
        borderColor: 'rgba(122, 193, 198, 0.2)',
        borderRadius: 20,
    },
    contentTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 16,
    },
    icon24: {
        width: 24,
        height: 24
    },
    icon16: {
        width: 16,
        height: 16
    },
    settingHeader: {
        color: 'rgba(5, 59, 74, 1)',
        fontSize: 28,
        fontWeight: 700,
        textAlign: 'center'
    },
    iconButton: {
        borderRadius: 100,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderBlockColor: 'rgba(5, 59, 74, 0.2)',
        borderWidth: 1,
        width: 40,
        height: 40
    },
    iconButtonWithBack: {
        backgroundColor: '#F4A672',
        borderWidth: 0
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    flexCol: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    justifyBetween: {
        justifyContent: 'space-between',
    },
    justifyCenter: {
        justifyContent: 'center',
    },
    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        justifyContent: 'center',
        top: -35,
        zIndex: 999
    },
    backBtnIcon: {

    },
    backBtnText: {
        color: 'rgba(122, 193, 198, 1)',
        fontSize: 14,
        fontWeight: 400
    },

    container: {
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        flex: 1,
        justifyContent: 'center',
    },
    label: {
        fontSize: 24,
        fontWeight: 700,
        color: 'rgba(5, 59, 74, 1)',
    },
    subLabel: {
        fontSize: 16,
        fontWeight: 700,
        color: 'rgba(5, 59, 74, 1)',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: 'rgba(122, 193, 198, 0.5)',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 20,
        fontSize: 16,
        fontWeight: 400,
        color: 'rgba(5, 59, 74, 1)',
        outlineWidth: 0
    },
    input2: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        fontSize: 16,
        fontWeight: 400,
        color: 'rgba(5, 59, 74, 1)',
        outlineWidth: 0
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: 'rgba(122, 193, 198, 0.5)',
        borderRadius: 10,
        paddingRight: 10
    },
    button: {
        marginTop: 30,
        backgroundColor: '#F4A672',
        borderRadius: 50,
        paddingVertical: 12,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#b2cbd6',
    },
    buttonText: {
        fontSize: 16,
        color: 'rgba(5, 59, 74, 1)',
        fontWeight: '400',
    },

});

