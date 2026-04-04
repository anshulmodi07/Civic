import { Slot, useRouter, useSegments } from "expo-router";
import { useContext, useEffect } from "react";
import { AuthContext, AuthProvider } from "@/src/context/AuthContext";

function RootLayoutInner() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  const segments = useSegments() as string[];

  useEffect(() => {
    if (loading) return;

    const isAuthRoute = segments.includes("(auth)");
    const isWorkerRoute = segments.includes("(worker)");

    if (!user && !isAuthRoute) {
      router.replace("/login");
      return;
    }

    if (user?.role === "worker" && !isWorkerRoute) {
      router.replace("/dashboard");
      return;
    }

    if (user && user.role !== "worker" && isAuthRoute) {
      router.replace("/");
      return;
    }
  }, [user, loading, segments, router]);

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