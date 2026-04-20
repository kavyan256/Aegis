import React, { useState } from "react"
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import ScreenHeader from "../components/ScreenHeader"
import { MATTE_COLORS, LAYOUT, SPACING } from "../utils/theme"

export default function LibraryScreen({ navigation }) {
  const { isDarkMode, toggleTheme } = useTheme()

  const libraryStats = { capacity: 120, current: 75 }
  const issuedBooks = [
    { id: 1, name: "The Hitchhiker's Guide to the Galaxy", issueDate: "2025-08-20", isDue: false },
    { id: 2, name: "The Lord of the Rings", issueDate: "2025-08-21", isDue: true },
    { id: 3, name: "The Chronicles of Narnia", issueDate: "2025-08-18", isDue: false },
  ]

  const [notify, setNotify] = useState(false)
  const tokenNumber = "42"
  const isFull = libraryStats.current >= libraryStats.capacity
  const availableSeats = libraryStats.capacity - libraryStats.current

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: MATTE_COLORS.darkBg }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={MATTE_COLORS.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleTheme}>
          <Ionicons name={isDarkMode ? "sunny" : "moon"} size={24} color={MATTE_COLORS.accentPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader
          title="Library"
          subtitle="Check availability"
          showIcon={false}
        />

        {/* Current Status */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="people" size={24} color={MATTE_COLORS.accentPrimary} />
            <Text style={styles.cardTitle}>Current Status</Text>
          </View>

          <View style={styles.statusRow}>
            <View>
              <Text style={styles.statsNumber}>{libraryStats.current}</Text>
              <Text style={styles.statsLabel}>Readers</Text>
            </View>
            <View style={styles.divider} />
            <View>
              <Text style={styles.statsNumber}>{availableSeats}</Text>
              <Text style={styles.statsLabel}>Available</Text>
            </View>
          </View>

          {isFull && (
            <TouchableOpacity
              style={styles.notifyButton}
              onPress={() => setNotify(!notify)}
            >
              <Ionicons name="notifications" size={16} color={MATTE_COLORS.accentPrimary} />
              <Text style={styles.notifyText}>Notify when available</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Seat Number */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="chair" size={24} color={MATTE_COLORS.accentSecondary} />
            <Text style={styles.cardTitle}>Your Seat</Text>
          </View>
          <Text style={styles.seatNumber}>#{tokenNumber}</Text>
        </View>

        {/* Issued Books */}
        <View style={styles.card}>
          <View style={[styles.cardHeader, { marginBottom: LAYOUT.spacingMd }]}>
            <Ionicons name="book" size={24} color={MATTE_COLORS.accentPrimary} />
            <Text style={styles.cardTitle}>Issued Books</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{issuedBooks.length}</Text>
            </View>
          </View>

          {issuedBooks.length === 0 ? (
            <Text style={styles.emptyText}>No books issued</Text>
          ) : (
            issuedBooks.map((book, idx) => (
              <View key={book.id} style={[styles.bookRow, book.isDue && styles.bookRowDue]}>
                <Text style={styles.bookIndex}>{idx + 1}.</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.bookName} numberOfLines={2}>
                    {book.name}
                  </Text>
                  <Text style={styles.bookDate}>{book.issueDate}</Text>
                </View>
                {book.isDue && (
                  <View style={styles.dueBadge}>
                    <Text style={styles.dueText}>DUE</Text>
                  </View>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
    paddingTop: 12,
    paddingBottom: SPACING.sm,
  },
  content: {
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
    paddingBottom: SPACING.xl,
  },
  card: {
    backgroundColor: MATTE_COLORS.cardBg,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: MATTE_COLORS.borderColor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: MATTE_COLORS.textPrimary,
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingVertical: SPACING.md,
  },
  statsNumber: {
    fontSize: 40,
    fontWeight: '700',
    color: MATTE_COLORS.accentPrimary,
    textAlign: 'center',
  },
  statsLabel: {
    fontSize: 13,
    color: MATTE_COLORS.textSecondary,
    marginTop: SPACING.xs,
    textAlign: 'center',
    fontWeight: '500',
  },
  divider: {
    width: 1,
    height: 60,
    backgroundColor: MATTE_COLORS.borderColor,
  },
  notifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MATTE_COLORS.accentPrimary + '15',
    borderRadius: 12,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  notifyText: {
    fontSize: 14,
    fontWeight: '600',
    color: MATTE_COLORS.accentPrimary,
  },
  seatNumber: {
    fontSize: 56,
    fontWeight: '700',
    color: MATTE_COLORS.accentSecondary,
    textAlign: 'center',
    marginVertical: SPACING.lg,
  },
  badge: {
    backgroundColor: MATTE_COLORS.accentPrimary,
    borderRadius: 12,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: MATTE_COLORS.darkBg,
    fontSize: 13,
    fontWeight: '700',
  },
  emptyText: {
    color: MATTE_COLORS.textSecondary,
    textAlign: 'center',
    paddingVertical: SPACING.lg,
    fontSize: 14,
  },
  bookRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: MATTE_COLORS.borderColor,
    gap: SPACING.md,
  },
  bookRowDue: {
    backgroundColor: MATTE_COLORS.accentSecondary + '10',
    paddingHorizontal: SPACING.sm,
    borderRadius: 8,
    marginBottom: SPACING.xs,
  },
  bookIndex: {
    fontSize: 14,
    fontWeight: '600',
    color: MATTE_COLORS.textSecondary,
    width: 20,
  },
  bookName: {
    fontSize: 14,
    fontWeight: '600',
    color: MATTE_COLORS.textPrimary,
    lineHeight: 20,
  },
  bookDate: {
    fontSize: 12,
    color: MATTE_COLORS.textSecondary,
    marginTop: SPACING.xs,
    fontWeight: '400',
  },
  dueBadge: {
    backgroundColor: MATTE_COLORS.accentSecondary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 6,
  },
  dueText: {
    color: MATTE_COLORS.darkBg,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
})
