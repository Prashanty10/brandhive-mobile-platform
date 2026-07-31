import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../../../Theme/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const MOCK_BANNERS = [
  {
    _id: "b1",
    title: "Times Square Digital Screen",
    tag: "POPULAR",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?w=600&auto=format&fit=crop&q=80",
    city: "New York",
    state: "NY",
    price: { amount: 4500, duration: "day" },
  },
  {
    _id: "b2",
    title: "Central Mall Atrium Display",
    tag: "FEATURED",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80",
    city: "Los Angeles",
    state: "CA",
    price: { amount: 3200, duration: "day" },
  },
  {
    _id: "b3",
    title: "Metro Station Transit Wall Banners",
    tag: "EXCLUSIVE",
    rating: "5.0",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80",
    city: "Chicago",
    state: "IL",
    price: { amount: 2800, duration: "day" },
  },
];

const MOCK_POPULAR_ADS = [
  { _id: "p1", title: "Highway Unipole Billboard", price: "5,000", image: "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?w=500&auto=format&fit=crop&q=60" },
  { _id: "p2", title: "City Public Transit Bus Wraps", price: "3,500", image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=500&auto=format&fit=crop&q=60" },
  { _id: "p3", title: "Airport Terminal Digital Display", price: "8,000", image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&auto=format&fit=crop&q=60" },
];

const HomeScreen = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    firstName: "Vanessa",
    lastName: "Miller",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
    city: "New York",
    state: "NY",
  });
  const [banner, setbanner] = useState(MOCK_BANNERS);
  const [popularads, setpopularads] = useState(MOCK_POPULAR_ADS);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHomeData = useCallback(async () => {
    setbanner(MOCK_BANNERS);
    setpopularads(MOCK_POPULAR_ADS);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      const loadData = async () => {
        try {
          await fetchHomeData();
        } finally {
          if (isMounted) setLoading(false);
        }
      };

      loadData();
      return () => {
        isMounted = false;
      };
    }, [fetchHomeData])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchHomeData();
      await new Promise((resolve) => setTimeout(resolve, 600));
    } finally {
      setRefreshing(false);
    }
  }, [fetchHomeData]);

  const name = user?.firstName || "Vanessa";
  const surname = user?.lastName || "";
  const dp =
    user?.profileImage ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop";
  const city = user?.city || "New York";
  const state = user?.state || "NY";

  const renderitem = () => {
    return (
      <View style={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <View style={styles.profileContainer}>
            <View style={styles.avatarWrapper}>
              <Image style={styles.avatar} source={{ uri: dp }} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.welcomeGreeting}>
                Hey, <Text style={styles.welcomeName}>{name}</Text> 👋
              </Text>
              <Text style={styles.welcomeSubtitleText}>
                Welcome to BrandHive
              </Text>
            </View>
          </View>

          <Pressable style={styles.notificationButton}>
            <Ionicons
              name="notifications-outline"
              size={22}
              color={colors.white}
            />
            <View style={styles.notificationBadge} />
          </Pressable>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchWrapper}>
            <Ionicons
              name="search"
              size={20}
              color={colors.textMuted}
              style={styles.searchIcon}
            />
            <TextInput
              placeholder="Search ad spaces..."
              placeholderTextColor={colors.textMuted}
              style={styles.searchInput}
            />
          </View>
        </View>

        <View style={styles.exploreSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Spaces</Text>
          </View>

          <View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={banner}
              keyExtractor={(item) => item._id}
              contentContainerStyle={styles.bannersContainer}
              renderItem={({ item }) => {
                const imageUrl =
                  item.image && item.image.startsWith("http")
                    ? item.image
                    : "https://images.unsplash.com/photo-1617396900799-f4ec2b43c7ae?q=80&w=600";

                return (
                  <Pressable style={styles.bannerCard}>
                    <Image
                      source={{ uri: imageUrl }}
                      style={styles.bannerImage}
                      resizeMode="cover"
                    />
                    <View style={styles.bannerInfo}>
                      <View style={styles.tagRow}>
                        <Text style={styles.bannerTag}>
                          {item.tag || "SPONSOR"}
                        </Text>
                        <View style={styles.ratingRow}>
                          <Ionicons name="star" size={12} color="#FFD700" />
                          <Text style={styles.ratingText}>
                            {item.rating || "5.0"}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.bannerTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={styles.bannerLocation} numberOfLines={1}>
                        <Ionicons
                          name="location-outline"
                          size={12}
                          color={colors.textSecondary}
                        />{" "}
                        {item.location?.city || item.city || "New York"},{" "}
                        {item.location?.state || item.state || "NY"}
                      </Text>
                      <View style={styles.priceRow}>
                        <Text style={styles.bannerPrice}>
                          ₹{item.price?.amount || 0}
                        </Text>
                        <Text style={styles.bannerDuration}>
                          /{item.price?.duration || "day"}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                );
              }}
            />
          </View>
        </View>

        <View style={styles.adTypeSection}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Campaign Channels</Text>
              <Text style={styles.sectionSubtitle}>
                Select a medium to explore available ad spaces
              </Text>
            </View>
          </View>

          <View style={styles.platformRow}>
            <Pressable
              style={styles.platformCard}
              onPress={() =>
                router.push({
                  pathname: "/Buyer/advertisement/online/OnlineCategoryScreen",
                  params: { type: "online" },
                })
              }
            >
              <View
                style={[
                  styles.platformIconContainer,
                  { backgroundColor: colors.accentLight },
                ]}
              >
                <Ionicons name="globe-outline" size={22} color={colors.primary} />
              </View>
              <Text style={styles.platformTitle}>Online Ads</Text>
              <Text style={styles.platformSubtitle}>
                Websites, social media & mobile app banners
              </Text>
            </Pressable>

            <Pressable
              style={styles.platformCard}
              onPress={() =>
                router.push({
                  pathname: "/Buyer/advertisement/offline/OfflineCategoryScreen",
                  params: { type: "offline" },
                })
              }
            >
              <View
                style={[
                  styles.platformIconContainer,
                  { backgroundColor: "#FFF7ED" },
                ]}
              >
                <Ionicons name="storefront-outline" size={22} color="#F97316" />
              </View>
              <Text style={styles.platformTitle}>Offline Ads</Text>
              <Text style={styles.platformSubtitle}>
                Billboards, transit ads & physical banners
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Popular Ad Spaces Section */}
        <View style={{ marginVertical: hp("2.5%") }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: hp("1.5%") }}>
            <View>
              <Text style={styles.sectionTitle}>Popular Ad Spaces</Text>
              <Text style={styles.sectionSubtitle}>Top performing high-visibility locations</Text>
            </View>
            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 2 }} activeOpacity={0.7}>
              <Text style={{ fontSize: wp("3.4%"), fontWeight: "600", color: colors.primary }}>View all</Text>
              <Ionicons name="chevron-forward" size={14} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={popularads}
            keyExtractor={(item) => item._id || item.id}
            contentContainerStyle={{ paddingRight: wp("5%"), gap: wp("3.5%") }}
            renderItem={({ item }) => (
              <View style={{ width: wp("55%"), backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: "hidden", elevation: 2 }}>
                <Image source={{ uri: item.image }} style={{ width: "100%", height: hp("14%") }} resizeMode="cover" />
                <View style={{ padding: wp("3.5%") }}>
                  <Text style={{ fontSize: wp("3.8%"), fontWeight: "700", color: colors.textPrimary, marginBottom: 4 }} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={{ fontSize: wp("4%"), fontWeight: "800", color: colors.textPrimary }}>
                    ₹{item.price}<Text style={{ fontSize: wp("3%"), fontWeight: "400", color: colors.textSecondary }}>/day</Text>
                  </Text>
                </View>
              </View>
            )}
          />
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Campaign Insights</Text>
        </View>
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {renderitem()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  flatListContent: {
    paddingHorizontal: wp(6),
    paddingBottom: hp(12),
  },

  scrollContent: {
    paddingBottom: 130,
  },

  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: hp(2),
    marginBottom: hp(1.8),
  },

  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(3),
  },

  avatarWrapper: {
    width: wp(13.5),
    height: wp(13.5),
    borderRadius: wp(6.75),
    borderWidth: 2,
    borderColor: colors.primary,
    padding: 1.5,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },

  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: wp(5.5),
  },

  profileInfo: {
    justifyContent: "center",
  },

  welcomeGreeting: {
    fontSize: wp(5),
    color: colors.textPrimary,
    fontWeight: "700",
    letterSpacing: -0.4,
  },

  welcomeName: {
    color: colors.primary,
    fontWeight: "800",
  },

  welcomeSubtitleText: {
    fontSize: wp(3),
    color: colors.textSecondary,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 2,
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1.8),
  },

  searchWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: wp(4),
    height: hp(6),
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },

  searchIcon: {
    marginRight: wp(2.5),
  },

  searchInput: {
    flex: 1,
    fontSize: wp(3.8),
    color: colors.textPrimary,
    fontWeight: "500",
  },

  notificationButton: {
    width: hp(6),
    height: hp(6),
    borderRadius: 16,
    backgroundColor: colors.buttonSecondary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
    position: "relative",
  },

  notificationBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.buttonSecondary,
  },

  exploreSection: {
    marginBottom: hp(2.2),
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(1.5),
  },

  sectionTitle: {
    fontSize: wp(4.5),
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },

  sectionSubtitle: {
    fontSize: wp(3.2),
    color: colors.textSecondary,
    marginTop: hp(0.5),
    marginBottom: hp(1.2),
  },

  seeAllText: {
    fontSize: wp(3.4),
    color: colors.textSecondary,
    fontWeight: "600",
  },

  adTypeSection: {
    marginBottom: hp(2.2),
  },

  statsSection: {
    marginBottom: hp(2.2),
  },
  bannersContainer: {
    gap: wp(3),
  },
  bannerCard: {
    width: wp(75),
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  bannerImage: {
    width: "100%",
    height: hp(21),
  },
  bannerInfo: {
    padding: wp(4),
  },
  tagRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(0.8),
  },
  bannerTag: {
    fontSize: wp(3.2),
    fontWeight: "700",
    color: colors.primary,
    backgroundColor: colors.accentLight,
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.4),
    borderRadius: 8,
    textTransform: "uppercase",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1),
  },
  ratingText: {
    fontSize: wp(3.5),
    fontWeight: "700",
    color: colors.textPrimary,
  },
  bannerTitle: {
    fontSize: wp(4),
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: hp(0.5),
  },
  bannerLocation: {
    fontSize: wp(3.5),
    color: colors.textSecondary,
    marginBottom: hp(1),
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  bannerPrice: {
    fontSize: wp(4.2),
    fontWeight: "800",
    color: colors.primary,
  },
  bannerDuration: {
    fontSize: wp(3.2),
    color: colors.textSecondary,
    marginLeft: 2,
  },
  platformRow: {
    flexDirection: "row",
    gap: wp(4),
    marginTop: hp(0.2),
  },
  platformCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: wp(4),
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  platformIconContainer: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(5.5),
    backgroundColor: colors.accentLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(1.2),
  },
  platformTitle: {
    fontSize: wp(4),
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: hp(0.5),
  },
  platformSubtitle: {
    fontSize: wp(3.1),
    color: colors.textSecondary,
    lineHeight: wp(4.4),
  },
});
