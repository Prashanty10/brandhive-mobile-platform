import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import colors from "../../../../Theme/colors";

import { ONLINE_PLATFORMS } from "../../../../data/onlineInformation";

const onlinePlatforms = ONLINE_PLATFORMS.map((platform, index) => ({
  id: index + 1,
  name: platform.name || platform.title,
  platformKey: platform.platformKey || platform.id,
  icon: platform.icon,
  iconColor: platform.iconColor,
  bgTint: platform.bgTint,
  tags: platform.tags || [],
  subtitle: platform.shortOverview || platform.subtitle,
}));


const platformFilters = [
  { id: 1, title: "All" },
  { id: 2, title: "Popular" },
  { id: 3, title: "Social Media" },
  { id: 4, title: "Search" },
  { id: 5, title: "Video" },
  { id: 6, title: "Shopping" },
  { id: 7, title: "Messaging" },
  { id: 8, title: "Business" },
];

const OnlineCategoryScreen = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  // Filtering logic
  const filteredPlatforms = onlinePlatforms.filter((platform) => {
    // Search query match
    const matchesSearch =
      platform.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      platform.subtitle.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter match
    const matchesFilter =
      selectedFilter === "All" || platform.tags.includes(selectedFilter);

    return matchesSearch && matchesFilter;
  });

  const handlePlatformPress = (item) => {
    router.push({
      pathname: "/Buyer/advertisement/online/OnlineInformationScreen",
      params: { platformId: item.platformKey },
    });
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={wp("12%")} color={colors.textMuted} />
      <Text style={styles.emptyTitle}>No platforms found</Text>
      <Text style={styles.emptySubtitle}>
        {`We couldn't find any advertising platforms matching "${searchQuery}" under "${selectedFilter}"`}
      </Text>
      <TouchableOpacity
        style={styles.clearSearchBtn}
        onPress={() => {
          setSearchQuery("");
          setSelectedFilter("All");
        }}
      >
        <Text style={styles.clearSearchText}>Reset Filters</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Online Ads</Text>
          <Text style={styles.headerSubtitle}>Discover digital marketing platforms</Text>
        </View>
        <View style={{ width: wp("10%") }} />
      </View>

      {/* Search Input */}
      <View style={styles.searchRow}>
        <View style={styles.searchWrapper}>
          <Ionicons
            name="search"
            size={18}
            color={colors.textMuted}
            style={styles.searchIcon}
          />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search platforms..."
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Horizontal Category Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScrollContent}
        >
          {platformFilters.map((item) => {
            const isActive = selectedFilter === item.title;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => setSelectedFilter(item.title)}
                style={[
                  styles.filterPill,
                  isActive ? styles.filterPillActive : styles.filterPillInactive,
                ]}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterText,
                    isActive ? styles.filterTextActive : styles.filterTextInactive,
                  ]}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Platforms Grid List */}
      <View style={{ flex: 1 }}>
        <FlatList
          data={filteredPlatforms}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.7}
              onPress={() => handlePlatformPress(item)}
            >
              <View style={{ flex: 1 }}>
                <View style={styles.cardTopRow}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: item.bgTint },
                    ]}
                  >
                    <Ionicons name={item.icon} size={22} color={item.iconColor} />
                  </View>
                </View>

                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text
                  style={styles.cardSubtitle}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {item.subtitle}
                </Text>
              </View>

              <View style={styles.learnMoreContainer}>
                <Text style={styles.learnMoreText}>Learn more</Text>
                <Ionicons
                  name="chevron-forward"
                  size={12}
                  color={colors.primary}
                />
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

export default OnlineCategoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : hp("6%"),
  },
  header: {
    height: hp("7%"),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp("5%"),
    backgroundColor: colors.background,
  },
  backButton: {
    width: wp("10%"),
    height: wp("10%"),
    borderRadius: wp("5%"),
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  headerTitleContainer: {
    alignItems: "center",
    flex: 1,
  },
  headerTitle: {
    fontSize: wp("4.5%"),
    fontWeight: "700",
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: wp("2.8%"),
    color: colors.textSecondary,
    marginTop: 1,
  },
  searchRow: {
    paddingHorizontal: wp("5%"),
    marginTop: hp("1.5%"),
    marginBottom: hp("1%"),
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingHorizontal: wp("3%"),
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  searchIcon: {
    marginRight: wp("2%"),
  },
  searchInput: {
    flex: 1,
    paddingVertical: hp("1.5%"),
    color: colors.textPrimary,
    fontSize: wp("3.8%"),
  },
  clearButton: {
    padding: 4,
  },
  filtersContainer: {
    marginVertical: hp("1.5%"),
  },
  filtersScrollContent: {
    paddingHorizontal: wp("5%"),
    gap: wp("2.5%"),
    alignItems: "center",
  },
  filterPill: {
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1%"),
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterPillInactive: {
    backgroundColor: colors.card,
    borderColor: colors.border,
  },
  filterText: {
    fontSize: wp("3.4%"),
    fontWeight: "600",
  },
  filterTextActive: {
    color: colors.white,
  },
  filterTextInactive: {
    color: colors.textSecondary,
  },
  listContent: {
    paddingHorizontal: wp("4%"),
    paddingBottom: hp("12%"),
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: hp("2%"),
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: wp("4%"),
    width: wp("43.5%"),
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    justifyContent: "space-between",
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: hp("1.2%"),
  },
  iconContainer: {
    width: wp("11%"),
    height: wp("11%"),
    borderRadius: wp("3%"),
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: wp("3.8%"),
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: hp("0.5%"),
  },
  cardSubtitle: {
    fontSize: wp("3%"),
    color: colors.textSecondary,
    lineHeight: wp("4.2%"),
    marginBottom: hp("1.5%"),
  },
  learnMoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accentLight,
    paddingVertical: hp("0.8%"),
    borderRadius: 12,
    gap: 4,
  },
  learnMoreText: {
    fontSize: wp("3.2%"),
    fontWeight: "600",
    color: colors.primary,
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
    marginBottom: hp("3%"),
  },
  clearSearchBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("1.2%"),
    borderRadius: 20,
  },
  clearSearchText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: wp("3.5%"),
  },
});
