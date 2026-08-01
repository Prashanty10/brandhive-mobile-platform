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
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../Theme/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { getBannersApi } from "../Api/bannerApi";
import { userInfo } from "../Api/userApi";

const HomeScreen = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHomeData = useCallback(async () => {
    try {
      const bannerRes = await getBannersApi();
      if (bannerRes?.banners) {
        setBanners(bannerRes.banners);
      } else if (Array.isArray(bannerRes)) {
        setBanners(bannerRes);
      }
      try {
        const userRes = await userInfo();
        if (userRes?.user) setUser(userRes.user);
      } catch (e) {}
    } catch (error) {
      console.error("Fetch home data error:", error);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const initialLoad = async () => {
      setLoading(true);
      await fetchHomeData();
      if (isMounted) setLoading(false);
    };
    initialLoad();
    return () => {
      isMounted = false;
    };
  }, [fetchHomeData]);

  useFocusEffect(
    useCallback(() => {
      fetchHomeData();
    }, [fetchHomeData]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchHomeData();
    } finally {
      setRefreshing(false);
    }
  }, [fetchHomeData]);

  const name = user?.firstName || "User";
  const dp =
    user?.profileImage ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop";
  const userLocation = user?.city
    ? `${user.city}${user?.state ? `, ${user.state}` : ""}`
    : "Select Location";

  return (
    <SafeAreaView style={styles.container}>
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.textPrimary} />
          <Text style={styles.loadingText}>Loading BrandHive...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollStyle}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.textPrimary]}
              tintColor={colors.textPrimary}
            />
          }
        >
          <View style={styles.headerContainer}>
            <View style={styles.profileContainer}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => router.push("/Buyer/Screens/ProfileScreen")}
                style={styles.avatarWrapper}
              >
                <Image style={styles.avatar} source={{ uri: dp }} />
              </TouchableOpacity>
              <View style={styles.profileInfo}>
                <Text style={styles.welcomeGreeting}>
                  Hey, <Text style={styles.welcomeName}>{name}</Text> 👋
                </Text>
                <TouchableOpacity
                  style={styles.locationRow}
                  activeOpacity={0.7}
                  onPress={() =>
                    router.push("/Buyer/components/Profile/EditProfileScreen")
                  }
                >
                  <Ionicons
                    name="location-outline"
                    size={12}
                    color={colors.textSecondary}
                  />
                  <Text style={styles.locationText} numberOfLines={1}>
                    {userLocation}
                  </Text>
                  <Ionicons
                    name="chevron-down"
                    size={11}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.notifBtn}
              activeOpacity={0.8}
              onPress={() => router.push("/Buyer/Screens/ProfileScreen")}
            >
              <Ionicons
                name="notifications-outline"
                size={19}
                color={colors.textPrimary}
              />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchWrapper}>
            <View style={styles.searchIconBox}>
              <Ionicons
                name="search-outline"
                size={16}
                color={colors.textPrimary}
              />
            </View>
            <TextInput
              placeholder="Search spaces, locations..."
              placeholderTextColor={colors.textMuted}
              style={styles.searchInput}
            />
            <TouchableOpacity
              style={styles.searchFilterBtn}
              activeOpacity={0.8}
            >
              <Ionicons
                name="options-outline"
                size={16}
                color={colors.textPrimary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Spaces</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>

            {banners && banners.length > 0 ? (
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={banners}
                keyExtractor={(item) =>
                  item._id || item.id || String(Math.random())
                }
                contentContainerStyle={styles.bannersContainer}
                renderItem={({ item }) => {
                  const imageUrl =
                    item.image && item.image.startsWith("http")
                      ? item.image
                      : "https://images.unsplash.com/photo-1617396900799-f4ec2b43c7ae?q=80&w=600";
                  return (
                    <Pressable
                      style={({ pressed }) => [
                        styles.bannerCard,
                        pressed && { opacity: 0.95 },
                      ]}
                    >
                      <Image
                        source={{ uri: imageUrl }}
                        style={styles.bannerImage}
                        resizeMode="cover"
                      />
                      <View style={styles.bannerBody}>
                        <View style={styles.bannerTopRow}>
                          <View style={styles.tagBadge}>
                            <Text style={styles.tagText}>
                              {item.tag || "FEATURED"}
                            </Text>
                          </View>
                          <View style={styles.ratingPill}>
                            <Ionicons name="star" size={11} color="#F59E0B" />
                            <Text style={styles.ratingText}>
                              {item.rating || "5.0"}
                            </Text>
                          </View>
                        </View>

                        <Text style={styles.bannerTitle} numberOfLines={1}>
                          {item.title || "Premium Billboard Space"}
                        </Text>

                        <View style={styles.bannerLocationRow}>
                          <Ionicons
                            name="location-outline"
                            size={12}
                            color={colors.textSecondary}
                          />
                          <Text
                            style={styles.bannerLocationText}
                            numberOfLines={1}
                          >
                            {item.location?.city || item.city || "Location"},{" "}
                            {item.location?.state || item.state || ""}
                          </Text>
                        </View>

                        <View style={styles.bannerFooter}>
                          <View>
                            <Text style={styles.bannerPrice}>
                              ₹{item.price?.amount || item.price || 0}
                            </Text>
                            <Text style={styles.bannerDuration}>
                              per {item.price?.duration || "day"}
                            </Text>
                          </View>
                          <TouchableOpacity
                            style={styles.bookBtn}
                            activeOpacity={0.85}
                            onPress={() =>
                              router.push("/Buyer/Screens/BookingScreen")
                            }
                          >
                            <Text style={styles.bookBtnText}>Book Now</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </Pressable>
                  );
                }}
              />
            ) : (
              <View style={styles.emptyCard}>
                <Ionicons
                  name="images-outline"
                  size={32}
                  color={colors.textMuted}
                />
                <Text style={styles.emptyText}>
                  No featured spaces available.
                </Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Campaign Channels</Text>
                <Text style={styles.sectionSubtitle}>
                  Select a channel to discover spaces
                </Text>
              </View>
            </View>

            <View style={styles.channelsRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.channelCard,
                  pressed && { opacity: 0.9 },
                ]}
                onPress={() =>
                  router.push({
                    pathname:
                      "/Buyer/advertisement/online/OnlineCategoryScreen",
                    params: { type: "online" },
                  })
                }
              >
                <View style={styles.channelIconBox}>
                  <Ionicons
                    name="globe-outline"
                    size={22}
                    color={colors.textPrimary}
                  />
                </View>
                <Text style={styles.channelTitle}>Online Ads</Text>
                <Text style={styles.channelSubtitle}>
                  Websites, apps{"\n"}& social banners
                </Text>
                <View style={styles.channelArrow}>
                  <Ionicons
                    name="arrow-forward"
                    size={14}
                    color={colors.textPrimary}
                  />
                </View>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.channelCard,
                  pressed && { opacity: 0.9 },
                ]}
                onPress={() =>
                  router.push({
                    pathname:
                      "/Buyer/advertisement/offline/OfflineCategoryScreen",
                    params: { type: "offline" },
                  })
                }
              >
                <View style={styles.channelIconBox}>
                  <Ionicons
                    name="storefront-outline"
                    size={22}
                    color={colors.textPrimary}
                  />
                </View>
                <Text style={styles.channelTitle}>Offline Ads</Text>
                <Text style={styles.channelSubtitle}>
                  Billboards, transit{"\n"}& digital screens
                </Text>
                <View style={styles.channelArrow}>
                  <Ionicons
                    name="arrow-forward"
                    size={14}
                    color={colors.textPrimary}
                  />
                </View>
              </Pressable>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Nearby Spaces</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.seeAll}>Explore</Text>
              </TouchableOpacity>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.nearbyCard,
                pressed && { opacity: 0.95 },
              ]}
            >
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800",
                }}
                style={styles.nearbyImage}
                resizeMode="cover"
              />
              <View style={styles.nearbyOverlayBadge}>
                <Ionicons name="location-sharp" size={11} color="#FFF" />
                <Text style={styles.nearbyOverlayText}>2.1 km away</Text>
              </View>
              <View style={styles.nearbyBody}>
                <View style={styles.nearbyTopRow}>
                  <View style={styles.nearbyCategoryChip}>
                    <Text style={styles.nearbyCategoryText}>LED Screen</Text>
                  </View>
                  <View style={styles.ratingPill}>
                    <Ionicons name="star" size={11} color="#F59E0B" />
                    <Text style={styles.ratingText}>4.9</Text>
                  </View>
                </View>

                <Text style={styles.nearbyTitle}>
                  High Impact Digital LED Screen
                </Text>

                <View style={styles.nearbyLocationRow}>
                  <Ionicons
                    name="location-outline"
                    size={12}
                    color={colors.textSecondary}
                  />
                  <Text style={styles.nearbyLocationText}>
                    Cyber Hub, Gurugram
                  </Text>
                </View>

                <View style={styles.nearbyFooter}>
                  <View>
                    <Text style={styles.bannerPrice}>₹4,500</Text>
                    <Text style={styles.bannerDuration}>per day</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.bookBtn}
                    activeOpacity={0.85}
                    onPress={() => router.push("/Buyer/Screens/BookingScreen")}
                  >
                    <Text style={styles.bookBtnText}>Book Space</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Pressable>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollStyle: { flex: 1, backgroundColor: colors.background },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    gap: 12,
  },
  loadingText: { fontSize: 15, fontWeight: "500", color: colors.textSecondary },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: hp("16%"),
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  profileContainer: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatarWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.border,
    overflow: "hidden",
  },
  avatar: { width: "100%", height: "100%" },
  profileInfo: { justifyContent: "center", gap: 3 },
  welcomeGreeting: {
    fontSize: 19,
    color: colors.textPrimary,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  welcomeName: { color: colors.textPrimary, fontWeight: "800" },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  locationText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
    maxWidth: wp("40%"),
  },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
    position: "relative",
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
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  searchIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.neutralLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  searchIcon: { marginRight: 10 },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: "400",
  },
  searchFilterBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.neutralLight,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 6,
  },
  section: { marginBottom: 12 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 3,
    fontWeight: "400",
  },
  seeAll: { fontSize: 14, fontWeight: "700", color: colors.textPrimary },
  bannersContainer: { gap: 16, paddingRight: 4 },
  bannerCard: {
    width: wp("78%"),
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 1,
  },
  bannerImage: { width: "100%", height: hp("22%") },
  bannerBody: { padding: 12, gap: 4 },
  bannerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tagBadge: {
    backgroundColor: colors.neutralLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  ratingPill: { flexDirection: "row", alignItems: "center", gap: 3 },
  ratingText: { fontSize: 12, fontWeight: "600", color: colors.textPrimary },
  bannerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: -0.2,
    marginTop: 2,
  },
  bannerLocationRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  bannerLocationText: { fontSize: 12, color: colors.textSecondary, flex: 1 },
  bannerFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  bannerPrice: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  bannerDuration: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: "400",
    marginTop: 1,
  },
  bookBtn: {
    backgroundColor: colors.button,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  bookBtnText: { color: colors.white, fontSize: 13, fontWeight: "700" },
  emptyCard: {
    height: hp("16%"),
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  emptyText: { fontSize: 14, color: colors.textSecondary },
  channelsRow: { flexDirection: "row", gap: 12 },
  channelCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  channelIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.neutralLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  channelTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  channelSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
    marginBottom: 12,
  },
  channelArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.neutralLight,
    justifyContent: "center",
    alignItems: "center",
  },
  nearbyCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  nearbyImage: { width: "100%", height: hp("22%") },
  nearbyOverlayBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  nearbyOverlayText: { fontSize: 11, color: "#FFF", fontWeight: "600" },
  nearbyBody: { padding: 16, gap: 6 },
  nearbyTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nearbyCategoryChip: {
    backgroundColor: colors.neutralLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  nearbyCategoryText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
    letterSpacing: 0.3,
  },
  nearbyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: -0.2,
    marginTop: 2,
  },
  nearbyLocationRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  nearbyLocationText: { fontSize: 12, color: colors.textSecondary },
  nearbyFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
});
