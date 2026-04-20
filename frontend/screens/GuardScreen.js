"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert, SafeAreaView } from "react-native"
import { useState, useEffect } from "react"
import { useTheme } from "../context/ThemeContext"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext"
import QRCode from "react-native-qrcode-svg"
import api from "../services/api"
import LoadingSpinner from "../components/LoadingSpinner"
import FormPicker from "../components/FormPicker"
import ScreenHeader from "../components/ScreenHeader"
import { MATTE_COLORS, LAYOUT } from "../utils/theme"
import AllLocations from "../constants/SecuityLocations.json"

export default function GuardScreen({ navigation }) {
  const { isDarkMode, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const [profile, setProfile] = useState(null)
  const [location, setLocation] = useState("")
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [focusedInput, setFocusedInput] = useState(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  useEffect(() => {
    if (!location && profile?.location) {
      setLocation(profile.location)
    } else if (!location && AllLocations?.Locations?.length > 0) {
      setLocation(AllLocations.Locations[0])
    }
  }, [profile, location])

  const loadDashboardData = async () => {
    try {
      const res = await api.get("/auth/fetchProfile", {
        headers: { Authorization: `Bearer ${user.token}` },
        params: { user },
      })
      setProfile(res.data.user)
    } catch (error) {
      Alert.alert("Error", "Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadDashboardData()
    setRefreshing(false)
  }

  const handleLogout = () => {
    Alert.alert("Logout", "Sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: logout },
    ])
  }

  if (loading) return <LoadingSpinner />

  const locationItems = AllLocations?.Locations?.map(loc => ({ label: loc, value: loc })) || []

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

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <ScreenHeader
          title={`Good ${getGreeting()}`}
          subtitle={`${user?.name}`}
          showIcon={false}
        />

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("Scan")}
          >
            <View style={styles.actionIconBg}>
              <Ionicons name="scan" size={24} color={MATTE_COLORS.darkBg} />
            </View>
            <Text style={styles.actionLabel}>Scan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("LogBook", { location })}
          >
            <View style={styles.actionIconBg}>
              <Ionicons name="document-text" size={24} color={MATTE_COLORS.darkBg} />
            </View>
            <Text style={styles.actionLabel}>Logs</Text>
          </TouchableOpacity>
        </View>

        {/* Location Picker */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <FormPicker
            icon="location"
            value={location}
            onValueChange={setLocation}
            items={locationItems}
            isFocused={focusedInput === 'location'}
            onFocus={() => setFocusedInput('location')}
            onBlur={() => setFocusedInput(null)}
          />
        </View>

        {/* QR Code */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Guard QR Code</Text>
          <View style={styles.qrCard}>
            <QRCode
              value={JSON.stringify({
                guardName: user?.name,
                guardId: user?.guardId,
                location: location,
              })}
              size={200}
              color={MATTE_COLORS.textPrimary}
              backgroundColor={MATTE_COLORS.inputBg}
            />
            <Text style={styles.qrNote}>Scan at entry/exit</Text>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={MATTE_COLORS.accentSecondary} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return "Morning"
  if (hour < 17) return "Afternoon"
  return "Evening"
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
    paddingTop: 12,
    paddingBottom: LAYOUT.spacingSm,
  },
  content: {
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
    paddingBottom: LAYOUT.spacingLg,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: LAYOUT.spacingLg,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: MATTE_COLORS.inputBg,
    borderRadius: 14,
    paddingVertical: LAYOUT.spacingMd,
    borderWidth: 1,
    borderColor: MATTE_COLORS.borderColor,
  },
  actionIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: MATTE_COLORS.accentPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: MATTE_COLORS.textPrimary,
  },
  section: {
    marginBottom: LAYOUT.spacingLg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: MATTE_COLORS.textPrimary,
    marginBottom: LAYOUT.spacingSm,
    letterSpacing: 0.3,
  },
  qrCard: {
    backgroundColor: MATTE_COLORS.inputBg,
    borderRadius: 14,
    padding: LAYOUT.spacingMd,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: MATTE_COLORS.borderColor,
  },
  qrNote: {
    fontSize: 12,
    color: MATTE_COLORS.textSecondary,
    marginTop: LAYOUT.spacingSm,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MATTE_COLORS.accentSecondary + '15',
    borderRadius: 12,
    paddingVertical: LAYOUT.spacingMd,
    gap: 8,
    borderWidth: 1,
    borderColor: MATTE_COLORS.accentSecondary + '30',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: MATTE_COLORS.accentSecondary,
  },
})

