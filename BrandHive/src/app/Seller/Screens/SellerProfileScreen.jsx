import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import colors from "../../../Theme/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const SellerProfileScreen = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    firstName: "Vanessa",
    lastName: "Miller",
    email: "seller@brandhive.com",
    role: "seller",
    username: "vanessa_seller",
    city: "New York",
    state: "NY",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
  });
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchUser();
    }, []),
  );

  const handleSignOut = async () => {
    try {
      await SecureStore.deleteItemAsync("ACCESS_TOKEN");
      await SecureStore.deleteItemAsync("REFRESH_TOKEN");
    } catch (e) {
      console.log("Signout error:", e);
    }
    router.replace("/Buyer/Authentication/LoginScreen");
  };

  const handleSwitchRole = async () => {
    Alert.alert(
      "Switch Mode",
      "Would you like to switch to Buyer mode?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Switch to Buyer",
          onPress: () => {
            router.replace("/Buyer/Screens/HomeScreen");
          },
        },
      ]
    );
  };

  const name = user?.firstName
    ? `${user.firstName} ${user?.lastName ?? ""}`.trim()
    : "BrandSpace Seller";
  const email = user?.email || "seller@brandhive.com";
  const dp =
    user?.profileImage ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop";
  const username = user?.username || "seller";
  const location = user?.city
    ? `${user.city}, ${user?.state ?? ""}`.trim()
    : "Mumbai, Maharashtra";

  const MenuItem = ({
    icon,
    title,
    value,
    onPress,
    isDestructive,
    hideChevron,
    isLast,
    badge,
  }) => {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.menuItem,
          isLast && styles.noBorder,
          pressed && styles.menuItemPressed,
        ]}
        onPress={onPress}
        disabled={!onPress}
      >
        <View style={styles.menuItemLeft}>
          <Ionicons
            name={icon}
            size={wp(5)}
            color={isDestructive ? colors.error : colors.textSecondary}
          />
          <Text
            style={[
              styles.menuItemText,
              isDestructive && styles.destructiveText,
            ]}
          >
            {title}
          </Text>
        </View>

        <View style={styles.menuItemRight}>
          {badge ? (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ) : null}
          {value ? (
            <Text style={styles.menuItemValue}>{value}</Text>
          ) : !hideChevron ? (
            <Ionicons
              name="chevron-forward"
              size={wp(4.2)}
              color={colors.textMuted}
            />
          ) : null}
        </View>
      </Pressable>
    );
  };

  const MenuSection = ({ title, children }) => {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionHeader}>{title}</Text>
        <View style={styles.sectionContent}>{children}</View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Seller Profile</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: dp }} style={styles.avatar} />
            </View>
            <Text style={styles.nameText}>{name}</Text>
            <Text style={styles.roleText}>Verified Seller • @{username}</Text>

            <View style={styles.infoRow}>
              <Ionicons
                name="mail-outline"
                size={16}
                color={colors.textSecondary}
              />
              <Text style={styles.infoText}>{email}</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons
                name="location-outline"
                size={16}
                color={colors.textSecondary}
              />
              <Text style={styles.infoText}>{location}</Text>
            </View>
          </View>

          {/* Business & Account Section */}
          <MenuSection title="BUSINESS & ACCOUNT">
            <MenuItem
              icon="business-outline"
              title="Business Information"
              onPress={() => Alert.alert("Business Info", "Business Information details feature is coming soon!")}
            />
            <MenuItem
              icon="id-card-outline"
              title="KYC Verification"
              badge="Verified"
              onPress={() => Alert.alert("KYC", "Your KYC is verified!")}
            />
            <MenuItem
              icon="card-outline"
              title="Bank Account & Payouts"
              onPress={() => Alert.alert("Payouts", "Bank account settings coming soon!")}
            />
            <MenuItem
              icon="swap-horizontal-outline"
              title="Switch to Buyer Mode"
              isLast={true}
              onPress={handleSwitchRole}
            />
          </MenuSection>

          {/* Preferences & Support Section */}
          <MenuSection title="SUPPORT & PREFERENCES">
            <MenuItem
              icon="notifications-outline"
              title="Notification Settings"
              onPress={() => Alert.alert("Notifications", "Notification settings coming soon!")}
            />
            <MenuItem
              icon="help-circle-outline"
              title="Seller Help & Support"
              onPress={() => Alert.alert("Support", "Seller support desk is coming soon!")}
            />
            <MenuItem
              icon="document-outline"
              title="Terms & Conditions"
              isLast={true}
              onPress={() => router.push("/Buyer/Authentication/TermsconditionsScreen")}
            />
          </MenuSection>

          {/* Logout Button */}
          <Pressable
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && styles.logoutButtonPressed,
            ]}
            onPress={() => {
              Alert.alert(
                "Log Out",
                "Are you sure you want to log out of BrandHive?",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Log Out",
                    onPress: handleSignOut,
                    style: "destructive",
                  },
                ],
              );
            }}
          >
            <Ionicons
              name="log-out-outline"
              size={wp(5.2)}
              color={colors.error}
            />
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default SellerProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: wp(6),
    paddingTop: hp(1.5),
    paddingBottom: hp(1),
  },
  headerTitle: {
    fontSize: wp(6.5),
    fontWeight: "800",
    color: colors.textPrimary,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: wp(5),
    paddingTop: hp(1),
    paddingBottom: hp(18),
  },
  profileCard: {
    width: "100%",
    backgroundColor: colors.card,
    borderRadius: 24,
    paddingVertical: hp(3.5),
    paddingHorizontal: wp(5),
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: hp(2.5),
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  avatarContainer: {
    width: wp(24),
    height: wp(24),
    borderRadius: wp(12),
    overflow: "hidden",
    borderWidth: 3,
    borderColor: colors.primary,
    marginBottom: hp(1.5),
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  nameText: {
    fontSize: wp(5.5),
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  roleText: {
    fontSize: wp(3.8),
    fontWeight: "600",
    color: colors.primary,
    marginBottom: hp(1.5),
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: hp(0.5),
  },
  infoText: {
    fontSize: wp(3.6),
    color: colors.textSecondary,
    fontWeight: "500",
  },
  sectionContainer: {
    width: "100%",
    marginBottom: hp(2.5),
  },
  sectionHeader: {
    fontSize: wp(3.2),
    fontWeight: "700",
    color: colors.textSecondary,
    marginBottom: hp(1),
    letterSpacing: 1,
    paddingLeft: wp(2),
  },
  sectionContent: {
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: hp(2),
    paddingHorizontal: wp(5),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  menuItemPressed: {
    backgroundColor: colors.lightGray,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuItemText: {
    fontSize: wp(4),
    fontWeight: "600",
    color: colors.textPrimary,
  },
  menuItemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  menuItemValue: {
    fontSize: wp(3.8),
    fontWeight: "600",
    color: colors.textSecondary,
  },
  badgeContainer: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.3),
    borderRadius: wp(2),
  },
  badgeText: {
    fontSize: wp(2.8),
    color: colors.success,
    fontWeight: "600",
  },
  destructiveText: {
    color: colors.error,
  },
  logoutButton: {
    width: "100%",
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingVertical: hp(2),
    paddingHorizontal: wp(5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: hp(1),
  },
  logoutButtonPressed: {
    backgroundColor: colors.lightGray,
  },
  logoutText: {
    fontSize: wp(4),
    fontWeight: "700",
    color: colors.error,
  },
});
