import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from '@react-native-masked-view/masked-view';
import GradientText from "./ui/GradientText";
import GradientBorderBox from "./ui/GradientBorderBox";
import supabase from "@/app/lib/supabase";
import { LearningTargetCard } from "./LearningTargetCard";
import { ChildrenCard } from "./ChildrenCard";
import PathwayStories from "./parent/learning/pathway/PathwayStories";
import IconDefaultAvatar from "@/assets/images/icons/icon-parent-3.svg"

interface Child {
  progress: number;
  children: {
    id: string,
    name: string,
    age: number,
    mode: string,
    avatar_url?: string
  }
}

interface LearningCategory {
  id: string,
  name: string,
  description: string
}

import IconEdit from "@/assets/images/parent/icon-edit.svg";
import IconDetail from "@/assets/images/parent/icon-detailBtn.svg"
import IconStep from "@/assets/images/parent/icon-step.svg"
import IconPathway from "@/assets/images/parent/icon-pathway.svg"
import IconCancel from "@/assets/images/parent/icon-cancel.svg"
import IconPlus from "@/assets/images/parent/icon-plus.svg"
import IconClock from "@/assets/images/parent/icon-clock.svg"
import IconDate from "@/assets/images/parent/icon-date.svg"
import IconHappy from "@/assets/images/parent/icon-happy.svg"
import IconDoc from "@/assets/images/parent/icon-doc.svg"
import IconTop from "@/assets/images/parent/icon-top.svg"
import IconInformation from "@/assets/images/parent/icon-information.svg"
import IconCheck from "@/assets/images/parent/icon-check.svg"
import LearningModuleModal from "./Modals/LearningModuleMode";

export function PathwayCard({
  pathway,
  handleViewButton,
  handleEditButton
}: {
  pathway: any;
  handleViewButton: (id: string) => void;
  handleEditButton: (id: string) => void;
}) {
  return (
    <ThemedView style={styles.container}>
      <Image
        source={require("@/assets/images/parent/parent-back-pattern.png")}
        style={styles.topBackPattern}
        resizeMode="cover"
      />
      <ThemedView style={styles.overview}>
        <IconPathway width={27} height={27} />
        <ThemedText style={styles.title}>{pathway.name}</ThemedText>
        <ThemedView style={[styles.flexRow]}>
          <IconStep width={24} height={24} />
          <ThemedText style={styles.subtitle}>3 Steps</ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.pathwayCard}>
        <ThemedView
          style={[
            styles.lengthContainer,
            { borderBottomWidth: 1, borderColor: "rgba(252, 252, 252, 0.2)" },
          ]}
        >
          <ThemedView style={styles.flexRow}>
            <ThemedView style={[styles.iconBtnCircle, { padding: 5 }]}>
              <IconClock width={21} height={21} />
            </ThemedView>

            <GradientText text="Length" />
            <ThemedText style={styles.lengthText}>45 min</ThemedText>
          </ThemedView>
          <ThemedView style={styles.flexRow}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => handleEditButton(pathway.id)}
            >
              <IconEdit width={24} height={24} color={'rgba(122, 193, 198, 1)'} />
            </TouchableOpacity>
            <ThemedText style={{ color: "rgba(122, 193, 198, 0.5)" }}>
              {" "}
              |{" "}
            </ThemedText>
            <TouchableOpacity
              style={[styles.iconBtn, styles.iconBtnCircle]}
              onPress={() => handleViewButton(pathway.id)}
            >
              <IconDetail width={24} height={24} />
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.cardTextContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
          >
            {/* Card 1: Social & Empathy Lessons */}
            <ThemedView style={styles.card}>
              <ThemedView style={styles.cardTop}>
                <ThemedText style={styles.cardTitle}>
                  Social & Empathy Lessons
                </ThemedText>
                <ThemedText style={styles.cardSubText}>3 Series</ThemedText>
                <ThemedText style={styles.cardSubText}>3 Stories</ThemedText>
              </ThemedView>
              <Image
                source={require("@/assets/images/kid/series-back-1.png")} // Replace with your image
                style={styles.cardImage}
              />
            </ThemedView>

            {/* Connector */}
            <ThemedView style={styles.connector}>
              <ThemedView style={styles.circle1} />
              <ThemedView style={styles.line} />
              <ThemedView style={styles.circle2} />
            </ThemedView>

            {/* Card 2: Story */}
            <ThemedView style={styles.card}>
              <Image
                source={require("@/assets/images/kid/series-back-2.png")} // Replace with your image
                style={styles.cardImage}
              />
              <ThemedView style={styles.storyContent}>
                <ThemedView style={styles.badge}>
                  <ThemedText style={styles.badgeText}>1</ThemedText>
                </ThemedView>
                <ThemedText style={styles.storyIndex}>#4</ThemedText>
                <ThemedText style={styles.storyLabel}>
                  UNDERWATER ADVENTURES
                </ThemedText>
                <ThemedText style={styles.storyTitle}>
                  Petal Tales: The Search for Rainbow Flowers
                </ThemedText>
                <ThemedText style={styles.storyDuration}>12 min</ThemedText>
              </ThemedView>
            </ThemedView>
          </ScrollView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

