"use client"

import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Linking, SafeAreaView } from "react-native"
import { useState, useEffect } from "react"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import * as Location from "expo-location"
import { emergencyAPI } from "../services/api"
import { useAuth } from "../context/AuthContext"
import LoadingSpinner from "../components/LoadingSpinner"
import ScreenHeader from "../components/ScreenHeader"
import LocationCard from "../components/LocationCard"
import { MATTE_COLORS, LAYOUT } from "../utils/theme"

const EMERGENCY_TYPES = [
  {
    id: 'medical',
    title: "Medical",
    icon: "medical",
    color: '#10b981',
    bg: '#10b98120',
  },
  {
    id: 'security',
    title: "Security",
    icon: "shield",
    color: '#f59e0b',
    bg: '#f59e0b20',
  },
  {
    id: 'fire',
    title: "Fire",
    icon: "flame",
    color: '#ef4444',
    bg: '#ef444420',
  },
  {
    id: 'other',
    title: "Other",
    icon: "alert-circle",
    color: '#6366f1',
    bg: '#6366f120',
  },
]

export default function EmergencyScreen() {
  const { isDarkMode, toggleTheme } = useTheme()
  const { user } = useAuth()
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [locationLoading, setLocationLoading] = useState(false)

  useEffect(() => {
    getCurrentLocation()
    setLoading(false)
  }, [])

  const getCurrentLocation = async () => {
    setLocationLoading(true)
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required for emergency services")
        return
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      })

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      Alert.alert("Location Error", "Unable to get current location")
    } finally {
      setLocationLoading(false)
    }
  }

  const handleEmergencyAlert = (type) => {
    const emergencyType = EMERGENCY_TYPES.find(e => e.id === type)
    Alert.alert(
      "Emergency Alert",
      `Send a ${emergencyType.title.toLowerCase()} alert? Campus security will be notified with your location.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send Alert",
          style: "destructive",
          onPress: () => sendEmergencyAlert(type),
        },
      ],
    )
  }

  const sendEmergencyAlert = async (type) => {
    try {
      const alertData = {
        type,
        location: location || null,
        timestamp: new Date().toISOString(),
        studentInfo: {
          name: user?.name,
          studentId: user?.studentId,
          phone: user?.phone,
          hostel: user?.hostel,
          roomNumber: user?.roomNumber,
        },
      }

      await emergencyAPI.createAlert(alertData)

      Alert.alert(
        "Alert Sent",
        "Campus security has been notified. Stay calm and follow safety protocols.",
        [{ text: "OK" }],
      )
    } catch (error) {
      Alert.alert("Error", "Failed to send alert. Try calling directly.")
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: MATTE_COLORS.darkBg }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {}} style={{ opacity: 0 }}>
          <Ionicons name="arrow-back" size={24} color="transparent" />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleTheme}>
          <Ionicons name={isDarkMode ? 'sunny' : 'moon'} size={24} color={MATTE_COLORS.accentPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader
          title="Emergency Services"
          subtitle="Quick access to help"
          showIcon={false}
        />

        {/* Location Card */}
        <LocationCard location={location} loading={locationLoading} onRefresh={getCurrentLocation} />

        {/* Emergency Alerts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Send Alert</Text>
          <Text style={styles.sectionDesc}>Campus security will be notified immediately</Text>

          <View style={styles.emergencyGrid}>
            {EMERGENCY_TYPES.map(emergency => (
              <TouchableOpacity
                key={emergency.id}
                style={[styles.emergencyButton, { backgroundColor: emergency.bg }]}
                onPress={() => handleEmergencyAlert(emergency.id)}
                disabled={!location}
              >
                <View style={[styles.iconBg, { backgroundColor: emergency.color }]}>
                  <Ionicons name={emergency.icon} size={28} color={MATTE_COLORS.darkBg} />
                </View>
                <Text style={styles.emergencyLabel}>{emergency.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {!location && (
            <View style={styles.warning}>
              <Ionicons name="warning" size={18} color={MATTE_COLORS.accentSecondary} />
              <Text style={styles.warningText}>Location required to send alert</Text>
            </View>
          )}
        </View>

        {/* Safety Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety Tips</Text>
          <View style={styles.tipsContainer}>
            <View style={styles.tipRow}>
              <Text style={styles.tipNumber}>1</Text>
              <Text style={styles.tipText}>Provide clear location details</Text>
            </View>
            <View style={styles.tipRow}>
              <Text style={styles.tipNumber}>2</Text>
              <Text style={styles.tipText}>Stay calm and follow instructions</Text>
            </View>
            <View style={styles.tipRow}>
              <Text style={styles.tipNumber}>3</Text>
              <Text style={styles.tipText}>Campus security: (Emergency Hotline)</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
    paddingTop: 12,
    paddingBottom: 8,
  },
  content: {
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
    paddingBottom: LAYOUT.screenPaddingVertical + 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: MATTE_COLORS.textPrimary,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  sectionDesc: {
    fontSize: 13,
    color: MATTE_COLORS.textSecondary,
    marginBottom: 20,
    lineHeight: 18,
  },
  emergencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  emergencyButton: {
    width: '48%',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: MATTE_COLORS.borderColor,
  },
  iconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emergencyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: MATTE_COLORS.textPrimary,
  },
  warning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MATTE_COLORS.accentSecondary + '15',
    padding: 16,
    borderRadius: 10,
    gap: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: MATTE_COLORS.accentSecondary,
    fontWeight: '500',
    lineHeight: 18,
  },
  tipsContainer: {
    backgroundColor: MATTE_COLORS.inputBg,
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: MATTE_COLORS.borderColor,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  tipNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: MATTE_COLORS.accentPrimary,
    color: MATTE_COLORS.darkBg,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 13,
    lineHeight: 28,
    marginRight: 12,
    flexShrink: 0,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: MATTE_COLORS.textPrimary,
    fontWeight: '500',
    lineHeight: 20,
  },
})
