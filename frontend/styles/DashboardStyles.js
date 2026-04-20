import { StyleSheet } from "react-native"
import { MATTE_COLORS, SPACING } from "../utils/theme"

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MATTE_COLORS.darkBg,
  },
  header: {
    backgroundColor: MATTE_COLORS.cardBg,
    paddingTop: 50,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  greeting: {
    fontSize: 14,
    fontWeight: '400',
    color: MATTE_COLORS.textSecondary,
    opacity: 0.8,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: MATTE_COLORS.textPrimary,
    marginTop: SPACING.xs,
  },
  studentId: {
    fontSize: 13,
    fontWeight: '400',
    color: MATTE_COLORS.textSecondary,
    opacity: 0.8,
    marginTop: SPACING.xs,
  },
  logoutButton: {
    backgroundColor: MATTE_COLORS.accentSecondary + "20",
    marginTop : 15,
    borderRadius: 8,
  },
  content: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: MATTE_COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  quickActions: {
    marginTop: SPACING.lg,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionCard: {
    width: "48%",
    backgroundColor: MATTE_COLORS.cardBg,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '400',
    color: MATTE_COLORS.textSecondary,
    textAlign: "center",
  },
})
