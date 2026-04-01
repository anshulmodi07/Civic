import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DashboardScreen from "../screens/worker/DashboardScreen";
import MyTasksScreen from "../screens/worker/MyTasksScreen";
import TaskDetailScreen from "../screens/worker/TaskDetailScreen";
import CompleteTaskScreen from "../screens/worker/CompleteTaskScreen";

const Stack = createNativeStackNavigator();

export default function WorkerNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="MyTasks" component={MyTasksScreen} />
      <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
      <Stack.Screen name="CompleteTask" component={CompleteTaskScreen} />
    </Stack.Navigator>
  );
}