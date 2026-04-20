"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native"
import { useState, useEffect } from "react"
import { useTheme } from "../context/ThemeContext"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext"
import { commonAPI } from "../services/api"
import { COLORS, FONTS, SIZES, SPACING } from "../utils/constants"
import { AcademicYearList, AcademicYearMap, DepartmentList, DepartmentMap } from "../utils/enumMappings"
import LoadingSpinner from "../components/LoadingSpinner"
import { MATTE_COLORS, LAYOUT } from "../utils/theme"

import { Picker } from "@react-native-picker/picker"

export default function ProfileScreen() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth()
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  // password update state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [pwdSaving, setPwdSaving] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const departments = DepartmentList

  const years = AcademicYearList

  const hostels = ["BH 1", "BH 2", "BH 3", "BH 4", "BH 5", "GH 1", "GH 2", "GH 3"]

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const response = await commonAPI.getProfile()
      setProfile(response.data.userData || response.data.user)
    } catch (error) {
      console.log("Profile load error:", error)
      Alert.alert("Error", "Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await commonAPI.updateProfile(profile)
      setEditing(false)
      loadProfile();
      Alert.alert("Success", "Profile updated successfully")

    } catch (error) {
      Alert.alert("Error", "Error in Update profile")

    } finally {
      setSaving(false)
    }
  }

  const updateProfile = (key, value) => {
    setProfile((prev) => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return <LoadingSpinner />
  }

  const isStudent = profile?.role === "student"
  const isSecurity = profile?.role === "security"
  const idLabel = isSecurity ? "Guard ID" : "Student ID"

  return (
    <ScrollView style={[styles.container, { backgroundColor: MATTE_COLORS.darkBg }]}> 
      <View style={[styles.header, { backgroundColor: MATTE_COLORS.cardBg }]}> 
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: '100%' }}>
          <TouchableOpacity onPress={toggleTheme} style={{ padding: 8, alignSelf: 'flex-end' }}>
            <Ionicons name={isDarkMode ? 'sunny' : 'moon'} size={24} color={MATTE_COLORS.accentPrimary} />
          </TouchableOpacity>
        </View>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: MATTE_COLORS.inputBg }]}> 
            <Text style={[styles.avatarText, { color: MATTE_COLORS.textPrimary }]}>{profile?.name?.charAt(0)?.toUpperCase() || "U"}</Text>
          </View>
          <Text style={[styles.userName, { color: MATTE_COLORS.textPrimary }]}>{profile?.name}</Text>
          <Text style={[styles.userRole, { color: MATTE_COLORS.textSecondary }]}>{profile?.role?.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={[styles.section, { backgroundColor: MATTE_COLORS.cardBg }]}> 
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: MATTE_COLORS.textPrimary }]}>Personal Information</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => (editing ? handleSave() : setEditing(true))}
              disabled={saving}
            >
              <Ionicons name={editing ? "checkmark" : "pencil"} size={20} color={MATTE_COLORS.accentPrimary} />
              <Text style={[styles.editButtonText, { color: MATTE_COLORS.accentPrimary }]}>{editing ? (saving ? "Saving..." : "Save") : "Edit"}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: MATTE_COLORS.textSecondary }]}>Full Name</Text>
            {editing ? (
              <TextInput
                style={[styles.fieldInput, { color: MATTE_COLORS.textPrimary, borderBottomColor: MATTE_COLORS.borderColor }]}
                value={profile?.name || ""}
                onChangeText={(value) => updateProfile("name", value)}
              />
            ) : (
              <Text style={[styles.fieldValue, { color: MATTE_COLORS.textPrimary }]}>{profile?.name}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: MATTE_COLORS.textSecondary }]}>Email</Text>
             {editing ? (
              <TextInput
                style={[styles.fieldInput, { color: MATTE_COLORS.textPrimary, borderBottomColor: MATTE_COLORS.borderColor }]}
                value={profile?.email || ""}
                onChangeText={(value) => updateProfile("email", value)}
              />
            ) : (
            <Text style={[styles.fieldValue, { color: MATTE_COLORS.textPrimary }]}>{profile?.email}</Text>
            )}
          </View>

          {isStudent || isSecurity ? (
            <View style={styles.fieldContainer}>
              <Text style={[styles.fieldLabel, { color: MATTE_COLORS.textSecondary }]}>{idLabel}</Text>
              {editing ? (
                <TextInput
                  style={[styles.fieldInput, { color: MATTE_COLORS.textPrimary, borderBottomColor: MATTE_COLORS.borderColor }]}
                  value={isSecurity ? profile?.guardId || "" : profile?.studentId || ""}
                  onChangeText={(value) => updateProfile(isSecurity ? "guardId" : "studentId", value)}
                />
              ) : (
                <Text style={[styles.fieldValue, { color: MATTE_COLORS.textPrimary }]}>
                  {isSecurity ? profile?.guardId : profile?.studentId}
                </Text>
              )}
            </View>
          ) : null}

          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: MATTE_COLORS.textSecondary }]}>Phone Number</Text>
            {editing ? (
              <TextInput
                style={[styles.fieldInput, { color: MATTE_COLORS.textPrimary, borderBottomColor: MATTE_COLORS.borderColor }]}
                value={profile?.phoneNumber || ""}
                onChangeText={(value) => updateProfile("phoneNumber", value)}
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={[styles.fieldValue, { color: MATTE_COLORS.textPrimary }]}>{profile?.phoneNumber}</Text>
            )}
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: MATTE_COLORS.cardBg }]}> 
          <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: MATTE_COLORS.textPrimary }]}>
            {isStudent ? "Academic Information" : "Hostel Information"}
          </Text>
          </View>
          {
          isStudent && !editing ? (
            <>
              <View style={styles.fieldContainer}>
                <Text style={[styles.fieldLabel, { color: MATTE_COLORS.textSecondary }]}>Department</Text>
                <Text style={[styles.fieldValue, { color: MATTE_COLORS.textPrimary }]}>{DepartmentMap[profile?.department] || profile?.department}</Text>
              </View>

              <View style={styles.fieldContainer}>
                <Text style={[styles.fieldLabel, { color: MATTE_COLORS.textSecondary }]}>Year</Text>
                <Text style={[styles.fieldValue, { color: MATTE_COLORS.textPrimary }]}>{AcademicYearMap[profile?.year] || profile?.year}</Text>
              </View>

              <View style={styles.fieldContainer}>
                <Text style={[styles.fieldLabel, { color: MATTE_COLORS.textSecondary }]}>Hostel</Text>
                <Text style={[styles.fieldValue, { color: MATTE_COLORS.textPrimary }]}>{profile?.hostel}</Text>
              </View>
            </>
          ) : isStudent && editing ? (
            <>
              <View style={[styles.pickerContainer, { backgroundColor: MATTE_COLORS.inputBg, borderColor: MATTE_COLORS.borderColor }]}> 
                <Ionicons name="library-outline" size={20} color={MATTE_COLORS.textSecondary} style={styles.inputIcon}/> 
                <Picker
                  selectedValue={profile.department || ""}
                  style={styles.picker}
                  onValueChange={value => updateProfile('department', value)}>
                  <Picker.Item label="Select Department *" value="" />
                  {departments.map(dept => (
                    <Picker.Item key={dept} label={DepartmentMap[dept] || dept} value={dept} />
                  ))}
                </Picker>
              </View>
              <View style={[styles.pickerContainer, { backgroundColor: MATTE_COLORS.inputBg, borderColor: MATTE_COLORS.borderColor }]}> 
                <Ionicons name="calendar-outline" size={20} color={MATTE_COLORS.textSecondary} style={styles.inputIcon} />
                <Picker
                  selectedValue={profile.year || ""}
                  style={styles.picker}
                  onValueChange={value => updateProfile('year', value)}>
                  <Picker.Item label="Select Year *" value="" />
                  {years.map(y => (
                    <Picker.Item key={y} label={AcademicYearMap[y] || y} value={y} />
                  ))}
                </Picker>
              </View>
              <View style={[styles.pickerContainer, { backgroundColor: MATTE_COLORS.inputBg, borderColor: MATTE_COLORS.borderColor }]}> 
                <Ionicons name="home-outline" size={20} color={MATTE_COLORS.textSecondary} style={styles.inputIcon} />
                <Picker
                  selectedValue={profile.hostel || ""}
                  style={styles.picker}
                  onValueChange={value => updateProfile('hostel', value)}>
                  <Picker.Item label="Select Hostel *" value="" />
                  {hostels.map(h => (
                    <Picker.Item key={h} label={h} value={h} />
                  ))}
                </Picker>
              </View>

              </>
            ) : (
              <View style={styles.fieldContainer}>
                <Text style={[styles.fieldLabel, { color: MATTE_COLORS.textSecondary }]}>Assigned Hostel</Text>
                <Text style={[styles.fieldValue, { color: MATTE_COLORS.textPrimary }]}>{profile?.hostel || "Not assigned"}</Text>
              </View>
            )
          }
              
              

          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: MATTE_COLORS.textSecondary }]}>Room Number</Text>
            {editing ? (
              <TextInput
                style={[styles.fieldInput, { color: MATTE_COLORS.textPrimary, borderBottomColor: MATTE_COLORS.borderColor }]}
                value={profile?.roomNumber || ""}
                onChangeText={(value) => updateProfile("roomNumber", value)}
              />
            ) : (
              <Text style={[styles.fieldValue, { color: MATTE_COLORS.textPrimary }]}>{profile?.roomNumber || "Not specified"}</Text>
            )}
          </View>
        </View>

        
        <View style={[styles.section, { backgroundColor: MATTE_COLORS.cardBg }]}> 
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: MATTE_COLORS.textPrimary }]}>Change Password</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: MATTE_COLORS.textSecondary }]}>Current Password</Text>
            <TextInput
              style={[styles.fieldInput, { color: MATTE_COLORS.textPrimary, borderBottomColor: MATTE_COLORS.borderColor }]}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry={!showCurrent}
              placeholder="Enter current password"
              placeholderTextColor={MATTE_COLORS.textSecondary}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowCurrent(v => !v)} style={{ position: 'absolute', right: 12, top: 34 }}>
              <Ionicons name={showCurrent ? "eye-outline" : "eye-off-outline"} size={18} color={MATTE_COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: MATTE_COLORS.textSecondary }]}>New Password</Text>
            <TextInput
              style={[styles.fieldInput, { color: MATTE_COLORS.textPrimary, borderBottomColor: MATTE_COLORS.borderColor }]}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNew}
              placeholder="Enter new password"
              placeholderTextColor={MATTE_COLORS.textSecondary}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowNew(v => !v)} style={{ position: 'absolute', right: 12, top: 34 }}>
              <Ionicons name={showNew ? "eye-outline" : "eye-off-outline"} size={18} color={MATTE_COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: MATTE_COLORS.textSecondary }]}>Confirm New Password</Text>
            <TextInput
              style={[styles.fieldInput, { color: MATTE_COLORS.textPrimary, borderBottomColor: MATTE_COLORS.borderColor }]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirm}
              placeholder="Confirm new password"
              placeholderTextColor={MATTE_COLORS.textSecondary}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowConfirm(v => !v)} style={{ position: 'absolute', right: 12, top: 34 }}>
              <Ionicons name={showConfirm ? "eye-outline" : "eye-off-outline"} size={18} color={MATTE_COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 12 }}>
            <TouchableOpacity
              onPress={() => {
                setCurrentPassword("")
                setNewPassword("")
                setConfirmPassword("")
              }}
              style={{ padding: 10, marginRight: 8 }}
            >
              <Text style={{ color: MATTE_COLORS.textSecondary }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                if (!currentPassword || !newPassword || !confirmPassword) {
                  Alert.alert("Error", "Please fill all password fields")
                  return
                }
                if (newPassword !== confirmPassword) {
                  Alert.alert("Error", "New password and confirm password do not match")
                  return
                }
                if (newPassword.length < 6) {
                  Alert.alert("Error", "New password must be at least 6 characters")
                  return
                }
                try {
                  setPwdSaving(true)
                  const res = await commonAPI.changePassword({ currentPassword, newPassword, confirmPassword })
                  setPwdSaving(false)
                  Alert.alert("Success", res?.data?.message || "Password updated")
                  setCurrentPassword("")
                  setNewPassword("")
                  setConfirmPassword("")
                } catch (err) {
                  setPwdSaving(false)
                  console.log("Change password error", err)
                  Alert.alert("Error", err?.response?.data?.message || err.message || "Server error")
                }
              }}
              style={[styles.editButton, { paddingHorizontal: 16 }]}
              disabled={pwdSaving}
            >
              <Ionicons name="key-outline" size={18} color={MATTE_COLORS.accentPrimary} />
              <Text style={[styles.editButtonText, { color: MATTE_COLORS.accentPrimary, marginLeft: SPACING.xs }]}>{pwdSaving ? "Updating..." : "Update Password"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: MATTE_COLORS.cardBg }]}> 
          <Text style={[styles.sectionTitle, { color: MATTE_COLORS.textPrimary }]}>Account Status</Text>

          <View style={styles.statusContainer}>
            <View style={styles.statusItem}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: profile?.isActive ? '#4caf50' : '#f44336',
                  },
                ]}
              />
              <Text style={[styles.statusText, { color: MATTE_COLORS.textPrimary }]}>{profile?.isActive ? "Active" : "Inactive"}</Text>
            </View>

            <View style={styles.statusItem}>
              <Text style={[styles.statusLabel, { color: MATTE_COLORS.textSecondary }]}>Member since</Text>
              <Text style={[styles.statusValue, { color: MATTE_COLORS.textPrimary }]}>{new Date(profile?.createdAt).toLocaleDateString()}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: MATTE_COLORS.accentSecondary + '20' }]} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color={MATTE_COLORS.accentSecondary} />
          <Text style={[styles.logoutButtonText, { color: MATTE_COLORS.accentSecondary }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: SPACING.xl,
    alignItems: "center",
  },
  avatarContainer: {
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  avatarText: {
    fontSize: SIZES.xxxl,
    fontFamily: FONTS.bold,
  },
  userName: {
    fontSize: SIZES.xl,
    fontFamily: FONTS.bold,
    marginBottom: SPACING.xs,
  },
  userRole: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.regular,
    opacity: 0.8,
  },
  content: {
    padding: SPACING.lg,
  },
  section: {
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontFamily: FONTS.bold,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 6,
  },
  editButtonText: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.regular,
    marginLeft: SPACING.xs,
  },
  fieldContainer: {
    marginBottom: SPACING.md,
  },
  fieldLabel: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.regular,
    marginBottom: SPACING.xs,
  },
  fieldValue: {
    fontSize: SIZES.md,
    fontFamily: FONTS.regular,
  },
  fieldInput: {
    fontSize: SIZES.md,
    fontFamily: FONTS.regular,
    borderBottomWidth: 1,
    paddingVertical: SPACING.xs,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    height: 50,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  picker: {
    flex: 1,
    height: 50,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.xs,
  },
  statusText: {
    fontSize: SIZES.md,
    fontFamily: FONTS.regular,
  },
  statusLabel: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.regular,
    marginRight: SPACING.xs,
  },
  statusValue: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.regular,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.md,
    borderRadius: 12,
    marginTop: SPACING.lg,
  },
  logoutButtonText: {
    fontSize: SIZES.md,
    fontFamily: FONTS.bold,
    marginLeft: SPACING.xs,
  },
})
