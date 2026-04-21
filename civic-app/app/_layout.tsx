import { Slot, useRouter, useSegments } from "expo-router";
import { useContext, useEffect } from "react";
import { AuthContext, AuthProvider } from "@/src/context/AuthContext";



function RootLayoutInner() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
    const segments = useSegments() as string[];
  
  useEffect(() => {
    if (loading) return;



const inAuthGroup = segments.includes("(auth)");
const inWorkerGroup = segments.includes("(worker)");
const inClientGroup = segments.includes("(client)");

// Not logged in
if (!user && !inAuthGroup) {
  router.replace("/(auth)/login");
  return;
}

// Logged in → block auth pages
if (user && inAuthGroup) {
  if (user.role === "worker") {
    router.replace("/(worker)/(tabs)/dashboard");
  } else {
    router.replace("/(client)");
  }
  return;
}

// Worker protection
if (user?.role === "worker" && !inWorkerGroup && !inAuthGroup) {
  router.replace("/(worker)/(tabs)/dashboard");
  return;
}

// Client protection
if (user?.role === "client" && !inClientGroup && !inAuthGroup) {
  router.replace("/(client)/browse");
  return;
}

  }, [user, loading, segments]);

  if (loading) return null;

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutInner />
    </AuthProvider>
  );
}