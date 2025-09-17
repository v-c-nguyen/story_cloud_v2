import BottomNavBar from '@/components/BottomNavBar';
import Header from '@/components/Header';
import MyModal from '@/components/Modals/PlanUpdatedModal';
import ContentPreferences from '@/components/parent/content';
import { TabBar } from '@/components/TabBar';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text
} from 'react-native';
import { Image } from 'expo-image';
import IconProfile from "@/assets/images/parent/footer/icon-profile.svg";
import { tabData } from '@/data/parent/dashboardData';

const starIcon = require('@/assets/images/parent/icon-star.png')

const { width } = Dimensions.get('window');

const ModalTitle = "Story Style"
export const ModalContent = () => (
    <>
        Story style settings allows for you to adjust the pace and energy level of our stories. This setting is also available for your kid/s in the listen/watch player view.
        {"\n\n"}
        <Text>
            <Text style={{ fontWeight: 'bold' }}>PLAY TIME</Text>
            , just like it sounds, is for when your kid is needing an immersive and engaging story experience.{" "}
            <Text style={{ fontWeight: 'bold' }}>STORY TIME</Text>
            , is the opposite, it is for unwinding, relaxing and bed time vibes.
        </Text>
    </>
);
export default function Content() {
    const router = useRouter();
    const tabs = tabData;

    const [isMonthly, setIsMonthly] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [activeTab, setActiveTab] = React.useState('subscription');


    const handleTabPress = (tabId: string) => {
        if (tabId === 'content') router.navigate("/(parent)/(profiles)/(content)")
        if (tabId === 'account') router.navigate("/(parent)/(profiles)/(account)")
        setActiveTab(tabId);
    };

    return (


        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(5, 59, 74, 1)' }}>

                <ThemedView style={{ flex: 1, backgroundColor: 'rgba(5, 59, 74, 1)' }}>
                    <MyModal
                        visible={modalVisible}
                        title={ModalTitle}
                        content={<ModalContent />}
                        buttonText='Back to Profile'
                        onClose={() => setModalVisible(false)}
                        starIcon={starIcon}
                    />
                    <ScrollView
                        style={styles.rootContainer}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 55 }}
                    >
                        <Image
                            source={require("@/assets/images/parent/parent-back-pattern.png")}
                            style={styles.topBackPattern}
                            contentFit="cover"
                        />
                        {/* Header */}
                        <Header
                            icon={IconProfile}
                            role="parent"
                            title="Profile Settings"
                            theme="dark"
                        ></Header>

                        {/* Cloud Image */}
                        <ThemedView style={styles.headerRocketWrap}>
                            <Image
                                source={require("@/assets/images/kid/cloud-group-far.png")}
                                style={styles.imgCloudFar}
                                contentFit="cover"
                            />
                            <Image
                                source={require("@/assets/images/kid/cloud-group-near.png")}
                                style={styles.imgCloudNear}
                                contentFit="cover"
                            />
                        </ThemedView>

                        {/* Main Content */}
                        <ThemedView style={styles.settingContentStyle}>
                            <ThemedText style={styles.settingHeader}>Settings</ThemedText>

                            {/* Tab Navigation */}
                            <TabBar
                                tabs={tabs}
                                activeTab={'content'}
                                onTabPress={handleTabPress}
                            />

                            <ThemedView style={[styles.tabContent, { marginTop: 20 }]} >

                                {/* Main Content */}
                                <ContentPreferences setModalVisible={setModalVisible} />
                            </ThemedView>

                        </ThemedView>
                    </ScrollView>

                </ThemedView>
                <BottomNavBar
                    role="parent"
                    image={true}
                    theme="darkImage"
                    active="Profile" />
            </SafeAreaView>

        </>
    );
}

