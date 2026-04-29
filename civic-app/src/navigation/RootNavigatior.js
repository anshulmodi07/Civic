import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import WorkerNavigator from "./WorkerNavigatior";
import ClientNavigator from "./ClientNavigatior";
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