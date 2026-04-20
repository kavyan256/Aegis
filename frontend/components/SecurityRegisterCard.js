import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import FormInput from './FormInput'
import FormPicker from './FormPicker'
import { MATTE_COLORS, LAYOUT } from '../utils/theme'
import AllLocations from '../constants/SecuityLocations.json'

export default function SecurityRegisterCard({
  formData,
  updateFormData,
  focusedInput,
  setFocusedInput,
}) {
  const locationItems = AllLocations.Locations.map(loc => ({
    label: loc,
    value: loc,
  }))

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Security Details</Text>

      <FormInput
        icon="id-card"
        placeholder="Guard ID"
        value={formData.guardId}
        onChangeText={v => updateFormData('guardId', v)}
        isFocused={focusedInput === 'guardId'}
        onFocus={() => setFocusedInput('guardId')}
        onBlur={() => setFocusedInput(null)}
      />

      <FormPicker
        icon="shield"
        value={formData.securityPost}
        onValueChange={v => updateFormData('securityPost', v)}
        items={locationItems}
        isFocused={focusedInput === 'securityPost'}
        onFocus={() => setFocusedInput('securityPost')}
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
