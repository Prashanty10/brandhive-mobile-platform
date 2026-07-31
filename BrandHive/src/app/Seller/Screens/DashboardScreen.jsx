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
  {
    id: 1,
    categoryName: "hoarding",
    title: "Hoarding",
    subtitle: "Traditional Outdoor Unipole & Billboard",
    icon: ["easel-outline"],
    iconColor: "#0284C7",
  },
  {
    id: 2,
    categoryName: "digital_billboard",
    title: "Digital Billboard",
    subtitle: "High-Def 4K Outdoor LED Screens",
    icon: ["tv-outline"],
    iconColor: "#7C3AED",
  },
  {
    id: 3,
    categoryName: "led_screen",
    title: "LED Screen",
    subtitle: "Commercial & Retail Standee Displays",
    icon: ["desktop-outline"],
    iconColor: "#2563EB",
  },
  {
    id: 4,
    categoryName: "bus_advertisement",
    title: "Bus Advertisement",
    subtitle: "City Public Transit Full Body & Panel Wraps",
    icon: ["bus-outline"],
    iconColor: "#059669",
  },
  {
    id: 5,
    categoryName: "bus_shelter_advertisement",
    title: "Bus Shelter Advertisement",
    subtitle: "Lit Commuter Banners & Both-Side Panels",
    icon: ["business-outline"],
    iconColor: "#EA580C",
  },
  {
    id: 6,
    categoryName: "auto_rickshaw_advertisement",
    title: "Auto Rickshaw Advertisement",
    subtitle: "Mobile Hood Covers & Driver Backseat Posters",
    icon: ["car-outline"],
    iconColor: "#D97706",
  },
  {
    id: 7,
    categoryName: "taxi_advertisement",
    title: "Taxi Advertisement",
    subtitle: "Uber / Ola Cab Carrier & Glass Branding",
    icon: ["car-sport-outline"],
    iconColor: "#0284C7",
  },
  {
    id: 8,
    categoryName: "van_advertisement",
    title: "Van Advertisement",
    subtitle: "Mobile Display Van with Sound & LED",
    icon: ["bus-outline"],
    iconColor: "#16A34A",
  },
  {
    id: 9,
    categoryName: "truck_advertisement",
    title: "Truck Advertisement",
    subtitle: "Intercity Highway Cargo Container Body Wrap",
    icon: ["car-outline"],
    iconColor: "#475569",
  },
  {
    id: 10,
    categoryName: "metro_advertisement",
    title: "Metro Advertisement",
    subtitle: "Train Exterior Wraps & Station Media",
    icon: ["subway-outline"],
    iconColor: "#7C3AED",
  },
  {
    id: 11,
    categoryName: "local_train_advertisement",
    title: "Local Train Advertisement",
    subtitle: "Overhead Posters & Coach Interior Branding",
    icon: ["train-outline"],
    iconColor: "#2563EB",
  },
  {
    id: 12,
    categoryName: "railway_station_advertisement",
    title: "Railway Station Advertisement",
    subtitle: "FOB Bridge Banners, Platform Screens & Kiosks",
    icon: ["location-outline"],
    iconColor: "#D97706",
  },
  {
    id: 13,
    categoryName: "airport_advertisement",
    title: "Airport Advertisement",
    subtitle: "Terminal Screens, Conveyor Belts & Trolleys",
    icon: ["airplane-outline"],
    iconColor: "#0284C7",
  },
  {
    id: 14,
    categoryName: "mall_advertisement",
    title: "Mall Advertisement",
    subtitle: "Atrium Drop Banners, Escalators & Digital Standees",
    icon: ["storefront-outline"],
    iconColor: "#EC4899",
  },
];

