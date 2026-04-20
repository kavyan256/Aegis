"use client"

import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { useMemo } from "react"
import { MATTE_COLORS, SPACING } from "../utils/theme"

export default function FilterTabs({ options, activeFilter, onFilterChange }) {
  const totalWidth = useMemo(() => options.length * 120, [options.length])

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { minWidth: totalWidth }]}
      >
        {options.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[styles.tab, activeFilter === option.key && styles.activeTab]}
            onPress={() => onFilterChange(option.key)}
          >
            <Text style={[styles.tabText, activeFilter === option.key && styles.activeTabText]}>{option.label}</Text>
            {option.count > 0 && (
              <View style={[styles.badge, activeFilter === option.key && styles.activeBadge]}>
                <Text style={[styles.badgeText, activeFilter === option.key && styles.activeBadgeText]}>
                  {option.count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.md,
    backgroundColor: MATTE_COLORS.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: MATTE_COLORS.borderColor,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    borderRadius: 20,
    backgroundColor: MATTE_COLORS.inputBg,
  },
  activeTab: {
    backgroundColor: MATTE_COLORS.accentPrimary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '400',
    color: MATTE_COLORS.textSecondary,
  },
  activeTabText: {
    color: MATTE_COLORS.textPrimary,
    fontWeight: 'bold',
  },
  badge: {
    backgroundColor: MATTE_COLORS.borderColor,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: SPACING.xs,
    minWidth: 20,
    alignItems: "center",
  },
  activeBadge: {
    backgroundColor: MATTE_COLORS.textPrimary + "30",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: MATTE_COLORS.textSecondary,
  },
  activeBadgeText: {
    color: MATTE_COLORS.textPrimary,
  },
})
