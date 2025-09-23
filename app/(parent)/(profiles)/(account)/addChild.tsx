import supabase from '@/app/lib/supabase';
import AvatarUploader from '@/components/AvatarUploader/AvatarUploader';
import BottomNavBar from '@/components/BottomNavBar';
import Header from '@/components/Header';
import MyModal from '@/components/Modals/PlanUpdatedModal';
import { ModeList } from '@/components/ModeList';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useChildrenStore } from '@/store/childrenStore';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity
} from 'react-native';
import IconProfile from "@/assets/images/parent/footer/icon-profile.svg";
import IconInformation from "@/assets/images/parent/icon-information.svg";
import IconTick from "@/assets/images/icons/icon-tick.svg";
import IconCancel from "@/assets/images/parent/icon-cancel.svg";
import IconDefaultAvatar from "@/assets/images/icons/icon-parent-3.svg"
import useIsMobile from '@/hooks/useIsMobile';

interface Child {
    name?: string;
    age?: number;
    mode?: string;
    avatar_url?: string;
}

const AddChild = () => {
    const isMobile = useIsMobile();
    const router = useRouter();
    const addChildToStore = useChildrenStore(state => state.addChild);
    const [firstName, setFirstName] = React.useState('');
    const [age, setAge] = React.useState('');
    const [child, setChild] = React.useState<Child>({ mode: 'free' }); // Default mode set to 'free'
    const [avatar, setAvatar] = React.useState('');
    const [modalVisible, setModalVisible] = React.useState(false);
    const [uploading, setUploading] = React.useState(false);
    // ModeList should update learningMode
    function handleSaveButton() {
        saveChild();
    }
    const starIcon = require('@/assets/images/parent/icon-star.png')

    async function saveChild() {
        // Get JWT token
        const jwt = supabase.auth.getSession && (await supabase.auth.getSession())?.data?.session?.access_token;

        // Validate required fields
        if (!firstName.trim()) {
            alert('Please enter both first and last name.');
            return;
        }
        if (!age.trim() || isNaN(Number(age)) || Number(age) <= 0) {
            alert('Please enter a valid age.');
            return;
        }
        if (!child.mode || typeof child.mode !== 'string' || !child.mode.trim()) {
            alert('Please select a learning mode.');
            return;
        }
        // Use entered values and correct field names
        const childData = {
            name: firstName.trim(),
            avatar_url: avatar || "", // fallback to default
            age: Number(age),
            mode: child.mode,
        };

        // Call edge function
        let response;
        try {
            const fetchResponse = await fetch('https://fzmutsehqndgqwprkxrm.supabase.co/functions/v1/children', {
                method: 'POST',
                body: JSON.stringify(childData),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: jwt ? `Bearer ${jwt}` : '',
                }
            });
            const data = await fetchResponse.json();
            if (fetchResponse.ok && data) {
                // Add to Zustand store
                addChildToStore(data.data);
                // Redirect on success
                // router.push('../');
                setModalVisible(true)

            } else {
                alert(data?.error || 'Failed to save child');
            }
        } catch (e) {
            // Fallback to fetch if supabase.functions.invoke fails
            alert(e || 'Failed to save child');
        }
    }

    function handleCancelButton() {
        router.push('../')
    }

    const onUpload = async (publicUrl: string) => {
        setAvatar(publicUrl)
    }
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(5, 59, 74, 1)' }}>
                <ThemedView style={{ flex: 1, backgroundColor: 'white' }}>
                    <ScrollView
                        style={styles.rootContainer}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 55 }}
                    >
                        {/* Header */}
                        <Header
                            icon={IconProfile}
                            role="parent"
                            title="Profile Settings"
                            theme="light"
                        ></Header>
                        <ThemedView style={[styles.container, styles.tabContent]}>

                            <MyModal
                                visible={modalVisible}
                                title="Your Child was added successfully!"
                                content='You can manage kids mode in their settings'
                                buttonText='Back to Profile'
                                onClose={() => { setModalVisible(false), router.push('../') }}
                                starIcon={starIcon}
                            />
                            {/* Parent Mode Header */}
                            <ThemedView style={styles.parentStyle}>
                                {/* Picture Section */}
                                <ThemedView style={{ flexDirection: "row", justifyContent: isMobile ? "center" : "space-between", alignItems: "center" }}>
                                    <ThemedText style={styles.sectionTitle}>Add New Kid</ThemedText>
                                    {
                                        !isMobile &&
                                        <ThemedView style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                                            <TouchableOpacity style={[styles.addButton, { backgroundColor: "#F4A672", borderWidth: 0, marginRight: 10 }]} onPress={handleSaveButton}>
                                                <IconTick width={18} height={18} />
                                                <ThemedText style={{ fontSize: 16, color: '#053B4A' }}> Save </ThemedText>
                                            </TouchableOpacity>
                                            <ThemedText style={{ color: "#053b4a3b", fontSize: 30 }}>|</ThemedText>
                                            <TouchableOpacity style={[styles.addButton, { borderWidth: 0 }]} onPress={handleCancelButton}>
                                                <IconCancel width={18} height={18} />
                                                <ThemedText style={{ fontSize: 16, color: '#053B4A' }}> Cancel </ThemedText>
                                            </TouchableOpacity>
                                        </ThemedView>
                                    }
                                </ThemedView>

                                <ThemedView style={{ flexDirection: isMobile ? "column" : "row", gap: 10 }}>
                                    <ThemedView style={styles.avatarWrapper}>
                                        {
                                            avatar || child.avatar_url ?
                                                <Image source={{ uri: avatar || child.avatar_url }} style={styles.avatar} />
                                                :
                                                <IconDefaultAvatar width={160} height={160} />

                                        }
                                    </ThemedView>

                                    <ThemedView style={{ flexDirection: "column", justifyContent: "center" }}>
                                        <ThemedView style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                            <AvatarUploader
                                                onUpload={(publicUrl) => onUpload(publicUrl)}
                                            />
                                        </ThemedView>
                                        <ThemedText style={styles.recommendationText}>
                                            At least 800x800px recommended{'\n'}
                                            JPG or PNG and GIF is allowed,
                                        </ThemedText>
                                    </ThemedView>
                                </ThemedView>
                                {/* General Info */}

                                <ThemedView style={{ flexDirection: isMobile ? "column" : "row", gap: 10 }}>
                                    <ThemedView style={[styles.inputWrapper, !isMobile && { width: "50%" }]}>
                                        <ThemedText style={styles.inputLabel}>First Name</ThemedText>
                                        <TextInput
                                            placeholder="Enter First Name"
                                            placeholderTextColor="rgba(5,59,74,0.20)"
                                            style={styles.input}
                                            value={firstName}
                                            onChangeText={setFirstName}
                                        />
                                    </ThemedView>

                                    <ThemedView style={[styles.inputWrapper, !isMobile && { width: "50%" }]}>
                                        <ThemedText style={styles.inputLabel}>Age</ThemedText>
                                        <TextInput
                                            placeholder="Enter Age"
                                            placeholderTextColor="rgba(5,59,74,0.20)"
                                            style={styles.input}
                                            keyboardType="numeric"
                                            value={age}
                                            onChangeText={text => setAge(text)}
                                        />
                                    </ThemedView>
                                </ThemedView>
                            </ThemedView>
                            {/* All Kids */}
                            <ThemedView style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <ThemedText style={[styles.inputLabel, { marginBottom: 0 }]}>Learning Mode</ThemedText>
                                <IconInformation width={16} height={16} color={"#053B4A"} style={styles.modeIcon} />
                            </ThemedView>
                            <ThemedView>
                                <ThemedView style={styles.modesStyle}>
                                    {/* ModeList should call setLearningMode with the selected mode */}
                                    <ModeList active={child} mode='light' selectActiveChild={setChild} />
                                </ThemedView>
                            </ThemedView>

                            <ThemedView style={[styles.flexRow, { marginTop: 20 }]}>
                                {
                                    isMobile &&
                                    <ThemedView style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                                        <TouchableOpacity style={[styles.addButton]} onPress={handleSaveButton}>
                                            <IconTick width={18} height={18} />
                                            <ThemedText style={{ fontSize: 16, color: '#053B4A' }}> Save </ThemedText>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.addButton]} onPress={handleCancelButton}>
                                            <IconCancel width={18} height={18} />
                                            <ThemedText style={{ fontSize: 16, color: '#053B4A' }}> Cancel </ThemedText>
                                        </TouchableOpacity>
                                    </ThemedView>
                                }
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
};

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        position: "relative",
    },
    container: {
        backgroundColor: 'white',
        flex: 1,
        paddingVertical: 15,
        marginVertical: 15,
        paddingHorizontal: 10,
        marginHorizontal: 3,
        paddingBottom: 50,
        marginBottom: 100
    },
    modeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    tabContent: {
        marginHorizontal: 1,
        borderWidth: 2,
        borderColor: 'rgba(122, 193, 198, 0.2)',
        borderRadius: 20,
    },
    icon: {
        width: 45,
        height: 40,
        marginRight: 8,
    },
    modeText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#053B4A',
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#053B4A',
        textAlign: 'center',
        marginBottom: 30,
    },
    avatarWrapper: {
        marginBottom: 20,
        alignItems: 'center'
    },
    avatar: {
        width: 160,
        height: 160,
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
        margin: 'auto',
        marginBottom: 20,
    },
    uploadButtonText: {
        color: '#053B4A',
        fontWeight: '400'
    },
    recommendationText: {
        color: 'rgba(5, 59, 74, 0.5)',
        marginBottom: 20,
        textAlign: 'center'
    },
    inputWrapper: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '700',
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
        borderRadius: 20,
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
    flexRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 10,
    }
});

export default AddChild;