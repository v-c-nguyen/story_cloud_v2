import supabase from '@/app/lib/supabase';
import { useUser } from '@/app/lib/UserContext';
import { ThemedView } from "@/components/ThemedView";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import IconInformation from "@/assets/images/parent/icon-information.svg"

const ageGroups = ["2 - 5", "6 - 9"];
const storyStyles = ["Story Time", "Play Time"];
const timeLimits = ["1 hr", "2 hr", "3 hr", "4 hr"];
const WeeklytimeLimits = ["2 hr", "5 hr", "10 hr", "15 hr"];

interface ContentPreferencesProps {
  setModalVisible: (visible: boolean) => void;
}


export default function ContentPreferences({
  setModalVisible,
}: ContentPreferencesProps = {
    setModalVisible: (visible: boolean) => { },
  }) {
  const [selectedAge, setSelectedAge] = useState("");
  const [activeUser, setActiveUser] = useState<any>(null);
  const [selectedStyle, setSelectedStyle] = useState("");
  const [limitType, setLimitType] = useState("Daily");
  const [selectedLimit, setSelectedLimit] = useState("2 hr");
  // 2 hrs, 5 hrs, 10 hrs, 15hrs
  // Fetch preferences from DB on mount

  useEffect(() => {
    // Prefill parent info when user changes
    async function getUserPreferences() {
      const jwt = supabase.auth.getSession && (await supabase.auth.getSession())?.data?.session?.access_token;
      const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
      setActiveUser(user);
      const { data, error } = await supabase.functions.invoke(`preferences/getOne/${user?.id}`, {
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
        setSelectedAge(data.data?.age);
        setSelectedStyle(data.data?.style);
      }
    }
    getUserPreferences()
  }, []);



  // Get user from context
  const { user } = useUser();

  useEffect(() => {
    async function updatePreferencesEdge() {
      const jwt = supabase.auth.getSession && (await supabase.auth.getSession())?.data?.session?.access_token;
      await fetch('https://fzmutsehqndgqwprkxrm.supabase.co/functions/v1/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: jwt ? `Bearer ${jwt}` : '',
        },
        body: JSON.stringify({
          age_group: selectedAge,
          story_style: selectedStyle,
          kid_id: user?.id
        })
      });
    }
    if (selectedAge || selectedStyle)
      updatePreferencesEdge();
  }, [selectedAge, selectedStyle]);

  return (
    <View style={styles.cardContainer}>
      {/* Content Preferences */}
      <Text style={styles.sectionHeader}>Content Preferences</Text>
      <Text style={styles.label}>Content Access by Age Group</Text>
      <View style={styles.pillRow}>
        {ageGroups.map((age) => (
          <TouchableOpacity
            key={age}
            style={[styles.pill, selectedAge === age && styles.pillActive]}
            onPress={() => setSelectedAge(age)}
          >
            <Text style={[styles.pillText, selectedAge === age && styles.pillTextActive]}>{age}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ThemedView style={{ flexDirection: 'row', gap: 15, alignItems: 'center' }}>
        <Text style={styles.label}>Story Style</Text>
        <TouchableOpacity style={{ marginBottom: 8 }} onPress={() => setModalVisible(true)}>
          <IconInformation width={18} height={18} color={"#053B4A"} style={styles.informationBtn} />
        </TouchableOpacity>
      </ThemedView>
      <View style={styles.pillRow}>
        {storyStyles.map((style) => (
          <TouchableOpacity
            key={style}
            style={[styles.pill, selectedStyle === style && styles.pillActive]}
            onPress={() => setSelectedStyle(style)}
          >
            <Text style={[styles.pillText, selectedStyle === style && styles.pillTextActive]}>{style}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Parental Controls */}
      <Text style={[styles.sectionHeader, { marginTop: 32 }]}>Parental Controls</Text>
      <Text style={styles.label}>Time Limits</Text>
      <Text style={styles.subLabel}>Monitor your child's screen time</Text>
      <View style={[styles.toggleRow, { gap: 0 }]}>
        <TouchableOpacity
          style={[styles.toggle, styles.left]}
          onPress={() => setLimitType("Daily")}
        >
          <Text style={[styles.toggleText, limitType === "Daily" && styles.toggleTextActive]}>Daily</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggle, styles.right]}
          onPress={() => setLimitType("Weekly")}
        >
          <Text style={[styles.toggleText, limitType === "Weekly" && styles.toggleTextActive]}>Weekly</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />
      <View style={styles.pillRow}>
        {limitType === 'Daily' ? (
          timeLimits.map((limit) => (
            <TouchableOpacity
              key={limit}
              style={[styles.pill, selectedLimit === limit && styles.pillActive]}
              onPress={() =>
                setSelectedLimit(selectedLimit === limit ? "" : limit)
              }
            >
              <Text style={[styles.pillText, selectedLimit === limit && styles.pillTextActive]}>
                {limit}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          WeeklytimeLimits.map((limit) => (
            <TouchableOpacity
              key={limit}
              style={[styles.pill, selectedLimit === limit && styles.pillActive]}
              onPress={() =>
                setSelectedLimit(selectedLimit === limit ? "" : limit)
              }
            >
              <Text style={[styles.pillText, selectedLimit === limit && styles.pillTextActive]}>
                {limit}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    padding: 24,
    paddingBottom: 80,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    fontSize: 24,
    color: "rgba(5, 59, 74, 1)",
    fontWeight: '700',
    marginBottom: 30
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#053B4A',
    marginBottom: 10,
  },
  subLabel: {
    fontSize: 14,
    color: '#053B4A',
    marginBottom: 12,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  pill: {
    backgroundColor: '#F4F4F4',
    borderRadius: 12,
    // paddingVertical: 14,
    paddingHorizontal: 18,
    // width: 69,
    height: 45,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  pillActive: {
    backgroundColor: '#F4A672',
    borderColor: '#F4A672',
  },
  pillText: {
    color: '#053B4A',
    fontWeight: '600',
    fontSize: 16,
  },
  pillTextActive: {
    fontWeight: '700',
  },
  infoIcon: {
    fontSize: 14,
    color: '#053B4A',
    fontWeight: 'bold',
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  toggle: {
    backgroundColor: '#F4F4F4',
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  left: {
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  right: {
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  toggleActive: {
    fontWeight: '700',
  },
  toggleText: {
    color: '#053B4A',
    fontWeight: '400',
    fontSize: 16,
  },
  toggleTextActive: {
    color: '#053B4A',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  informationBtn: {
    width: 18,
    height: 18,
    tintColor: '#053B4A'
  },
});
