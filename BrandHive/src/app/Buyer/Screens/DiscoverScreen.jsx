import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../Theme/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "billboard", label: "Billboards" },
  { id: "digital", label: "Digital" },
  { id: "transit", label: "Transit" },
  { id: "mall", label: "Mall" },
  { id: "airport", label: "Airport" },
];

const FEATURED_ADS = [
  {
    id: "1",
    title: "Times Square Unipole Billboard",
    category: "Billboard",
    location: "Express Highway, Sector 18",
    price: "₹4,500/day",
    rating: 4.9,
    reviews: 38,
    iconName: "easel-outline",
    iconColor: "#374151",
    iconBg: "#F0F0F0",
    tag: "Featured",
  },
  {
    id: "2",
    title: "City Centre 4K LED Digital Screen",
    category: "Digital",
    location: "Central Promenade Mall Atrium",
    price: "₹6,000/day",
    rating: 4.8,
    reviews: 52,
    iconName: "tv-outline",
    iconColor: "#374151",
    iconBg: "#F0F0F0",
    tag: "Popular",
  },
  {
    id: "3",
    title: "Metro Station Platform Panels",
    category: "Transit",
    location: "Connaught Place Metro, Gate 3",
    price: "₹3,200/day",
    rating: 4.7,
    reviews: 29,
    iconName: "subway-outline",
    iconColor: "#374151",
    iconBg: "#F0F0F0",
    tag: "New",
  },
  {
    id: "4",
    title: "Airport Terminal Premium Display",
    category: "Airport",
    location: "IGI Airport Terminal 2, Arrival",
    price: "₹8,500/day",
    rating: 5.0,
    reviews: 17,
    iconName: "airplane-outline",
    iconColor: "#374151",
    iconBg: "#F0F0F0",
    tag: "Premium",
  },
];

const QUICK_STATS = [
  { label: "Listings", value: "2,400+", iconName: "megaphone-outline" },
  { label: "Cities", value: "48", iconName: "location-outline" },
  { label: "Partners", value: "380+", iconName: "people-outline" },
];

const DiscoverScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredAds =
    activeCategory === "all"
      ? FEATURED_ADS
      : FEATURED_ADS.filter((ad) => ad.category.toLowerCase() === activeCategory);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Discover</Text>
            <Text style={styles.headerSubtitle}>Find premium ad spaces near you</Text>
          </View>
          <TouchableOpacity style={styles.filterBtn} activeOpacity={0.7}>
            <Ionicons name="options-outline" size={19} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* ── Search Bar ── */}
        <View style={styles.searchWrapper}>
          <Ionicons name="search-outline" size={17} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search billboards, locations..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")} activeOpacity={0.7}>
              <Ionicons name="close-circle" size={17} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Stats Row ── */}
        <View style={styles.statsRow}>
          {QUICK_STATS.map((stat, idx) => (
            <View key={idx} style={styles.statCard}>
              <View style={styles.statIconBg}>
                <Ionicons name={stat.iconName} size={15} color={colors.textPrimary} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Category Chips ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.chip, isActive && styles.activeChip]}
                onPress={() => setActiveCategory(cat.id)}
                activeOpacity={0.75}
              >
                <Text style={[styles.chipText, isActive && styles.activeChipText]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Section Title ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {activeCategory === "all"
              ? "All Listings"
              : CATEGORIES.find((c) => c.id === activeCategory)?.label}
          </Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* ── Ad Cards ── */}
        <View style={styles.adsList}>
          {filteredAds.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconBg}>
                <Ionicons name="search-outline" size={28} color={colors.textMuted} />
              </View>
              <Text style={styles.emptyTitle}>No listings found</Text>
              <Text style={styles.emptySubtitle}>Try a different category</Text>
            </View>
          ) : (
            filteredAds.map((ad) => (
              <TouchableOpacity key={ad.id} style={styles.adCard} activeOpacity={0.88}>
                <View style={[styles.adIconBlock, { backgroundColor: ad.iconBg }]}>
                  <Ionicons name={ad.iconName} size={24} color={ad.iconColor} />
                </View>

                <View style={styles.adContent}>
                  <View style={styles.adTopRow}>
                    <Text style={styles.adTitle} numberOfLines={1}>{ad.title}</Text>
                    <View style={styles.tagBadge}>
                      <Text style={styles.tagText}>{ad.tag}</Text>
                    </View>
                  </View>

                  <View style={styles.adLocationRow}>
                    <Ionicons name="location-outline" size={11} color={colors.textSecondary} />
                    <Text style={styles.adLocation} numberOfLines={1}>{ad.location}</Text>
                  </View>

                  <View style={styles.adBottomRow}>
                    <Text style={styles.adPrice}>{ad.price}</Text>
                    <View style={styles.ratingRow}>
                      <Ionicons name="star" size={11} color="#F59E0B" />
                      <Text style={styles.adRating}>{ad.rating} ({ad.reviews})</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DiscoverScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: hp("14%") },

  // ── Header
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28, fontWeight: "800", color: colors.textPrimary, letterSpacing: -0.5,
  },
  headerSubtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 3 },
  filterBtn: {
    width: 44, height: 44, borderRadius: 22,
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white,
    justifyContent: "center", alignItems: "center",
    shadowColor: "#111827", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },

  // ── Search
  searchWrapper: {
    flexDirection: "row", alignItems: "center", backgroundColor: colors.white,
    borderRadius: 16, borderWidth: 1, borderColor: colors.border,
    marginHorizontal: 20, marginBottom: 20, paddingHorizontal: 16, height: 52,
    shadowColor: "#111827", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 14, color: colors.textPrimary, height: "100%" },

  // ── Stats
  statsRow: { flexDirection: "row", paddingHorizontal: 20, marginBottom: 20, gap: 12 },
  statCard: {
    flex: 1, backgroundColor: colors.white, borderRadius: 16,
    borderWidth: 1, borderColor: colors.border,
    paddingVertical: 14, paddingHorizontal: 12, alignItems: "center",
    shadowColor: "#111827", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  statIconBg: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: colors.neutralLight,
    justifyContent: "center", alignItems: "center", marginBottom: 8,
  },
  statValue: { fontSize: 15, fontWeight: "800", color: colors.textPrimary, letterSpacing: -0.3 },
  statLabel: {
    fontSize: 11, color: colors.textSecondary, marginTop: 2, textAlign: "center", fontWeight: "500",
  },

  // ── Category Chips
  categoriesRow: { paddingHorizontal: 20, gap: 8, paddingBottom: 20 },
  chip: {
    paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20,
    backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border,
  },
  activeChip: { backgroundColor: "#111827", borderColor: "#111827" },
  chipText: { fontSize: 13, fontWeight: "600", color: colors.textSecondary },
  activeChipText: { color: colors.white },

  // ── Section Header
  sectionHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 20, marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: colors.textPrimary, letterSpacing: -0.2 },
  seeAll: { fontSize: 13, fontWeight: "700", color: colors.textPrimary },

  // ── Ad Cards
  adsList: { paddingHorizontal: 20, gap: 12 },
  adCard: {
    flexDirection: "row", backgroundColor: colors.white, borderRadius: 20,
    borderWidth: 1, borderColor: colors.border, padding: 16,
    shadowColor: "#111827", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
    alignItems: "center", gap: 14,
  },
  adIconBlock: { width: 52, height: 52, borderRadius: 16, justifyContent: "center", alignItems: "center", flexShrink: 0 },
  adContent: { flex: 1, gap: 5 },
  adTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  adTitle: { flex: 1, fontSize: 14, fontWeight: "700", color: colors.textPrimary, letterSpacing: -0.1 },
  tagBadge: { backgroundColor: colors.neutralLight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  tagText: { fontSize: 10, fontWeight: "700", color: colors.textSecondary, letterSpacing: 0.3 },
  adLocationRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  adLocation: { flex: 1, fontSize: 12, color: colors.textSecondary },
  adBottomRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 2 },
  adPrice: { fontSize: 14, fontWeight: "800", color: colors.textPrimary, letterSpacing: -0.2 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  adRating: { fontSize: 11, fontWeight: "600", color: colors.textSecondary },

  // ── Empty
  emptyState: { alignItems: "center", paddingTop: hp("6%"), paddingBottom: hp("4%") },
  emptyIconBg: {
    width: 64, height: 64, borderRadius: 20, backgroundColor: colors.divider,
    justifyContent: "center", alignItems: "center", marginBottom: 16,
  },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: colors.textPrimary },
  emptySubtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
});
