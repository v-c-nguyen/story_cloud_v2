import { Image } from "expo-image";
import { RelativePathString, useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";
import {
  childHooterData,
  HooterItem,
  parentHooterData,
} from "../data/layoutData";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import React, { useEffect } from "react";
import useIsMobile from "@/hooks/useIsMobile";

export default function BottomNavBar({
  role = "kid",
  active = "Dashboard",
  subActive = "Library",
  image = false,
  theme = "dark",
  flag = false,
  pathway = false,
}) {
  const isMobile = useIsMobile();
  const router = useRouter();
  // Filter child tabs if role is kid and pathway is true
  const childTabs = role === "kid" && pathway
    ? childHooterData.filter(item => item.pathway)
    : childHooterData;

  // Helper for route path
  const getRoute = (item: HooterItem, sub?: HooterItem) => {
    const rolePrefix = `/(${role})`;
    if (role === "parent") {
      switch (item.name) {
        case "Dashboard":
          return `${rolePrefix}/(dashboard)`;
        case "Learning":
          if (sub)
            return `${rolePrefix}/(learning)/(${sub.name.toLowerCase()})`;
          return `${rolePrefix}/(learning)/(library)`;
        case "Listen":
          return `${rolePrefix}/(listen)`;
        case "Profile":
          return `${rolePrefix}/(profiles)/(account)`;
      }
    } else {
      switch (item.name) {
        case "Dashboard":
          return `${rolePrefix}/(dashboard)`;
        case "Explore":
          return `${rolePrefix}/(explore)`;
        case "Favourites":
          return `${rolePrefix}/(favourite)`;
        case "Listen":
          return `${rolePrefix}/(listen)`;
      }
    }
    return "/";
  };

  return (
    <ThemedView style={[
      styles.bottomNavContainer,
      { height: isMobile ? 178 : 245 },
      active == "Dashboard" && role == "parent" && isMobile && { height: 113 },
      image && { backgroundColor: 'transparent' }]}
    >
      {/* Learning Bottom Bar Back Pattern */}
      <Image
        source={require("@/assets/images/parent/parent-back-pattern.png")}
        style={[styles.topBackPattern,
        {
          height: active == "Learning" ? '100%' : 0
        }
        ]}
        contentFit="cover"
      />
      {image && isMobile && (
        <Image
          source={require("@/assets/images/kid/cloud-group-bottom.png")}
          pointerEvents="none"
          style={[
            styles.cloudGroup,
            theme == "darkImage" && { tintColor: "rgba(5, 59, 74, 1)" },
          ]}
          contentFit="fill"
        ></Image>
      )}

      {
        !isMobile && image &&
        <Image
          source={require("@/assets/images/parent/tablet_icons/parent_footer_cloud.png")}
          pointerEvents="none"
          style={[
            styles.cloudGroup,
            theme == "darkImage" && { tintColor: "rgba(5, 59, 74, 1)" },
            theme == "light" && {tintColor: "white"}
          ]}
          contentFit="fill"
        ></Image>

      }
      { isMobile && role == "parent" &&
        parentHooterData?.map(
          (item, index) =>
            (item.items?.length ?? 0) > 0 &&
            active == item.name && (
              <ThemedView
                key={index}
                style={[
                  styles.bottomNavBar,
                  { height: 65 },
                  theme == "light" && { backgroundColor: "white" },
                  image == true && { backgroundColor: "rgba(0,0,0,0)" },
                ]}
              >
                {item.items?.map((subItem, subIx) => (
                  <React.Fragment key={subItem.name}>
                    {subIx > 0 && <ThemedText style={{ color: "#fcfcfc36", fontSize: 24, fontWeight: 400 }}>|</ThemedText>}
                    <NavSubItem
                      icon={subItem.icon}
                      label={subItem.name}
                      active={subActive === subItem.name}
                      theme={theme}
                      onPress={() =>
                        router.push(getRoute(item, subItem) as RelativePathString)
                      }
                    />
                  </React.Fragment>
                ))}
              </ThemedView>
            )
        )}

      {/* Nav Items */}
      <ThemedView
        style={[
          styles.bottomNavBar,
          { justifyContent: isMobile ? "center" : "space-evenly", alignItems: 'center' },
          theme == "light" && { backgroundColor: "red" },
          image == true && { backgroundColor: "rgba(0,0,0,0)", borderWidth: 0 },
        ]}
      >
        <Image
          source={require("@/assets/images/parent/parent-back-pattern.png")}
          style={[styles.topBackPattern,
          {
            height: active == "Dashboard" ? '100%' : 0
          }
          ]}
          contentFit="cover"
        />
        {role == "kid" &&
          childTabs?.map((item, index) => (
            <NavItem
              key={index}
              icon={item.icon}
              role={role}
              label={item.name}
              active={active == item.name}
              unvisibleFlag={flag}
              theme={theme}
              onPress={() => router.push(getRoute(item) as RelativePathString)}
            />
          ))}
        {role == "parent" &&
          parentHooterData?.map((item, index) => (
            <NavItem
              key={index}
              icon={item.icon}
              role={role}
              label={item.name}
              active={active == item.name}
              items={item.items}
              unvisibleFlag={flag}
              theme={theme}
              onPress={() => router.push(getRoute(item) as RelativePathString)}
            />
          ))}
      </ThemedView>
    </ThemedView>
  );
}

interface NavItem {
  icon: any;
  role: string;
  label: string;
  active: boolean;
  theme: string;
  items?: HooterItem[];
  onPress: () => void;
  unvisibleFlag: boolean;
}

function NavItem({
  icon: Icon,
  role,
  label,
  active,
  theme,
  items = [],
  onPress,
  unvisibleFlag = false,
}: NavItem) {
  const isMobile = useIsMobile();
  return (
    <TouchableOpacity
      style={[
        styles.navItem,
        active && styles.navItemActive,
        active && isMobile && { borderColor: theme == "light" ? "rgba(5, 59, 74, 1)" : theme == "darkImage" ? "white" : "rgba(122, 193, 198, 0.48)" },
        active && !isMobile && { borderColor: theme == "darkImage" ? "white" : "#053B4A" },
        unvisibleFlag && { width: 0, padding: 0, borderWidth: 0 }]}
      onPress={onPress}
    >
      <ThemedView style={{ position: "relative", height: 24 }}>
        <ThemedView
          style={[styles.activeCircle, !active && { display: "none" }]}
        ></ThemedView>
        <Icon
          width={24}
          height={24}
          style={[
            {
              color:
                active
                  ? "rgba(5, 59, 74, 1)"
                  : "rgba(122, 193, 198, 1)",
              zIndex: 10
            },
            theme == "darkImage" && { color: "white" },
            theme == "light" && { color: "rgba(5, 59, 74, 1)" },
            theme != "darkImage" && !isMobile && { color: "rgba(5, 59, 74, 1)" }
          ]}
        />
      </ThemedView>
      <ThemedText
        style={[
          styles.navLabel,
          theme == "darkImage" && { color: "white" },
          theme == "light" && { color: "rgba(5, 59, 74, 1)" },
          theme != "darkImage" && !isMobile && { color: "rgba(5, 59, 74, 1)" }
        ]}
      >
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
}

// NavSubItem: sub-tab for parent "Learning"
interface NavSubItemProps {
  icon: any;
  label: string;
  active: boolean;
  theme?: string;
  onPress: () => void;
}

function NavSubItem({ icon: Icon, label, active, theme, onPress }: NavSubItemProps) {
  return (
    <TouchableOpacity
      style={[styles.subItem, active && styles.subItemActive]}
      onPress={onPress}
    >
      <ThemedView style={{ position: "relative", height: 24 }}>
        <ThemedView
          style={[styles.activeCircleForSub, !active && { display: "none" }]}
        ></ThemedView>
        <Icon
          width={18}
          height={16}
          style={[
            {
              color: active
                ? "rgba(5, 59, 74, 1)"
                : "rgba(122, 193, 198, 1)",
              margin: "auto",
              zIndex: 10,
            },
            theme == "darkImage" && { color: "white" },
            theme == "light" && { color: "rgba(5, 59, 74, 1)" },
          ]}
        />
      </ThemedView>
      <ThemedText
        style={[
          styles.navLabel,
          theme == "light" && { color: "rgba(5, 59, 74, 1)" },
          theme == "darkImage" && { color: "white" },
        ]}
      >
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bottomNavContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(5, 59, 74, 1)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  topBackPattern: {
    width: '100%',
    height: '100%',
    maxHeight: 1200,
    position: "absolute",
  },
  // Cloud shapes (approximate Figma positions/sizes)
  cloudGroup: {
    position: "absolute",
    width: "100%",
    height: "100%",
    left: 0,
    top: 0,
    zIndex: 10,
  },
  bottomNavBar: {
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    height: 115,
    borderWidth: 1,
    borderColor: "rgba(122, 193, 198, 0.2)",
    paddingBottom: 10,
    paddingHorizontal: 16,
    paddingTop: 0,
    zIndex: 10,
  },
  navItem: {
    width: 85,
    paddingHorizontal: 8,
    paddingVertical: 14,
    borderRadius: 20,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  navItemActive: {
    borderWidth: 1
  },
  subItemActive: {
    borderColor: "rgba(122, 193, 198, 0.2)",
  },
  activeCircle: {
    position: "absolute",
    width: 30,
    height: 30,
    bottom: -2,
    left: 0,
    transform: "translate(-10%, 0)",
    backgroundColor: "#F4A672",
    borderRadius: 14,
  },
  activeCircleForSub: {
    position: "absolute",
    width: 30,
    height: 30,
    top: -3,
    left: -6,
    transform: "translate(0%, 0)",
    backgroundColor: "#F4A672",
    borderRadius: 14,
  },
  navLabel: {
    color: "rgba(122, 193, 198, 1)",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 12,
    textAlign: "center",
  },
  activeLabel: {
    tintColor: "rgba(5, 59, 74, 1)",
  },

  submenu: {
    height: 65,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  subItem: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
});
