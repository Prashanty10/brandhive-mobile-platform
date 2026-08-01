import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import colors from "../../../Theme/colors";

const TABS = ["Pending", "Confirmed", "Running", "Completed"];

const MOCK_BOOKINGS = [
  {
    id: "b1",
    buyerName: "Acme Brand Corp",
    status: "Pending",
    adName: "Times Square Outdoor LED Billboard",
    categoryName: "Digital Billboard",
    dateRange: "15 Aug 2026 - 30 Aug 2026",
    budget: "₹67,500",
    bgTint: "#EFF6FF",
    iconColor: "#3B82F6",
    icon: "tv-outline",
  },
  {
    id: "b2",
    buyerName: "Apex Retail Solutions",
    status: "Pending",
    adName: "City Public Transit Bus Wraps",
    categoryName: "Bus Advertisement",
    dateRange: "01 Sep 2026 - 15 Sep 2026",
    budget: "₹45,000",
    bgTint: "#ECFDF5",
    iconColor: "#10B981",
    icon: "bus-outline",
  },
  {
    id: "b3",
    buyerName: "Starlight Media Inc",
    status: "Confirmed",
    adName: "Central Highway Unipole",
    categoryName: "Hoarding",
    dateRange: "01 Aug 2026 - 31 Aug 2026",
    budget: "₹1,20,000",
    bgTint: "#FFF7ED",
    iconColor: "#F97316",
    icon: "easel-outline",
  },
  {
    id: "b4",
    buyerName: "Global Tech Summit",
    status: "Running",
    adName: "Airport Terminal Digital Display",
    categoryName: "Airport Advertisement",
    dateRange: "20 Jul 2026 - 10 Aug 2026",
    budget: "₹1,50,000",
    bgTint: "#EFF6FF",
    iconColor: "#0284C7",
    icon: "airplane-outline",
  },
];

const BookingsScreen = () => {
  const [activeTab, setActiveTab] = useState("Pending");
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);

  const filteredBookings = bookings.filter(
    (booking) => booking.status.toLowerCase() === activeTab.toLowerCase()
  );

  const handleAccept = (id, buyerName) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === id ? { ...booking, status: "Confirmed" } : booking
      )
    );
    Alert.alert("Booking Accepted", `You have accepted the booking from ${buyerName}.`);
  };

  const handleReject = (id, buyerName) => {
    setBookings((prev) => prev.filter((booking) => booking.id !== id));
    Alert.alert("Booking Rejected", `You have rejected the booking from ${buyerName}.`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "#F97316";
      case "Confirmed": return "#0284C7";
      case "Running": return "#10B981";
      case "Completed": return "#64748B";
      default: return colors.textPrimary;
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconBg}>
        <Ionicons name="calendar-outline" size={28} color={colors.textMuted} />
      </View>
      <Text style={styles.emptyTitle}>No bookings found</Text>
      <Text style={styles.emptySubtitle}>
        {`You don't have any ${activeTab.toLowerCase()} bookings at the moment.`}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Campaign Bookings</Text>
        <Text style={styles.headerSubtitle}>Review and manage advertising bookings</Text>
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
                activeOpacity={0.8}
                onPress={() => setActiveTab(tab)}
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
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <View style={[styles.iconBlock, { backgroundColor: item.bgTint }]}>
                <Ionicons name={item.icon} size={18} color={item.iconColor} />
              </View>
              <View style={styles.buyerInfo}>
                <Text style={styles.buyerLabel}>BUYER</Text>
                <Text style={styles.buyerName}>{item.buyerName}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: `${getStatusColor(item.status)}14` },
                ]}
              >
                <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                  {item.status}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Card Body */}
            <View style={styles.cardBody}>
              <Text style={styles.adName} numberOfLines={1}>
                {item.adName}
              </Text>

              <View style={styles.categoryRow}>
                <Ionicons name={item.icon} size={12} color={item.iconColor} />
                <Text style={styles.categoryText}>{item.categoryName}</Text>
              </View>

              <View style={styles.detailsGrid}>
                <View style={styles.detailCol}>
                  <Text style={styles.detailLabel}>Duration</Text>
                  <Text style={styles.detailValue}>{item.dateRange}</Text>
                </View>
                <View style={[styles.detailCol, styles.detailColRight]}>
                  <Text style={styles.detailLabel}>Budget</Text>
                  <Text style={[styles.detailValue, styles.budgetValue]}>{item.budget}</Text>
                </View>
              </View>
            </View>

            {/* Actions */}
            {item.status === "Pending" && (
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.rejectBtn}
                  activeOpacity={0.8}
                  onPress={() => handleReject(item.id, item.buyerName)}
                >
                  <Text style={styles.rejectBtnText}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.acceptBtn}
                  activeOpacity={0.8}
                  onPress={() => handleAccept(item.id, item.buyerName)}
                >
                  <Text style={styles.acceptBtnText}>Accept</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
};

export default BookingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : hp("6%"),
  },

  // ── Header
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 3,
  },

  // ── Tabs
  tabsWrapper: {
    paddingHorizontal: 20,
    marginBottom: 8,
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
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.textPrimary,
  },

  // ── List
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
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
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBlock: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  buyerInfo: {
    flex: 1,
  },
  buyerLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  buyerName: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: -0.1,
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
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: 14,
  },
  cardBody: {
    gap: 8,
  },
  adName: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: -0.1,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  detailsGrid: {
    flexDirection: "row",
    marginTop: 4,
    gap: 16,
  },
  detailCol: {
    flex: 1,
  },
  detailColRight: {
    alignItems: "flex-end",
  },
  detailLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: "600",
    letterSpacing: 0.3,
    marginBottom: 3,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  budgetValue: {
    color: colors.textPrimary,
    fontWeight: "800",
    fontSize: 15,
  },

  // ── Actions
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  rejectBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  rejectBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  acceptBtn: {
    flex: 2,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.button,
    justifyContent: "center",
    alignItems: "center",
  },
  acceptBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.white,
  },

  // ── Empty
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
