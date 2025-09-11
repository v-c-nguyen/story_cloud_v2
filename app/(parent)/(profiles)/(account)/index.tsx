import supabase from '@/app/lib/supabase';
import AvatarUploader from '@/components/AvatarUploader/AvatarUploader';
import BottomNavBar from '@/components/BottomNavBar';
import DropDownMenu from '@/components/DropDownMenu';
import Header from '@/components/Header';
import { ModeList } from '@/components/ModeList';
import { TabBar } from '@/components/TabBar';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useChildrenStore } from '@/store/childrenStore';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity
} from 'react-native';

import IconParent2 from "@/assets/images/icons/icon-parent-2.svg"
import IconParent3 from "@/assets/images/icons/icon-parent-3.svg"
import IconDownload from "@/assets/images/icons/icon-download.svg"
import IconEdit from "@/assets/images/parent/icon-edit.svg"
import IconAge from "@/assets/images/icons/icon-age.svg"
import IconInformation from "@/assets/images/parent/icon-information.svg"
import IconCheck from "@/assets/images/parent/icon-check.svg"
import IconSelectable from "@/assets/images/icons/icon-selectable.svg"
import IconFrontbox from "@/assets/images/icons/frontbox-white.svg"
import ImageCloud from "@/assets/images/icons/cloud.svg"


interface Kid {
    id: string;
    name: string;
    age: number;
    avatar_url?: any;
    [key: string]: any;
}
import IconProfile from "@/assets/images/parent/footer/icon-profile.svg"
import { tabData } from '@/data/parent/dashboardData';

