import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LoadingSpinner from '../components/LoadingSpinner';
import { COLORS, FONTS, SIZES } from '../utils/constants';
import { useTheme } from "../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { MATTE_COLORS } from '../utils/theme';

export default function LoadingScreen() {
  const { isDarkMode, toggleTheme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: MATTE_COLORS.darkBg }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: '100%' }}>
        <TouchableOpacity onPress={toggleTheme} style={{ padding: 8, alignSelf: 'flex-end' }}>
          <Ionicons name={isDarkMode ? 'sunny' : 'moon'} size={24} color={MATTE_COLORS.accentPrimary} />
        </TouchableOpacity>
      </View>
      <Text style={[styles.title, { color: MATTE_COLORS.textPrimary }]}>Aegis ID</Text>
      <Text style={[styles.subtitle, { color: MATTE_COLORS.textSecondary }]}>Digital Campus Pass</Text>
      <LoadingSpinner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  title: {
    fontSize: SIZES.xxxl,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: SIZES.md,
    fontFamily: FONTS.regular,
    color: COLORS.white,
    marginBottom: 32,
    opacity: 0.8,
  },
});