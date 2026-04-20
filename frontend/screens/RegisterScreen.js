import React, { useState } from 'react'
import {
  View,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import FormInput from '../components/FormInput'
import FormPicker from '../components/FormPicker'
import PrimaryButton from '../components/PrimaryButton'
import ScreenHeader from '../components/ScreenHeader'
import LoadingSpinner from '../components/LoadingSpinner'
import StudentRegisterCard from '../components/StudentRegisterCard'
import WardenRegisterCard from '../components/WardenRegisterCard'
import SecurityRegisterCard from '../components/SecurityRegisterCard'
import { MATTE_COLORS, LAYOUT } from '../utils/theme'
import { validateRegisterForm } from '../utils/validation'
import { AcademicYearList, DepartmentList } from '../utils/enumMappings'
import * as Application from 'expo-application'
import * as Device from 'expo-device'

const ROLES = [
  { label: '👨‍🎓 Student', value: 'student' },
  { label: '👨‍💼 Warden', value: 'warden' },
  { label: '👮 Security', value: 'security' },
]

const HOSTELS = [
  { label: 'BH 1', value: 'BH 1' },
  { label: 'BH 2', value: 'BH 2' },
  { label: 'BH 3', value: 'BH 3' },
  { label: 'BH 4', value: 'BH 4' },
  { label: 'BH 5', value: 'BH 5' },
  { label: 'GH 1', value: 'GH 1' },
  { label: 'GH 2', value: 'GH 2' },
  { label: 'GH 3', value: 'GH 3' },
]

const GENDERS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
]

export default function RegisterScreen({ navigation }) {
  const { isDarkMode, toggleTheme } = useTheme()
  const { register } = useAuth()
  const deviceId = Application.androidId || Device.osBuildId

  const [focusedInput, setFocusedInput] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    gender: 'male',
    role: 'student',
    department: DepartmentList[0]?.value || '',
    year: AcademicYearList[0]?.value || '',
    hostel: 'BH 1',
    roomNumber: '',
    studentId: '',
    guardId: '',
    securityPost: '',
    wardenId: '',
    deviceId,
  })

  const updateField = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleRegister = async () => {
    const validation = validateRegisterForm({
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      phone: formData.phone,
    })

    if (!validation.isValid) {
      Alert.alert('Validation Error', Object.values(validation.errors)[0])
      return
    }

    if (formData.role === 'student' && (!formData.studentId || !formData.hostel)) {
      Alert.alert('Error', 'Please fill all student fields')
      return
    }

    if (formData.role === 'security' && (!formData.guardId || !formData.securityPost)) {
      Alert.alert('Error', 'Please fill all security fields')
      return
    }

    setLoading(true)
    const payload = { ...formData, phoneNumber: formData.phone }
    delete payload.phone

    const result = await register(payload)
    setLoading(false)

    if (result.success) {
      Alert.alert('Success', 'Account created!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ])
    } else {
      Alert.alert('Error', result.error || 'Registration failed')
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: MATTE_COLORS.darkBg }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: LAYOUT.screenPaddingHorizontal, paddingTop: 12 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={MATTE_COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleTheme}>
            <Ionicons name={isDarkMode ? 'sunny' : 'moon'} size={24} color={MATTE_COLORS.accentPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: LAYOUT.screenPaddingHorizontal, paddingVertical: 20 }}>
          <ScreenHeader
            title="Create Account"
            subtitle="Join Aegis ID"
            showIcon={false}
          />

          {/* Basic Fields */}
          <FormInput
            icon="person"
            placeholder="Full Name"
            value={formData.name}
            onChangeText={v => updateField('name', v)}
            isFocused={focusedInput === 'name'}
            onFocus={() => setFocusedInput('name')}
            onBlur={() => setFocusedInput(null)}
          />

          <FormInput
            icon="mail"
            placeholder="Email Address"
            value={formData.email}
            onChangeText={v => updateField('email', v)}
            keyboardType="email-address"
            isFocused={focusedInput === 'email'}
            onFocus={() => setFocusedInput('email')}
            onBlur={() => setFocusedInput(null)}
          />

          <FormPicker
            icon="person-outline"
            value={formData.role}
            onValueChange={v => updateField('role', v)}
            items={ROLES}
            isFocused={focusedInput === 'role'}
            onFocus={() => setFocusedInput('role')}
            onBlur={() => setFocusedInput(null)}
          />

          {/* Role-specific fields */}
          {formData.role === 'student' && (
            <StudentRegisterCard
              formData={formData}
              updateFormData={updateField}
              departments={DepartmentList}
              years={AcademicYearList}
              hostels={HOSTELS}
              focusedInput={focusedInput}
              setFocusedInput={setFocusedInput}
            />
          )}

          {formData.role === 'warden' && (
            <WardenRegisterCard
              formData={formData}
              updateFormData={updateField}
              hostels={HOSTELS}
              focusedInput={focusedInput}
              setFocusedInput={setFocusedInput}
            />
          )}

          {formData.role === 'security' && (
            <SecurityRegisterCard
              formData={formData}
              updateFormData={updateField}
              focusedInput={focusedInput}
              setFocusedInput={setFocusedInput}
            />
          )}

          {/* Common Fields */}
          <FormInput
            icon="call"
            placeholder="Phone Number"
            value={formData.phone}
            onChangeText={v => updateField('phone', v)}
            keyboardType="phone-pad"
            isFocused={focusedInput === 'phone'}
            onFocus={() => setFocusedInput('phone')}
            onBlur={() => setFocusedInput(null)}
          />

          <FormPicker
            icon="male-female"
            value={formData.gender}
            onValueChange={v => updateField('gender', v)}
            items={GENDERS}
            isFocused={focusedInput === 'gender'}
            onFocus={() => setFocusedInput('gender')}
            onBlur={() => setFocusedInput(null)}
          />

          <FormInput
            icon="lock-closed"
            placeholder="Password"
            value={formData.password}
            onChangeText={v => updateField('password', v)}
            secureTextEntry={!showPassword}
            showToggle
            onToggle={() => setShowPassword(!showPassword)}
            isSecure={showPassword}
            isFocused={focusedInput === 'password'}
            onFocus={() => setFocusedInput('password')}
            onBlur={() => setFocusedInput(null)}
          />

          <FormInput
            icon="lock-closed"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={v => updateField('confirmPassword', v)}
            secureTextEntry={!showConfirmPassword}
            showToggle
            onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
            isSecure={showConfirmPassword}
            isFocused={focusedInput === 'confirmPassword'}
            onFocus={() => setFocusedInput('confirmPassword')}
            onBlur={() => setFocusedInput(null)}
          />

          <PrimaryButton label="CREATE ACCOUNT" onPress={handleRegister} icon="arrow-forward" />

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24 }}>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ color: MATTE_COLORS.textSecondary }}>Already have an account? </View>
                <Ionicons name="arrow-forward" size={14} color={MATTE_COLORS.accentPrimary} />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
