import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
  Modal,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import colors from "../../../Theme/colors";
import { OFFLINE_AD_CATEGORIES } from "../../Buyer/advertisement/offline/OfflineCategoryScreen";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?w=500&auto=format&fit=crop&q=60";

const MOCK_SELLER_ADS = [
  {
    _id: "ad1",
    title: "Prime Highway Unipole Billboard",
    category: "hoarding",
    price: 4500,
    status: "active",
    location: { address: "Express Highway Junction, Sector 18" },
    images: ["https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?w=500&auto=format&fit=crop&q=60"],
    createdAt: new Date().toISOString(),
  },
  {
    _id: "ad2",
    title: "City Mall Entrance 4K Digital Billboard",
    category: "digital_billboard",
    price: 6000,
    status: "active",
    location: { address: "Central Promenade Mall, Main Atrium" },
    images: ["https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&auto=format&fit=crop&q=60"],
    createdAt: new Date().toISOString(),
  },
  {
    _id: "ad3",
    title: "Metro Station Platform LED Screens",
    category: "led_screen",
    price: 3200,
    status: "pending",
    location: { address: "Connaught Place Metro Station Gate 3" },
    images: ["https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&auto=format&fit=crop&q=60"],
    createdAt: new Date().toISOString(),
  },
];

const AdvertisementsScreen = () => {
  const router = useRouter();

  const [advertisements, setAdvertisements] = useState(MOCK_SELLER_ADS);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  const fetchAdvertisements = async (isRefreshing = false) => {
    if (isRefreshing) {
      setRefreshing(true);
      setTimeout(() => {
        setAdvertisements(MOCK_SELLER_ADS);
        setRefreshing(false);
      }, 400);
    } else {
      setAdvertisements(MOCK_SELLER_ADS);
      setLoading(false);
    }
  };

  // Re-fetch automatically whenever screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchAdvertisements();
    }, [])
  );

  const handleCategorySelect = (categoryName) => {
    setCategoryModalVisible(false);
    router.push({
      pathname: "/Seller/CreateAdvertisement",
      params: { categoryName },
    });
  };

  const formatPrice = (price) => {
    if (!price) return "N/A";
    const num = Number(price);
    if (isNaN(num)) return price;
    return `₹${num.toLocaleString("en-IN")}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Recently";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Recently";
    }
  };

  const getStatusStyle = (status) => {
    const s = status ? status.toLowerCase() : "active";
    switch (s) {
      case "active":
        return { bg: "#ECFDF5", text: "#10B981", label: "Active" };
      case "pending":
        return { bg: "#FFF7ED", text: "#F97316", label: "Pending" };
      case "inactive":
        return { bg: "#FEF2F2", text: "#EF4444", label: "Inactive" };
      default:
        return { bg: "#ECFDF5", text: "#10B981", label: "Active" };
    }
  };

  // Category info lookup
  const getCategoryDetails = (catName) => {
    const matched = OFFLINE_AD_CATEGORIES.find(
      (c) => c.categoryName === catName
    );
    if (matched) {
      return {
        title: matched.title,
        icon: matched.icon[0],
        iconColor: matched.iconColor,
      };
    }
    const formatted = catName
      ? catName.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
      : "General Ad";
    return {
      title: formatted,
      icon: "megaphone-outline",
      iconColor: colors.primary,
    };
  };

  // Render Skeleton Loaders while loading
  const renderSkeletonLoaders = () => (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3].map((key) => (
        <View key={key} style={styles.skeletonCard}>
          <View style={styles.skeletonImage} />
          <View style={styles.skeletonBody}>
            <View style={[styles.skeletonLine, { width: "40%", height: 12 }]} />
            <View style={[styles.skeletonLine, { width: "80%", height: 18 }]} />
            <View style={[styles.skeletonLine, { width: "60%", height: 12 }]} />
            <View style={[styles.skeletonLine, { width: "35%", height: 16 }]} />
          </View>
        </View>
      ))}
    </View>
  );

  // Render Error / Retry State
  const renderErrorState = () => (
    <View style={styles.stateContainer}>
      <View style={styles.errorIconWrapper}>
        <Ionicons name="cloud-offline-outline" size={48} color={colors.error} />
      </View>
      <Text style={styles.stateTitle}>Unable to Load Listings</Text>
      <Text style={styles.stateSubtitle}>{error}</Text>
      <TouchableOpacity
        style={styles.retryBtn}
        activeOpacity={0.8}
        onPress={() => fetchAdvertisements()}
      >
        <Ionicons name="refresh" size={18} color={colors.white} />
        <Text style={styles.retryBtnText}>Retry Connection</Text>
      </TouchableOpacity>
    </View>
  );

  // Render Empty State
  const renderEmptyState = () => (
    <View style={styles.stateContainer}>
      <View style={styles.emptyIconWrapper}>
        <Ionicons name="megaphone-outline" size={48} color={colors.primary} />
      </View>
      <Text style={styles.stateTitle}>No Advertisements Yet</Text>
      <Text style={styles.stateSubtitle}>
        You haven&apos;t published any advertisements yet. Create your first advertisement to start receiving booking requests.
      </Text>
      <TouchableOpacity
        style={styles.createAdBtn}
        activeOpacity={0.8}
        onPress={() => setCategoryModalVisible(true)}
      >
        <Ionicons name="add-circle-outline" size={20} color={colors.white} />
        <Text style={styles.createAdBtnText}>Create Advertisement</Text>
      </TouchableOpacity>
    </View>
  );

  // Render Single Advertisement Card
  const renderAdCard = ({ item }) => {
    const catDetails = getCategoryDetails(item.category);
    const statusStyle = getStatusStyle(item.status);
    const imageUri =
      Array.isArray(item.images) && item.images.length > 0
        ? item.images[0]
        : DEFAULT_IMAGE;
    const locationText =
      typeof item.location === "object" && item.location?.address
        ? item.location.address
        : typeof item.location === "string"
        ? item.location
        : "Location details available";

    return (
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>
              {statusStyle.label}
            </Text>
          </View>
        </View>

        <View style={styles.cardInfo}>
          <View style={styles.categoryRow}>
            <View
              style={[
                styles.iconWrapper,
                { backgroundColor: `${catDetails.iconColor}15` },
              ]}
            >
              <Ionicons name={catDetails.icon} size={14} color={catDetails.iconColor} />
            </View>
            <Text style={styles.categoryText}>{catDetails.title}</Text>
            <Text style={styles.dotSeparator}>•</Text>
            <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
          </View>

          <Text style={styles.adTitle} numberOfLines={1}>
            {item.title}
          </Text>

          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.locationText} numberOfLines={1}>
              {locationText}
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Price:</Text>
            <Text style={styles.priceValue}>{formatPrice(item.price)}</Text>
            <Text style={styles.priceDuration}> / month</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Advertisements</Text>
          <Text style={styles.headerSubtitle}>
            Manage & track your live advertising listings
          </Text>
        </View>

        <TouchableOpacity
          style={styles.headerAddBtn}
          activeOpacity={0.8}
          onPress={() => setCategoryModalVisible(true)}
        >
          <Ionicons name="add" size={22} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      {loading && !refreshing ? (
        renderSkeletonLoaders()
      ) : error ? (
        renderErrorState()
      ) : (
        <FlatList
          style={{ flex: 1 }}
          data={advertisements}
          keyExtractor={(item, idx) => item._id || item.id || idx.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={renderAdCard}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchAdvertisements(true)}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        />
      )}

      {/* Floating Action Button */}
      {advertisements.length > 0 && !loading && (
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.9}
          onPress={() => setCategoryModalVisible(true)}
        >
          <Ionicons name="add" size={28} color={colors.white} />
        </TouchableOpacity>
      )}

      {/* Category Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={categoryModalVisible}
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Category</Text>
              <TouchableOpacity
                onPress={() => setCategoryModalVisible(false)}
                style={styles.closeBtn}
              >
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScroll}
            >
              <Text style={styles.modalSubtitle}>
                Select an advertising medium to list your space:
              </Text>
              {OFFLINE_AD_CATEGORIES.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.categoryItem}
                  activeOpacity={0.7}
                  onPress={() => handleCategorySelect(item.categoryName)}
                >
                  <View
                    style={[
                      styles.itemIconContainer,
                      { backgroundColor: `${item.iconColor}15` },
                    ]}
                  >
                    <Ionicons
                      name={item.icon[0]}
                      size={20}
                      color={item.iconColor}
                    />
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemSubtitle} numberOfLines={1}>
                      {item.subtitle}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AdvertisementsScreen;

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
    fontWeight: "400",
  },
  headerAddBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },

  // ── List
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: hp("15%"),
    gap: 12,
  },

  // ── Ad Card
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    height: hp("17%"),
  },
  imageContainer: {
    width: wp("33%"),
    height: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  statusBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  cardInfo: {
    flex: 1,
    padding: 14,
    justifyContent: "space-between",
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    width: 20,
    height: 20,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
    letterSpacing: 0.1,
  },
  dotSeparator: {
    fontSize: 11,
    color: colors.textMuted,
    marginHorizontal: 4,
  },
  dateText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  adTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: -0.1,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 11,
    color: colors.textSecondary,
    flex: 1,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginRight: 4,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  priceDuration: {
    fontSize: 11,
    color: colors.textSecondary,
  },

  // ── Skeleton
  skeletonContainer: {
    paddingHorizontal: 20,
    gap: 12,
    paddingTop: 4,
  },
  skeletonCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    height: hp("17%"),
    overflow: "hidden",
    padding: 12,
    gap: 12,
  },
  skeletonImage: {
    width: wp("30%"),
    height: "100%",
    backgroundColor: colors.divider,
    borderRadius: 12,
  },
  skeletonBody: {
    flex: 1,
    justifyContent: "space-around",
  },
  skeletonLine: {
    backgroundColor: colors.divider,
    borderRadius: 6,
  },

  // ── States
  stateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingBottom: hp("10%"),
  },
  emptyIconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: colors.neutralLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  errorIconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  stateTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: -0.2,
  },
  stateSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  createAdBtn: {
    backgroundColor: colors.button,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  createAdBtnText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 14,
  },
  retryBtn: {
    backgroundColor: colors.error,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  retryBtnText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 14,
  },

  // ── FAB
  fab: {
    position: "absolute",
    bottom: 110,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.32,
    shadowRadius: 12,
    elevation: 6,
  },

  // ── Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: hp("80%"),
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  modalScroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: hp("5%"),
  },
  modalSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  itemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    flexShrink: 0,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 3,
    letterSpacing: -0.1,
  },
  itemSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
