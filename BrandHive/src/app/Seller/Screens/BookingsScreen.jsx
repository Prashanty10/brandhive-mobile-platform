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
      case "Pending":
        return "#F97316";
      case "Confirmed":
        return "#0284C7";
      case "Running":
        return "#10B981";
      case "Completed":
        return "#64748B";
      default:
        return colors.textPrimary;
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="calendar-outline" size={wp("12%")} color={colors.textMuted} />
      <Text style={styles.emptyTitle}>No bookings found</Text>
      <Text style={styles.emptySubtitle}>
        {`You don't have any ${activeTab.toLowerCase()} bookings at the moment.`}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Campaign Bookings</Text>
        <Text style={styles.headerSubtitle}>Review and manage advertising bookings</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tabBtn, isActive && styles.activeTabBtn]}
              activeOpacity={0.8}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Bookings List */}
      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.buyerInfo}>
                <Text style={styles.buyerLabel}>Buyer</Text>
                <Text style={styles.buyerName}>{item.buyerName}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}12` }]}>
                <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.cardBody}>
              <Text style={styles.adName}>{item.adName}</Text>
              
              <View style={styles.infoRow}>
                <View style={[styles.iconWrapper, { backgroundColor: item.bgTint }]}>
                  <Ionicons name={item.icon} size={14} color={item.iconColor} />
                </View>
                <Text style={styles.categoryText}>{item.categoryName}</Text>
              </View>

              <View style={styles.detailsGrid}>
                <View style={styles.detailCol}>
                  <Text style={styles.detailLabel}>Duration</Text>
                  <Text style={styles.detailValue}>{item.dateRange}</Text>
                </View>
                <View style={styles.detailCol}>
                  <Text style={styles.detailLabel}>Budget</Text>
                  <Text style={[styles.detailValue, styles.budgetValue]}>{item.budget}</Text>
                </View>
              </View>
            </View>

            {item.status === "Pending" && (
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.rejectBtn]}
                  activeOpacity={0.8}
                  onPress={() => handleReject(item.id, item.buyerName)}
                >
                  <Text style={styles.rejectBtnText}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.acceptBtn]}
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
  header: {
    paddingHorizontal: wp("5%"),
    paddingBottom: hp("1.5%"),
  },
  headerTitle: {
    fontSize: wp("6%"),
    fontWeight: "800",
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: wp("3.2%"),
    color: colors.textSecondary,
    marginTop: 2,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
    padding: 4,
    marginHorizontal: wp("5%"),
    marginVertical: hp("1.5%"),
  },
  tabBtn: {
    flex: 1,
    paddingVertical: hp("1.2%"),
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  activeTabBtn: {
    backgroundColor: colors.white,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: wp("2.8%"),
    fontWeight: "700",
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
  },
  listContent: {
    paddingHorizontal: wp("5%"),
    paddingTop: hp("1%"),
    paddingBottom: hp("15%"),
    gap: hp("2%"),
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: wp("4.5%"),
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buyerInfo: {
    flex: 1,
  },
  buyerLabel: {
    fontSize: wp("2.5%"),
    color: colors.textSecondary,
    textTransform: "uppercase",
    fontWeight: "600",
    marginBottom: 2,
  },
  buyerName: {
    fontSize: wp("3.6%"),
    fontWeight: "700",
    color: colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusText: {
    fontSize: wp("2.5%"),
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: hp("1.5%"),
  },
  cardBody: {
    gap: 6,
  },
  adName: {
    fontSize: wp("3.8%"),
    fontWeight: "800",
    color: colors.textPrimary,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  iconWrapper: {
    width: 20,
    height: 20,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryText: {
    fontSize: wp("2.8%"),
    fontWeight: "600",
    color: colors.textSecondary,
  },
  detailsGrid: {
    flexDirection: "row",
    marginTop: hp("1%"),
    gap: wp("5%"),
  },
  detailCol: {
    flex: 1,
  },
  detailLabel: {
    fontSize: wp("2.6%"),
    color: colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: wp("2.8%"),
    fontWeight: "600",
    color: colors.textPrimary,
  },
  budgetValue: {
    color: colors.primary,
    fontWeight: "800",
    fontSize: wp("3.2%"),
  },
  actionsRow: {
    flexDirection: "row",
    marginTop: hp("2%"),
    gap: wp("3%"),
  },
  actionBtn: {
    flex: 1,
    paddingVertical: hp("1.2%"),
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  rejectBtn: {
    backgroundColor: colors.white,
    borderColor: colors.border,
  },
  rejectBtnText: {
    fontSize: wp("3.2%"),
    fontWeight: "700",
    color: colors.textPrimary,
  },
  acceptBtn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  acceptBtnText: {
    fontSize: wp("3.2%"),
    fontWeight: "700",
    color: colors.white,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp("10%"),
    paddingTop: hp("8%"),
  },
  emptyTitle: {
    fontSize: wp("4.5%"),
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: hp("2%"),
    marginBottom: hp("1%"),
  },
  emptySubtitle: {
    fontSize: wp("3.5%"),
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: wp("5%"),
  },
});
