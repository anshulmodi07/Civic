import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="dashboard" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="all-tasks" options={{ title: "All Tasks" }} />
      <Tabs.Screen name="my-tasks" options={{ title: "My Tasks" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      <Tabs.Screen name="incomplete-tasks" options={{ title: "Incomplete" }} />
    </Tabs>
  );
}