import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar, RefreshControl, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
// import { getMyComplaints } from "../api/complaint.api";
import StatusBadge from "../../components/StatusBadge";
import { checkSLA } from "../../utils/sla";
import SLABadge from "../../components/SLABadge";
import { getMyComplaints } from "../../api/complaint.api";

const getDisplayStatus = (complaint) => {
  if (complaint?.assignedTask?.status) return complaint.assignedTask.status;
  return complaint.status;
};

const getDepartmentName = (complaint) => {
  const dept = complaint.departmentId;
  if (!dept) return "";
  if (typeof dept === "string") return dept;
  return dept.name || "";
};

export default function MyComplaintsScreen({ navigation }) {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all'); // all, pending, in-progress, closed

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
  try {
    const data = await getMyComplaints();
    setComplaints(data || []);
  } catch (err) {
    console.log(err);
  } finally {
    setIsLoading(false);
    setIsRefreshing(false);
  }
};

  const onRefresh = () => {
    setIsRefreshing(true);
    loadComplaints();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return { bg: '#fef3c7', text: '#92400e', icon: 'hourglass-outline' };
      case 'in-progress':
      case 'accepted':
        return { bg: '#dbeafe', text: '#1e40af', icon: 'time-outline' };
      case 'completed':
        return { bg: '#dcfce7', text: '#15803d', icon: 'checkmark-circle-outline' };
      case 'incompleted':
        return { bg: '#fee2e2', text: '#b91c1c', icon: 'close-circle-outline' };
      default:
        return { bg: '#f1f5f9', text: '#475569', icon: 'help-circle-outline' };
    }
  };

  const getFilteredComplaints = () => {
    if (filterStatus === 'all') return complaints;
    return complaints.filter(c => getDisplayStatus(c) === filterStatus);
  };

  const getStatusCounts = () => {
    return {
      all: complaints.length,
      pending: complaints.filter(c => getDisplayStatus(c) === 'pending').length,
      'in-progress': complaints.filter(c => ['in-progress','accepted'].includes(getDisplayStatus(c))).length,
      closed: complaints.filter(c => getDisplayStatus(c) === 'completed').length,
    };
  };

  const renderItem = ({ item }) => {
    const displayStatus = getDisplayStatus(item);
    const departmentName = getDepartmentName(item);
    const sla = checkSLA(departmentName, item.createdAt, displayStatus);
    const statusColor = getStatusColor(displayStatus);
    const daysSince = Math.floor((Date.now() - new Date(item.createdAt)) / (1000 * 60 * 60 * 24));

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("ComplaintDetail", { id: item._id })}
        style={styles.complaintCard}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <View style={[styles.issueIcon, { backgroundColor: statusColor.bg }]}>
              <Ionicons name={statusColor.icon} size={20} color={statusColor.text} />
            </View>
            <View style={styles.issueInfo}>
              <Text style={styles.issueType}>{departmentName.toUpperCase()}</Text>
              <Text style={styles.issueDate}>
                {daysSince === 0 ? 'Today' : daysSince === 1 ? 'Yesterday' : `${daysSince} days ago`}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.cardFooter}>
          <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor.text }]} />
            <Text style={[styles.statusText, { color: statusColor.text }]}>
              {String(displayStatus).replace('-', ' ').toUpperCase()}
            </Text>
          </View>

          {sla.breached && (
            <View style={styles.slaBadge}>
              <Ionicons name="alert-circle" size={14} color="#dc2626" />
              <Text style={styles.slaText}>SLA Breach</Text>
            </View>
          )}
        </View>

        {item.images && item.images.length > 0 && (
          <View style={styles.imageIndicator}>
            <Ionicons name="images-outline" size={14} color="#64748b" />
            <Text style={styles.imageCount}>{item.images.length} photo{item.images.length > 1 ? 's' : ''}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const FilterButton = ({ label, value, count }) => (
    <TouchableOpacity
      onPress={() => setFilterStatus(value)}
      style={[
        styles.filterButton,
        filterStatus === value && styles.filterButtonActive
      ]}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.filterButtonText,
        filterStatus === value && styles.filterButtonTextActive
      ]}>
        {label}
      </Text>
      <View style={[
        styles.filterCount,
        filterStatus === value && styles.filterCountActive
      ]}>
        <Text style={[
          styles.filterCountText,
          filterStatus === value && styles.filterCountTextActive
        ]}>
          {count}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const counts = getStatusCounts();
  const filteredComplaints = getFilteredComplaints();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LinearGradient
          colors={['#1e3a8a', '#3b82f6']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>My Complaints</Text>
        </LinearGradient>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Loading complaints...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient
        colors={['#1e3a8a', '#3b82f6']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>My Complaints</Text>
            <Text style={styles.headerSubtitle}>Track your submitted issues</Text>
          </View>
          <TouchableOpacity style={styles.filterIcon}>
            <Ionicons name="options-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <FilterButton label="All" value="all" count={counts.all} />
        <FilterButton label="Pending" value="pending" count={counts.pending} />
        <FilterButton label="Active" value="in-progress" count={counts['in-progress']} />
        <FilterButton label="Resolved" value="closed" count={counts.closed} />
      </View>

      {/* Complaints List */}
      {filteredComplaints.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="document-text-outline" size={64} color="#cbd5e1" />
          </View>
          <Text style={styles.emptyTitle}>No Complaints Found</Text>
          <Text style={styles.emptySubtitle}>
            {filterStatus === 'all' 
              ? "You haven't submitted any complaints yet"
              : `No ${filterStatus.replace('-', ' ')} complaints`
            }
          </Text>
          {filterStatus === 'all' && (
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('CreateComplaint')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#2563eb', '#1e40af']}
                style={styles.emptyButtonGradient}
              >
                <Ionicons name="add-circle-outline" size={20} color="#fff" />
                <Text style={styles.emptyButtonText}>Raise First Complaint</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredComplaints}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor="#2563eb"
              colors={['#2563eb']}
            />
          }
        />
      )}
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
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    fontWeight: '500',
  },
  filterIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
  },
  filterButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginRight: 6,
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  filterCount: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: 'center',
  },
  filterCountActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  filterCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  filterCountTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 20,
  },
  complaintCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  issueIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  issueInfo: {
    flex: 1,
  },
  issueType: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
    letterSpacing: 0.3,
  },
  issueDate: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  slaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  slaText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#dc2626',
    marginLeft: 4,
    letterSpacing: 0.3,
  },
  imageIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  imageCount: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 6,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyButton: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 8,
    letterSpacing: 0.3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: '#64748b',
    fontWeight: '500',
  },
});
