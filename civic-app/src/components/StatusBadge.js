import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';

const STATUS_CONFIG = {
  pending: {
    bg: '#fef3c7',
    text: '#92400e',
    border: '#fde68a',
    icon: 'hourglass-outline',
    label: 'Pending'
  },
  new: {
    bg: '#fef3c7',
    text: '#92400e',
    border: '#fde68a',
    icon: 'alert-circle-outline',
    label: 'New'
  },
  assigned: {
    bg: '#dbeafe',
    text: '#1e40af',
    border: '#bfdbfe',
    icon: 'person-outline',
    label: 'Assigned'
  },
  'in-progress': {
    bg: '#dbeafe',
    text: '#1e40af',
    border: '#bfdbfe',
    icon: 'construct-outline',
    label: 'In Progress'
  },
  closed: {
    bg: '#dcfce7',
    text: '#15803d',
    border: '#bbf7d0',
    icon: 'checkmark-circle',
    label: 'Resolved'
  },
  resolved: {
    bg: '#dcfce7',
    text: '#15803d',
    border: '#bbf7d0',
    icon: 'checkmark-circle',
    label: 'Resolved'
  },
  rejected: {
    bg: '#fee2e2',
    text: '#991b1b',
    border: '#fecaca',
    icon: 'close-circle-outline',
    label: 'Rejected'
  }
};

export default function StatusBadge({ status, showIcon = true, compact = false }) {
  const config = STATUS_CONFIG[status?.toLowerCase()] || STATUS_CONFIG.pending;

  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: config.bg,
        borderColor: config.border,
      },
      compact && styles.compact
    ]}>
      {showIcon && (
        <Ionicons 
          name={config.icon} 
          size={compact ? 12 : 14} 
          color={config.text} 
          style={styles.icon}
        />
      )}
      <View style={[styles.dot, { backgroundColor: config.text }]} />
      <Text style={[
        styles.text,
        { color: config.text },
        compact && styles.textCompact
      ]}>
        {config.label.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  compact: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  icon: {
    marginRight: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  textCompact: {
    fontSize: 11,
    letterSpacing: 0.3,
  },
});