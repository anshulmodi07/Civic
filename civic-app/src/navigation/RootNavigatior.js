import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import WorkerNavigator from "./WorkerNavigator";
import ClientNavigator from "./ClientNavigator";
import AuthNavigator from "./AuthNavigator";

export default function RootNavigator() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  if (!user) {
    return <AuthNavigator />;
  }

  return user.role === "worker"
    ? <WorkerNavigator />
    : <ClientNavigator />;
}