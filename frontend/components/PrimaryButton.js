import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { MATTE_COLORS, FONTS } from '../utils/theme'

export default function PrimaryButton({
  label,
  onPress,
  icon,
  loading = false,
  variant = 'primary', // primary, secondary
}) {
  const styles = getStyles(variant)

  return (
    <TouchableOpacity
      style={[styles.button, { opacity: loading ? 0.7 : 1 }]}
      onPress={onPress}
      disabled={loading}
    >
      <Text style={styles.text}>{loading ? 'Loading...' : label}</Text>
      {icon && !loading && (
        <Ionicons name={icon} size={20} color={MATTE_COLORS.textPrimary} style={{ marginLeft: 8 }} />
      )}
    </TouchableOpacity>
  )
}

const getStyles = (variant) => StyleSheet.create({
  button: {
    backgroundColor: variant === 'primary' ? MATTE_COLORS.accentPrimary : MATTE_COLORS.cardBg,
    borderRadius: 14,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    flexDirection: 'row',
    borderWidth: variant === 'secondary' ? 2 : 0,
    borderColor: MATTE_COLORS.borderColor,
    ...(variant === 'primary' && {
      shadowColor: MATTE_COLORS.accentPrimary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 12,
    }),
  },
  text: {
    color: MATTE_COLORS.textPrimary,
    fontSize: 16,
    fontFamily: FONTS.bold,
    letterSpacing: 1,
  },
})
