import { useChildrenStore } from '@/store/childrenStore';
import { useLearningCategoryStore } from '@/store/learningCategoryStore';
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { FlatList, ScrollView, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Image } from 'expo-image';
import { ChildrenCard } from './ChildrenCard';
import { LearningTargetCard } from './LearningTargetCard';
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import GradientText from './ui/GradientText';
import GradientBorderBox from './ui/GradientBorderBox';
import supabase from '@/app/lib/supabase';

const focusIcon = require('@/assets/images/parent/icon-focus.png');


import IconEdit from "@/assets/images/parent/icon-edit.svg";
import IconDetail from "@/assets/images/parent/icon-detailBtn.svg"
import IconStep from "@/assets/images/parent/icon-step.svg"
import IconFocus from "@/assets/images/parent/icon-focus.svg"
import IconCancel from "@/assets/images/parent/icon-cancel.svg"
import IconPlus from "@/assets/images/parent/icon-plus.svg"
import IconClock from "@/assets/images/parent/icon-clock.svg"
import IconDate from "@/assets/images/parent/icon-date.svg"
import IconHappy from "@/assets/images/parent/icon-happy.svg"
import IconDoc from "@/assets/images/parent/icon-doc.svg"
import IconTop from "@/assets/images/parent/icon-top.svg"
import IconInformation from "@/assets/images/parent/icon-information.svg"
import IconCheck from "@/assets/images/parent/icon-check.svg"

interface Child {
    id: string,
    name: string,
    age: number,
    mode: string,
    avatar_url?: string
}

export function FocusCard({ focus, handleEditButton, handleViewButton }: { focus: any, handleEditButton: (id: string) => void, handleViewButton: (id: string) => void }) {
    // Format date if available
    const formattedDate = focus?.created_at
        ? new Date(focus.created_at).toLocaleDateString()
        : '';
    useEffect(() => {
    }, [])
    return (
        <ThemedView style={styles.container}>
            <Image
                source={require("@/assets/images/parent/parent-back-pattern.png")}
                style={styles.topBackPattern}
                contentFit="cover"
            />
            <ThemedView style={styles.overview}>
                <IconFocus width={27} height={27} />
                <ThemedText style={styles.title}>{focus?.name}</ThemedText>
            </ThemedView>

            <ThemedView style={styles.pathwayCard}>
                <ThemedView style={[styles.lengthContainer, { borderBottomWidth: 1, borderColor: 'rgba(252, 252, 252, 0.2)' }]}>
                    <ThemedView style={styles.flexRow}>
                        <ThemedView style={[styles.iconBtnCircle, { padding: 8 }]}>
                            <IconDate style={{ width: 21, height: 21 }} />
                        </ThemedView>
                        <GradientText text='Date' />
                        <ThemedText style={styles.lengthText}>{formattedDate}</ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.flexRow}>
                        <TouchableOpacity
                            style={styles.iconBtn}
                            onPress={() => handleEditButton(focus.id)}
                        >
                            <IconEdit style={{ width: 24, height: 24 }} color={'rgba(122, 193, 198, 1)'} />
                        </TouchableOpacity>
                        <ThemedText style={{ color: 'rgba(122, 193, 198, 0.5)' }}> | </ThemedText>
                        <TouchableOpacity
                            style={[styles.iconBtn, styles.iconBtnCircle]}
                            onPress={() => handleViewButton(focus.id)}
                        >
                            <IconDetail style={{ width: 24, height: 24 }} />
                        </TouchableOpacity>
                    </ThemedView>
                </ThemedView>
                <ThemedView style={[styles.lengthContainer, styles.flexCol]}>
                    <ThemedView style={[styles.flexCol, { width: '100%' }]}>
                        <ThemedView style={[styles.flexRow, { justifyContent: 'space-between' }]} >
                            <ThemedView style={styles.flexRow}>
                                <ThemedView>
                                    <GradientText text='Learning Categories' />
                                    {
                                        focus?.focusmodes_targets?.length > 0 && focus.focusmodes_targets.map((target: any, index: number) => (
                                            <GradientBorderBox
                                                key={index}
                                                borderRadius={12}
                                                borderWidth={1}
                                                style={{ marginTop: 10 }}
                                            >
                                                <ThemedText style={{ color: "white", fontWeight: "bold", fontSize: 14 }}>
                                                    {target.learning_categories?.name}
                                                </ThemedText>
                                            </GradientBorderBox>
                                        )
                                        )
                                    }
                                </ThemedView>
                            </ThemedView>
                        </ThemedView>
                    </ThemedView>

                    <ThemedView style={[styles.flexCol, { justifyContent: 'space-between', width: '100%', marginTop: 20 }]} >
                        <ThemedView style={styles.flexRow}>
                            <ThemedView style={[styles.iconBtnCircle, { padding: 8 }]}>
                                <IconHappy width={21} height={21} style={styles.ButtonIcon} />
                            </ThemedView>
                            <GradientText text='Children' />
                        </ThemedView>
                        {focus?.focusmodes_kids?.length > 0 && (
                            <FlatList
                                data={focus.focusmodes_kids}
                                horizontal
                                keyExtractor={(_, index) => index.toString()}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <GradientBorderBox
                                        borderRadius={24}
                                        borderWidth={1}
                                        style={styles.progressBar}
                                        innerStyle={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            paddingVertical: 3,
                                            gap: 10,
                                        }}
                                    >
                                        <Image
                                            style={styles.avatar}
                                            source={item.children.avatar_url ? { uri: item.children.avatar_url } : require('@/assets/images/parent/avatar-parent-2.png')} ></Image>
                                        <ThemedView style={styles.avatarOutline}>
                                            <IconCheck width={20} height={20} color={"#FCFCFC"} style={styles.checkAvatar} />
                                        </ThemedView>
                                    </GradientBorderBox>
                                )}
                            />
                        )}

                    </ThemedView>
                </ThemedView>

            </ThemedView>
        </ThemedView >
    );
}

