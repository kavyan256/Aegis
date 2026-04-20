import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Picker } from '@react-native-picker/picker'
import { MATTE_COLORS } from '../utils/theme'

export default function FormPicker({
  icon,
  value,
  onValueChange,
  items = [],
  isFocused = false,
  onFocus,
  onBlur,
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
          color={MATTE_COLORS.accentPrimary}
          style={styles.icon}
        />
      )}
      <Picker
        selectedValue={value}
        style={styles.picker}
        onValueChange={onValueChange}
        dropdownIconColor={MATTE_COLORS.textSecondary}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        {items.map((item) => (
          <Picker.Item
            key={item.value}
            label={item.label}
            value={item.value}
          />
        ))}
      </Picker>
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
    borderColor: MATTE_COLORS.borderColor,
    height: 56,
  },
  icon: {
    marginRight: 12,
  },
  picker: {
    flex: 1,
    height: 56,
    color: MATTE_COLORS.textPrimary,
  },
})
