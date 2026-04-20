"use client"

import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { MATTE_COLORS, SPACING } from "../utils/theme"

export default function LocationCard({ location, loading, onRefresh }) {
  const formatCoordinates = (lat, lng) => {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
  }

  const getLocationStatus = () => {
    if (loading) return { text: "Getting location...", color: '#f59e0b', icon: "time" }
    if (location) return { text: "Location available", color: '#10b981', icon: "checkmark-circle" }
    return { text: "Location unavailable", color: '#ef4444', icon: "close-circle" }
  }

  const status = getLocationStatus()

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.statusContainer}>
          <Ionicons name={status.icon} size={20} color={status.color} />
          <Text style={[styles.statusText, { color: status.color }]}>{status.text}</Text>
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh} disabled={loading}>
          <Ionicons name="refresh" size={20} color={MATTE_COLORS.accentPrimary} />
        </TouchableOpacity>
      </View>

      {location && (
        <View style={styles.locationInfo}>
          <View style={styles.coordinatesContainer}>
            <Ionicons name="location" size={16} color={MATTE_COLORS.textSecondary} />
            <Text style={styles.coordinates}>{formatCoordinates(location.latitude, location.longitude)}</Text>
          </View>
          <Text style={styles.timestamp}>Updated: {new Date(location.timestamp).toLocaleTimeString()}</Text>
        </View>
      )}

      <View style={styles.infoContainer}>
        <Ionicons name="information-circle-outline" size={16} color={MATTE_COLORS.accentPrimary} />
        <Text style={styles.infoText}>
          Your location will be shared with emergency responders when you send an alert
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: MATTE_COLORS.cardBg,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: MATTE_COLORS.borderColor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: SPACING.xs,
    color: MATTE_COLORS.textPrimary,
  },
  refreshButton: {
    backgroundColor: MATTE_COLORS.accentPrimary + "20",
    padding: SPACING.xs,
    borderRadius: 6,
  },
  locationInfo: {
    marginBottom: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: MATTE_COLORS.borderColor,
  },
  coordinatesContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  coordinates: {
    fontSize: 13,
    fontWeight: '500',
    color: MATTE_COLORS.textPrimary,
    marginLeft: SPACING.xs,
    fontFamily: 'monospace',
  },
  timestamp: {
    fontSize: 12,
    fontWeight: '400',
    color: MATTE_COLORS.textSecondary,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: MATTE_COLORS.accentPrimary + "10",
    padding: SPACING.md,
    borderRadius: 8,
    gap: SPACING.xs,
  },
  infoText: {
    fontSize: 12,
    fontWeight: '400',
    color: MATTE_COLORS.textSecondary,
    marginLeft: 0,
    flex: 1,
    lineHeight: 16,
  },
})
