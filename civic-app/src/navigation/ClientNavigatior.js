import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/client/HomeScreen";
import CreateComplaintScreen from "../screens/client/CreateComplaintScreen";
import MyComplaintsScreen from "../screens/client/MyComplaintsScreen";
import ComplaintDetailScreen from "../screens/client/ComplaintDetailScreen";

const Stack = createNativeStackNavigator();

export default function ClientNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CreateComplaint" component={CreateComplaintScreen} />
      <Stack.Screen name="MyComplaints" component={MyComplaintsScreen} />
      <Stack.Screen name="ComplaintDetail" component={ComplaintDetailScreen} />
    </Stack.Navigator>
  );
}