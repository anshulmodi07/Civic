import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StatusBadge from './StatusBadge';
import SLABadge from './SLABadge';

export default function ComplaintCard({ item, onPress, showSLA = false, slaBreached = false }) {
  const getIssueIcon = (issueType) => {
    const type = issueType?.toLowerCase() || '';
    if (type.includes('road') || type.includes('pothole')) return 'car-outline';
    if (type.includes('light') || type.includes('street')) return 'bulb-outline';
    if (type.includes('water') || type.includes('drain')) return 'water-outline';
    if (type.includes('garbage') || type.includes('waste')) return 'trash-outline';
    if (type.includes('park') || type.includes('garden')) return 'leaf-outline';
    return 'alert-circle-outline';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
      case 'new':
        return '#f59e0b';
      case 'assigned':
      case 'in-progress':
        return '#3b82f6';
      case 'closed':
      case 'resolved':
        return '#22c55e';
      default:
        return '#64748b';
    }
  };

  return (
    <TouchableOpacity 
      onPress={() => onPress?.(item)} 
      style={styles.card}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconContainer, { backgroundColor: `${getStatusColor(item?.status)}15` }]}>
            <Ionicons 
              name={getIssueIcon(item?.issueType)} 
              size={22} 
              color={getStatusColor(item?.status)} 
            />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.title} numberOfLines={1}>
              {item?.title || item?.issueType?.toUpperCase() || 'Untitled Complaint'}
            </Text>
            <Text style={styles.date}>
              {formatDate(item?.createdAt)}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
      </View>

      {/* Description/Summary */}
      {item?.summary || item?.description ? (
        <Text style={styles.summary} numberOfLines={2}>
          {item?.summary || item?.description}
        </Text>
      ) : null}

      {/* Footer with Badges */}
      <View style={styles.footer}>
        <View style={styles.badges}>
          {item?.status && (
            <StatusBadge status={item.status} showIcon={false} compact />
          )}
          {showSLA && (
            <SLABadge breached={slaBreached} showIcon={false} compact />
          )}
        </View>

        {/* Meta Info */}
        <View style={styles.meta}>
          {item?.images && item.images.length > 0 && (
            <View style={styles.metaItem}>
              <Ionicons name="images-outline" size={14} color="#64748b" />
              <Text style={styles.metaText}>{item.images.length}</Text>
            </View>
          )}
          {item?.location && (
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={14} color="#64748b" />
            </View>
          )}
        </View>
      </View>

      {/* Priority Indicator */}
      <View style={[styles.priorityBar, { backgroundColor: getStatusColor(item?.status) }]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
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
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  date: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  summary: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    flex: 1,
  },
  meta: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  priorityBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
});