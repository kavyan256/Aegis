import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { MATTE_COLORS, FONTS } from '../utils/theme'

export default function ScreenHeader({
  title,
  subtitle,
  icon = 'shield-checkmark',
  showIcon = false,
}) {
  return (
    <View style={styles.container}>
      {showIcon && (
        <View style={styles.iconContainer}>
          <Ionicons
            name={icon}
            size={48}
            color={MATTE_COLORS.accentPrimary}
          />
        </View>
      )}
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: MATTE_COLORS.cardBg,
    borderWidth: 2,
    borderColor: MATTE_COLORS.accentPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    color: MATTE_COLORS.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: MATTE_COLORS.textSecondary,
    letterSpacing: 0.3,
  },
})
