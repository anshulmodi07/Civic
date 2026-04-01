import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

/**
 * StatusBadge Component
 * Displays a colored badge for task status with icon
 * 
 * @param {string} status - The task status (assigned, accepted, in-progress, resolved)
 * @param {string} size - Size variant (small, medium, large) - default: medium
 * @param {boolean} showIcon - Whether to show icon - default: true
 */
export default function StatusBadge({ status, size = "medium", showIcon = true }) {
  const getStatusConfig = (status) => {
    const configs = {
      assigned: {
        color: "#F59E0B",
        bgColor: "#FEF3C7",
        textColor: "#F59E0B",
        icon: "document-text",
        label: "ASSIGNED",
      },
      accepted: {
        color: "#8B5CF6",
        bgColor: "#F3E8FF",
        textColor: "#8B5CF6",
        icon: "checkmark-circle",
        label: "ACCEPTED",
      },
      "in-progress": {
        color: "#3B82F6",
        bgColor: "#DBEAFE",
        textColor: "#3B82F6",
        icon: "time",
        label: "IN PROGRESS",
      },
      resolved: {
        color: "#10B981",
        bgColor: "#D1FAE5",
        textColor: "#10B981",
        icon: "checkmark-done",
        label: "RESOLVED",
      },
      pending: {
        color: "#6B7280",
        bgColor: "#F3F4F6",
        textColor: "#6B7280",
        icon: "ellipsis-horizontal",
        label: "PENDING",
      },
    };
    return configs[status] || configs.pending;
  };

  const getSizeConfig = (size) => {
    const sizes = {
      small: {
        iconSize: 14,
        fontSize: 10,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
        gap: 3,
      },
      medium: {
        iconSize: 16,
        fontSize: 11,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
        gap: 4,
      },
      large: {
        iconSize: 18,
        fontSize: 13,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        gap: 6,
      },
    };
    return sizes[size] || sizes.medium;
  };

  const statusConfig = getStatusConfig(status);
  const sizeConfig = getSizeConfig(size);

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: statusConfig.bgColor,
          paddingVertical: sizeConfig.paddingVertical,
          paddingHorizontal: sizeConfig.paddingHorizontal,
          borderRadius: sizeConfig.borderRadius,
          gap: sizeConfig.gap,
        },
      ]}
    >
      {showIcon && (
        <Ionicons
          name={statusConfig.icon}
          size={sizeConfig.iconSize}
          color={statusConfig.color}
        />
      )}
      <Text
        style={[
          styles.text,
          {
            color: statusConfig.textColor,
            fontSize: sizeConfig.fontSize,
          },
        ]}
      >
        {statusConfig.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  text: {
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});