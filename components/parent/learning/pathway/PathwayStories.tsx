import React from 'react';
import { ScrollView, Image, TouchableOpacity } from 'react-native';
import { ThemedView } from '../../../ThemedView';
import { ThemedText } from '../../../ThemedText';
import GradientText from '../../../ui/GradientText';

import IconStep from "@/assets/images/parent/icon-step.svg"
import IconCancel from "@/assets/images/parent/icon-cancel.svg"
import IconPlus from "@/assets/images/parent/icon-plus.svg"

export default function PathwayStories({ pathwayMode }: { pathwayMode: any }) {
    const [selectedStep, setSelectedStep] = React.useState(0);
    return (
        <ThemedView style={{ padding: 5, paddingBottom: 30, borderBottomWidth: 1, borderColor: 'rgba(252, 252, 252, 0.2)' }}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ padding: 30, alignItems: 'center' }}
            >
                {/* Card 1: Social & Empathy Lessons */}
                <ThemedView style={{ width: 228, height: 220, backgroundColor: '#003b4f', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(248, 236, 174, 1)', overflow: 'hidden', zIndex: -1 }}>
                    <ThemedView style={{ padding: 12 }}>
                        <ThemedText style={{ color: 'rgba(248, 236, 174, 1)', fontSize: 20, fontWeight: '700', marginBottom: 12 }}>
                            {pathwayMode?.name}
                        </ThemedText>
                        <ThemedText style={{ color: '#9ec7d3', fontSize: 20, marginTop: 5 }}>3 Series</ThemedText>
                        <ThemedText style={{ color: '#9ec7d3', fontSize: 20, marginTop: 5 }}>3 Stories</ThemedText>
                    </ThemedView>
                    <Image
                        source={require('@/assets/images/kid/series-back-1.png')}
                        style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                    />
                </ThemedView>

                {/* Connector */}
                <ThemedView style={{ width: 80, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <ThemedView style={{ width: 10, height: 10, left: 0, transform: [{ translateX: -5 }], position: 'absolute', borderRadius: 5, backgroundColor: 'rgba(5, 59, 74, 1)', borderWidth: 1, borderColor: 'rgba(248, 236, 174, 1)', zIndex: 2 }} />
                    <ThemedView style={{ position: 'absolute', left: 0, width: '100%', height: 1, backgroundColor: 'rgba(248, 236, 174, 1)', zIndex: 1 }} />
                    <ThemedView style={{ width: 10, height: 10, right: 0, transform: [{ translateX: 5 }], position: 'absolute', borderRadius: 5, backgroundColor: 'rgba(5, 59, 74, 1)', borderWidth: 1, borderColor: 'rgba(248, 236, 174, 1)', zIndex: 2 }} />
                </ThemedView>

                {/* Card 2: Story */}
                {
                    selectedStep != 1
                        ?
                        <TouchableOpacity onPress={() => setSelectedStep(1)}>
                            <ThemedView style={{ width: 320, height: 220, backgroundColor: '#003b4f', borderRadius: 12, borderWidth: 1, borderColor: '#add7da42', overflow: 'hidden', flexDirection: 'row', zIndex: -1 }}>
                                <Image
                                    source={require('@/assets/images/kid/series-back-2.png')}
                                    style={{ width: 80, height: '100%', resizeMode: 'cover' }}
                                />
                                <ThemedView style={{ padding: 12, width: '70%' }}>
                                    <ThemedView style={{ backgroundColor: '#003b4f', borderColor: '#fcfcfc2f', borderWidth: 1, borderRadius: 20, padding: 10, alignSelf: 'flex-start', flexDirection: 'row', gap: 5, marginBottom: 4 }}>
                                        <IconStep width={24}height={24} />
                                        <ThemedText style={{ color: '#fcfcfc2f' }}>|</ThemedText>
                                        <ThemedText style={{ color: '#ffffffff', fontSize: 18, fontWeight: 'bold' }}>1</ThemedText>
                                    </ThemedView>
                                    <ThemedText style={{ color: '#7AC1C6', fontSize: 16, marginBottom: 2 }}>#4</ThemedText>
                                    <GradientText text="UNDERWATER ADVENTURES" style={{ color: '#66e0d5', fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase', marginBottom: 4 }} />
                                    <ThemedText style={{ color: '#7AC1C6', fontSize: 16, marginBottom: 4 }}>
                                        Petal Tales: The Search for Rainbow Flowers
                                    </ThemedText>
                                    <ThemedText style={{ color: '#7ac1c686', fontSize: 14 }}>12 min</ThemedText>
                                </ThemedView>
                            </ThemedView>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={() => setSelectedStep(0)}>
                            <ThemedView style={[{ width: 320, height: 220, backgroundColor: '#003b4f', borderRadius: 12, borderWidth: 1, borderColor: '#add7da42', overflow: 'hidden', flexDirection: 'row', zIndex: -1 }, { transform: [{ rotate: '-8deg' }], borderColor: '#F4A672', borderWidth: 2, boxShadow: '0 4px 40px 0 rgba(252,252,252,0.1)' }]}>
                                <Image
                                    source={require('@/assets/images/kid/series-back-2.png')}
                                    style={{ width: 80, height: '100%', resizeMode: 'cover' }}
                                />
                                <ThemedView style={{ padding: 12, width: '70%' }}>
                                    <ThemedView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <ThemedView style={{ backgroundColor: '#003b4f', borderColor: '#fcfcfc2f', borderWidth: 1, borderRadius: 20, padding: 10, alignSelf: 'flex-start', flexDirection: 'row', gap: 5, marginBottom: 4 }}>
                                            <IconStep width={24} height={24} />
                                            <ThemedText style={{ color: '#fcfcfc2f' }}>|</ThemedText>
                                            <ThemedText style={{ color: '#ffffffff', fontSize: 18, fontWeight: 'bold' }}>1</ThemedText>
                                        </ThemedView>
                                        <TouchableOpacity>
                                            <ThemedView style={{ backgroundColor: '#003b4f', borderColor: '#fcfcfc2f', borderWidth: 1, borderRadius: 20, padding: 10, alignSelf: 'flex-start', flexDirection: 'row', gap: 5, marginBottom: 4 }}>
                                                <IconCancel width={18} height={18} color={"#7AC1C6"}/>
                                            </ThemedView>
                                        </TouchableOpacity>
                                    </ThemedView>
                                    <ThemedText style={{ color: '#7AC1C6', fontSize: 16, marginBottom: 2 }}>#4</ThemedText>
                                    <GradientText text="UNDERWATER ADVENTURES" style={{ color: '#66e0d5', fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase', marginBottom: 4 }} />
                                    <ThemedText style={{ color: '#7AC1C6', fontSize: 16, marginBottom: 4 }}>
                                        Petal Tales: The Search for Rainbow Flowers
                                    </ThemedText>
                                    <ThemedText style={{ color: '#7ac1c686', fontSize: 14 }}>12 min</ThemedText>
                                </ThemedView>
                            </ThemedView>
                        </TouchableOpacity>
                }

                {/* Connector */}
                <ThemedView style={{ width: 80, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <ThemedView style={{ width: 10, height: 10, left: 0, transform: [{ translateX: -5 }], position: 'absolute', borderRadius: 5, backgroundColor: 'rgba(5, 59, 74, 1)', borderWidth: 1, borderColor: 'rgba(248, 236, 174, 1)', zIndex: 2 }} />
                    <ThemedView style={{ position: 'absolute', left: 0, width: '100%', height: 1, backgroundColor: 'rgba(248, 236, 174, 1)', zIndex: 1 }} />
                    <ThemedView style={{ width: 10, height: 10, right: 0, transform: [{ translateX: 5 }], position: 'absolute', borderRadius: 5, backgroundColor: 'rgba(5, 59, 74, 1)', borderWidth: 1, borderColor: 'rgba(248, 236, 174, 1)', zIndex: 2 }} />
                </ThemedView>

                {/* Add New Card */}
                <TouchableOpacity>
                    <ThemedView style={[{ width: 320, height: 220, backgroundColor: '#003b4f', borderRadius: 12, borderWidth: 1, borderColor: '#add7da42', overflow: 'hidden', flexDirection: 'row', zIndex: -1 }, { borderStyle: 'dashed', borderWidth: 3 }]}>
                        <ThemedView style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 10 }}>
                            <IconPlus width={24} height={24} color={"#2AEBEB"}  />
                            <GradientText text="Add New Story" style={{ fontSize: 24, fontWeight: 'bold' }} />
                        </ThemedView>
                    </ThemedView>
                </TouchableOpacity>
            </ScrollView>
        </ThemedView>
    );
}
