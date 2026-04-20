"use client"

import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Modal,
  StyleSheet,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import LoadingSpinner from "../components/LoadingSpinner"
import { CameraView, useCameraPermissions } from "expo-camera"
import { securityAPI } from "../services/api"
import SafeJourneyCard from "../components/SafeJourneyCard"
import WelcomeBackCard from "../components/WelcomeBackCard"
import { MATTE_COLORS, LAYOUT } from "../utils/theme"

export default function ScannerScreen({ navigation }) {
  const { isDarkMode, toggleTheme } = useTheme()
  const [permission, requestPermission] = useCameraPermissions()
  const [scanned, setScanned] = useState(false)
  const [action, setAction] = useState("")
  const [location, setLocation] = useState("")
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    if (!permission) {
      requestPermission()
    }
  }, [permission])

  useEffect(() => {
    if (action === "exit" || action === "entry") {
      setShowPopup(true)
      setScanned(true)
    }
  }, [action])

  const handleBarCodeScanned = async ({ data }) => {
    if (!scanned) {
      setScanned(true)
      try {
        const parsed = JSON.parse(data)
        setLocation(parsed?.location || "")

        const response = await securityAPI.logEntry({
          location: parsed?.location,
          hash: parsed?.hash,
          studentId: parsed?.studentId,
          userId: parsed?.userId,
        })

        setAction(response?.data?.log?.action || "")
      } catch (error) {
        Alert.alert("Invalid QR", error?.response?.data?.message || "Unable to scan this QR")
        setScanned(false)
      }
    }
  }

  if (!permission) return <LoadingSpinner />

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Ionicons name="camera" size={48} color={MATTE_COLORS.accentPrimary} />
          <Text style={styles.permissionText}>Camera access required</Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={MATTE_COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan QR Code</Text>
        <TouchableOpacity onPress={toggleTheme}>
          <Ionicons name={isDarkMode ? "sunny" : "moon"} size={24} color={MATTE_COLORS.accentPrimary} />
        </TouchableOpacity>
      </View>

      {/* Camera */}
      {!showPopup && (
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            barcodeScannerSettings={{
              barcodeTypes: ["qr", "ean13", "ean8", "code128"],
            }}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          />
          <View style={styles.scannerFrame} />
        </View>
      )}

      {/* Scan Result Popup */}
      <Modal visible={showPopup} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          {action === "exit" && (
            <SafeJourneyCard
              onClose={() => {
                setShowPopup(false)
                setScanned(false)
                setAction("")
                setLocation("")
                navigation.goBack()
              }}
              location={location}
            />
          )}
          {action === "entry" && (
            <WelcomeBackCard
              onClose={() => {
                setShowPopup(false)
                setScanned(false)
                setAction("")
                setLocation("")
                navigation.goBack()
              }}
              location={location}
            />
          )}
        </View>
      </Modal>

      {/* Rescan Button */}
      {scanned && !showPopup && (
        <View style={styles.rescanContainer}>
          <TouchableOpacity
            style={styles.rescanButton}
            onPress={() => {
              setScanned(false)
              setAction("")
              setLocation("")
            }}
          >
            <Ionicons name="refresh" size={20} color={MATTE_COLORS.textPrimary} />
            <Text style={styles.rescanText}>Scan Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MATTE_COLORS.darkBg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
    paddingVertical: LAYOUT.spacingSm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: MATTE_COLORS.textPrimary,
    letterSpacing: 0.3,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  permissionText: {
    fontSize: 16,
    fontWeight: '600',
    color: MATTE_COLORS.textPrimary,
  },
  permissionButton: {
    backgroundColor: MATTE_COLORS.accentPrimary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 10,
  },
  permissionButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: MATTE_COLORS.darkBg,
  },
  cameraContainer: {
    flex: 1,
    margin: LAYOUT.spacingMd,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: MATTE_COLORS.accentPrimary,
  },
  camera: {
    flex: 1,
  },
  scannerFrame: {
    position: 'absolute',
    width: '70%',
    aspectRatio: 1,
    top: '50%',
    left: '50%',
    transform: [{ translateX: '-35%' }, { translateY: '-35%' }],
    borderWidth: 3,
    borderColor: MATTE_COLORS.accentPrimary,
    borderRadius: 20,
    opacity: 0.7,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  rescanContainer: {
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
    paddingVertical: LAYOUT.spacingMd,
  },
  rescanButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: MATTE_COLORS.inputBg,
    paddingVertical: LAYOUT.spacingMd,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: MATTE_COLORS.borderColor,
    gap: 8,
  },
  rescanText: {
    fontSize: 15,
    fontWeight: '600',
    color: MATTE_COLORS.textPrimary,
  },
})