const styles = StyleSheet.create({
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
        width: '112%',
        height: '100%',
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: -100,
    },
    imgCloudNear: {
        width: '112%',
        height: '100%',
        position: "absolute",
        top: 42,
        left: 0,
        zIndex: -10
    },
    topBackPattern: {
        width: "100%",
        height: "100%",
        position: "absolute",
    },
    settingContentStyle: {
        backgroundColor: '#fff',
        paddingHorizontal: 3,
        zIndex: 10,
        lineHeight: 32,
        paddingBottom: 100,
        marginTop: -100
    },
    profileFrontBox: {
        position: "absolute",
        top: 180,
        zIndex: 0,
        tintColor: 'white'
    },
    mainSettingStyle: {
        display: 'flex',
        flexDirection: 'column'
    },
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
        marginHorizontal: 1,
        borderWidth: 2,
        borderColor: 'rgba(122, 193, 198, 0.2)',
        borderRadius: 20,
    },
    settingHeader: {
        color: 'rgba(5, 59, 74, 1)',
        fontSize: 28,
        fontWeight: 700,
        textAlign: 'center',
        lineHeight: 0
    },
    container: {
        paddingTop: 30,
        paddingBottom: 10,
        paddingHorizontal: 12,
        flex: 1,
        backgroundColor: '#fefefe',
        alignItems: 'center',
        overflow: 'hidden'
    },
    title: {
        fontSize: 24,
        fontWeight: 700,
        color: 'rgba(5, 59, 74, 1)',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: 400,
        color: 'rgba(5, 59, 74, 0.50)',
        marginBottom: 20,
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    toggleLabel: {
        fontSize: 16,
        fontWeight: 400,
        color: 'rgba(5, 59, 74, 1)',
        marginHorizontal: 8,
    },
    activeLabel: {
        fontWeight: 600,
    },
    card: {
        backgroundColor: '#fff',
        borderWidth: 3,
        borderColor: 'rgba(122, 193, 198, 0.7)',
        shadowColor: 'rgba(0, 0, 0, 0.06)',
        shadowOffset: { width: 0, height: 9 },
        shadowOpacity: 0.06, // or sometimes manually adjusted
        shadowRadius: 250, // blur radius
        elevation: 20, // (Android only) approximate
        borderRadius: 20,
        paddingTop: 50,
        marginHorizontal: 5,
        gap: 10,
        justifyContent: 'space-between',
        overflow: 'hidden'
    },
    planTitle: {
        textAlign: 'center',
        fontSize: 20,
        color: 'rgba(5, 59, 74, 1)',
    },
    storyCloud: {
        fontSize: 24,
        fontWeight: 700,
        color: 'rgba(5, 59, 74, 1)',
    },
    planName: {
        textAlign: 'center',
        fontSize: 45,
        fontStyle: 'italic',
        fontWeight: 700,
        color: 'rgba(4, 143, 153, 1)',
        lineHeight: 56,
        marginBottom: 5,
    },
    planPrice: {
        textAlign: 'center',
        fontSize: 50,
        fontWeight: 700,
        lineHeight: 43,
        color: 'rgba(5, 59, 74, 1)',
    },
    planSeats: {
        textAlign: 'center',
        fontWeight: 700,
        fontSize: 20,
        color: 'rgba(5, 59, 74, 1)',
        paddingBottom: 20,
        borderBottomColor: 'rgba(5, 59, 74, 0.15)',
        borderBottomWidth: 1
    },
    featureRow: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
    },
    featureCustomText: {
        marginLeft: 20,
        fontWeight: 700,
        fontSize: 18,
        color: 'rgba(5, 59, 74, 1)',
    },
    planButton: {
        marginTop: 20,
        height: 87,
        backgroundColor: 'rgba(173, 215, 218, 1)',
        paddingVertical: 12,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#b8dce2',
        gap: 5
    },
    buttonCustomText: {
        color: 'rgba(5, 59, 74, 1)',
        fontSize: 18,
        fontWeight: 700,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#c8dce0',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#00797c',
        width: 12,
        height: 12,
        borderRadius: 6,
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '96%',
        backgroundColor: 'rgba(252, 252, 252, 0.95)',
        borderRadius: 30,
        borderWidth: 2,
        borderColor: 'rgba(122, 193, 198, 0.2)',
        elevation: 10,
    },
    modalIconContainer: {
        padding: 60,
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

});
