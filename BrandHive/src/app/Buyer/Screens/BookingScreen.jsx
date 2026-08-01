import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../Theme/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const TABS = ["Active", "Pending", "Completed", "Cancelled"];

const MOCK_BOOKINGS = [
  {
    id: "bk1",
    adTitle: "Times Square Unipole Billboard",
    sellerName: "MediaHub Pvt. Ltd.",
    status: "Active",
    category: "Billboard",
    dateRange: "01 Aug – 31 Aug 2026",
    totalPaid: "₹1,35,000",
    iconName: "easel-outline",
    iconColor: "#2563EB",
    iconBg: "#EFF6FF",
  },
  {
    id: "bk2",
    adTitle: "City Centre 4K LED Screen",
    sellerName: "DigitalEdge Solutions",
    status: "Active",
    category: "Digital Billboard",
    dateRange: "10 Aug – 25 Aug 2026",
    totalPaid: "₹96,000",
    iconName: "tv-outline",
    iconColor: "#7C3AED",
    iconBg: "#F5F3FF",
  },
  {
    id: "bk3",
    adTitle: "Metro Station Platform Panels",
    sellerName: "TransitMedia Co.",
    status: "Pending",
    category: "Transit",
    dateRange: "15 Sep – 30 Sep 2026",
    totalPaid: "₹64,000",
    iconName: "subway-outline",
    iconColor: "#059669",
    iconBg: "#ECFDF5",
  },
  {
    id: "bk4",
    adTitle: "Airport Terminal Display",
    sellerName: "AirSpace Ads",
    status: "Completed",
    category: "Airport",
    dateRange: "01 Jul – 20 Jul 2026",
    totalPaid: "₹1,70,000",
    iconName: "airplane-outline",
    iconColor: "#EA580C",
    iconBg: "#FFF7ED",
  },
];

const STATUS_CONFIG = {
  Active: { color: "#059669", bg: "#ECFDF5" },
  Pending: { color: "#F59E0B", bg: "#FFFBEB" },
  Completed: { color: "#2563EB", bg: "#EFF6FF" },
  Cancelled: { color: "#EF4444", bg: "#FEF2F2" },
};

const BookingScreen = () => {
  const [activeTab, setActiveTab] = useState("Active");
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);

  const filteredBookings = bookings.filter(
    (b) => b.status.toLowerCase() === activeTab.toLowerCase()
  );

  const handleCancel = (id, title) => {
    Alert.alert(
      "Cancel Booking",
      `Are you sure you want to cancel "${title}"?`,
      [
        { text: "Keep", style: "cancel" },
        {
          text: "Cancel Booking",
          style: "destructive",
          onPress: () =>
            setBookings((prev) =>
              prev.map((b) =>
                b.id === id ? { ...b, status: "Cancelled" } : b
              )
            ),
        },
      ]
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconBg}>
        <Ionicons name="calendar-outline" size={28} color={colors.textMuted} />
      </View>
      <Text style={styles.emptyTitle}>No bookings here</Text>
      <Text style={styles.emptySubtitle}>
        {`Your ${activeTab.toLowerCase()} bookings will appear here.`}
      </Text>
    </View>
  );

  const renderItem = ({ item }) => {
    const cfg = STATUS_CONFIG[item.status] || {
      color: colors.textSecondary,
      bg: colors.divider,
    };

    return (
      <TouchableOpacity style={styles.card} activeOpacity={0.92}>
        {/* Top Row */}
        <View style={styles.cardTop}>
          <View style={[styles.iconBlock, { backgroundColor: item.iconBg }]}>
            <Ionicons name={item.iconName} size={22} color={item.iconColor} />
          </View>
          <View style={styles.cardTitleGroup}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.adTitle}
            </Text>
            <Text style={styles.cardSeller} numberOfLines={1}>
              {item.sellerName}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
            <Text style={[styles.statusText, { color: cfg.color }]}>
              {item.status}
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Detail Grid */}
        <View style={styles.detailGrid}>
          <View style={styles.detailItem}>
            <View style={styles.detailLabelRow}>
              <Ionicons name="grid-outline" size={11} color={colors.textSecondary} />
              <Text style={styles.detailLabel}>Category</Text>
            </View>
            <Text style={styles.detailValue}>{item.category}</Text>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailLabelRow}>
              <Ionicons name="calendar-outline" size={11} color={colors.textSecondary} />
              <Text style={styles.detailLabel}>Duration</Text>
            </View>
            <Text style={styles.detailValue}>{item.dateRange}</Text>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailLabelRow}>
              <Ionicons name="wallet-outline" size={11} color={colors.textSecondary} />
              <Text style={styles.detailLabel}>Total Paid</Text>
            </View>
            <Text style={[styles.detailValue, styles.priceValue]}>{item.totalPaid}</Text>
          </View>
        </View>

        {/* Actions */}
        {item.status === "Active" && (
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => handleCancel(item.id, item.adTitle)}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.viewBtn} activeOpacity={0.8}>
              <Text style={styles.viewBtnText}>View Details</Text>
            </TouchableOpacity>
          </View>
        )}
        {item.status === "Pending" && (
          <View style={styles.pendingNote}>
            <Ionicons name="time-outline" size={13} color="#F59E0B" />
            <Text style={styles.pendingNoteText}>Awaiting seller confirmation</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <Text style={styles.headerSubtitle}>Track your ad campaigns</Text>
      </View>

      {/* ── Tabs ── */}
      <View style={styles.tabsWrapper}>
        <View style={styles.tabsTrack}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabBtn, isActive && styles.activeTabBtn]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── List ── */}
      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
};

export default BookingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // ── Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 3,
    fontWeight: "400",
  },

  // ── Tabs
  tabsWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  tabsTrack: {
    flexDirection: "row",
    backgroundColor: colors.divider,
    borderRadius: 14,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  activeTabBtn: {
    backgroundColor: colors.white,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.textPrimary,
  },

  // ── List
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: hp("15%"),
    gap: 12,
  },

  // ── Card
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBlock: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  cardTitleGroup: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: -0.1,
  },
  cardSeller: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: 14,
  },

  // Detail Grid
  detailGrid: {
    gap: 10,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textPrimary,
    textAlign: "right",
    flexShrink: 1,
    marginLeft: 16,
  },
  priceValue: {
    color: colors.textPrimary,
    fontWeight: "800",
    fontSize: 14,
  },

  // Actions
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  cancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  viewBtn: {
    flex: 2,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.button,
    justifyContent: "center",
    alignItems: "center",
  },
  viewBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.white,
  },

  // Pending note
  pendingNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    backgroundColor: "#FFFBEB",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  pendingNoteText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#F59E0B",
  },

  // Empty
  emptyContainer: {
    alignItems: "center",
    paddingTop: hp("10%"),
    paddingHorizontal: 40,
  },
  emptyIconBg: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: colors.divider,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});
