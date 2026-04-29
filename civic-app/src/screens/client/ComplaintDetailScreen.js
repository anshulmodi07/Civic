import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, StatusBar, ActivityIndicator, Dimensions } from "react-native";
import { useEffect, useState } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import {
  addComplaintComment,
  getAssetUrl,
  getComplaintById,
  getComplaintComments,
  getComplaintTimeline,
  toggleSupport,
} from "../../api/complaint.api";
import StatusBadge from "../../components/StatusBadge";
import { TextInput } from "react-native";
// import { addComment, getComments } from "../../api/comment.api";
// import api from "../../api/axios";

const { width } = Dimensions.get('window');

/* Data now comes from backend (Complaint + Task + Interaction) */

/* ─────────────────────────────────────────────────────── */

export default function ComplaintDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [complaint, setComplaint] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [supportCount, setSupportCount] = useState(0);
  const [hasSupported, setHasSupported] = useState(false);

  useEffect(() => {
    loadComplaint();
    loadComments();
  }, []);

  const loadComplaint = async () => {
    try {
      const data = await getComplaintById(id);
      setComplaint(data);
      setSupportCount(Number(data?.upvotesCount || 0));
      setHasSupported(Boolean(data?.hasUpvoted));

      const timelineData = await getComplaintTimeline(id);
      setTimeline(timelineData || []);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      setLoadingComments(true);
      const data = await getComplaintComments(id);
      setComments(data || []);
    } catch (err) {
      console.log("Failed to load comments", err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentInput.trim()) return;
    try {
      const created = await addComplaintComment(id, commentInput.trim());
      setComments((prev) => [created, ...prev]);
      setCommentInput("");
    } catch (err) {
      console.log("Failed to add comment", err);
    }
  };

  const [isSupporting, setIsSupporting] = useState(false);

  const handleSupport = async () => {
    if (isSupporting) return;
    setIsSupporting(true);

    try {
      const result = await toggleSupport(id);
      setSupportCount(result.upvotes);
      setHasSupported(result.upvoted);
    } catch (err) {
      console.log("Support failed", err);
    } finally {
      setIsSupporting(false);
    }
  };

  const getDisplayStatus = (c) => {
    if (c?.assignedTask?.status) return c.assignedTask.status;
    return c.status;
  };

  const getDepartmentName = (c) => {
    const dept = c.departmentId;
    if (!dept) return "";
    if (typeof dept === "string") return dept;
    return dept.name || "";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':     return { bg: '#fef3c7', text: '#92400e', icon: 'hourglass-outline',   label: 'Pending Review' };
      case 'accepted':    return { bg: '#dbeafe', text: '#1e40af', icon: 'person-outline',       label: 'Accepted by Worker' };
      case 'in-progress': return { bg: '#dbeafe', text: '#1e40af', icon: 'construct-outline',    label: 'Work in Progress' };
      case 'completed':   return { bg: '#dcfce7', text: '#15803d', icon: 'checkmark-circle',     label: 'Resolved' };
      case 'incompleted': return { bg: '#fee2e2', text: '#b91c1c', icon: 'close-circle',         label: 'Marked Incomplete' };
      default:            return { bg: '#f1f5f9', text: '#475569', icon: 'help-circle-outline',  label: status };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LinearGradient colors={['#1e3a8a', '#3b82f6']} style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Complaint Details</Text>
          <View style={styles.placeholder} />
        </LinearGradient>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Loading details...</Text>
        </View>
      </View>
    );
  }

  if (!complaint) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
          <Text style={styles.errorText}>Failed to load complaint</Text>
        </View>
      </View>
    );
  }

  const statusInfo = getStatusColor(getDisplayStatus(complaint));
  const daysSince = Math.floor((Date.now() - new Date(complaint.createdAt)) / (1000 * 60 * 60 * 24));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={['#1e3a8a', '#3b82f6']} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Complaint Details</Text>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* Status Card */}
        <View style={styles.statusCard}>
          <LinearGradient colors={[statusInfo.bg, statusInfo.bg]} style={styles.statusGradient}>
            <View style={styles.statusHeader}>
              <View style={styles.statusIconContainer}>
                <Ionicons name={statusInfo.icon} size={32} color={statusInfo.text} />
              </View>
              <View style={styles.statusInfo}>
                <Text style={styles.statusLabel}>Status</Text>
                <Text style={[styles.statusValue, { color: statusInfo.text }]}>{statusInfo.label}</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Department & Timing */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}><Ionicons name="alert-circle" size={20} color="#2563eb" /></View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Department</Text>
              <Text style={styles.infoValue}>{getDepartmentName(complaint).toUpperCase()}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}><Ionicons name="calendar" size={20} color="#2563eb" /></View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Submitted</Text>
              <Text style={styles.infoValue}>{formatDate(complaint.createdAt)}</Text>
              <Text style={styles.infoSubtext}>
                {daysSince === 0 ? 'Today' : daysSince === 1 ? 'Yesterday' : `${daysSince} days ago`}
              </Text>
            </View>
          </View>
          {complaint.location && (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}><Ionicons name="location" size={20} color="#2563eb" /></View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Location</Text>
                  <Text style={styles.infoCoords}>
                    {complaint.location.lat.toFixed(6)}, {complaint.location.lng.toFixed(6)}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text" size={20} color="#334155" />
            <Text style={styles.sectionTitle}>Description</Text>
          </View>
          <View style={styles.descriptionCard}>
            <Text style={styles.descriptionText}>{complaint.description}</Text>
          </View>
        </View>

        {/* Community Support */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="people" size={20} color="#334155" />
            <Text style={styles.sectionTitle}>Community Support</Text>
          </View>
          <View style={styles.supportCard}>
            <Text style={styles.supportCount}>👍 {supportCount} citizens support this issue</Text>
            <TouchableOpacity
              style={[styles.supportButton, hasSupported && { backgroundColor: "#94a3b8" }]}
              onPress={handleSupport}
              disabled={hasSupported}
            >
              <Ionicons name="thumbs-up" size={18} color="#fff" />
              <Text style={styles.supportButtonText}>{hasSupported ? "Supported" : "Support Issue"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Submitted Images */}
        {complaint.images && complaint.images.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="images" size={20} color="#334155" />
              <Text style={styles.sectionTitle}>Evidence Photos ({complaint.images.length})</Text>
            </View>
            <View style={styles.imagesGrid}>
              {complaint.images.map((img, i) => (
                <TouchableOpacity key={i} style={styles.imageContainer} activeOpacity={0.8} onPress={() => setSelectedImageIndex(i)}>
                  <Image source={{ uri: getAssetUrl(img) }} style={styles.thumbnail} resizeMode="cover" />
                  <View style={styles.imageOverlay}><Ionicons name="expand-outline" size={20} color="#fff" /></View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Assigned Task */}
        {complaint.assignedTask && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="people" size={20} color="#334155" />
              <Text style={styles.sectionTitle}>Assigned Task</Text>
            </View>
            <View style={styles.teamCard}>
              <View style={styles.teamInfo}>
                <View style={styles.teamAvatar}><Ionicons name="person" size={24} color="#2563eb" /></View>
                <View style={styles.teamDetails}>
                  <Text style={styles.teamName}>Task #{String(complaint.assignedTask._id).slice(-6)}</Text>
                  <Text style={styles.teamRole}>Status: {String(complaint.assignedTask.status).replace("-", " ")}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Proof of Work */}
        {getDisplayStatus(complaint) === "completed" &&
          complaint.assignedTask?.proofImages &&
          complaint.assignedTask.proofImages.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="checkmark-done-circle" size={20} color="#15803d" />
              <Text style={[styles.sectionTitle, { color: '#15803d' }]}>Proof of Completion</Text>
            </View>
            <View style={styles.imagesGrid}>
              {complaint.assignedTask.proofImages.map((img, i) => (
                <TouchableOpacity key={i} style={styles.imageContainer} activeOpacity={0.8}>
                  <Image source={{ uri: getAssetUrl(img) }} style={styles.thumbnail} resizeMode="cover" />
                  <View style={[styles.imageOverlay, { backgroundColor: 'rgba(21, 128, 61, 0.7)' }]}>
                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Timeline */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time" size={20} color="#334155" />
            <Text style={styles.sectionTitle}>Activity Timeline</Text>
          </View>
          <View style={styles.timeline}>
            {timeline.length === 0 ? (
              <Text style={{ color: "#64748b", paddingLeft: 8 }}>No timeline updates available</Text>
            ) : (
              timeline.map((item, index) => (
                <View key={index} style={styles.timelineItem}>
                  <View style={[styles.timelineDot, {
                    backgroundColor:
                      item.status === "completed" ? "#22c55e"
                      : item.status === "accepted" ? "#3b82f6"
                      : item.status === "in-progress" ? "#f59e0b"
                      : item.status === "incompleted" ? "#ef4444"
                      : "#94a3b8",
                  }]} />
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineTitle}>
                      {(item.status || item.type || "UPDATE").replace(/-/g, " ").toUpperCase()}
                    </Text>
                    <Text style={styles.timelineDate}>{formatDate(item.at)}</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>

        {/* Comments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="chatbubble-ellipses" size={20} color="#334155" />
            <Text style={styles.sectionTitle}>Community Discussion</Text>
          </View>
          {loadingComments ? (
            <ActivityIndicator size="small" color="#2563eb" />
          ) : comments.length === 0 ? (
            <Text style={{ color: "#64748b" }}>No comments yet. Be the first to discuss.</Text>
          ) : (
            comments.map((comment, index) => (
              <View key={index} style={styles.commentItem}>
                <Ionicons name="person-circle" size={28} color="#64748b" />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={styles.commentAuthor}>{comment.userId?.name || "Citizen"}</Text>
                  <Text style={styles.commentText}>{comment.commentText}</Text>
                  <Text style={styles.commentTime}>{formatDate(comment.createdAt)}</Text>
                </View>
              </View>
            ))
          )}
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              value={commentInput}
              onChangeText={setCommentInput}
            />
            <TouchableOpacity style={styles.commentButton} onPress={handleAddComment}>
              <Ionicons name="send" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff', letterSpacing: 0.3 },
  moreButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  placeholder: { width: 40 },
  content: { flex: 1, paddingHorizontal: 20 },
  statusCard: { marginTop: 20, marginBottom: 16, borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  statusGradient: { padding: 20 },
  statusHeader: { flexDirection: 'row', alignItems: 'center' },
  statusIconContainer: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  statusInfo: { flex: 1 },
  statusLabel: { fontSize: 14, fontWeight: '600', color: '#64748b', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 },
  statusValue: { fontSize: 22, fontWeight: '700', letterSpacing: 0.3 },
  infoCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start' },
  infoIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  infoContent: { flex: 1, paddingTop: 2 },
  infoLabel: { fontSize: 13, fontWeight: '600', color: '#64748b', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  infoValue: { fontSize: 16, fontWeight: '600', color: '#1e293b', marginBottom: 2 },
  infoSubtext: { fontSize: 13, color: '#94a3b8', fontWeight: '500' },
  infoCoords: { fontSize: 14, color: '#475569', fontFamily: 'monospace', fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 16 },
  section: { marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#334155', marginLeft: 8, letterSpacing: 0.3 },
  descriptionCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  descriptionText: { fontSize: 15, color: '#475569', lineHeight: 24, fontWeight: '500' },
  imagesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  imageContainer: { width: (width - 52) / 2, height: (width - 52) / 2, borderRadius: 16, overflow: 'hidden', position: 'relative' },
  thumbnail: { width: '100%', height: '100%' },
  imageOverlay: { position: 'absolute', bottom: 8, right: 8, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  teamCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  teamInfo: { flexDirection: 'row', alignItems: 'center' },
  teamAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  teamDetails: { flex: 1 },
  teamName: { fontSize: 17, fontWeight: '700', color: '#1e293b', marginBottom: 2 },
  teamRole: { fontSize: 14, color: '#64748b', fontWeight: '500' },
  timeline: { backgroundColor: '#fff', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  timelineItem: { flexDirection: 'row', paddingBottom: 16, position: 'relative' },
  timelineDot: { width: 12, height: 12, borderRadius: 6, marginTop: 4, marginRight: 16 },
  timelineContent: { flex: 1 },
  timelineTitle: { fontSize: 16, fontWeight: '600', color: '#1e293b', marginBottom: 4 },
  timelineDate: { fontSize: 13, color: '#64748b', fontWeight: '500' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 15, color: '#64748b', fontWeight: '500' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  errorText: { marginTop: 16, fontSize: 18, fontWeight: '600', color: '#ef4444' },
  commentItem: { flexDirection: "row", marginTop: 12, alignItems: "flex-start" },
  commentAuthor: { fontSize: 13, fontWeight: '700', color: '#334155', marginBottom: 2 },
  commentText: { fontSize: 14, color: "#0f172a" },
  commentTime: { fontSize: 12, color: "#64748b", marginTop: 4 },
  commentInputContainer: { flexDirection: "row", marginTop: 15 },
  commentInput: { flex: 1, borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 10, padding: 10 },
  commentButton: { backgroundColor: "#2563eb", padding: 10, borderRadius: 10, marginLeft: 8 },
  supportCard: { backgroundColor: "#f8fafc", padding: 15, borderRadius: 12 },
  supportCount: { fontSize: 15, marginBottom: 10, color: "#334155" },
  supportButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#2563eb", padding: 12, borderRadius: 10 },
  supportButtonText: { color: "#fff", marginLeft: 6, fontWeight: "600" },
});