export function PathwayDetailedCard({
  pathwayMode,
  handleEditButton
}: {
  pathwayMode: any,
  handleEditButton: (id: string) => void
}) {
  const router = useRouter();
  const formattedDate = pathwayMode?.created_at
    ? new Date(pathwayMode.created_at).toLocaleDateString()
    : "";
  function handleBack() {
    router.navigate("./");
  }
  return (
    <ThemedView style={[styles.container, { paddingBottom: 30 }]}>
      <Image
        source={require("@/assets/images/parent/parent-back-pattern.png")}
        style={styles.topBackPattern}
        resizeMode="cover"
      />
      <ThemedView style={[styles.overview, { alignItems: "center" }]}>
        <IconPathway width={27} height={27} />
        <ThemedText style={styles.title}>{pathwayMode?.name}</ThemedText>
        <ThemedView style={[styles.flexRow]}>
          <IconStep width={24} height={24} />
          <ThemedText style={styles.subtitle}>3 Steps</ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.pathwayCard}>
        <ThemedView
          style={[
            styles.lengthContainer,
            { borderBottomWidth: 1, borderColor: "rgba(252, 252, 252, 0.2)" },
          ]}
        >
          <ThemedView style={[styles.flexCol, { width: "100%" }]}>
            <ThemedView
              style={[styles.flexRow, { justifyContent: "space-between" }]}
            >
              <ThemedView style={styles.flexRow}>
                <ThemedView style={[styles.iconBtnCircle, { padding: 8 }]}>
                  <IconClock width={21} height={21} style={styles.ButtonIcon} />
                </ThemedView>
                <GradientText text="Length" />
                <ThemedText style={styles.lengthText}>45 min</ThemedText>
              </ThemedView>
              <ThemedView style={styles.flexRow}>

                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => handleEditButton(pathwayMode.id)}
                >
                  <IconEdit width={24} height={24} color={'rgba(122, 193, 198, 1)'} />
                </TouchableOpacity>
                <ThemedText style={{ color: "rgba(122, 193, 198, 0.5)" }}>
                  {" "}
                  |{" "}
                </ThemedText>
                <TouchableOpacity
                  onPress={handleBack}
                  style={[
                    styles.iconBtn,
                    styles.iconBtnCircle,
                    styles.backOrange,
                  ]}
                >
                  <IconTop width={24} height={24} />
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>

            <ThemedView
              style={[styles.flexRow, { justifyContent: "space-between" }]}
            >
              <ThemedView style={styles.flexRow}>
                <ThemedView style={[styles.iconBtnCircle, { padding: 8 }]}>
                  <IconDate width={21} height={21} style={styles.ButtonIcon} />
                </ThemedView>
                <GradientText text="Date Created" />
                <ThemedText style={styles.lengthText}>
                  {formattedDate}
                </ThemedText>
              </ThemedView>
            </ThemedView>
            <ThemedView
              style={[styles.flexRow, { justifyContent: "space-between" }]}
            >
              <ThemedView style={styles.flexRow}>
                <ThemedView style={[styles.iconBtnCircle, { padding: 8 }]}>
                  <IconPathway width={21} height={21} style={styles.ButtonIcon} />
                </ThemedView>
                <GradientText text={pathwayMode?.name} />
              </ThemedView>
            </ThemedView>
            <ThemedView
              style={[styles.flexRow, { justifyContent: "space-between" }]}
            >
              <ThemedView
                style={[styles.flexRow, { alignItems: "flex-start" }]}
              >
                <ThemedView
                  style={[styles.iconBtnCircle, { padding: 8, marginTop: 8 }]}
                >
                  <IconDoc width={21} height={21} style={styles.ButtonIcon} />
                </ThemedView>
                <ThemedView style={{ width: "90%" }}>
                  <GradientText text="Description" />
                  <ThemedText style={[styles.lengthText, { paddingRight: 20 }]}>
                    {pathwayMode?.description}
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            </ThemedView>
            <ThemedView
              style={[styles.flexCol, { justifyContent: "space-between" }]}
            >
              <ThemedView style={styles.flexRow}>
                <ThemedView style={[styles.iconBtnCircle, { padding: 8 }]}>
                  <IconHappy width={21} height={21} style={styles.ButtonIcon} />
                </ThemedView>
                <GradientText text="Children" />
              </ThemedView>

              {pathwayMode?.pathway_kids &&
                pathwayMode?.pathway_kids.length > 0 &&
                pathwayMode?.pathway_kids.map((kid: any, idx: number) => (
                  <GradientBorderBox
                    key={idx}
                    borderRadius={24}
                    borderWidth={1}
                    style={styles.progressBar}
                    innerStyle={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                      paddingHorizontal: 4,
                      paddingVertical: 4,
                      width: 'auto'
                    }}
                  >
                    {
                      kid.children?.avatar_url ?
                        <Image source={{ uri: kid.children?.avatar_url }} style={styles.avatar} />
                        :
                        <IconDefaultAvatar width={35} height={35} />

                    }
                    <ThemedText style={styles.name}>
                      {kid.children?.name}
                    </ThemedText>
                    <ThemedView style={styles.bar}></ThemedView>
                    <ThemedText style={styles.value}>0%</ThemedText>
                  </GradientBorderBox>
                ))}
            </ThemedView>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.cardTextContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
          >
            {/* Card 1: Social & Empathy Lessons */}
            <ThemedView style={styles.card}>
              <ThemedView style={styles.cardTop}>
                <ThemedText style={styles.cardTitle}>
                  Social & Empathy Lessons
                </ThemedText>
                <ThemedText style={styles.cardSubText}>3 Series</ThemedText>
                <ThemedText style={styles.cardSubText}>3 Stories</ThemedText>
              </ThemedView>
              <Image
                source={require("@/assets/images/kid/series-back-1.png")} // Replace with your image
                style={styles.cardImage}
              />
            </ThemedView>

            {/* Connector */}
            <ThemedView style={styles.connector}>
              <ThemedView style={styles.circle1} />
              <ThemedView style={styles.line} />
              <ThemedView style={styles.circle2} />
            </ThemedView>

            {/* Card 2: Story */}
            <ThemedView style={styles.card2}>
              <Image
                source={require("@/assets/images/kid/series-back-2.png")} // Replace with your image
                style={styles.cardImage2}
              />
              <ThemedView style={styles.storyContent}>
                <ThemedView style={styles.badge}>
                  <ThemedText style={styles.badgeText}>1</ThemedText>
                </ThemedView>
                <ThemedText style={styles.storyIndex}>#4</ThemedText>
                <ThemedText style={styles.storyLabel}>
                  UNDERWATER ADVENTURES
                </ThemedText>
                <ThemedText style={styles.storyTitle}>
                  Petal Tales: The Search for Rainbow Flowers
                </ThemedText>
                <ThemedText style={styles.storyDuration}>12 min</ThemedText>
              </ThemedView>
            </ThemedView>
          </ScrollView>
        </ThemedView>

        <ThemedView style={styles.lengthContainer}>
          <ThemedView style={[styles.flexCol, { width: "100%" }]}>
            <ThemedView
              style={[styles.flexRow, { justifyContent: "space-between" }]}
            >
              <ThemedView style={styles.flexRow}>
                <ThemedView>
                  <GradientText text="Learning Categories" />
                  {pathwayMode?.pathway_targets &&
                    pathwayMode?.pathway_targets.length > 0 &&
                    pathwayMode?.pathway_targets.map(
                      (target: any, idx: number) => (
                        <GradientBorderBox
                          key={idx}
                          borderRadius={12}
                          borderWidth={1}
                          style={{ marginTop: 10 }}
                        >
                          <ThemedText style={{ color: "white", fontWeight: "bold", fontSize: 14 }}>
                            {target.learning_categories.name}
                          </ThemedText>
                        </GradientBorderBox>
                      )
                    )}
                </ThemedView>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}
