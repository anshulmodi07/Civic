import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text>This is a modal</Text>
      <Link href="/(tabs)/dashboard">Go to Dashboard</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});