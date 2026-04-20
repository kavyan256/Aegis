"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from "react-native"
import { useState, useEffect } from "react"
import { useTheme } from "../context/ThemeContext"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext"
import { outpass, commonAPI } from "../services/api"
import styles from "../styles/DashboardStyles"
import { MATTE_COLORS, LAYOUT } from "../utils/theme"

import LoadingSpinner from "../components/LoadingSpinner"
import PasskeyCard from "../components/PasskeyCard"

export default function DashboardScreen({ navigation }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth()
  const [passkey, setPasskey] = useState(null)
  const [stats, setStats] = useState({
    totalOutpasses: 0,
    activeOutpasses: 0,
    pendingOutpasses: 0,
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [passkeyResponse, outpassesResponse] = await Promise.all([
        commonAPI.getDailyPasskey(),
        outpass.getOutpasses(),
      ])

      setPasskey(passkeyResponse.data)

      if (outpassesResponse.data.outpass){
        const outpasses = outpassesResponse.data.outpass.auditTrail
        setStats({
          totalOutpasses: outpasses.length,
          activeOutpasses: outpasses.filter((op) => op.status === "approved").length,
          pendingOutpasses: outpasses.filter((op) => op.status === "pending").length,
        })
      }
    } catch (error) {
      console.log("Dashboard load error:", error)
      Alert.alert("Error", "Failed to load dashboard data")
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
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: logout },
    ])
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: MATTE_COLORS.darkBg }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={[styles.header, { backgroundColor: MATTE_COLORS.cardBg }]}> 
        
        
        <View style={styles.headerContent}>

          <View>
            <Text style={[styles.greeting, { color: MATTE_COLORS.textPrimary }]}>Good {getGreeting()}</Text>
            <Text style={[styles.userName, { color: MATTE_COLORS.textPrimary }]}>{user?.name}</Text>
            <Text style={[styles.studentId, { color: MATTE_COLORS.textSecondary }]}>{user?.studentId}</Text>
          </View>

          <View>
            <TouchableOpacity onPress={toggleTheme}>
              <Ionicons name={isDarkMode ? 'sunny' : 'moon'} size={24} color={MATTE_COLORS.accentPrimary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={28} color={MATTE_COLORS.accentSecondary} />
            </TouchableOpacity>
          </View>

        </View>
      </View>

      <View style={styles.content}>
        {/* Daily Passkey Card */}
        <PasskeyCard passkey={passkey?.passkey} onRefresh={loadDashboardData} />

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={[styles.sectionTitle, { color: MATTE_COLORS.textPrimary }]}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("Scan")}> 
              <View style={[styles.actionIcon, { backgroundColor: '#4caf5020' }]}> 
                <Ionicons name="scan" size={24} color={'#4caf50'} />
              </View>
              <Text style={[styles.actionText, { color: MATTE_COLORS.textSecondary }]}>Scan</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("Library")}> 
              <View style={[styles.actionIcon, { backgroundColor: '#2196f320' }]}> 
                <Ionicons name="book" size={24} color={'#2196f3'} />
              </View>
              <Text style={[styles.actionText, { color: MATTE_COLORS.textSecondary }]}>Library</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("SAC")}> 
              <View style={[styles.actionIcon, { backgroundColor: '#f4433620' }]}> 
                <Ionicons name="bicycle" size={24} color={'#ff9800'} />
              </View>
              <Text style={[styles.actionText, { color: MATTE_COLORS.textSecondary }]}>SAC</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("Profile")}> 
              <View style={[styles.actionIcon, { backgroundColor: '#4caf5020' }]}> 
                <Ionicons name="person" size={24} color={'#4caf50'} />
              </View>
              <Text style={[styles.actionText, { color: MATTE_COLORS.textSecondary }]}>Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return "Morning"
  if (hour < 17) return "Afternoon"
  return "Evening"
}

