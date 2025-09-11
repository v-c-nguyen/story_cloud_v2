import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

type TabItem = {
    id: string;
    icon: any;
    label: string;
};

type TabBarProps = {
    tabs: TabItem[];
    activeTab: string;
    onTabPress: (tabId: string) => void;
};

export function TabBar({ tabs, activeTab, onTabPress }: TabBarProps) {
    return (
        <ThemedView style={styles.tabContainer}>
            {tabs.map((tab) => (
                <TouchableOpacity
                    key={tab.id}
                    style={[
                        styles.tabItem,
                        activeTab === tab.id && styles.activeTabItem
                    ]}
                    onPress={() => onTabPress(tab.id)}
                >
                    <ThemedView style={styles.tabItemStyle}>
                        <ThemedView style={[styles.tabIconContainer, activeTab == tab.id && styles.activeIconContainer]}>
                            <tab.icon
                                width={20}
                                height={20}
                                color={"#053B4A"}
                                style={styles.tabIcon}
                            />
                        </ThemedView>
                        <ThemedText style={[
                            styles.tabText,
                            activeTab === tab.id && styles.activeTabText
                        ]}>
                            {tab.label}
                        </ThemedText>
                    </ThemedView>
                </TouchableOpacity>
            ))}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    tabContainer: {
        width: 340,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(rgba(252, 252, 252, 0.3))',
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'rgba(5, 59, 74, 0.5)',
        padding: 2,
        paddingRight: 15,
        marginHorizontal: 'auto',
        marginTop: 20,
    },
    tabItem: {
        borderRadius: 8,
        alignItems: 'center',
    },
    activeTabItem: {
        backgroundColor: 'rgba(252, 252, 252, 0.3)',
    },
    tabText: {
        fontSize: 18,
        color: 'rgba(5, 59, 74, 1)',
        fontFamily: 'Sitara-Regular',
    },
    activeTabText: {
        color: '#rgba(5, 59, 74, 1)',
        fontFamily: 'Sitara-Bold',
    },
    tabItemStyle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 5
    },
    tabIcon: {
        width: 20,
        height: 20,
        tintColor: 'rgba(5, 59, 74, 1)'
    },
    tabIconContainer: {
        borderRadius: 100,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40
    },
    activeIconContainer: {
        backgroundColor: 'rgba(244, 166, 114, 1)',
        borderRadius: 100,
    }
}); 