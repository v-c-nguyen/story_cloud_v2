import { Stack } from 'expo-router';
import React from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';
import { StyleSheet } from 'react-native';

export default function AuthLayout() {
  const colorScheme = useColorScheme();
  const tabs = [
    { id: 'account', label: 'Account', icon: require("@/assets/images/parent/icon-profile.png") },
    { id: 'content', label: 'Content', icon: require("@/assets/images/parent/icon-content.png") }
  ];
  const [activeTab, setActiveTab] = React.useState('account');
  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId);
  };
  return (

    <Stack
    >
      <Stack.Screen name="(account)" options={{ headerShown: false }} />
      <Stack.Screen name="(billing)" options={{ headerShown: false }} />
      <Stack.Screen name="(content)" options={{ headerShown: false }} />
      <Stack.Screen name="(login)" options={{ headerShown: false }} />
      <Stack.Screen name="(subscription)" options={{ headerShown: false }} />
    </Stack>

  );
}


const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    position: "relative",
  },
  headerRocketWrap: {
    width: '100%',
    height: 200,
    paddingLeft: 36,
    marginTop: -56,
    position: "relative",
  },
  imgCloudFar: {
    width: 400,
    height: 278,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: -100,
  },
  imgCloudNear: {
    width: 400,
    height: 279,
    position: "absolute",
    top: 42,
    left: 0,
    zIndex: -10
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
  settingContentStyle: {
    backgroundColor: '#fff',
    paddingHorizontal: 3,
    zIndex: 10,
    paddingBottom: 100
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
    borderRadius: 50,
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
  }
});