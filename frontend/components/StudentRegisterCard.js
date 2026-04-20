import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import FormInput from './FormInput'
import FormPicker from './FormPicker'
import { MATTE_COLORS, LAYOUT } from '../utils/theme'

export default function StudentRegisterCard({
  formData,
  updateFormData,
  departments,
  years,
  hostels,
  focusedInput,
  setFocusedInput,
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Student Details</Text>

      <FormPicker
        icon="book"
        value={formData.department}
        onValueChange={v => updateFormData('department', v)}
        items={departments}
        isFocused={focusedInput === 'department'}
        onFocus={() => setFocusedInput('department')}
        onBlur={() => setFocusedInput(null)}
      />

      <FormPicker
        icon="calendar"
        value={formData.year}
        onValueChange={v => updateFormData('year', v)}
        items={years}
        isFocused={focusedInput === 'year'}
        onFocus={() => setFocusedInput('year')}
        onBlur={() => setFocusedInput(null)}
      />

      <FormPicker
        icon="home"
        value={formData.hostel}
        onValueChange={v => updateFormData('hostel', v)}
        items={hostels}
        isFocused={focusedInput === 'hostel'}
        onFocus={() => setFocusedInput('hostel')}
        onBlur={() => setFocusedInput(null)}
      />

      <FormInput
        icon="key"
        placeholder="Room Number"
        value={formData.roomNumber}
        onChangeText={v => updateFormData('roomNumber', v)}
        isFocused={focusedInput === 'roomNumber'}
        onFocus={() => setFocusedInput('roomNumber')}
        onBlur={() => setFocusedInput(null)}
      />

      <FormInput
        icon="card"
        placeholder="Student ID"
        value={formData.studentId}
        onChangeText={v => updateFormData('studentId', v)}
        isFocused={focusedInput === 'studentId'}
        onFocus={() => setFocusedInput('studentId')}
        onBlur={() => setFocusedInput(null)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: MATTE_COLORS.inputBg,
    borderRadius: 14,
    padding: LAYOUT.screenPaddingHorizontal,
    marginBottom: LAYOUT.spacingMd,
    borderWidth: 1,
    borderColor: MATTE_COLORS.borderColor,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: MATTE_COLORS.textPrimary,
    marginBottom: LAYOUT.spacingMd,
  },
})

