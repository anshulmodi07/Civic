import { Slot, useRouter, useSegments } from "expo-router";
import { useContext, useEffect } from "react";
import { AuthContext, AuthProvider } from "@/src/context/AuthContext";



function RootLayoutInner() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inWorkerGroup = segments[0] === "(worker)";
    const inClientGroup = segments[0] === "(client)";

    // ❌ Not logged in → go to login
    if (!user && !inAuthGroup) {
      router.replace("/login");
      return;
    }

    // ❌ Logged in user trying to access auth pages → redirect out
    if (user && inAuthGroup) {
      if (user.role === "worker") {
        router.replace("/(worker)/(tabs)/dashboard");  // ✅ full path
      } else {
        router.replace("/(client)/browse");  // adjust for client
      }
      return;
    }

    // ✅ Worker trying to access non-worker area → redirect
    // ⚠️ Do NOT redirect if already anywhere inside (worker)
    if (user?.role === "worker" && !inWorkerGroup) {
      router.replace("/(worker)/(tabs)/dashboard");  // ✅ full path
      return;
    }

    // ✅ Client trying to access non-client area → redirect
    if (user?.role === "client" && !inClientGroup) {
      router.replace("/(client)/browse");  // adjust as needed
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