const DashboardScreen = () => {
  const router = useRouter();
  const [userName, setUserName] = useState("Vanessa");

  const fetchUser = async () => {
    setUserName("Vanessa");
  };

  useFocusEffect(
    useCallback(() => {
      fetchUser();
    }, [])
  );

  const handleCategoryPress = (categoryName) => {
    router.push({
      pathname: "/Seller/CreateAdvertisement",
      params: { categoryName },
    });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTitleContainer}>
        <Text style={styles.greetingText}>Hi, {userName} 👋</Text>
        <Text style={styles.subtitleText}>Manage your advertisement business</Text>
      </View>
      <TouchableOpacity style={styles.notificationBtn} activeOpacity={0.7}>
        <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
        <View style={styles.notificationBadge} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {renderHeader()}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Advertisement Categories Section */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Advertisement Categories</Text>
          <Text style={styles.sectionSubtitle}>Select a medium below to create a new advertisement listing</Text>
          
          <View style={styles.categoriesGrid}>
            {OFFLINE_AD_CATEGORIES.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.categoryCard}
                activeOpacity={0.7}
                onPress={() => handleCategoryPress(item.categoryName)}
              >
                <View style={[styles.categoryIconContainer, { backgroundColor: `${item.iconColor}12` }]}>
                  <Ionicons name={item.icon[0]} size={20} color={item.iconColor} />
                </View>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryCardTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.categoryCardSubtitle} numberOfLines={1}>
                    {item.subtitle}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={14} color={colors.textSecondary} style={styles.chevron} />
              </TouchableOpacity>
            ))}
          </View>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp("5%"),
    paddingBottom: hp("1.5%"),
  },
  headerTitleContainer: {
    flex: 1,
  },
  greetingText: {
    fontSize: wp("5.5%"),
    fontWeight: "800",
    color: colors.textPrimary,
  },
  subtitleText: {
    fontSize: wp("3%"),
    color: colors.textSecondary,
    marginTop: 2,
  },
  notificationBtn: {
    width: wp("10%"),
    height: wp("10%"),
    borderRadius: wp("5%"),
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  scrollContent: {
    paddingBottom: hp("15%"),
  },
  sectionTitle: {
    fontSize: wp("4.2%"),
    fontWeight: "800",
    color: colors.textPrimary,
    paddingHorizontal: wp("5%"),
    marginTop: hp("2%"),
    marginBottom: hp("1%"),
  },
  sectionSubtitle: {
    fontSize: wp("3%"),
    color: colors.textSecondary,
    paddingHorizontal: wp("5%"),
    marginBottom: hp("1.5%"),
  },
  metricsContainer: {
    paddingLeft: wp("5%"),
    paddingRight: wp("2%"),
    paddingVertical: hp("0.5%"),
    gap: wp("4%"),
  },
  metricCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: wp("4%"),
    width: wp("36%"),
    height: hp("14%"),
    justifyContent: "space-between",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  metricTitle: {
    fontSize: wp("2.8%"),
    color: colors.textSecondary,
    fontWeight: "600",
    marginTop: 6,
  },
  metricValue: {
    fontSize: wp("4%"),
    fontWeight: "800",
    color: colors.textPrimary,
  },
  categoriesSection: {
    marginTop: hp("1%"),
  },
  categoriesGrid: {
    paddingHorizontal: wp("5%"),
    gap: hp("1.5%"),
  },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: wp("3.5%"),
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  categoryIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp("3.5%"),
  },
  categoryInfo: {
    flex: 1,
  },
  categoryCardTitle: {
    fontSize: wp("3.5%"),
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 2,
  },
  categoryCardSubtitle: {
    fontSize: wp("2.8%"),
    color: colors.textSecondary,
  },
  chevron: {
    marginLeft: wp("2%"),
  },
  activitySection: {
    marginTop: hp("1%"),
  },
  activityList: {
    paddingHorizontal: wp("5%"),
    gap: hp("1.5%"),
  },
  activityCard: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: wp("3.5%"),
    alignItems: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  activityIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp("3%"),
  },
  activityInfo: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  activityTitle: {
    fontSize: wp("3.2%"),
    fontWeight: "700",
    color: colors.textPrimary,
  },
  activityTime: {
    fontSize: wp("2.5%"),
    color: colors.textSecondary,
  },
  activityDesc: {
    fontSize: wp("2.8%"),
    color: colors.textSecondary,
    lineHeight: wp("4%"),
  },
});
