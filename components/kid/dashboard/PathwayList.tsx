import { useUser } from "@/app/lib/UserContext";
import { StoryCard2 } from "@/components/Cards";
import PathwayProgressBar from "@/components/PathwayProgressBar";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Image } from "expo-image";
import { RelativePathString, Stack, useRouter } from "expo-router";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";

import IconAvatarRight from "@/assets/images/icons/arrow-right.svg"

interface ParentKids {
    id: string;
    name: string;
    avatar_url: string;
}

interface ParentTargets {
    id: string;
    name: string;
}
interface PathwayProps {
    id: number;
    description: string;
    length: number;
    currentStep: number;
    name: string;
    parent_id: string;
    parent_kids: ParentKids[];
    parent_targets: ParentTargets[];
    stories: any[];
}
export default function PathwayList({ pathway }: { pathway: PathwayProps }) {
    const { child } = useUser();

    return (
        <ThemedView style={{ marginBottom: 60 }}>
            <ThemedText style={styles.pathwayTitle}>
                Your
                <ThemedView style={{ height: 16 }} />
                <ThemedText style={{ color: "#EC701D", fontSize: 30 }}> Adventure</ThemedText> Awaits!
            </ThemedText>
            <ThemedText style={styles.pathwaySubTitle}>
                Story Pathway | {pathway?.stories.length} Episodes
            </ThemedText>
            <ThemedView style={{ marginVertical: 36 }}>
                <PathwayProgressBar total={pathway.stories.length} current={pathway.currentStep} child={child} />
            </ThemedView>
            {/* Continue Watching */}
            <SectionHeader title={pathway.name} description={pathway.description} link="continue" />
            {
                pathway?.stories && pathway.stories.length > 0 ?
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.cardScrollContainer}
                    >
                        {pathway?.stories.map((item, idx) => (
                            <StoryCard2 key={idx} {...item} />
                        ))}
                    </ScrollView>
                    :
                    <ThemedText style={{ color: '#053B4A', width: '100%', textAlign: 'center', marginTop: 20 }}>no stories</ThemedText>
            }
        </ThemedView>
    )
}



function SectionHeader({ title, description, link }: { title: string, description: string, link: string }) {

    const router = useRouter();
    // Helper for route path
    const getRoute = () => {

        return `./${link}`;
    };
    return (
        <>
            <Stack.Screen options={{
                headerShown: false
            }} />
            <ThemedView style={{ paddingHorizontal: 16 }}>
                <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
                <ThemedView style={styles.sectionHeaderLink}>
                    <ThemedText style={[styles.sectionSubTitle, { width: '80%' }]}>{description}</ThemedText>
                    <TouchableOpacity onPress={() => router.push(getRoute() as RelativePathString)}>

                        <IconAvatarRight
                            width={24}
                            height={24}
                            color={"#053B4A"}
                        />
                    </TouchableOpacity>
                </ThemedView>
            </ThemedView>
        </>
    );
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: "#F4A672",
        position: "relative",
    },
    topBackPattern: {
        width: "100%",
        height: 400,
        position: "absolute",
    },
    headingWrap: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: 16,
        marginRight: 16,
        marginTop: 23,
    },
    logoBallon: { width: 48, height: 48 },
    headerWrap: {
        marginTop: 48,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    headerTitle: {
        color: "#053B4A",
        fontSize: 42,
        fontWeight: "700",
        lineHeight: 46.2,
    },
    headerStar: {
        width: 84,
        height: 90,
        marginLeft: 8,
    },
    headerSubtitle: {
        color: "#053B4A",
        fontSize: 18,
        fontWeight: "400",
        lineHeight: 24.3,
        textAlign: "center",
        marginTop: 4,
        marginBottom: 12,
    },
    headerRocket: { width: 224.54, height: 287 },
    headerRocketWrap: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        paddingLeft: 36,
        marginTop: -56,
        position: "relative",
    },
    imgCloudFar: {
        width: "110%",
        height: 278,
        position: "absolute",
        top: 58,
        left: 0,
        zIndex: -100,
    },
    imgCloudNear: {
        width: "100%",
        height: 279,
        position: "absolute",
        top: 100,
        left: 0,
    },
    pathwayTitle: {
        color: "#053B4A",
        fontSize: 30,
        fontWeight: 700,
        lineHeight: 37.5,
        textAlign: "center",
    },
    pathwaySubTitle: {
        color: "#053B4A80",
        fontSize: 20,
        fontWeight: 400,
        lineHeight: 20,
        textAlign: "center",
        marginTop: 24,
    },
    sectionHeaderLink: {
        marginTop: 10,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    sectionTitle: {
        color: "#053B4A",
        fontSize: 24,
        fontWeight: "700",
        lineHeight: 24,
    },
    sectionSubTitle: {
        color: "#053B4A",
        fontSize: 16,
        fontWeight: "400",
        fontStyle: "italic",
        lineHeight: 21.68,
    },
    sectionArrow: {
        width: 24,
        height: 24,
    },
    cardScrollContainer: {
        gap: 20,
        paddingHorizontal: 16,
        paddingBottom: 60,
    },
});
