"use client"

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  SafeAreaView,
  StatusBar,
} from "react-native"
import { useState, useRef } from "react"
import { Ionicons } from "@expo/vector-icons"
import { Picker } from "@react-native-picker/picker"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import { COLORS, FONTS, SIZES, SPACING } from "../utils/constants"
import LoadingSpinner from "../components/LoadingSpinner"
import api from "../services/api"

const MATTE_COLORS = {
  darkBg: "#0F1419",
  cardBg: "#1A1F2B",
  inputBg: "#252D3D",
  accentPrimary: "#6366F1",
  accentSecondary: "#EC4899",
  textPrimary: "#FFFFFF",
  textSecondary: "#94A3B8",
  borderColor: "#334155",
}

export default function LoginScreen({ navigation }) {
  const { isDarkMode, toggleTheme } = useTheme()
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("student")
  const [password, setPassword] = useState("123456")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const [focusedInput, setFocusedInput] = useState(null)

  const [forgotModalVisible, setForgotModalVisible] = useState(false)
  const [forgotEmail, setForgotEmail] = useState("")
  const [sendingForgot, setSendingForgot] = useState(false)
  const forgotInputRef = useRef(null)

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }
    setLoading(true)
    const result = await login(email, password, role)
    setLoading(false)

    if (!result.success) {
      Alert.alert("Login Failed", result.error)
    }
  }

  const openForgotModal = () => {
    setForgotEmail(email || "")
    setForgotModalVisible(true)
  }

  const sendForgotEmail = async () => {
    if (!forgotEmail) {
      Alert.alert("Error", "Please enter your email")
      return
    }
    try {
      setSendingForgot(true)
      const res = await api.post("/forgot", { email: forgotEmail })
      setSendingForgot(false)
      setForgotModalVisible(false)
      Alert.alert("Success", res.data?.message || "Password reset email sent")
    } catch (err) {
      setSendingForgot(false)
      const msg = err?.response?.data?.message || err.message || "Failed to send reset email"
      Alert.alert("Error Sending", msg)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: MATTE_COLORS.darkBg }]}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: MATTE_COLORS.darkBg }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Floating Theme Toggle */}
        <TouchableOpacity
          onPress={toggleTheme}
          style={styles.themeButton}
        >
          <Ionicons name={isDarkMode ? "sunny" : "moon"} size={26} color={MATTE_COLORS.accentPrimary} />
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="shield-checkmark" size={48} color={MATTE_COLORS.accentPrimary} />
            </View>
            <Text style={styles.title}>Aegis ID</Text>
            <Text style={styles.subtitle}>Secure Campus Access</Text>
          </View>

          {/* Role Picker */}
          <View style={[styles.rolePickerContainer, { borderColor: focusedInput === "role" ? MATTE_COLORS.accentPrimary : MATTE_COLORS.borderColor }]}>
            <Ionicons name="person" size={20} color={MATTE_COLORS.accentPrimary} style={styles.roleIcon} />
            <Picker
              selectedValue={role}
              style={styles.picker}
              onValueChange={(itemValue) => setRole(itemValue)}
              dropdownIconColor={MATTE_COLORS.textSecondary}
              onFocus={() => setFocusedInput("role")}
              onBlur={() => setFocusedInput(null)}
            >
              <Picker.Item label="👨‍🎓 Student" value="student" />
              <Picker.Item label="👨‍💼 Warden" value="warden" />
              <Picker.Item label="👮 Security" value="security" />
            </Picker>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Email Input */}
            <View style={[styles.inputContainer, { borderColor: focusedInput === "email" ? MATTE_COLORS.accentPrimary : MATTE_COLORS.borderColor }]}>
              <Ionicons name="mail" size={20} color={focusedInput === "email" ? MATTE_COLORS.accentPrimary : MATTE_COLORS.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor={MATTE_COLORS.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                onFocus={() => setFocusedInput("email")}
                onBlur={() => setFocusedInput(null)}
              />
            </View>

            {/* Password Input */}
            <View style={[styles.inputContainer, { borderColor: focusedInput === "password" ? MATTE_COLORS.accentPrimary : MATTE_COLORS.borderColor }]}>
              <Ionicons name="lock-closed" size={20} color={focusedInput === "password" ? MATTE_COLORS.accentPrimary : MATTE_COLORS.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={MATTE_COLORS.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete="password"
                onFocus={() => setFocusedInput("password")}
                onBlur={() => setFocusedInput(null)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons name={showPassword ? "eye" : "eye-off"} size={20} color={MATTE_COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>SIGN IN</Text>
              <Ionicons name="arrow-forward" size={20} color={MATTE_COLORS.textPrimary} style={{ marginLeft: 8 }} />
            </TouchableOpacity>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPassword} onPress={openForgotModal}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Forgot Password Modal */}
          <Modal
            visible={forgotModalVisible}
            animationType="fade"
            transparent={true}
            onRequestClose={() => setForgotModalVisible(false)}
            onShow={() => setTimeout(() => forgotInputRef.current?.focus?.(), 100)}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.modalOverlay}
            >
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Ionicons name="key" size={32} color={MATTE_COLORS.accentSecondary} />
                </View>
                <Text style={styles.modalTitle}>Reset Password</Text>
                <Text style={styles.modalDescription}>We'll send a reset link to your email address</Text>

                <TextInput
                  ref={forgotInputRef}
                  autoFocus={true}
                  value={forgotEmail}
                  onChangeText={setForgotEmail}
                  placeholder="Email Address"
                  placeholderTextColor={MATTE_COLORS.textSecondary}
                  style={styles.modalInput}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity onPress={() => setForgotModalVisible(false)} style={styles.modalCancelButton}>
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={sendForgotEmail} style={styles.modalSendButton}>
                    <Text style={styles.modalSendText}>{sendingForgot ? "Sending..." : "Send Reset Link"}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </Modal>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>New to Aegis? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.signUpText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    position: "relative",
  },
  themeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 100,
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: MATTE_COLORS.cardBg,
    borderWidth: 1,
    borderColor: MATTE_COLORS.borderColor,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: MATTE_COLORS.cardBg,
    borderWidth: 2,
    borderColor: MATTE_COLORS.accentPrimary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontFamily: FONTS.bold,
    color: MATTE_COLORS.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: MATTE_COLORS.textSecondary,
    letterSpacing: 0.3,
  },
  rolePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: MATTE_COLORS.inputBg,
    borderRadius: 14,
    marginBottom: 20,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: MATTE_COLORS.borderColor,
    height: 56,
  },
  roleIcon: {
    marginRight: 12,
  },
  picker: {
    flex: 1,
    height: 56,
    color: MATTE_COLORS.textPrimary,
  },
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: MATTE_COLORS.inputBg,
    borderRadius: 14,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: MATTE_COLORS.borderColor,
    height: 56,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: MATTE_COLORS.textPrimary,
  },
  eyeIcon: {
    padding: 8,
  },
  loginButton: {
    backgroundColor: MATTE_COLORS.accentPrimary,
    borderRadius: 14,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    flexDirection: "row",
    shadowColor: MATTE_COLORS.accentPrimary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  loginButtonText: {
    color: MATTE_COLORS.textPrimary,
    fontSize: 16,
    fontFamily: FONTS.bold,
    letterSpacing: 1,
  },
  forgotPassword: {
    alignItems: "center",
    marginTop: 16,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: MATTE_COLORS.accentSecondary,
    fontFamily: FONTS.semibold,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: MATTE_COLORS.textSecondary,
  },
  signUpText: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: MATTE_COLORS.accentPrimary,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: MATTE_COLORS.cardBg,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: MATTE_COLORS.borderColor,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: MATTE_COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: MATTE_COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  modalInput: {
    backgroundColor: MATTE_COLORS.inputBg,
    borderWidth: 2,
    borderColor: MATTE_COLORS.borderColor,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: MATTE_COLORS.textPrimary,
    fontSize: 16,
    fontFamily: FONTS.regular,
    marginBottom: 24,
  },
  modalButtonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: MATTE_COLORS.borderColor,
    justifyContent: "center",
    alignItems: "center",
  },
  modalCancelText: {
    color: MATTE_COLORS.textSecondary,
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  modalSendButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: MATTE_COLORS.accentSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  modalSendText: {
    color: MATTE_COLORS.textPrimary,
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
})
