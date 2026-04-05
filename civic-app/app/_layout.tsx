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

    // ❌ Not logged in → go to login
    if (!user && !inAuthGroup) {
      router.replace("/login");
      return;
    }

    // ✅ Worker → force worker dashboard
    if (user?.role === "worker" && !inWorkerGroup) {
      router.replace("/dashboard");
      return;
    }

    // ❌ Logged in user trying auth pages
    if (user && inAuthGroup) {
      router.replace("/dashboard");
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