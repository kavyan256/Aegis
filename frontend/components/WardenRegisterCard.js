import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import FormInput from './FormInput'
import FormPicker from './FormPicker'
import { MATTE_COLORS, LAYOUT } from '../utils/theme'

export default function WardenRegisterCard({
  formData,
  updateFormData,
  hostels,
  focusedInput,
  setFocusedInput,
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Warden Details</Text>

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
        icon="id-card"
        placeholder="Warden ID"
        value={formData.wardenId}
        onChangeText={v => updateFormData('wardenId', v)}
        isFocused={focusedInput === 'wardenId'}
        onFocus={() => setFocusedInput('wardenId')}
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