export function FocusDetailedCard({
    focus,
    handleEditButton
}: { focus: any, handleEditButton: (id: string) => void }) {
    const router = useRouter();
    // Format date if available
    const formattedDate = focus?.created_at
        ? new Date(focus.created_at).toLocaleDateString()
        : '';
    function handleBack() {
        router.navigate("./")
    }
    return (
        <ThemedView style={[styles.container_detail]}>
            <Image
                source={require("@/assets/images/parent/parent-back-pattern.png")}
                style={styles.topBackPattern}
                contentFit="cover"
            />
            <ThemedView style={[styles.overview, { alignItems: 'center' }]}>
                <IconFocus width={27} height={27} />
                <ThemedText style={styles.title}>{focus?.name}</ThemedText>
            </ThemedView>

            <ThemedView style={styles.pathwayCard}>
                <ThemedView style={[styles.lengthContainer, { borderBottomWidth: 1, borderColor: 'rgba(252, 252, 252, 0.2)' }]}>
                    <ThemedView style={[styles.flexCol, { width: '100%' }]}>
                        <ThemedView style={[styles.flexRow, { justifyContent: 'space-between' }]} >
                            <ThemedView style={styles.flexRow}>
                                <ThemedView style={[styles.iconBtnCircle, { padding: 8 }]}>
                                    <IconDate width={21} height={21} style={styles.ButtonIcon} />
                                </ThemedView>
                                <GradientText text='Date' />
                                <ThemedText style={styles.lengthText}>
                                    {formattedDate}
                                </ThemedText>
                            </ThemedView>
                            <ThemedView style={styles.flexRow}>
                                <TouchableOpacity
                                    style={styles.iconBtn}
                                    onPress={() => handleEditButton(focus.id)}
                                >
                                    <IconEdit
                                        width={24}
                                        height={24}
                                        color={'rgba(122, 193, 198, 1)'}
                                        style={{ width: 18, height: 18 }}
                                    />
                                </TouchableOpacity>
                                <ThemedText style={{ color: 'rgba(122, 193, 198, 0.5)' }}> | </ThemedText>
                                <TouchableOpacity
                                    onPress={handleBack}
                                    style={[styles.iconBtn, styles.iconBtnCircle, styles.backOrange]}>
                                    <IconTop style={{ width: 24, height: 24 }}/>
                                </TouchableOpacity>
                            </ThemedView>
                        </ThemedView>
                        <ThemedView style={[styles.flexRow, { justifyContent: 'space-between' }]} >
                            <ThemedView style={styles.flexRow}>
                                <ThemedView style={[styles.iconBtnCircle, { padding: 8 }]}><IconFocus width={21} height={21} style={styles.ButtonIcon} /></ThemedView>
                                <GradientText text={focus?.name} />
                            </ThemedView>
                        </ThemedView>
                        <ThemedView style={[styles.flexRow, { justifyContent: 'space-between' }]} >
                            <ThemedView style={[styles.flexRow, { alignItems: 'flex-start' }]}>
                                <ThemedView style={[styles.iconBtnCircle, { padding: 8, marginTop: 8 }]}><IconDoc width={21} height={21} style={styles.ButtonIcon} /></ThemedView>
                                <ThemedView style={{ width: '90%' }}>
                                    <GradientText text='Description' />
                                    <ThemedText style={[styles.descriptionText, { paddingRight: 20 }]}>
                                        {focus?.description}
                                    </ThemedText>
                                </ThemedView>
                            </ThemedView>
                        </ThemedView>
                    </ThemedView>
                </ThemedView>

                <ThemedView style={[styles.lengthContainer, styles.flexCol]}>
                    <ThemedView style={[styles.flexCol, { width: '100%' }]}>
                        <ThemedView style={[styles.flexRow, { justifyContent: 'space-between' }]} >
                            <ThemedView style={styles.flexRow}>
                                <ThemedView>
                                    <GradientText text='Language Categories' />
                                    {
                                        focus?.focusmodes_targets?.length > 0 && focus.focusmodes_targets.map((target: any, index: number) => (
                                            <GradientBorderBox
                                                key={index}
                                                borderRadius={12}
                                                borderWidth={1}
                                                style={{ marginTop: 10 }}
                                            >
                                                <ThemedText style={{ color: "white", fontWeight: "bold", fontSize: 14 }}>
                                                    {target.learning_categories?.name}
                                                </ThemedText>
                                            </GradientBorderBox>
                                        )
                                        )
                                    }
                                </ThemedView>
                            </ThemedView>
                        </ThemedView>
                    </ThemedView>

                    <ThemedView style={[styles.flexCol, { justifyContent: 'space-between', width: '100%', marginTop: 20 }]} >
                        <ThemedView style={styles.flexRow}>
                            <ThemedView style={[styles.iconBtnCircle, { padding: 8 }]}><IconHappy width={21} height={21} style={styles.ButtonIcon} /></ThemedView>
                            <GradientText text='Children' />
                        </ThemedView>

                        {focus?.focusmodes_kids?.length > 0 && (
                            <FlatList
                                data={focus.focusmodes_kids}
                                horizontal
                                keyExtractor={(_, index) => index.toString()}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <GradientBorderBox
                                        borderRadius={24}
                                        borderWidth={1}
                                        style={styles.progressBar}
                                        innerStyle={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            paddingVertical: 3,
                                            gap: 10,
                                        }}
                                    >
                                        <Image
                                            style={styles.avatar}
                                            source={item.children.avatar_url ? { uri: item.children.avatar_url } : require('@/assets/images/parent/avatar-parent-2.png')} ></Image>
                                        <ThemedView style={styles.avatarOutline}>
                                            <IconCheck width={20} height={20} color={"#FCFCFC"} style={styles.checkAvatar}/>
                                        </ThemedView>
                                    </GradientBorderBox>
                                )}
                            />
                        )}

                    </ThemedView>
                </ThemedView>
            </ThemedView>
        </ThemedView >
    );
}

