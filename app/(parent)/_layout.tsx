import { Stack } from 'expo-router';
import React from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function ParentLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
    >
      <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
      <Stack.Screen name="(learning)" options={{ headerShown: false }} />
      <Stack.Screen name="(profiles)" options={{ headerShown: false }} />
      <Stack.Screen name="(listen)" options={{ headerShown: false }} />
    </Stack>
  );
}
