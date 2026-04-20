"use client"

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native"
import { useState } from "react"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import DateTimePicker from "@react-native-community/datetimepicker"
import { outpass } from "../services/api"
import { useAuth } from "../context/AuthContext"
import FormInput from "../components/FormInput"
import PrimaryButton from "../components/PrimaryButton"
import ScreenHeader from "../components/ScreenHeader"
import LoadingSpinner from "../components/LoadingSpinner"
import { MATTE_COLORS, LAYOUT } from "../utils/theme"

const formatDate = (date) => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

const formatTime = (date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function CreateOutpassScreen({ navigation }) {
  const { isDarkMode, toggleTheme } = useTheme()
  const { user } = useAuth()
  const [focusedInput, setFocusedInput] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(null)

  const [formData, setFormData] = useState({
    purpose: "",
    destination: "",
    fromDate: new Date(),
    fromTime: new Date(),
    toDate: new Date(),
    toTime: new Date(),
    emergencyName: "",
    emergencyContact: "",
    remarks: "",
  })

  const updateField = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleDateChange = (event, selectedDate, field) => {
    setShowDatePicker(null)
    if (selectedDate) {
      updateField(field, selectedDate)
    }
  }

  const validateForm = () => {
    const { purpose, destination, emergencyContact } = formData

    if (!purpose.trim()) {
      Alert.alert("Error", "Please enter the purpose of outpass")
      return false
    }

    if (!destination.trim()) {
      Alert.alert("Error", "Please enter the destination")
      return false
    }

    if (!emergencyContact.trim()) {
      Alert.alert("Error", "Please enter emergency contact number")
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      await outpass.createOutpass(formData)
      Alert.alert("Success", "Outpass request submitted successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ])
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to create outpass")
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: MATTE_COLORS.darkBg }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={MATTE_COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleTheme}>
            <Ionicons name={isDarkMode ? 'sunny' : 'moon'} size={24} color={MATTE_COLORS.accentPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: LAYOUT.screenPaddingHorizontal, paddingVertical: 20 }}>
          <ScreenHeader
            title="Create Outpass"
            subtitle="Plan your trip"
            showIcon={false}
          />

          {/* Purpose & Destination */}
          <FormInput
            icon="clipboard"
            placeholder="Purpose (e.g., Medical, Family visit)"
            value={formData.purpose}
            onChangeText={v => updateField('purpose', v)}
            isFocused={focusedInput === 'purpose'}
            onFocus={() => setFocusedInput('purpose')}
            onBlur={() => setFocusedInput(null)}
            multiline
          />

          <FormInput
            icon="location"
            placeholder="Destination"
            value={formData.destination}
            onChangeText={v => updateField('destination', v)}
            isFocused={focusedInput === 'destination'}
            onFocus={() => setFocusedInput('destination')}
            onBlur={() => setFocusedInput(null)}
          />

          {/* Departure */}
          <Text style={styles.sectionTitle}>Departure</Text>
          <View style={styles.dateTimeRow}>
            <TouchableOpacity
              style={[styles.dateTimeButton, { flex: 1, marginRight: 8 }]}
              onPress={() => setShowDatePicker("fromDate")}
            >
              <Ionicons name="calendar-outline" size={20} color={MATTE_COLORS.accentPrimary} />
              <Text style={styles.dateTimeText}>{formatDate(formData.fromDate)}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.dateTimeButton, { flex: 1 }]}
              onPress={() => setShowDatePicker("fromTime")}
            >
              <Ionicons name="time-outline" size={20} color={MATTE_COLORS.accentPrimary} />
              <Text style={styles.dateTimeText}>{formatTime(formData.fromTime)}</Text>
            </TouchableOpacity>
          </View>

          {/* Return */}
          <Text style={styles.sectionTitle}>Return</Text>
          <View style={styles.dateTimeRow}>
            <TouchableOpacity
              style={[styles.dateTimeButton, { flex: 1, marginRight: 8 }]}
              onPress={() => setShowDatePicker("toDate")}
            >
              <Ionicons name="calendar-outline" size={20} color={MATTE_COLORS.accentPrimary} />
              <Text style={styles.dateTimeText}>{formatDate(formData.toDate)}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.dateTimeButton, { flex: 1 }]}
              onPress={() => setShowDatePicker("toTime")}
            >
              <Ionicons name="time-outline" size={20} color={MATTE_COLORS.accentPrimary} />
              <Text style={styles.dateTimeText}>{formatTime(formData.toTime)}</Text>
            </TouchableOpacity>
          </View>

          {/* Emergency Contact */}
          <Text style={[styles.sectionTitle, { marginTop: LAYOUT.spacingMd }]}>Emergency Contact</Text>

          <FormInput
            icon="person"
            placeholder="Name of person to contact"
            value={formData.emergencyName}
            onChangeText={v => updateField('emergencyName', v)}
            isFocused={focusedInput === 'emergencyName'}
            onFocus={() => setFocusedInput('emergencyName')}
            onBlur={() => setFocusedInput(null)}
          />

          <FormInput
            icon="call"
            placeholder="Emergency Contact Number"
            value={formData.emergencyContact}
            onChangeText={v => updateField('emergencyContact', v)}
            keyboardType="phone-pad"
            isFocused={focusedInput === 'emergencyContact'}
            onFocus={() => setFocusedInput('emergencyContact')}
            onBlur={() => setFocusedInput(null)}
          />

          <FormInput
            icon="document-text"
            placeholder="Additional Remarks (optional)"
            value={formData.remarks}
            onChangeText={v => updateField('remarks', v)}
            isFocused={focusedInput === 'remarks'}
            onFocus={() => setFocusedInput('remarks')}
            onBlur={() => setFocusedInput(null)}
            multiline
          />

          <PrimaryButton label="SUBMIT REQUEST" onPress={handleSubmit} icon="arrow-forward" />
        </ScrollView>
      </KeyboardAvoidingView>

      {showDatePicker && (
        <DateTimePicker
          value={formData[showDatePicker]}
          mode={showDatePicker.includes("Date") ? "date" : "time"}
          display="default"
          onChange={(event, selectedDate) => handleDateChange(event, selectedDate, showDatePicker)}
          minimumDate={new Date()}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
    paddingTop: 12,
    paddingBottom: LAYOUT.spacingSm,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: MATTE_COLORS.textPrimary,
    marginBottom: LAYOUT.spacingSm,
    marginTop: LAYOUT.spacingMd,
    letterSpacing: 0.3,
  },
  dateTimeRow: {
    flexDirection: 'row',
    marginBottom: LAYOUT.spacingMd,
  },
  dateTimeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MATTE_COLORS.inputBg,
    borderRadius: 14,
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
    height: LAYOUT.inputHeight,
    borderWidth: 1,
    borderColor: MATTE_COLORS.borderColor,
    marginHorizontal: 4,
  },
  dateTimeText: {
    fontSize: 14,
    color: MATTE_COLORS.textPrimary,
    fontWeight: '600',
    marginLeft: 8,
  },
})
