import { Stack } from 'expo-router';
import React from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function AuthLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
    >
      <Stack.Screen name="(focus)" options={{ headerShown: false }} />
      <Stack.Screen name="(pathway)" options={{ headerShown: false }} />
      <Stack.Screen name="(library)" options={{ headerShown: false }} />
    </Stack>
  );
}
