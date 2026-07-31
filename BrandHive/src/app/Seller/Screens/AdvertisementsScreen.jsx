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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  headerAddBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent:"center",
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
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
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    height: hp("16.5%"),
  },
  imageContainer: {
    width: wp("32%"),
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
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    fontSize: wp("2.5%"),
    fontWeight: "700",
  },
  cardInfo: {
    flex: 1,
    padding: wp("3.5%"),
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
    fontSize: wp("2.8%"),
    fontWeight: "700",
    color: colors.textSecondary,
  },
  dotSeparator: {
    fontSize: wp("2.8%"),
    color: colors.textMuted,
    marginHorizontal: 4,
  },
  dateText: {
    fontSize: wp("2.6%"),
    color: colors.textMuted,
  },
  adTitle: {
    fontSize: wp("3.8%"),
    fontWeight: "700",
    color: colors.textPrimary,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: wp("2.8%"),
    color: colors.textSecondary,
    flex: 1,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceLabel: {
    fontSize: wp("2.8%"),
    color: colors.textSecondary,
    marginRight: 4,
  },
  priceValue: {
    fontSize: wp("3.6%"),
    fontWeight: "800",
    color: colors.primary,
  },
  priceDuration: {
    fontSize: wp("2.8%"),
    color: colors.textSecondary,
  },

  // Skeleton Loaders
  skeletonContainer: {
    paddingHorizontal: wp("5%"),
    gap: hp("2%"),
    paddingTop: hp("1%"),
  },
  skeletonCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    height: hp("16.5%"),
    overflow: "hidden",
    padding: wp("3%"),
    gap: wp("3%"),
  },
  skeletonImage: {
    width: wp("28%"),
    height: "100%",
    backgroundColor: colors.inputBg || "#F1F5F9",
    borderRadius: 14,
  },
  skeletonBody: {
    flex: 1,
    justifyContent: "space-around",
  },
  skeletonLine: {
    backgroundColor: colors.inputBg || "#F1F5F9",
    borderRadius: 6,
  },

  // Empty & Error States
  stateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp("8%"),
    paddingBottom: hp("10%"),
  },
  emptyIconWrapper: {
    width: wp("20%"),
    height: wp("20%"),
    borderRadius: wp("10%"),
    backgroundColor: colors.accentLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp("2%"),
  },
  errorIconWrapper: {
    width: wp("20%"),
    height: wp("20%"),
    borderRadius: wp("10%"),
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp("2%"),
  },
  stateTitle: {
    fontSize: wp("5%"),
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: hp("1%"),
    textAlign: "center",
  },
  stateSubtitle: {
    fontSize: wp("3.5%"),
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: wp("5%"),
    marginBottom: hp("3%"),
  },
  createAdBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: wp("6%"),
    paddingVertical: hp("1.5%"),
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  createAdBtnText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: wp("3.8%"),
  },
  retryBtn: {
    backgroundColor: colors.error,
    paddingHorizontal: wp("6%"),
    paddingVertical: hp("1.5%"),
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  retryBtnText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: wp("3.8%"),
  },

  // Floating Action Button
  fab: {
    position: "absolute",
    bottom: 110,
    right: wp("6%"),
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: hp("80%"),
    paddingTop: hp("2.5%"),
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp("6%"),
    paddingBottom: hp("1.5%"),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: wp("4.5%"),
    fontWeight: "800",
    color: colors.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  modalScroll: {
    paddingHorizontal: wp("6%"),
    paddingTop: hp("2%"),
    paddingBottom: hp("5%"),
  },
  modalSubtitle: {
    fontSize: wp("3.2%"),
    color: colors.textSecondary,
    marginBottom: hp("2%"),
    lineHeight: wp("4.5%"),
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: wp("3.5%"),
    marginBottom: hp("1.5%"),
  },
  itemIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp("3.5%"),
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: wp("3.5%"),
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: wp("2.8%"),
    color: colors.textSecondary,
  },
});
