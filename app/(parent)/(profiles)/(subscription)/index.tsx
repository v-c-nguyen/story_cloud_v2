import supabase from '@/app/lib/supabase';
import BottomNavBar from '@/components/BottomNavBar';
import DropDownMenu from '@/components/DropDownMenu';
import Header from '@/components/Header';
import MyModal from '@/components/Modals/PlanUpdatedModal';
import { TabBar } from '@/components/TabBar';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Stack, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Platform, SafeAreaView, ScrollView,
    StyleSheet,
    Switch,
    TouchableOpacity
} from 'react-native';
import { Image } from 'expo-image';
import IconProfile from "@/assets/images/parent/footer/icon-profile.svg";
import { tabData } from '@/data/parent/dashboardData';
import IconTickBox from "@/assets/images/icons/icon-box-tick.svg"
import IconCancel from "@/assets/images/parent/icon-cancel.svg"

const starIcon = require('@/assets/images/parent/icon-star.png')

const { width } = Dimensions.get('window');

const plans = [
    {
        name: 'Basic',
        priceMonthly: 8.99,
        priceAnnual: 89.99,
        seats: 1,
        features: [
            'Listen Mode',
            'Creative Learning',
            'Premium Accessibility',
            'Cutting Edge Content',
            'Dual Mode Experience',
            'Interactive Learning',
            'Character-Driven Adventures',
            'Anytime, Anywhere',
        ],
        buttonLabel: 'Cancel Subscription',
    },
    {
        name: 'Advanced',
        priceMonthly: 14.99,
        priceAnnual: 149.99,
        seats: 5,
        features: [
            'Read Mode',
            'Watch Mode',
            'Advanced Learning',
            'Cutting Edge Content',
            'Dual Mode Experience',
            'Interactive Learning',
            'Character-Driven Adventures',
            'Anytime, Anywhere',
        ],
        buttonLabel: 'Update Subscription',
    },
];
export default function SubscriptionPlansScreen() {
    let domain = '';
    if (typeof window !== 'undefined' && Platform.OS === 'web') {
        domain = window.location.origin;
    }
    const router = useRouter();
    const [isMonthly, setIsMonthly] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);

    // Show modal if URL contains ?status=success (web only)
    useEffect(() => {
        let domain = '';
        if (typeof window !== 'undefined' && Platform.OS === 'web') {
            domain = window.location.origin;
        } else {
            domain = 'https://storycloud.com'; // Replace with your tunnel URL
        }
    }, []);

    // Show modal if URL contains ?status=success

    const [activeTab, setActiveTab] = React.useState('subscription');

    const handleScroll = (event: any) => {
        const x = event.nativeEvent.contentOffset.x;
        const newIndex = Math.round(x / width);
        setCurrentIndex(newIndex);
    };


    const handleButtonClick = async (label: string, plan: any) => {
        if (label === 'Update Subscription') {
            try {
                // Call your Supabase Edge Function to create a Stripe Checkout session
                const jwt = supabase.auth.getSession && (await supabase.auth.getSession())?.data?.session?.access_token;
                const res = await fetch('https://fzmutsehqndgqwprkxrm.supabase.co/functions/v1/create-stripe-checkout', {
                    method: "POST",
                    headers: {
                        Authorization: jwt ? `Bearer ${jwt}` : '',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        plan: plan.name,
                        interval: isMonthly ? 'month' : 'year',
                        success_url: `myapp://subscription-success`,
                        cancel_url: `myapp://subscription-cancel`,
                    }),
                });

                const { url, error } = await res.json();

                if (!url || typeof url !== "string") {
                    Alert.alert("Stripe Error", error || "No checkout URL returned.");
                    return;
                }

                // Open Stripe Checkout in an in-app browser
                const result = await WebBrowser.openAuthSessionAsync(url, `myapp://subscription-success`);
                if (result.type === 'success') {
                    setModalVisible(true);
                }

            } catch (err: any) {
                Alert.alert('Stripe Error', err.message || 'Could not start checkout.');
            }
        } else if (label === 'Cancel Subscription') {
            await fetch('https://fzmutsehqndgqwprkxrm.supabase.co/functions/v1/cancel-stripe-checkout', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    subscription_id: "sub_1PabcXYZ" // from Stripe's webhook or customer portal
                })
            });
        }
    };

    const handleTabPress = (tabId: string) => {
        if (tabId === 'account') handleItemProcess('subscription');
        else if (tabId === 'content') router.navigate("/(parent)/(profiles)/(content)");
    };

    const handleItemProcess = (item: string) => {
        switch (item) {
            case 'account':
                router.navigate("/(parent)/(profiles)/(account)");
                break;
            case 'login':
                router.navigate("/(parent)/(profiles)/(login)");
                break;
            case 'subscription':
                router.navigate("/(parent)/(profiles)/(subscription)");
                break;
            case 'billing':
                router.navigate("/(parent)/(profiles)/(billing)");
                break;

            default:
                break;
        }

    }
    const tabs = tabData;
    return (


        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(5, 59, 74, 1)' }}>

                <ThemedView style={{ flex: 1, backgroundColor: 'rgba(5, 59, 74, 1)' }}>
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
                                activeTab={'account'}
                                onTabPress={handleTabPress}
                            />

                            <DropDownMenu activeItem={activeTab} onSelect={(item) => handleItemProcess(item)} />
                            <ThemedView style={styles.tabContent} >

                                {/* Main Content */}

                                <ThemedView style={styles.container}>
                                    {/* Header */}
                                    <ThemedText style={styles.title}>Your Subscription Plan</ThemedText>
                                    <ThemedText style={styles.subtitle}>Edit or upgrade your plan from here</ThemedText>

                                    {/* Toggle */}
                                    <ThemedView style={styles.toggleRow}>
                                        <ThemedText style={[styles.toggleLabel, isMonthly && styles.activeLabel]}>Monthly</ThemedText>
                                        <Switch
                                            value={!isMonthly}
                                            onValueChange={() => setIsMonthly(prev => !prev)}
                                            trackColor={{ false: '#ccc', true: '#F4A672' }}
                                            thumbColor="#fff"
                                        />
                                        <ThemedText style={[styles.toggleLabel, !isMonthly && styles.activeLabel]}>Annual</ThemedText>
                                    </ThemedView>

                                    {/* Horizontal ScrollView */}
                                    <ScrollView
                                        horizontal
                                        pagingEnabled
                                        showsHorizontalScrollIndicator={false}
                                        onScroll={handleScroll}
                                        scrollEventThrottle={16}
                                        style={{ position: 'relative', flex: 1 }}
                                    >
                                        {plans.map((plan, index) => (
                                            <ThemedView key={index} style={styles.card}>
                                                <ThemedText style={styles.planTitle}>
                                                    <ThemedText style={styles.storyCloud}>StoryCloud</ThemedText> | Explorer
                                                </ThemedText>
                                                <ThemedText style={styles.planName}>{plan.name}</ThemedText>
                                                <ThemedText style={styles.planPrice}>
                                                    ${isMonthly ? plan.priceMonthly : plan.priceAnnual}
                                                </ThemedText>
                                                <ThemedText style={styles.planSeats}>{plan.seats} Seat{plan.seats > 1 ? 's' : ''}</ThemedText>

                                                {/* Features */}
                                                <ThemedView style={{ marginTop: 20 }}>
                                                    {plan.features.map((feature, idx) => (
                                                        <ThemedView key={idx} style={styles.featureRow}>
                                                            <IconTickBox width={24} height={24} color={"rgba(5, 59, 74, 1)"} />
                                                            <ThemedText style={styles.featureCustomText}>{feature}</ThemedText>
                                                        </ThemedView>
                                                    ))}
                                                </ThemedView>

                                                {/* Button */}
                                                <TouchableOpacity
                                                    style={styles.planButton}
                                                    onPress={() => handleButtonClick(plan.buttonLabel, plan)}
                                                >
                                                    {
                                                        plan.buttonLabel == "Cancel Subscription" &&
                                                        <IconCancel width={20} height={20} color={"#053B4A"} />
                                                    }
                                                    <ThemedText style={styles.buttonCustomText}>{plan.buttonLabel}</ThemedText>
                                                </TouchableOpacity>
                                            </ThemedView>
                                        ))}
                                    </ScrollView>
                                    <ThemedView style={styles.dotsContainer}>
                                        {plans.map((_, idx) => (
                                            <ThemedView
                                                key={idx}
                                                style={[
                                                    styles.dot,
                                                    currentIndex === idx && styles.activeDot
                                                ]}
                                            />
                                        ))}
                                    </ThemedView>



                                    {/* Modal */}
                                    {/* Plan Updated Modal */}
                                    <MyModal
                                        visible={modalVisible}
                                        title="Your Plan has been Updated"
                                        content='Updates will be reflected in your next billing cycle'
                                        buttonText='Back to Profile'
                                        onClose={() => setModalVisible(false)}
                                        starIcon={starIcon}
                                    />
                                </ThemedView>

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
        overflow: 'hidden'
    },
    settingHeader: {
        color: 'rgba(5, 59, 74, 1)',
        fontSize: 28,
        fontWeight: 700,
        textAlign: 'center',
        lineHeight: 34,
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
        lineHeight: 48,
        color: 'rgba(5, 59, 74, 1)',
    },
    planSeats: {
        textAlign: 'center',
        fontWeight: 700,
        fontSize: 20,
        color: 'rgba(5, 59, 74, 1)',
        paddingBottom: 20,
        borderBottomColor: 'rgba(5, 59, 74, 0.15)',
        borderBottomWidth: 1,
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


});
