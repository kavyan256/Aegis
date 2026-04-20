import React, { useState } from "react"
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import ScreenHeader from "../components/ScreenHeader"
import { MATTE_COLORS, LAYOUT } from "../utils/theme"

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
    paddingBottom: LAYOUT.spacingSm,
  },
  content: {
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
    paddingBottom: LAYOUT.spacingLg,
  },
  card: {
    backgroundColor: MATTE_COLORS.inputBg,
    borderRadius: 14,
    padding: LAYOUT.screenPaddingHorizontal,
    marginBottom: LAYOUT.spacingMd,
    borderWidth: 1,
    borderColor: MATTE_COLORS.borderColor,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: LAYOUT.spacingMd,
    gap: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: MATTE_COLORS.textPrimary,
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: LAYOUT.spacingMd,
  },
  statsNumber: {
    fontSize: 36,
    fontWeight: '700',
    color: MATTE_COLORS.accentPrimary,
    textAlign: 'center',
  },
  statsLabel: {
    fontSize: 12,
    color: MATTE_COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  divider: {
    width: 1,
    height: 50,
    backgroundColor: MATTE_COLORS.borderColor,
  },
  notifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MATTE_COLORS.accentPrimary + '15',
    borderRadius: 10,
    paddingVertical: LAYOUT.spacingSm,
    gap: 8,
  },
  notifyText: {
    fontSize: 13,
    fontWeight: '600',
    color: MATTE_COLORS.accentPrimary,
  },
  seatNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: MATTE_COLORS.accentSecondary,
    textAlign: 'center',
    marginVertical: LAYOUT.spacingMd,
  },
  badge: {
    backgroundColor: MATTE_COLORS.accentPrimary,
    borderRadius: 12,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: MATTE_COLORS.darkBg,
    fontSize: 12,
    fontWeight: '700',
  },
  emptyText: {
    color: MATTE_COLORS.textSecondary,
    textAlign: 'center',
    paddingVertical: LAYOUT.spacingMd,
    fontSize: 13,
  },
  bookRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: LAYOUT.spacingSm,
    borderBottomWidth: 1,
    borderBottomColor: MATTE_COLORS.borderColor,
    gap: 10,
  },
  bookRowDue: {
    backgroundColor: MATTE_COLORS.accentSecondary + '10',
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  bookIndex: {
    fontSize: 13,
    fontWeight: '600',
    color: MATTE_COLORS.textSecondary,
    width: 20,
  },
  bookName: {
    fontSize: 13,
    fontWeight: '600',
    color: MATTE_COLORS.textPrimary,
    lineHeight: 18,
  },
  bookDate: {
    fontSize: 12,
    color: MATTE_COLORS.textSecondary,
    marginTop: 2,
  },
  dueBadge: {
    backgroundColor: MATTE_COLORS.accentSecondary,
    paddingHorizontal: 8,
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
