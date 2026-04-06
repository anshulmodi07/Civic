import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/client/HomeScreen";
import RaiseComplaintScreen from "../screens/client/RaiseComplaintScreen";
import CreateComplaintHostelScreen from "../screens/client/CreateComplaintHostelScreen";
import CreateComplaintCampusScreen from "../screens/client/CreateComplaintCampusScreen";
import MyComplaintsScreen from "../screens/client/MyComplaintsScreen";
import BrowseComplaintsScreen from "../screens/client/BrowseComplaintsScreen";
import ComplaintDetailScreen from "../screens/client/ComplaintDetailScreen";
import ComplaintMapScreen from "../screens/client/ComplaintMapScreen";

const Stack = createNativeStackNavigator();

export default function ClientNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="RaiseComplaint" component={RaiseComplaintScreen} />
      <Stack.Screen name="CreateComplaintHostel" component={CreateComplaintHostelScreen} />
      <Stack.Screen name="CreateComplaintCampus" component={CreateComplaintCampusScreen} />
      <Stack.Screen name="MyComplaints" component={MyComplaintsScreen} />
      <Stack.Screen name="BrowseComplaints" component={BrowseComplaintsScreen} />
      <Stack.Screen name="ComplaintDetail" component={ComplaintDetailScreen} />
      <Stack.Screen name="ComplaintMap" component={ComplaintMapScreen} />
    </Stack.Navigator>
  );
}