const downloadIcon = require('@/assets/images/parent/icon-download.png')
const editIcon = require('@/assets/images/parent/icon-edit.png')
const cakeIcon = require('@/assets/images/parent/icon-cake.png')
const information_circle = require('@/assets/images/parent/information_circle.png')
const plusIcon = require('@/assets/images/parent/icon-plus.png')

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL'
type User = {
    id: string;
    email: string;
    name: string;
    avatar_url?: string;
    phonenumber?: string;
    // Add other user fields as needed
};
const AccountSettings = () => {
    const router = useRouter();
    const [user, setUser] = React.useState<User>({ id: '', email: '', name: '' });
    const tabs = tabData;

    const [fname, setFName] = React.useState('');
    const [lname, setLName] = React.useState('');
    const [pnumber, setPNumber] = React.useState('');
    const [modalVisible, setModalVisible] = React.useState(false);
    const children = useChildrenStore((state: any) => state.children);
    const [activeChild, setActiveChild] = React.useState(children[0]);
    const [activeTab, setActiveTab] = React.useState('account');
    const [avatar, setAvatar] = React.useState('');
    const setChildren = useChildrenStore((state: any) => state.setChildren);
    const starIcon = require('@/assets/images/parent/icon-star.png')


    useEffect(() => {
        // Prefill parent info when user changes
        async function getUser() {
            const jwt = supabase.auth.getSession && (await supabase.auth.getSession())?.data?.session?.access_token;
            const { data, error } = await supabase.functions.invoke('user/getUser', {
                method: 'GET',
                headers: {
                    Authorization: jwt ? `Bearer ${jwt}` : '',
                },
            });
            if (error) {
                alert('Error fetching children:' + error.message);
                return;
            }
            if (data) {
                setUser(data.data);
                const user = data.data
                setFName(user.name?.split(' ')[0] ?? '');
                setLName(user.name?.split(' ')[1] ?? '');
                setPNumber(user.phone_number ?? '');
                setAvatar(user?.avatar_url || null)
            }
        }
        // Fetch children data from Supabase edge function and sync Zustand store
        async function fetchChildren() {
            if (!user?.id) return;
            const jwt = supabase.auth.getSession && (await supabase.auth.getSession())?.data?.session?.access_token;
            const { data, error } = await supabase.functions.invoke('children', {
                method: 'GET',
                headers: {
                    Authorization: jwt ? `Bearer ${jwt}` : '',
                },
            });
            if (error) {
                console.error('Error fetching children:', error.message);
                return;
            }
            if (data && Array.isArray(data.data)) {
                setChildren(data.data);
                setActiveChild(data.data[0]);
            }
        }
        getUser()
        fetchChildren();
    }, []);


    function handleAddButton() {
        if (children.length < 4) {
            router.push('./addChild');
        }
    }

    function handleEditButton(kid: any) {
        const index = children.findIndex((c: any) => c.id === kid.id);
        router.push(`./editChild?index=${index}`);
    }
    const handleTabPress = (tabId: string) => {
        if (tabId === 'account') handleItemProcess('account');
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

    const onUpload = async (publicUrl: string) => {
        // Update user profile in DB
        const { error: updateError } = await supabase
            .from('users')
            .update({ avatar_url: publicUrl })
            .eq('id', user?.id);
        if (updateError) throw updateError;

        setAvatar(publicUrl)
    }



    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(5, 59, 74, 1)' }}>
                <ThemedView style={{ flex: 1, position: 'relative', backgroundColor: 'rgba(5, 59, 74, 1)' }}>
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

                        <IconFrontbox
                            width={500}
                            height={'100%'}
                            style={styles.profileFrontBox}
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
                                contentFit="fill"
                            />
                            <Image
                                source={require("@/assets/images/kid/cloud-group-near.png")}
                                style={styles.imgCloudNear}
                                contentFit="fill"
                            />
                        </ThemedView>

                        {/* Main Content */}
                        <ThemedView style={styles.settingContentStyle}>
                            <ThemedText style={styles.settingHeader}>Settings</ThemedText>

                            {/* Tab Navigation */}
                            <TabBar
                                tabs={tabs}
                                activeTab={activeTab}
                                onTabPress={handleTabPress}
                            />

                            <DropDownMenu activeItem={activeTab} onSelect={(item) => handleItemProcess(item)} />
                            <ThemedView style={styles.tabContent} >
                                <ThemedView style={styles.container}>

                                    {/* Parent Mode Header */}
                                    <ThemedView style={styles.parentStyle}>
                                        <ThemedView style={styles.modeRow}>
                                            <IconParent2
                                                width={45}
                                                height={40}
                                                style={styles.icon}
                                            />
                                            <ThemedText style={styles.modeText}>Parent Mode</ThemedText>
                                        </ThemedView>

                                        {/* Picture Section */}
                                        <ThemedText style={styles.sectionTitle}>Picture</ThemedText>


                                        <ThemedView style={styles.avatarWrapper}>
                                            {
                                                avatar ?
                                                    <Image
                                                        source={{ uri: avatar }}
                                                        style={styles.avatar}
                                                    />
                                                    :
                                                    <IconParent3
                                                        width={160}
                                                        height={160}
                                                        style={styles.avatar}
                                                    />
                                            }
                                        </ThemedView>

                                        <AvatarUploader
                                            user={user}
                                            setUser={setUser}
                                            onUpload={(publicUrl) => onUpload(publicUrl)}
                                        />
                                        <ThemedText style={styles.recommendationText}>
                                            At least 800x800px recommended{'\n'}
                                            JPG or PNG and GIF is allowed,
                                        </ThemedText    >

                                        {/* General Info */}
                                        <ThemedText style={styles.sectionTitle}>General</ThemedText>

                                        <ThemedView style={styles.inputWrapper}>
                                            <ThemedText style={styles.inputLabel}>First Name</ThemedText>
                                            <TextInput
                                                placeholder="Enter First Name"
                                                value={fname}
                                                onChangeText={setFName}
                                                placeholderTextColor="rgba(5,59,74,0.20)"
                                                style={styles.input} />
                                        </ThemedView>

                                        <ThemedView style={styles.inputWrapper}>
                                            <ThemedText style={styles.inputLabel}>Last Name</ThemedText>
                                            <TextInput
                                                placeholder="Enter Last Name"
                                                value={lname}
                                                onChangeText={setLName}
                                                placeholderTextColor="rgba(5,59,74,0.20)"
                                                style={styles.input} />
                                        </ThemedView>

                                        <ThemedView style={styles.inputWrapper}>
                                            <ThemedText style={styles.inputLabel}>Phone</ThemedText>
                                            <TextInput
                                                placeholder="Enter Phone"
                                                value={pnumber}
                                                onChangeText={setPNumber}
                                                placeholderTextColor="rgba(5,59,74,0.20)"
                                                style={styles.input} />
                                        </ThemedView>
                                    </ThemedView>
                                    {/* All Kids */}

                                    <ThemedView>
                                        <ThemedText style={styles.sectionTitle}>All Your Kids</ThemedText>
                                        <ThemedView>

                                            {children.map((kid: Kid, index: number) => (
                                                <ThemedView key={index} style={styles.kidContainer}>
                                                    <ThemedView style={styles.header}>
                                                        {
                                                            kid.avatar_url ? <Image source={{ uri: kid.avatar_url }} style={styles.kid_avatar} /> : <IconParent3
                                                                width={60}
                                                                height={60}
                                                                style={styles.kid_avatar}
                                                            />
                                                        }
                                                        <ThemedText style={styles.name}>{kid.name}</ThemedText>
                                                        <ThemedView style={styles.infoIcons}>
                                                            <IconAge width={24} height={24} />
                                                            <ThemedText style={styles.age}>{kid.age}</ThemedText>
                                                        </ThemedView>
                                                        <TouchableOpacity style={styles.iconButton} onPress={() => handleEditButton(kid)}>
                                                            <IconEdit width={24} height={24} color={"#053B4A"} />
                                                        </TouchableOpacity>
                                                    </ThemedView>

                                                    <ThemedView style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                                        <ThemedText style={[styles.inputLabel, { marginBottom: 0 }]}>Learning Mode</ThemedText>
                                                        <IconInformation width={16} height={16} color={"#053B4A"} />
                                                    </ThemedView>

                                                    <ThemedView style={styles.modesStyle}>
                                                        <ModeList active={kid} mode='light' selectActiveChild={setActiveChild} />
                                                    </ThemedView>
                                                </ThemedView>
                                            ))}
                                            <TouchableOpacity
                                                style={[styles.addButton, children.length >= 4 && { display: 'none' }]}
                                                onPress={handleAddButton}
                                            >
                                                <Image source={plusIcon} style={{ width: 18, height: 18 }} />
                                                <ThemedText style={{ fontSize: 16, color: '#053B4A' }}>Add One More Kid</ThemedText>
                                            </TouchableOpacity>
                                        </ThemedView>

                                    </ThemedView>

                                </ThemedView>
                            </ThemedView>

                        </ThemedView>
                    </ScrollView>
                </ThemedView>
            </SafeAreaView>
            <BottomNavBar
                role="parent"
                image={true}
                theme="darkImage"
                active="Profile" />
        </>
    );
};

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
    topBackPattern: {
        width: "100%",
        height: 400,
        position: "absolute",
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
    settingContentStyle: {
        paddingHorizontal: 3,
        zIndex: 10,
        paddingBottom: 100,
        marginTop: -100
    },
    profileFrontBox: {
        position: "absolute",
        top: 190,
        zIndex: 10,
        maxWidth: 554
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
        overflow: 'hidden',

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
    settingHeader: {
        color: 'rgba(5, 59, 74, 1)',
        fontSize: 28,
        fontWeight: 700,
        lineHeight: 36,
        textAlign: 'center'
    },
    container: {
        paddingVertical: 30,
        paddingHorizontal: 14,
        backgroundColor: 'white',
        flex: 1,
        paddingBottom: 50,
        marginBottom: 25
    },
    modeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    icon: {
        marginRight: 8,
    },
    modeText: {
        fontSize: 18,
        fontWeight: 700,
        color: '#053B4A',
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 700,
        color: '#053B4A',
        marginBottom: 30,
    },
    avatarWrapper: {
        marginBottom: 20,
    },
    avatar: {
        borderRadius: 100,
        backgroundColor: '#B2E0E4',
    },
    uploadButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        borderColor: '#053B4A',
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 30,
        alignItems: 'center',
        width: 180,
        marginBottom: 20,
    },
    uploadButtonText: {
        color: '#053B4A',
        fontWeight: 400,
    },
    recommendationText: {
        color: 'rgba(5, 59, 74, 0.5)',
        marginBottom: 20,
    },
    icon_18: {
        width: 18,
        height: 18
    },
    inputWrapper: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: 700,
        color: '#053B4A',
        marginBottom: 10,
    },
    modeIcon: {
        width: 16,
        height: 16,
        tintColor: 'rgba(5, 59, 74, 1)'
    },
    input: {
        borderWidth: 1,
        borderColor: '#B2E0E4',
        borderRadius: 8,
        paddingHorizontal: 20,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: '#F9FCFC',
        outlineWidth: 0
    },
    parentStyle: {
        marginBottom: 30
    },
    kidContainer: {
        marginBottom: 30,
        borderBottomColor: '#eee',
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 20,
        marginBottom: 20
    },
    kid_avatar: {
        width: 60,
        height: 60,
        borderRadius: 50,
    },

    name: {
        fontSize: 18,
        fontWeight: '700',
        color: '#053B4A',
    },
    age: {
        fontSize: 18,
        color: 'rgba(244, 166, 114, 1)'
    },
    infoIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },

    modesStyle: {
        marginTop: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,

    },
    addButton: {
        borderWidth: 1,
        borderRadius: 30,
        borderColor: 'rgba(5, 59, 74, 0.5)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        gap: 10,
        justifyContent: 'center'
    },
    iconButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        gap: 10,
        justifyContent: 'center'
    }
});

export default AccountSettings;
