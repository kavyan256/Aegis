"use client"

import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native"
import { useState } from "react"
import { Ionicons } from "@expo/vector-icons"
import QRCode from "react-native-qrcode-svg"
import { MATTE_COLORS, LAYOUT } from "../utils/theme"

export default function PasskeyCard({ passkey, onRefresh }) {
  const [showQR, setShowQR] = useState(false)

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTimeRemaining = () => {
    if (!passkey?.expiresAt) return "N/A"

    const now = new Date()
    const expiry = new Date(passkey.expiresAt)
    const diff = expiry - now

    if (diff <= 0) return "Expired"

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}h ${minutes}m`
  }

  const handleRefresh = () => {
    Alert.alert("Refresh Passkey", "This will generate a new passkey. Continue?", [
      { text: "Cancel", style: "cancel" },
      { text: "Refresh", onPress: onRefresh },
    ])
  }

  if (!passkey) {
    return (
      <View style={styles.card}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={MATTE_COLORS.accentSecondary} />
          <Text style={[styles.errorTitle, { color: MATTE_COLORS.textPrimary }]}>QR To Be Shown</Text>
          <Text style={[styles.errorText, { color: MATTE_COLORS.textSecondary }]}>Contact admin to activate your account</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.card, { backgroundColor: MATTE_COLORS.cardBg }]}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={[styles.cardTitle, { color: MATTE_COLORS.textPrimary }]}>Today's Passkey</Text>
          <Text style={[styles.validUntil, { color: MATTE_COLORS.textSecondary }]}>Valid until {formatTime(passkey.expiresAt)}</Text>
        </View>
        <TouchableOpacity style={[styles.refreshButton, { backgroundColor: MATTE_COLORS.accentPrimary + '20' }]} onPress={handleRefresh}>
          <Ionicons name="refresh-outline" size={20} color={MATTE_COLORS.accentPrimary} />
        </TouchableOpacity>
      </View>

      <View style={[styles.passkeyContainer, { backgroundColor: MATTE_COLORS.inputBg }]}>
        <Text style={[styles.passkeyLabel, { color: MATTE_COLORS.textSecondary }]}>Secure Code</Text>
        <Text style={[styles.passkeyCode, { color: MATTE_COLORS.accentPrimary }]}>{passkey.hash? passkey.hash.substring(0, 8).toUpperCase() : ""}</Text>
        <Text style={[styles.timeRemaining, { color: MATTE_COLORS.accentSecondary }]}>Expires in {getTimeRemaining()}</Text>
      </View>

      <View style={styles.qrSection}>
        <TouchableOpacity style={[styles.qrToggle, { backgroundColor: MATTE_COLORS.accentPrimary + '10' }]} onPress={() => setShowQR(!showQR)}>
          <Ionicons name={showQR ? "eye-off-outline" : "qr-code-outline"} size={20} color={MATTE_COLORS.accentPrimary} />
          <Text style={[styles.qrToggleText, { color: MATTE_COLORS.accentPrimary }]}>{showQR ? "Hide QR Code" : "Show QR Code"}</Text>
        </TouchableOpacity>

        {showQR && (
          <View style={styles.qrContainer}>
            <QRCode
              value={JSON.stringify({
                studentId: passkey.studentId,
                hash: passkey.hash,
                timestamp: passkey.createdAt,
              })}
              size={150}
              color={MATTE_COLORS.textPrimary}
              backgroundColor={MATTE_COLORS.cardBg}
            />
            <Text style={[styles.qrNote, { color: MATTE_COLORS.textSecondary }]}>Show this QR code to security for entry/exit</Text>
          </View>
        )}
      </View>

      <View style={styles.statusIndicator}>
        <View style={[styles.statusDot, { backgroundColor: '#4caf50' }]} />
        <Text style={[styles.statusText, { color: '#4caf50' }]}>Active & Valid</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  validUntil: {
    fontSize: 13,
    fontWeight: '400',
    marginTop: 4,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
  },
  passkeyContainer: {
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 16,
    borderRadius: 12,
  },
  passkeyLabel: {
    fontSize: 13,
    fontWeight: '400',
    marginBottom: 8,
  },
  passkeyCode: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 8,
  },
  timeRemaining: {
    fontSize: 13,
    fontWeight: '400',
  },
  qrSection: {
    alignItems: "center",
    marginBottom: 16,
  },
  qrToggle: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  qrToggleText: {
    fontSize: 13,
    fontWeight: '400',
    marginLeft: 8,
  },
  qrContainer: {
    alignItems: "center",
  },
  qrNote: {
    fontSize: 12,
    fontWeight: '400',
    textAlign: "center",
    marginTop: 8,
    maxWidth: 200,
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '400',
  },
  errorContainer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '400',
    textAlign: "center",
  },
})