export function PathwayEditCard({
  pathwayMode,
}: {
  pathwayMode: any,
}) {
  const router = useRouter();
  const [editName, setEditName] = React.useState(false);
  const [editDescription, setEditDescription] = React.useState(false);
  const [name, setName] = React.useState(pathwayMode?.name || '');
  const [description, setDescription] = React.useState(pathwayMode?.description || '');
  const [categories, setCategories] = React.useState<LearningCategory[]>([]);
  const [children, setChildren] = React.useState<Child[]>([]);
  const [allCategories, setAllCategories] = React.useState<any[]>([]);
  const [allChildren, setAllChildren] = React.useState<any[]>([]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalType, setModalType] = React.useState<'category' | 'child' | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [currentTarget, setCurrentTarget] = React.useState(null);
  const [TargetModalVisible, setTargetModalVisible] = React.useState(false);

  useEffect(() => {
    if (pathwayMode) {
      setName(pathwayMode.name);
      setDescription(pathwayMode.description);
      setCategories(
        pathwayMode?.pathway_targets
          ? pathwayMode.pathway_targets.map((t: any) => t.learning_categories)
          : []
      );
      setChildren(
        pathwayMode?.pathway_kids
          ? pathwayMode.pathway_kids.map((t: any) => t)
          : []
      );
    }
  }, [pathwayMode])

  const formattedDate = pathwayMode?.created_at
    ? new Date(pathwayMode.created_at).toLocaleDateString()
    : "";
  function handleBack() {
    router.navigate("./");
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
  // Remove category by index
  const handleRemoveCategory = (idx: number) => {
    setCategories(categories.filter((_, i) => i !== idx));
  };

  // Remove child by index
  const handleRemoveChild = (idx: number) => {
    setChildren(children.filter((_, i) => i !== idx));
  };

  function handleTargetSelected(id: string, name: string) {
    setCategories(prev => {
      const exists = prev.some(t => t.name.trim() === name.trim());
      if (exists) {
        return prev.filter(t => t.name.trim() !== name.trim());
      } else {
        // Find the category object by id and add it
        const categoryToAdd = allCategories.find((cat: LearningCategory) => cat.id === id);
        if (categoryToAdd) {
          return [...prev, categoryToAdd];
        }
        return prev;
      }
    });
  }

  function handleChildSelected(child: any) {
    setChildren(prev => {
      const exists = prev.some(t => t.children.id === child.id);
      if (exists) {
        return prev.filter(t => t.children.id !== child.id);
      } else {
        const childAdd = { progress: 0, children: child };
        return [...prev, childAdd];
      }
    });
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

  async function handleEditButton() {
    console.log("children:", children)
    const childrenData = {
      name: name,
      description: description,
      categories: categories,
      children: children
    }
    const jwt = supabase.auth.getSession && (await supabase.auth.getSession())?.data?.session?.access_token;
    let response;
    try {
      const fetchResponse = await fetch(`https://fzmutsehqndgqwprkxrm.supabase.co/functions/v1/pathway-modes/${pathwayMode.id}`, {
        method: 'PUT',
        body: JSON.stringify(childrenData),
        headers: {
          'Content-Type': 'application/json',
          Authorization: jwt ? `Bearer ${jwt}` : '',
        }
      });
      const data = await fetchResponse.json();
      if (fetchResponse.ok) {

        // Add to Zustand store
        router.push('/(parent)/(learning)/(pathway)');

      } else {
        alert(data?.error || 'Failed to save child');
      }
    } catch (e) {
      // Fallback to fetch if supabase.functions.invoke fails
      alert(e || 'Failed to save child');
    }
  }
  function handleInformationClicked(target: any) {
    if (target) {
      setCurrentTarget(target)
      setTargetModalVisible(true)
    }
  }

  return (
    <ThemedView style={[styles.container, { paddingBottom: 30 }]}>
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <ThemedView style={{
          position: 'absolute',
          top: -50,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.4)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 0
        }}>
          <ThemedView style={{ backgroundColor: '#053B4A', borderRadius: 16, borderColor: '#add7da4d', borderWidth: 1, padding: 24, width: "90%", minHeight: 200 }}>
            <ThemedText style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 16, color: 'white' }}>
              {modalType === 'category' ? 'Add Learning Category' : 'Add Child'}
            </ThemedText>
            <ScrollView
              horizontal
              style={{ maxHeight: 300 }}
              showsHorizontalScrollIndicator={false}
            >
              <ThemedView style={{ flexDirection: 'row', gap: 10 }}>
                {modalType === 'category' && allCategories && allCategories.length > 0 &&
                  allCategories.map(cat => (
                    <LearningTargetCard
                      key={cat.id}
                      target={{ ...cat, id: String(cat.id) }}
                      isSelected={categories.some(t => t.name.trim() === (cat.name ?? '').trim())}
                      onPress={() => handleTargetSelected(cat.id, cat.name)}
                      checkIcon={IconCheck}
                      informationIcon={IconInformation}
                      handleInformationClicked={(target: any) => () => handleInformationClicked(target)}
                    />
                  ))}
                {modalType === "child" && allChildren && allChildren.length > 0 &&
                  allChildren.map(child => (
                    <ChildrenCard
                      key={child.id}
                      child={child}
                      isActive={children.some(t => t.children.id === child.id)}
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
      </Modal>
      <Modal
        visible={TargetModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setTargetModalVisible(false)}
        style={{ zIndex: 999 }}
      >
        <LearningModuleModal
          target={currentTarget}
          onCancel={() => setTargetModalVisible(false)} />
      </Modal>

      <Image
        source={require("@/assets/images/parent/parent-back-pattern.png")}
        style={styles.topBackPattern}
        resizeMode="cover"
      />
      <ThemedView style={[styles.overview, { alignItems: "center" }]}>
        <IconPathway width={27} height={27} />
        <ThemedText style={styles.title}>{pathwayMode?.name}</ThemedText>
        {
          pathwayMode && pathwayMode.length > 0 &&
          <ThemedView style={[styles.flexRow]}>
            <IconStep />
            <ThemedText style={styles.subtitle}>{pathwayMode?.stories.length()} Steps</ThemedText>
          </ThemedView>
        }
      </ThemedView>

      <ThemedView style={[styles.pathwayCard,
      { borderColor: '#F4A672', borderWidth: 3, marginHorizontal: 5 }]}>
        <ThemedView
          style={[
            styles.lengthContainer,
            { borderBottomWidth: 1, borderColor: "rgba(252, 252, 252, 0.2)" },
          ]}
        >
          <ThemedView style={[styles.flexCol, { width: "100%" }]}>
            <ThemedView
              style={[styles.flexRow, { justifyContent: "space-between" }]}
            >
              <ThemedView style={styles.flexRow}>
                <ThemedView style={[styles.iconBtnCircle, { padding: 8 }]}>
                  <IconClock width={21} height={21} style={styles.ButtonIcon} />
                </ThemedView>
                <GradientText text="Length" />
                <ThemedText style={styles.lengthText}>45 min</ThemedText>
              </ThemedView>
              <ThemedView style={styles.flexRow}>

                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => handleEditButton()}
                >
                  <IconCancel width={19} height={19} color={'#F4A672'} style={{ width: 18, height: 18 }} />
                </TouchableOpacity>
                <ThemedText style={{ color: "rgba(122, 193, 198, 0.5)" }}>
                  {" "}
                  |{" "}
                </ThemedText>
                <TouchableOpacity
                  onPress={handleBack}
                  style={[
                    styles.iconBtn,
                    styles.iconBtnCircle,
                    styles.backOrange,
                  ]}
                >
                  <IconTop width={24} height={24} />
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>

            <ThemedView
              style={[styles.flexRow, { justifyContent: "space-between" }]}
            >
              <ThemedView style={styles.flexRow}>
                <ThemedView style={[styles.iconBtnCircle, { padding: 8 }]}>
                  <IconDate width={21} height={21} style={styles.ButtonIcon} />
                </ThemedView>
                <GradientText text="Date Created" />
                <ThemedText style={styles.lengthText}>
                  {formattedDate}
                </ThemedText>
              </ThemedView>
            </ThemedView>
            {/* Edit Pathway Mode Name */}
            <ThemedView style={[styles.flexRow, { justifyContent: 'space-between' }]} >
              <ThemedView style={styles.flexRow}>
                <ThemedView style={[styles.iconBtnCircle, { padding: 8 }]}>
                  <IconPathway width={21} height={21} style={styles.ButtonIcon} />
                </ThemedView>
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
            {/* Edit Pathway Mode description */}
            <ThemedView style={[styles.flexRow, { justifyContent: 'space-between' }]} >
              <ThemedView style={[styles.flexRow, { alignItems: 'flex-start' }]}>
                <ThemedView style={[styles.iconBtnCircle, { padding: 8, marginTop: 8 }]}>
                  <IconDoc width={21} height={21} style={styles.ButtonIcon} />
                </ThemedView>
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

            {/* Edit Assigned Childrens */}
            <ThemedView>
              <ThemedView style={styles.flexRow}>
                <ThemedView style={[styles.iconBtnCircle, { padding: 8 }]}>
                  <IconHappy width={21} height={21} style={styles.ButtonIcon} />
                </ThemedView>
                <GradientText text="Children" />
              </ThemedView>

              {
                children && children.length > 0 &&
                children.map((kid: any, idx: number) => (
                  <ThemedView key={idx} style={{ flexDirection: 'row', marginTop: 10 }}>
                    <ThemedView>
                      <GradientBorderBox
                        borderRadius={24}
                        borderWidth={1}
                        style={styles.progressBar}
                        innerStyle={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 10,
                          paddingHorizontal: 4,
                          paddingVertical: 4
                        }}
                      >
                        {
                          kid.children?.avatar_url ?
                            <Image source={{ uri: kid.children?.avatar_url }} style={styles.avatar} />
                            :
                            <IconDefaultAvatar width={35} height={35} />

                        }
                        <ThemedText style={styles.name}>
                          {kid?.name}
                        </ThemedText>
                        <ThemedView style={styles.bar}></ThemedView>
                        { pathwayMode.stories && pathwayMode.stories.length > 0 &&
                          <ThemedText style={styles.value}>{kid.progress / pathwayMode.stories.length}%</ThemedText>
                        }
                        <ThemedText style={{ color: '#7AC1C6' }}>|</ThemedText>
                        <TouchableOpacity onPress={() => handleRemoveChild(idx)}>
                          <ThemedView style={[styles.categoryEditIconContainer, { borderRadius: 20 }]}>
                            <IconCancel style={styles.categoryEditIcon} />
                          </ThemedView>
                        </TouchableOpacity>
                      </GradientBorderBox>
                    </ThemedView>
                  </ThemedView>

                ))}
              <ThemedView style={{ marginTop: 10, flexDirection: 'row' }}>
                <ThemedView>
                  <GradientBorderBox
                    borderRadius={24}
                    borderWidth={1}
                    style={styles.progressBar}
                    innerStyle={{ paddingVertical: 4 }}
                  >
                    <ThemedView style={[styles.flexRow]}>
                      <ThemedText style={{ color: 'white' }}>Add Children</ThemedText>
                      <TouchableOpacity onPress={handleAddChild}>
                        <ThemedView style={[styles.categoryEditIconContainer, { borderRadius: 20 }]}>
                          <IconPlus style={styles.categoryEditIcon} />
                        </ThemedView>
                      </TouchableOpacity>
                    </ThemedView>
                  </GradientBorderBox>
                </ThemedView>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* Stories for the pathway mode */}
        <PathwayStories pathwayMode={pathwayMode} />

        {/* Edit Learning Categories */}
        <ThemedView style={styles.lengthContainer}>
          <ThemedView style={[styles.flexCol, { width: "100%" }]}>

            <GradientText text="Learning Categories" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.flexRow}

            >
              {categories.length > 0 && categories.map((target: any, index: number) => (
                <GradientBorderBox
                  key={index}
                  borderRadius={12}
                  borderWidth={1}
                  style={styles.categoryEditBtn}
                >
                  <ThemedView key={index} style={[styles.flexRow]}>
                    <ThemedText style={[styles.categoryEditText]}>
                      {target.name}
                    </ThemedText>
                    <TouchableOpacity onPress={() => handleRemoveCategory(index)}>
                      <ThemedView style={styles.categoryEditIconContainer}>
                        <IconCancel style={styles.categoryEditIcon} />
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
        </ThemedView>

      </ThemedView >
    </ThemedView >
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBackPattern: {
    width: "100%",
    height: "100%",
    maxHeight: 1200,
    position: "absolute",
  },
  overview: {
    marginTop: 60,
    paddingHorizontal: 20,
    marginBottom: 16,
    flexDirection: "column",
    gap: 5,
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
  descriptionText: {
    color: 'rgba(122, 193, 198, 1)',
    fontSize: 14,
    fontWeight: '400',
  },
  pathwayCard: {
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "rgba(122, 193, 198, 0.5)",
    backgroundColor: '#053B4A',
    borderRadius: 20,
    marginBottom: 20,
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10
  },
  subtitle: {
    color: "#9fd3c7",
    fontWeight: 700,
    fontSize: 20,
  },
  lengthContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  lengthLabel: {
    color: "#9fd3c7",
    fontSize: 16,
    fontWeight: 600,
    marginRight: 8,
  },
  lengthText: {
    color: "rgba(122, 193, 198, 0.7)",
    fontSize: 16,
    fontWeight: "400",
  },
  categoryText: {
    color: "white",
    borderColor: "rgba(226, 158, 110, 1)",
    borderWidth: 1,
    marginTop: 10,
    borderRadius: 10,
    padding: 10,
  },
  cardTextContainer: {
    padding: 5,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderColor: "rgba(252, 252, 252, 0.2)",
  },
  cardSubtitle: {
    color: "#9fd3c7",
    fontSize: 14,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  flexCol: {
    flexDirection: "column",
    gap: 10,
  },
  iconBtn: {
    padding: 3,
  },
  iconBtnCircle: {
    borderWidth: 1,
    borderColor: "rgba(122, 193, 198, 0.5)",
    padding: 3,
    borderRadius: "50%",
  },
  backOrange: {
    backgroundColor: "rgba(244, 166, 114, 1)",
  },
  scrollContainer: {
    padding: 30,
    alignItems: "center",
  },
  card: {
    width: 228,
    height: 220,
    backgroundColor: "#003b4f",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(248, 236, 174, 1)",
    overflow: "hidden",
    zIndex: -1,
  },
  card2: {
    width: 320,
    height: 220,
    backgroundColor: "#003b4f",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#add7da42",
    overflow: "hidden",
    flexDirection: "row",
    zIndex: -1,
  },
  rotatedCard2: {
    transform: [{ rotate: '-8deg' }],
    borderColor: "#F4A672",
    borderWidth: 2,
    boxShadow: "0 4px 40px 0 rgba(252,252,252,0.1)"
  },
  cardTop: {
    padding: 12,
  },
  cardTitle: {
    color: "rgba(248, 236, 174, 1)",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  cardSubText: {
    color: "#9ec7d3",
    fontSize: 20,
    marginTop: 5,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  cardImage2: {
    width: 80,
    height: "100%",
    resizeMode: "cover",
  },
  connector: {
    width: 80,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  circle1: {
    width: 10,
    height: 10,
    left: 0,
    transform: "translate(-50%, 0)",
    position: "absolute",
    borderRadius: 5,
    backgroundColor: "rgba(5, 59, 74, 1)",
    borderWidth: 1,
    borderColor: "rgba(248, 236, 174, 1)",
    zIndex: 2,
  },
  circle2: {
    width: 10,
    height: 10,
    right: 0,
    transform: "translate(50%, 0)",
    position: "absolute",
    borderRadius: 5,
    backgroundColor: "rgba(5, 59, 74, 1)",
    borderWidth: 1,
    borderColor: "rgba(248, 236, 174, 1)",
    zIndex: 2,
  },
  line: {
    position: "absolute",
    left: 0,
    width: "100%",
    height: 1,
    backgroundColor: "rgba(248, 236, 174, 1)",
    zIndex: 1,
  },
  storyContent: {
    padding: 12,
    width: "70%",
  },
  badge: {
    backgroundColor: "#003b4f",
    borderColor: "#fcfcfc2f",
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: 5,
    marginBottom: 4,
  },
  badgeText: {
    color: "#ffffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  storyIndex: {
    color: "#7AC1C6",
    fontSize: 16,
    marginBottom: 2,
  },
  storyLabel: {
    color: "#66e0d5",
    fontWeight: "bold",
    fontSize: 12,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  storyTitle: {
    color: "#7AC1C6",
    fontSize: 16,
    marginBottom: 4,
  },
  storyDuration: {
    color: "#7ac1c686",
    fontSize: 14,
  },
  ButtonIcon: {
    width: 17,
    height: 17,
  },

  progressBar: {
    gap: 15,
    // width: 'fit-content'
    // Use a fixed width or 'auto' if you want it to size to content
    width: 'auto'
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 50
  },
  name: {
    fontSize: 12,
    fontWeight: 700,
    lineHeight: 18,
    color: "rgba(248, 236, 174, 1)",
  },
  bar: {
    width: 115,
    height: 4,
    borderRadius: 20,
    backgroundColor: "rgba(248, 236, 174, 0.3)",
  },
  value: {
    fontSize: 14,
    fontWeight: 700,
    color: "white",
  },
});
