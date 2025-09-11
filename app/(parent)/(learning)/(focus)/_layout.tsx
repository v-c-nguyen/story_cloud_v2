import { Stack } from 'expo-router';
import React from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function AuthLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
    >
      <Stack.Screen name="new_focus"  />
      <Stack.Screen name="view_focus" />
      <Stack.Screen name="edit_focus" />
      <Stack.Screen name="index"/>
    </Stack>
  );
}