export function FocusEditCard({ focus }: { focus: any }) {
    const [allCategories, setAllCategories] = React.useState<any[]>([]);
    const [allChildren, setAllChildren] = React.useState<any[]>([]);

    const router = useRouter();
    const [loading, setLoading] = React.useState(false)
    const [editName, setEditName] = React.useState(false);
    const [editDescription, setEditDescription] = React.useState(false);
    const [name, setName] = React.useState(focus?.name || '');
    const [description, setDescription] = React.useState(focus?.description || '');
    const [categories, setCategories] = React.useState<string[]>([]);
    const [children, setChildren] = React.useState<Child[]>([]);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [modalType, setModalType] = React.useState<'category' | 'child' | null>(null);

    useEffect(() => {
        setName(focus?.name || '')
        setDescription(focus?.description || '')
        setCategories(
            focus?.focusmodes_targets
                ? focus.focusmodes_targets.map((t: any) => t.learning_categories?.name)
                : []
        );
        setChildren(
            focus?.focusmodes_kids
                ? focus.focusmodes_kids.map((t: any) => t.children)
                : []
        );

    }, [focus])

    // Remove category by index
    const handleRemoveCategory = (idx: number) => {
        setCategories(categories.filter((_, i) => i !== idx));
    };
    // Remove child by index
    const handleRemoveChild = (idx: number) => {
        setChildren(children.filter((_, i) => i !== idx));
    };
    async function fetchLearningTargets() {
        setLoading(true);
        try {
            const jwt = supabase.auth.getSession && (await supabase.auth.getSession())?.data?.session?.access_token;
            const { data, error } = await supabase.functions.invoke('learning_categories', {
                method: 'GET',
                headers: {
                    Authorization: jwt ? `Bearer ${jwt}` : '',
                },
            });
            if (error) {
                console.error('Error fetching learning categories:', error.message);
            } else if (data && Array.isArray(data.data)) {
                setAllCategories(data.data);
            }
        } catch (e) {
            console.error('Error fetching learning categories:', e);
        } finally {
            setLoading(false);
        }
    }
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
                setAllChildren(data.data);
            }
        } catch (e) {
            console.error('Error fetching children:', e);
        } finally {
            setLoading(false);
        }
    }
    // Show modal for add
    const handleAddCategory = () => {
        fetchLearningTargets();
        setModalType('category');
        setModalVisible(true);
    };
    const handleAddChild = () => {
        fetchChildren();
        setModalType('child');
        setModalVisible(true);
    };

    // Format date if available
    const formattedDate = focus?.created_at
        ? new Date(focus.created_at).toLocaleDateString()
        : '';

    function handleBack() {
        router.navigate("./")
    }
    function handleTargetSelected(id: string, name: string) {
        setCategories(prev => {
            const exists = prev.some(t => t.trim() === name.trim());
            if (exists) {
                return prev.filter(t => t.trim() !== name.trim());
            } else {
                return [...prev, name];
            }
        });
    }
    function handleChildSelected(child: Child) {
        setChildren(prev => {
            const exists = prev.some(t => t.id === child.id);
            if (exists) {
                return prev.filter(t => t.id !== child.id);
            } else {
                return [...prev, child];
            }
        });
    }

    return (
        <ThemedView style={[styles.container_detail]}>
            <Image
                source={require("@/assets/images/parent/parent-back-pattern.png")}
                style={styles.topBackPattern}
                contentFit='cover'
            />
            <ThemedView style={[styles.overview, { alignItems: 'center' }]}>
                <Image source={focusIcon} />
                <ThemedText style={styles.title}>{name}</ThemedText>
            </ThemedView>

            <ThemedView style={styles.focusEditCard}>
                <ThemedView style={[styles.lengthContainer, { borderBottomWidth: 1, borderColor: 'rgba(252, 252, 252, 0.2)' }]}>
                    <ThemedView style={[styles.flexCol, { width: '100%' }]}>
                        <ThemedView style={[styles.flexRow, { justifyContent: 'space-between' }]} >
                            <ThemedView style={styles.flexRow}>
                                <ThemedView style={[styles.iconBtnCircle, { padding: 8 }]}><IconDate width={21} height={21} style={styles.ButtonIcon} /></ThemedView>
                                <GradientText text='Date' />
                                <ThemedText style={styles.lengthText}>{formattedDate}</ThemedText>
                            </ThemedView>
                            <ThemedView style={styles.flexRow}>
                                <TouchableOpacity
                                    style={styles.iconBtn}
                                    onPress={() => setEditName(true)}
                                >
                                    <IconCancel color={'#F4A672'} style={{ width: 18, height: 18 }} />
                                </TouchableOpacity>
                                <ThemedText style={{ color: 'rgba(122, 193, 198, 0.5)' }}> | </ThemedText>
                                <TouchableOpacity
                                    onPress={handleBack}
                                    style={[styles.iconBtn, styles.iconBtnCircle, styles.backOrange]}>
                                    <IconTop style={{ width: 24, height: 24 }} />
                                </TouchableOpacity>
                            </ThemedView>
                        </ThemedView>
                        <ThemedView style={[styles.flexRow, { justifyContent: 'space-between' }]} >
                            <ThemedView style={styles.flexRow}>
                                <ThemedView style={[styles.iconBtnCircle, { padding: 8 }]}><Image source={focusIcon} style={styles.ButtonIcon} /></ThemedView>
                                {editName ? (
                                    <TextInput
                                        style={{
                                            color: 'white',
                                            fontSize: 16,
                                            marginRight: 8,
                                            backgroundColor: 'rgba(0,0,0,0.2)',
                                            borderWidth: 1,
                                            borderColor: '#9fd3c7',
                                            borderRadius: 8,
                                            padding: 6,
                                            marginTop: 8,
                                            marginBottom: 8,
                                            width: 180
                                        }}
                                        value={name}
                                        onChangeText={setName}
                                        onBlur={() => setEditName(false)}
                                        autoFocus
                                    />
                                ) : (
                                    <GradientText text={name} />
                                )}
                                <TouchableOpacity
                                    style={styles.iconBtn}
                                    onPress={() => setEditName(true)}
                                >
                                    <IconEdit
                                        color={'rgba(122, 193, 198, 1)'}
                                        style={{ width: 24, height: 24 }}
                                    />
                                </TouchableOpacity>
                            </ThemedView>
                        </ThemedView>
                        <ThemedView style={[styles.flexRow, { justifyContent: 'space-between' }]} >
                            <ThemedView style={[styles.flexRow, { alignItems: 'flex-start' }]}>
                                <ThemedView style={[styles.iconBtnCircle, { padding: 8, marginTop: 8 }]}><IconDoc width={21} height={21} style={styles.ButtonIcon} /></ThemedView>
                                <ThemedView style={{ width: '90%' }}>
                                    <ThemedView style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                        <GradientText text='Description' />
                                        <TouchableOpacity
                                            style={styles.iconBtn}
                                            onPress={() => setEditDescription(true)}
                                        >
                                            <IconEdit
                                                color={'rgba(122, 193, 198, 1)'}
                                                style={{ width: 24, height: 24 }}
                                            />
                                        </TouchableOpacity>
                                    </ThemedView>

                                    {editDescription ? (
                                        <TextInput
                                            style={{
                                                fontSize: 14,
                                                color: 'white',
                                                backgroundColor: 'rgba(0,0,0,0.2)',
                                                borderWidth: 1,
                                                borderColor: '#9fd3c7',
                                                borderRadius: 8,
                                                padding: 6,
                                                marginTop: 8,
                                                marginBottom: 8,
                                                width: 250,
                                                maxWidth: 280,
                                                height: 100,
                                                boxSizing: 'border-box',
                                            }}
                                            multiline
                                            numberOfLines={5}
                                            editable
                                            value={description}
                                            onChangeText={setDescription}
                                            onBlur={() => setEditDescription(false)}
                                            autoFocus
                                        />
                                    ) : (
                                        <ThemedText style={[styles.descriptionText, { paddingRight: 20, width: '100%', maxWidth: 280 }]}>
                                            {description}
                                        </ThemedText>
                                    )}
                                </ThemedView>
                            </ThemedView>
                        </ThemedView>
                    </ThemedView>
                </ThemedView>
                <ThemedView style={{ padding: 16 }}>
                    <ThemedView>
                        <GradientText text='Learning Categories' />
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}
                        >
                            {categories.length > 0 && categories.map((target: string, index: number) => (

                                <GradientBorderBox
                                    key={index}
                                    borderRadius={12}
                                    borderWidth={1}
                                    style={styles.categoryEditBtn}
                                >
                                    <ThemedView key={index} style={[styles.flexRow]}>
                                        <ThemedText style={[styles.categoryEditText]}>
                                            {target}
                                        </ThemedText>
                                        <TouchableOpacity onPress={() => handleRemoveCategory(index)}>
                                            <ThemedView style={styles.categoryEditIconContainer}>
                                                <IconCancel width={18} style={styles.categoryEditIcon} />
                                            </ThemedView>
                                        </TouchableOpacity>
                                    </ThemedView>
                                </GradientBorderBox>
                            ))}
                            <GradientBorderBox
                                borderRadius={12}
                                borderWidth={1}
                                style={styles.categoryEditBtn}
                            >

                                <ThemedView style={[styles.flexRow]}>
                                    <ThemedText style={[styles.categoryEditText]}>
                                        Add New Category
                                    </ThemedText>
                                    <TouchableOpacity onPress={handleAddCategory}>
                                        <ThemedView style={styles.categoryEditIconContainer}>
                                            <IconPlus style={styles.categoryEditIcon} />
                                        </ThemedView>
                                    </TouchableOpacity>
                                </ThemedView>
                            </GradientBorderBox>
                        </ScrollView>
                    </ThemedView>

                    <ThemedView style={{ width: '100%', marginTop: 20 }} >
                        <ThemedView style={[styles.flexRow]}>
                            <ThemedView style={[styles.iconBtnCircle, { padding: 8 }]}><IconHappy style={styles.ButtonIcon} /></ThemedView>
                            <GradientText text='Children' />
                        </ThemedView>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ flexDirection: 'row', marginTop: 20, gap: 10, alignItems: 'center' }}
                        >
                            {children.length > 0 && children.map((target: any, index: number) => (
                                <GradientBorderBox
                                    key={index}
                                    borderRadius={24}
                                    borderWidth={1}
                                    style={styles.progressBar}
                                    innerStyle={{ paddingVertical: 4 }}
                                >
                                    <ThemedView key={index} style={[styles.flexRow]}>
                                        <Image
                                            source={target?.avatar_url ? { uri: target.avatar_url } : require('@/assets/images/parent/avatar-parent-2.png')}
                                            style={styles.avatar}
                                            contentFit="cover"
                                        />
                                        <TouchableOpacity onPress={() => handleRemoveChild(index)}>
                                            <ThemedView style={styles.categoryEditIconContainer}>
                                                <IconCancel style={styles.categoryEditIcon} />
                                            </ThemedView>
                                        </TouchableOpacity>
                                    </ThemedView>
                                </GradientBorderBox>
                            ))}
                            <GradientBorderBox
                                borderRadius={24}
                                borderWidth={1}
                                style={styles.progressBar}
                                innerStyle={{ paddingVertical: 4 }}
                            >
                                <ThemedView style={[styles.flexRow]}>
                                    <ThemedText style={{ color: 'white' }}>Add</ThemedText>
                                    <TouchableOpacity onPress={handleAddChild}>
                                        <ThemedView style={styles.categoryEditIconContainer}>
                                            <IconPlus style={styles.categoryEditIcon} />
                                        </ThemedView>
                                    </TouchableOpacity>
                                </ThemedView>
                            </GradientBorderBox>

                        </ScrollView>
                        {/* Modal for adding category/child */}
                        {modalVisible && (
                            <ThemedView style={{
                                position: 'absolute',
                                top: -50,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(0,0,0,0.4)',
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 1000
                            }}>
                                <ThemedView style={{ backgroundColor: '#053B4A', borderRadius: 16, borderColor: '#add7da4d', borderWidth: 1, padding: 24, width: 300, minHeight: 200 }}>
                                    <ThemedText style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 16, color: 'white' }}>
                                        {modalType === 'category' ? 'Add Learning Category' : 'Add Child'}
                                    </ThemedText>
                                    <ScrollView horizontal style={{ maxHeight: 300 }}>
                                        <ThemedView style={{ flexDirection: 'row', gap: 10 }}>
                                            {modalType === 'category' && allCategories && allCategories.length > 0 &&
                                                allCategories.map(cat => (
                                                    <LearningTargetCard
                                                        key={cat.id}
                                                        target={{ ...cat, id: String(cat.id) }}
                                                        isSelected={categories.some(t => t.trim() === (cat.name ?? '').trim())}
                                                        onPress={() => handleTargetSelected(cat.id, cat.name)}
                                                        checkIcon={IconCheck}
                                                        informationIcon={IconInformation}
                                                    />
                                                ))}
                                            {modalType === "child" && allChildren && allChildren.length > 0 &&
                                                allChildren.map(child => (
                                                    <ChildrenCard
                                                        key={child.id}
                                                        child={child}
                                                        isActive={children.some(t => t.id === child.id)}
                                                        onPress={() => handleChildSelected(child)}
                                                    />
                                                ))}

                                        </ThemedView>

                                    </ScrollView>
                                    <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 24, alignSelf: 'flex-end' }}>
                                        <ThemedView style={{ backgroundColor: '#F4A672', padding: 8, paddingHorizontal: 30, borderRadius: 20 }}>
                                            <ThemedText style={{ fontWeight: 400, color: '#053B4A' }}>Close</ThemedText>
                                        </ThemedView>
                                    </TouchableOpacity>
                                </ThemedView>
                            </ThemedView>
                        )}
                    </ThemedView>
                </ThemedView>
            </ThemedView>
        </ThemedView >
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 0,
    },
    container_detail: {
    },
    overview: {
        marginTop: 60,
        paddingHorizontal: 20,
        marginBottom: 16,
        flexDirection: 'column',
        gap: 5
    },
    topBackPattern: {
        width: "100%",
        height: "100%",
        maxHeight: 1200,
        position: "absolute",
    },
    pathwayCard: {
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: 'rgba(122, 193, 198, 0.5)',
        borderRadius: 20,
        marginBottom: 20,
        backgroundColor: '#053B4A',
    },
    focusEditCard: {
        marginHorizontal: 10,
        borderWidth: 4,
        borderColor: '#F4A672',
        backgroundColor: '#053B4A',
        borderRadius: 20,
        marginBottom: 50
    },
    title: {
        color: 'white',
        fontSize: 20,
        fontWeight: '600',
    },
    subtitle: {
        color: '#9fd3c7',
        fontWeight: 700,
        fontSize: 20,
    },
    lengthContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingVertical: 16,

    },
    lengthLabel: {
        color: '#9fd3c7',
        fontSize: 16,
        fontWeight: 600,
        marginRight: 8,
    },
    lengthText: {
        color: 'rgba(122, 193, 198, 1)',
        fontSize: 16,
        fontWeight: '400',
    },
    descriptionText: {
        color: 'rgba(122, 193, 198, 1)',
        fontSize: 14,
        fontWeight: '400',
    },
    categoryText: {
        color: 'white',
        borderColor: 'rgba(226, 158, 110, 1)',
        borderWidth: 1,
        marginTop: 10,
        borderRadius: 10,
        padding: 10
    },
    cardTextContainer: {
        padding: 5,
        paddingBottom: 30,
        borderBottomWidth: 1,
        borderColor: 'rgba(252, 252, 252, 0.2)',
    },
    cardSubtitle: {
        color: '#9fd3c7',
        fontSize: 14,
    },
    flexRow: {

        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    categoryEditBtn: {
        marginTop: 10,
    },
    categoryEditText: {
        color: 'white',
    },
    categoryEditIcon: {
        width: 15,
        height: 15,
        tintColor: '#053B4A',
    },
    categoryEditIconContainer: {
        backgroundColor: '#9fd3c7',
        padding: 8,
        borderRadius: 8,
    },
    flexCol: {
        flexDirection: 'column',
        gap: 10
    },
    iconBtn: {
        padding: 3
    },
    iconBtnCircle: {
        borderWidth: 1,
        borderColor: 'rgba(122, 193, 198, 0.5)',
        padding: 3,
        borderRadius: '50%'
    },
    backOrange: {
        backgroundColor: 'rgba(244, 166, 114, 1)'
    },
    scrollContainer: {
        padding: 16,
        alignItems: 'center',
    },
    card: {
        width: 240,
        height: 238,
        backgroundColor: '#003b4f',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(248, 236, 174, 1)',
        overflow: 'hidden',
        zIndex: -1
    },
    card2: {
        width: 240,
        height: 238,
        backgroundColor: '#003b4f',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(248, 236, 174, 1)',
        overflow: 'hidden',
        flexDirection: 'row',
        zIndex: -1
    },
    cardTop: {
        padding: 12,
    },
    cardTitle: {
        color: 'rgba(248, 236, 174, 1)',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 12
    },
    cardSubText: {
        color: '#9ec7d3',
        fontSize: 20,
        marginTop: 5,
    },
    cardImage: {
        width: '100%',
        height: 100,
        resizeMode: 'cover',
    },
    cardImage2: {
        width: '30%',
        height: '100%',
        resizeMode: 'cover',
    },
    connector: {
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    circle1: {
        width: 10,
        height: 10,
        left: 0,
        transform: 'translate(-50%, 0)',
        position: 'absolute',
        borderRadius: 5,
        backgroundColor: 'rgba(5, 59, 74, 1)',
        borderWidth: 1,
        borderColor: 'rgba(248, 236, 174, 1)',
        zIndex: 2,
    },
    circle2: {
        width: 10,
        height: 10,
        right: 0,
        transform: 'translate(50%, 0)',
        position: 'absolute',
        borderRadius: 5,
        backgroundColor: 'rgba(5, 59, 74, 1)',
        borderWidth: 1,
        borderColor: 'rgba(248, 236, 174, 1)',
        zIndex: 2,
    },
    line: {
        position: 'absolute',
        left: 0,
        width: '100%',
        height: 1,
        backgroundColor: 'rgba(248, 236, 174, 1)',
        zIndex: 1,
    },
    storyContent: {
        padding: 12,
        width: '70%'
    },
    badge: {
        backgroundColor: '#003b4f',
        borderColor: '#69e2ec',
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 2,
        alignSelf: 'flex-start',
        marginBottom: 4,
    },
    badgeText: {
        color: '#69e2ec',
        fontWeight: 'bold',
    },
    storyIndex: {
        color: '#ccc',
        fontSize: 12,
        marginBottom: 2,
    },
    storyLabel: {
        color: '#66e0d5',
        fontWeight: 'bold',
        fontSize: 13,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    storyTitle: {
        color: '#fff',
        fontSize: 14,
        marginBottom: 4,
    },
    storyDuration: {
        color: '#ccc',
        fontSize: 12,
    },
    ButtonIcon: {
        width: 21,
        height: 21,

    },

    progressBar: {
        width: 90,
    },
    avatarOutline: {
        width: 35,
        height: 35,
        backgroundColor: '#F4A672',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    avatar: {
        width: 35,
        height: 35,
        borderRadius: 50
    },
    checkAvatar: {
        width: 24,
        height: 24,
    },
    name: {
        fontSize: 12,
        fontWeight: 700,
        lineHeight: 18,
        color: 'rgba(248, 236, 174, 1)',
    },
    bar: {
        width: 115,
        height: 4,
        borderRadius: 20,
        backgroundColor: 'rgba(248, 236, 174, 0.3)'
    },
    value: {
        fontSize: 14,
        fontWeight: 700,
        color: 'white'
    }
});