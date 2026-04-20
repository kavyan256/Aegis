import React, { useCallback, useMemo, useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useFocusEffect } from "@react-navigation/native"
import styles from "../styles/LibraryStyles"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import { securityAPI } from "../services/api"
import { MATTE_COLORS, LAYOUT } from "../utils/theme"

export default function LogBook({ navigation, route }) {
  const { isDarkMode, toggleTheme } = useTheme()
  const { token } = useAuth()

  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)

  const location = route?.params?.location || ""

  const displayedLocation = useMemo(() => {
    return location && location.trim().length > 0 ? location : "All Locations"
  }, [location])

  const fetchLogs = useCallback(async () => {
    if (!token) {
      setError("Authentication token missing. Please log in again.")
      return
    }
    try {
      const params = {}
      if (location && location.trim().length > 0) {
        params.location = location.trim()
      }

      const response = await securityAPI.getLogs(params, token)
      setLogs(response.data?.logs || [])
      setError(null)
    } catch (err) {
      console.log("LogBook fetch error:", err?.response || err)
      const serverMessage = err?.response?.data?.message
      setError(serverMessage || err?.message || "Unable to load logs right now")
    }
  }, [location, token])

  const initialise = useCallback(async () => {
    setLoading(true)
    await fetchLogs()
    setLoading(false)
  }, [fetchLogs])

  useFocusEffect(
    useCallback(() => {
      initialise()
    }, [initialise]),
  )

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await fetchLogs()
    setRefreshing(false)
  }, [fetchLogs])

  const renderLog = useCallback(
    ({ item }) => {
      const actionLabel = item.action === "entry" ? "Entry" : item.action === "exit" ? "Exit" : item.action
      const residentName = item?.user?.name || item?.details?.scannedUserName || "Resident"
      const residentStudentId = item?.user?.studentId || item?.details?.scannedStudentId || "-"
      const residentSystemId = item?.user?.id || item?.userId || item?.details?.scannedUserId || "-"
      const guardOnDuty = item.guardName || "Guard"
      const timestamp = item?.createdAt ? new Date(item.createdAt).toLocaleString() : "Unknown"

      return (
        <View
          style={[
            styles.card,
            styles.shadow,
            {
              backgroundColor: MATTE_COLORS.cardBg,
              borderLeftWidth: 4,
              borderLeftColor: item.action === "entry" ? "#22c55e" : "#ef4444",
              marginHorizontal: 16,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { textAlign: "left", color: MATTE_COLORS.textPrimary }]}>{actionLabel}</Text>
          <Text style={{ color: MATTE_COLORS.textSecondary, marginBottom: 4 }}>Name: {residentName}</Text>
          <Text style={{ color: MATTE_COLORS.textSecondary, marginBottom: 4 }}>Student ID: {residentStudentId}</Text>
          <Text style={{ color: MATTE_COLORS.textSecondary, marginBottom: 4 }}>User ID: {residentSystemId}</Text>
          <Text style={{ color: MATTE_COLORS.textSecondary, marginBottom: 4 }}>Guard: {guardOnDuty}</Text>
          <Text style={{ color: MATTE_COLORS.textSecondary, marginBottom: 4 }}>Location: {item.location || "-"}</Text>
          <Text style={{ color: MATTE_COLORS.textSecondary, fontSize: 12 }}>Time: {timestamp}</Text>
        </View>
      )
    },
    [],
  )

  const listEmptyComponent = useMemo(() => {
    if (loading) {
      return null
    }
    return (
      <View style={{ padding: 32, alignItems: "center" }}>
        <Ionicons name="document-text-outline" size={36} color={MATTE_COLORS.textSecondary} />
        <Text style={{ marginTop: 12, color: MATTE_COLORS.textSecondary }}>No logs yet for this location.</Text>
      </View>
    )
  }, [loading])

  return (
    <View style={[styles.container, { backgroundColor: MATTE_COLORS.darkBg }]}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={MATTE_COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: MATTE_COLORS.textPrimary }]}>Entry Exit Logs</Text>
        <TouchableOpacity onPress={toggleTheme}>
          <Ionicons name={isDarkMode ? "sunny" : "moon"} size={24} color={MATTE_COLORS.accentPrimary} />
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
        <Text style={[styles.sectionTitle, { color: MATTE_COLORS.textPrimary }]}>Location: {displayedLocation}</Text>
        <Text style={{ color: MATTE_COLORS.textSecondary }}>Showing {logs.length} record(s)</Text>
        {error && <Text style={{ color: "#ef4444", marginTop: 4 }}>{error}</Text>}
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={MATTE_COLORS.accentPrimary} />
        </View>
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(item) => item.id}
          renderItem={renderLog}
          contentContainerStyle={{ paddingBottom: 32 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={listEmptyComponent}
        />
      )}
    </View>
  )
}
