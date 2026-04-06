import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { useEffect, useState, useContext } from "react";
import { getCitizenDashboard } from "../../api/dashboard.api";
import { AuthContext } from "../../context/AuthContext";

export default function HomeScreen({ navigation }) {
  const { user } = useContext(AuthContext);

const [dashboard, setDashboard] = useState({
  myComplaints: 0,
  activeComplaints: 0,
  resolvedComplaints: 0,
});

useEffect(() => {
  const loadDashboard = async () => {
    try {
      const data = await getCitizenDashboard();
      setDashboard(data);
    } catch (err) {
      console.log("Dashboard error:", err);
    }
  };

  loadDashboard();
}, []);
  const stats = [
  { label: "Active", count: dashboard.activeComplaints, icon: "time-outline" },
  { label: "Resolved", count: dashboard.resolvedComplaints, icon: "checkmark-circle-outline" },
  { label: "Total", count: dashboard.myComplaints, icon: "document-text-outline" },
];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#1e3a8a', '#3b82f6', '#60a5fa']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Welcome Back</Text>
            <Text style={styles.userName}>{user?.name||"Citizen"}</Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
            <View style={styles.badge} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.iconContainer, { backgroundColor: index === 0 ? '#dbeafe' : index === 1 ? '#dcfce7' : '#fef3c7' }]}>
                <Ionicons 
                  name={stat.icon} 
                  size={24} 
                  color={index === 0 ? '#1e40af' : index === 1 ? '#15803d' : '#a16207'} 
                />
              </View>
              <Text style={styles.statCount}>{stat.count}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity
            style={styles.primaryCard}
            onPress={() => navigation.navigate("RaiseComplaint")}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#2563eb', '#1e40af']}
              style={styles.primaryCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.cardIcon}>
                <Ionicons name="add-circle" size={32} color="#fff" />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.primaryCardTitle}>Raise New Complaint</Text>
                <Text style={styles.primaryCardSubtitle}>Report civic issues in your area</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.7)" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryCard}
            onPress={() => navigation.navigate("MyComplaints")}
            activeOpacity={0.8}
          >
            <View style={styles.cardIcon}>
              <Ionicons name="document-text-outline" size={28} color="#2563eb" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.secondaryCardTitle}>My Complaints</Text>
              <Text style={styles.secondaryCardSubtitle}>Track your reported issues</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#94a3b8" />
          </TouchableOpacity>
          <TouchableOpacity
  style={styles.secondaryCard}
  onPress={() => navigation.navigate("BrowseComplaints")}
  activeOpacity={0.8}
>
  <View style={styles.cardIcon}>
    <Ionicons name="globe-outline" size={28} color="#2563eb" />
  </View>

  <View style={styles.cardContent}>
    <Text style={styles.secondaryCardTitle}>
      Browse City Complaints
    </Text>

    <Text style={styles.secondaryCardSubtitle}>
      See issues reported around you
    </Text>
  </View>

  <Ionicons name="chevron-forward" size={24} color="#94a3b8" />
</TouchableOpacity>
<TouchableOpacity
  style={styles.secondaryCard}
  onPress={() => navigation.navigate("ComplaintMap")}
  activeOpacity={0.8}
>
  <View style={styles.cardIcon}>
    <Ionicons name="map-outline" size={28} color="#2563eb" />
  </View>

  <View style={styles.cardContent}>
    <Text style={styles.secondaryCardTitle}>
      Complaint Map
    </Text>

    <Text style={styles.secondaryCardSubtitle}>
      View nearby civic issues on map
    </Text>
  </View>

  <Ionicons name="chevron-forward" size={24} color="#94a3b8" />
</TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Updates</Text>
          
          <View style={styles.activityCard}>
            <View style={styles.activityDot} />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Street Light Repair</Text>
              <Text style={styles.activityStatus}>Status updated to "In Progress"</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
          </View>

          <View style={styles.activityCard}>
            <View style={[styles.activityDot, { backgroundColor: '#22c55e' }]} />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Pothole on Main Street</Text>
              <Text style={styles.activityStatus}>Resolved by Municipal Corp</Text>
              <Text style={styles.activityTime}>1 day ago</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#1e40af',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  userName: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '700',
    marginTop: 4,
    letterSpacing: 0.3,
  },
  notificationBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ef4444',
    borderWidth: 2,
    borderColor: '#fff',
  },
  content: {
    flex: 1,
    marginTop: -20,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statCount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  primaryCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  cardIcon: {
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  primaryCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  primaryCardSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  secondaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  secondaryCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  secondaryCardSubtitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  activityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3b82f6',
    marginRight: 12,
    marginTop: 4,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  activityStatus: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#94a3b8',
  },
});