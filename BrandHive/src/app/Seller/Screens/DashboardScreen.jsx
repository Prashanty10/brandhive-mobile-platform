import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import colors from "../../../Theme/colors";

const OFFLINE_AD_CATEGORIES = [
  { id: 1, categoryName: "hoarding", title: "Hoarding", subtitle: "Traditional Outdoor Unipole & Billboard", icon: ["easel-outline"], iconColor: "#374151" },
  { id: 2, categoryName: "digital_billboard", title: "Digital Billboard", subtitle: "High-Def 4K Outdoor LED Screens", icon: ["tv-outline"], iconColor: "#374151" },
  { id: 3, categoryName: "led_screen", title: "LED Screen", subtitle: "Commercial & Retail Standee Displays", icon: ["desktop-outline"], iconColor: "#374151" },
  { id: 4, categoryName: "bus_advertisement", title: "Bus Advertisement", subtitle: "City Public Transit Full Body & Panel Wraps", icon: ["bus-outline"], iconColor: "#374151" },
  { id: 5, categoryName: "bus_shelter_advertisement", title: "Bus Shelter Advertisement", subtitle: "Lit Commuter Banners & Both-Side Panels", icon: ["business-outline"], iconColor: "#374151" },
  { id: 6, categoryName: "auto_rickshaw_advertisement", title: "Auto Rickshaw Advertisement", subtitle: "Mobile Hood Covers & Driver Backseat Posters", icon: ["car-outline"], iconColor: "#374151" },
  { id: 7, categoryName: "taxi_advertisement", title: "Taxi Advertisement", subtitle: "Uber / Ola Cab Carrier & Glass Branding", icon: ["car-sport-outline"], iconColor: "#374151" },
  { id: 8, categoryName: "van_advertisement", title: "Van Advertisement", subtitle: "Mobile Display Van with Sound & LED", icon: ["bus-outline"], iconColor: "#374151" },
  { id: 9, categoryName: "truck_advertisement", title: "Truck Advertisement", subtitle: "Intercity Highway Cargo Container Body Wrap", icon: ["car-outline"], iconColor: "#374151" },
  { id: 10, categoryName: "metro_advertisement", title: "Metro Advertisement", subtitle: "Train Exterior Wraps & Station Media", icon: ["subway-outline"], iconColor: "#374151" },
  { id: 11, categoryName: "local_train_advertisement", title: "Local Train Advertisement", subtitle: "Overhead Posters & Coach Interior Branding", icon: ["train-outline"], iconColor: "#374151" },
  { id: 12, categoryName: "railway_station_advertisement", title: "Railway Station Advertisement", subtitle: "FOB Bridge Banners, Platform Screens & Kiosks", icon: ["location-outline"], iconColor: "#374151" },
  { id: 13, categoryName: "airport_advertisement", title: "Airport Advertisement", subtitle: "Terminal Screens, Conveyor Belts & Trolleys", icon: ["airplane-outline"], iconColor: "#374151" },
  { id: 14, categoryName: "mall_advertisement", title: "Mall Advertisement", subtitle: "Atrium Drop Banners, Escalators & Digital Standees", icon: ["storefront-outline"], iconColor: "#374151" },
];

const DashboardScreen = () => {
  const router = useRouter();
  const [userName, setUserName] = useState("Vanessa");

  const fetchUser = async () => { setUserName("Vanessa"); };

  useFocusEffect(
    useCallback(() => { fetchUser(); }, [])
  );

  const handleCategoryPress = (categoryName) => {
    router.push({ pathname: "/Seller/CreateAdvertisement", params: { categoryName } });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greetingText}>Hi, {userName} 👋</Text>
          <Text style={styles.subtitleText}>Manage your advertisement business</Text>
        </View>
        <TouchableOpacity style={styles.notifBtn} activeOpacity={0.8}>
          <Ionicons name="notifications-outline" size={19} color={colors.textPrimary} />
          <View style={styles.notifDot} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ── Section ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Advertisement Categories</Text>
          <Text style={styles.sectionSubtitle}>
            Select a medium to create a new listing
          </Text>
        </View>

        <View style={styles.categoriesGrid}>
          {OFFLINE_AD_CATEGORIES.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.categoryCard}
              activeOpacity={0.8}
              onPress={() => handleCategoryPress(item.categoryName)}
            >
              <View style={[styles.catIconBox, { backgroundColor: `${item.iconColor}14` }]}>
                <Ionicons name={item.icon[0]} size={18} color={item.iconColor} />
              </View>
              <View style={styles.catInfo}>
                <Text style={styles.catTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.catSubtitle} numberOfLines={1}>
                  {item.subtitle}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : hp("6%"),
  },

  // ── Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  subtitleText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 3,
    fontWeight: "400",
  },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  notifDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
    borderWidth: 1.5,
    borderColor: colors.white,
  },

  // ── Content
  scrollContent: {
    paddingBottom: hp("15%"),
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 3,
  },

  // ── Category Cards
  categoriesGrid: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  catIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    flexShrink: 0,
  },
  catInfo: {
    flex: 1,
  },
  catTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 3,
  },
  catSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
