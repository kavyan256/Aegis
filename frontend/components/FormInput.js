import React from 'react'
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { MATTE_COLORS, FONTS } from '../utils/theme'

export default function FormInput({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  onFocus,
  onBlur,
  isFocused = false,
  showToggle = false,
  onToggle,
  isSecure = false,
}) {
  return (
    <View style={[
      styles.container,
      { borderColor: isFocused ? MATTE_COLORS.accentPrimary : MATTE_COLORS.borderColor }
    ]}>
      {icon && (
        <Ionicons
          name={icon}
          size={20}
          color={isFocused ? MATTE_COLORS.accentPrimary : MATTE_COLORS.textSecondary}
          style={styles.icon}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={MATTE_COLORS.textSecondary}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {showToggle && (
        <TouchableOpacity onPress={onToggle} style={styles.toggleIcon}>
          <Ionicons
            name={isSecure ? 'eye' : 'eye-off'}
            size={20}
            color={MATTE_COLORS.textSecondary}
          />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MATTE_COLORS.inputBg,
    borderRadius: 14,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 2,
    height: 56,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: MATTE_COLORS.textPrimary,
  },
  toggleIcon: {
    padding: 8,
  },
})
