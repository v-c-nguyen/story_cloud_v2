import supabase from '@/app/lib/supabase';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '../ThemedText';

interface AvatarUploaderProps {
    user?: any;
    onUpload: (publicUrl: string) => void;
    setUser?: (user: any) => void;
}


import IconDownload from "@/assets/images/icons/icon-download.svg"

const AvatarUploader: React.FC<AvatarUploaderProps> = ({ user, onUpload, setUser }) => {
    const [uploading, setUploading] = useState(false);

    const handleUploadAvatar = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert('Permission to access media library is required!');
            return;
        }
        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.3,
            base64: true,
        });
        if (pickerResult.canceled || !pickerResult.assets || !pickerResult.assets[0].base64) return;
        setUploading(true);
        try {
            const base64 = pickerResult.assets[0].base64;
            const fileName = `${user?.id}_${Date.now()}.jpg`;
            const jwt = supabase.auth.getSession && (await supabase.auth.getSession())?.data?.session?.access_token;
            // Send base64 to Edge Function
            const response = await fetch(`https://fzmutsehqndgqwprkxrm.supabase.co/functions/v1/upload-avatar`, {
                method: 'POST',
                body: JSON.stringify({
                    base64,
                    fileName,
                    userId: user?.id,
                }),
                headers: {
                    Authorization: jwt ? `Bearer ${jwt}` : '',
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            const publicUrl = data?.publicUrl;
            if (!publicUrl) throw new Error('No public URL returned');

            if (setUser && user && typeof user === 'object') {
                setUser({ ...user, avatar_url: publicUrl });
            }
            onUpload(publicUrl);
        } catch (e: any) {
            alert('Upload failed: ' + (e?.message || e));
        } finally {
            setUploading(false);
        }
    };

    return (
        <React.Fragment>
            <TouchableOpacity style={styles.uploadButton} onPress={handleUploadAvatar} disabled={uploading}>
                <IconDownload width={24} height={24} />
                <ThemedText style={styles.uploadButtonText}>{uploading ? ' Uploading...' : ' Upload New Image'}</ThemedText>
            </TouchableOpacity>
        </React.Fragment>
    );
};

const styles = StyleSheet.create({

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
        width: 45,
        height: 40,
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
        gap: 5,
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
export default AvatarUploader;