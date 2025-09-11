import supabase from '@/app/lib/supabase';
import AvatarUploader from '@/components/AvatarUploader/AvatarUploader';
import BottomNavBar from '@/components/BottomNavBar';
import Header from '@/components/Header';
import { ModeList } from '@/components/ModeList';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useChildrenStore } from '@/store/childrenStore';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity
} from 'react-native';
import IconProfile from "@/assets/images/parent/footer/icon-profile.svg";

const downloadIcon = require('@/assets/images/parent/icon-download.png')
const editIcon = require('@/assets/images/parent/icon-edit.png')
const information_circle = require('@/assets/images/parent/information_circle.png')
const tickIcon = require('@/assets/images/parent/icon-tick.png')
const trashIcon = require('@/assets/images/parent/trash-icon.png')
const miaAvatar = require('@/assets/images/parent/mia_120.png')
const cancelIcon = require('@/assets/images/parent/icon-cancel.png')

const EditChild = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const childIndex = params.index ? Number(params.index) : 0;
    const children = useChildrenStore(state => state.children);
    const updateChildInStore = useChildrenStore(state => state.updateChild);
    const removeChildInStore = useChildrenStore(state => state.removeChild);
    const [kid, setKid] = React.useState(children[childIndex] || children[0] || {});
    const [firstName, setFirstName] = React.useState(kid.name ?? '');
    const [age, setAge] = React.useState(kid.age?.toString() ?? '');
    const [avatar, setAvatar] = React.useState(kid.avatar_url ?? '');
    const [isDirty, setIsDirty] = React.useState(false);

    // For ModeList, update mode in kid state
    const handleModeChange = (newKid: any) => {
        setKid((prev: any) => ({ ...prev, ...newKid }));
    };

    // Track changes to child data
    useEffect(() => {
        if (
            firstName !== (kid.name ?? '') ||
            age !== (kid.age?.toString() ?? '') ||
            kid.mode !== (children[childIndex]?.mode ?? '')
        ) {
            setIsDirty(true);
        } else {
            setIsDirty(false);
        }
    }, [firstName, age, kid.mode]);


    async function handleRemoveButton() {
        const jwt = supabase.auth.getSession && (await supabase.auth.getSession())?.data?.session?.access_token;

        // Call edge function with DELETE /children/:id
        try {
            const response = await fetch(`https://fzmutsehqndgqwprkxrm.supabase.co/functions/v1/children/${kid.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: jwt ? `Bearer ${jwt}` : '',
                },
            });
            const result = await response.json();
            if (!response.ok) {
                alert('Failed to remove child: ' + (result.msg || response.statusText));
                return;
            }
            // Update Zustand store to remove child
            removeChildInStore(childIndex);
            router.push('../');
        } catch (error) {

        }
    }

    async function handleSaveButton() {
        // Get JWT token
        const jwt = supabase.auth.getSession && (await supabase.auth.getSession())?.data?.session?.access_token;

        // Validate required fields
        if (!firstName.trim()) {
            alert('Please enter first name.');
            return;
        }
        if (!age.trim() || isNaN(Number(age)) || Number(age) <= 0) {
            alert('Please enter a valid age.');
            return;
        }
        if (!kid.mode || typeof kid.mode !== 'string' || !kid.mode.trim()) {
            alert('Please select a learning mode.');
            return;
        }

        // Prepare updated child data
        const updatedChild = {
            ...kid,
            name: firstName + (kid.name?.split(' ')[1] ? ' ' + kid.name.split(' ')[1] : ''),
            avatar_url: avatar || '',
            age: Number(age),
            mode: kid.mode,
        };

        // Call edge function with PUT /children/:id
        try {
            const response = await fetch(`https://fzmutsehqndgqwprkxrm.supabase.co/functions/v1/children/${kid.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: jwt ? `Bearer ${jwt}` : '',
                },
                body: JSON.stringify(updatedChild),
            });
            const result = await response.json();
            if (!response.ok) {
                alert('Failed to update child: ' + (result.msg || response.statusText));
                return;
            }
            // Update Zustand store with new child data
            updateChildInStore(childIndex, result.data);
            // Optional: log response for debugging
            router.push('../');
        } catch (error) {
            alert('Error updating child: ' + error);
        }
    }
    // Avatar upload handler

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

                            {/* Parent Mode Header */}
                            <ThemedView style={styles.parentStyle}>
                                {/* Picture Section */}
                                <ThemedText style={styles.sectionTitle}>{firstName}</ThemedText>

                                <ThemedView style={styles.avatarWrapper}>
                                    <Image
                                        source={avatar ? { uri: avatar } : require('@/assets/images/parent/avatar-parent-2.png')}
                                        style={styles.avatar}
                                    />
                                </ThemedView>
                                <ThemedView style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    <AvatarUploader
                                        onUpload={(publicUrl) => onUpload(publicUrl)}
                                        user={kid}
                                        setUser={setKid}
                                    />
                                </ThemedView>
                                <ThemedText style={styles.recommendationText}>
                                    At least 800x800px recommended{'\n'}
                                    JPG or PNG and GIF is allowed,
                                </ThemedText>

                                {/* General Info */}
                                <ThemedView style={styles.inputWrapper}>
                                    <ThemedText style={styles.inputLabel}>Name</ThemedText>
                                    <TextInput
                                        placeholder="Enter First Name"
                                        placeholderTextColor="rgba(5,59,74,0.20)"
                                        style={styles.input}
                                        value={firstName}
                                        onChangeText={setFirstName}
                                    />
                                </ThemedView>

                                <ThemedView style={styles.inputWrapper}>
                                    <ThemedText style={styles.inputLabel}>Age</ThemedText>
                                    <TextInput
                                        placeholder="Enter Age"
                                        placeholderTextColor="rgba(5,59,74,0.20)"
                                        style={styles.input}
                                        keyboardType="numeric"
                                        value={age}
                                        onChangeText={setAge}
                                    />
                                </ThemedView>
                            </ThemedView>
                            {/* All Kids */}
                            <ThemedView style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <ThemedText style={[styles.inputLabel, { marginBottom: 0 }]}>Learning Mode</ThemedText>
                                <Image source={information_circle} style={styles.modeIcon}></Image>
                            </ThemedView>
                            <ThemedView>
                                <ThemedView style={styles.modesStyle}>
                                    <ModeList active={kid} mode='light' selectActiveChild={handleModeChange} />
                                </ThemedView>
                            </ThemedView>

                            <ThemedView style={[styles.flexRow, { marginTop: 20 }]}>
                                <TouchableOpacity style={styles.addButton} onPress={handleCancelButton}>
                                    <Image source={cancelIcon} style={{ width: 16, height: 16 }} />
                                    <ThemedText style={{ fontSize: 16, color: '#053B4A' }}>Cancel</ThemedText>
                                </TouchableOpacity>

                                {isDirty ?
                                    <TouchableOpacity style={[styles.addButton,{backgroundColor: "#F4A672", borderWidth: 0}]} onPress={handleSaveButton}>
                                        <Image source={tickIcon} style={{ width: 22, height: 22 }} />
                                        <ThemedText style={{ fontSize: 16, color: '#053B4A' }}>Save Child</ThemedText>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity style={styles.addButton} onPress={handleRemoveButton}>
                                        <Image source={trashIcon} style={{ width: 22, height: 22 }} />
                                        <ThemedText style={{ fontSize: 16, color: '#053B4A' }}>Remove Child</ThemedText>
                                    </TouchableOpacity>
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
        width: '46%',
        borderColor: 'rgba(5, 59, 74, 0.5)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        gap: 10,
        justifyContent: 'center'
    },
    flexRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    }
});

export default EditChild;