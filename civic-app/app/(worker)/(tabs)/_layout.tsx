import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function WorkerLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
      }}
    >
      {/* DASHBOARD */}
      <Stack.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push("/(worker)/(tabs)/profile")}
              style={{ marginRight: 16 }}
            >
              <Ionicons
                name="person-circle-outline"
                size={28}
                color="#2563eb"
              />
            </TouchableOpacity>
          ),
        }}
      />

      {/* OTHER SCREENS */}
      <Stack.Screen name="all-tasks" options={{ title: "All Tasks" }} />
      <Stack.Screen name="my-tasks" options={{ title: "My Tasks" }} />
      <Stack.Screen
        name="incomplete-tasks"
        options={{ title: "Incomplete Tasks" }}
      />
      <Stack.Screen name="profile" options={{ title: "Profile" }} />
    </Stack>
  );
}