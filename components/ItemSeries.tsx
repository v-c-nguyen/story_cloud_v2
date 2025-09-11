// components/ItemSeries.tsx
import { Image } from "expo-image";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export interface ItemSeriesType {
  name: string;
  avatar_url?: string;
  symbol?: string;
}

interface ItemSeriesProps {
  itemsData: ItemSeriesType[];
  onSelect?: (item: ItemSeriesType | null) => void;
}

export interface ItemSeriesRef {
  resetSelection: () => void;
}

export const ItemSeries = forwardRef<ItemSeriesRef, ItemSeriesProps>(({ itemsData, onSelect }, ref) => {
  const [selected, setSelected] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    resetSelection: () => {
      setSelected(null);
      if (onSelect) onSelect(null);
    }
  }), [onSelect]);

  function handlePress(item: ItemSeriesType) {
    if (selected === item.name) {
      // Toggle off
      setSelected(null);
      if (onSelect) onSelect(null);
    } else {
      // Select new
      setSelected(item.name);
      if (onSelect) onSelect(item);
    }
  }

  return (
    <ThemedView>
      <FlatList
        data={itemsData}
        horizontal
        keyExtractor={(item) => item.name}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isSelected = selected === item.name;
          return (
            <TouchableOpacity onPress={() => handlePress(item)}>
              <ThemedView
                style={[
                  styles.pill,
                  isSelected && styles.pillSelected
                ]}
              >
                {item.avatar_url &&
                  <ThemedView
                    style={[
                      styles.avatarImgContainer,
                    ]}
                  >
                    <Image
                      source={item.avatar_url}
                      style={styles.avatar}
                      contentFit="cover"
                    />
                  </ThemedView>
                }
                {item.symbol &&
                  <ThemedText
                    style={[
                      styles.pillText,
                      isSelected && styles.pillTextSelected
                    ]}>
                    {item.symbol.trim() + ' '}
                  </ThemedText>
                }
                {/* <View style={styles.avatarContainer}>
                  <Image
                  source={item.avatar_url ? null : require("../assets/images/avatars/lara_wombat.png")}
                  style={styles.avatar}
                  contentFit="cover"
                />
                </View> */}
                <ThemedText
                  style={[
                    styles.pillText,
                    isSelected && styles.pillTextSelected
                  ]}
                >
                  {item.name.trim()}
                </ThemedText>
              </ThemedView>
            </TouchableOpacity>
          );
        }}
      />
    </ThemedView>
  );
});

ItemSeries.displayName = 'ItemSeries';

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  avatarImgContainer: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderRadius: 50,
    backgroundColor: "#F8ECAE",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#053b4a17",
  },

  pillSelected: {
    backgroundColor: "#fba864",
    borderWidth: 0,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  pillText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#053B4A",
  },

  pillTextSelected: {
    color: "#053B4A",
    fontWeight: "600",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 18,
  },
  avatarContainer: {
    marginRight: 8,
    padding: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: "#F8ECAE",
    alignItems: "center",
    justifyContent: "center",

  },
  fallbackAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ADD7DA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  fallbackText: {
    fontSize: 16,
    color: "#053B4A",
    fontWeight: "600",
  },
  symbol: {
    fontSize: 18,
    marginRight: 6,
  },
});