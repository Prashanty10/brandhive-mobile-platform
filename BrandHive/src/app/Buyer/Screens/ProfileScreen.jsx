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
import EditProfileScreen from "../components/profile/EditProfileScreen";

const ProfileScreen = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    firstName: "Vanessa",
    lastName: "Miller",
    email: "vanessa@brandhive.com",
    role: "buyer",
    username: "vanessa_m",
    city: "New York",
    state: "NY",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
  });
  const [loading, setLoading] = useState(false);
  const [isEditProfileVisible, setIsEditProfileVisible] = useState(false);

  const fetchUser = async () => {
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchUser();
    }, []),
  );

  const handleSwitchRole = async () => {
    Alert.alert("Switch Mode", "Would you like to switch to Seller mode?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Switch to Seller",
        onPress: () => {
          router.replace("/Seller/Screens/DashboardScreen");
        },
      },
    ]);
  };

  const handleSignOut = async () => {
    try {
      await SecureStore.deleteItemAsync("ACCESS_TOKEN");
      await SecureStore.deleteItemAsync("REFRESH_TOKEN");
    } catch (e) {
      console.log("Error clearing storage", e);
    }
    router.replace("/Buyer/Authentication/LoginScreen");
  };

  const name = user?.firstName
    ? `${user.firstName} ${user?.lastName ?? ""}`.trim()
    : "Prashant Yadav";
  const email = user?.email || "prashant@gmail.com";
  const dp =
    user?.profileImage ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop";
  const role = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()
    : "Buyer";
  const username = user?.username || "prashant10";
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
        <Text style={styles.headerTitle}>Profile</Text>
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
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: dp }} style={styles.avatar} />
            </View>
            <Text style={styles.nameText}>{name}</Text>
            <Text style={styles.roleText}>
              {role} • @{username}
            </Text>

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

          <MenuSection title="ACCOUNT">
            <MenuItem
              icon="person-outline"
              title="Edit Profile"
              onPress={() => setIsEditProfileVisible(true)}
            />
            <MenuItem
              icon="lock-closed-outline"
              title="Change Password"
              onPress={() =>
                router.push("/Buyer/Authentication/ResetPasswordScreen")
              }
            />
            <MenuItem
              icon="heart-outline"
              title="Saved Ads"
              onPress={() =>
                Alert.alert("Saved Ads", "Saved Ads feature is coming soon!")
              }
            />
            <MenuItem
              icon="calendar-outline"
              title="My Bookings"
              onPress={() => router.push("/Buyer/Screens/BookingScreen")}
            />
            <MenuItem
              icon="swap-horizontal-outline"
              title="Switch to Seller Mode"
              onPress={handleSwitchRole}
            />
            <MenuItem
              icon="notifications-outline"
              title="Notifications"
              isLast={true}
              onPress={() =>
                Alert.alert(
                  "Notifications",
                  "Notifications settings are coming soon!",
                )
              }
            />
          </MenuSection>

          <MenuSection title="SUPPORT">
            <MenuItem
              icon="help-circle-outline"
              title="Help & Support"
              onPress={() =>
                Alert.alert(
                  "Help & Support",
                  "Support desk is coming soon. Please contact us at support@brandhive.com.",
                )
              }
            />
            <MenuItem
              icon="call-outline"
              title="Contact Us"
              onPress={() =>
                Alert.alert(
                  "Contact Us",
                  "Contact us at contact@brandhive.com or call our hotline.",
                )
              }
            />
            <MenuItem
              icon="document-text-outline"
              title="Privacy Policy"
              onPress={() =>
                Alert.alert(
                  "Privacy Policy",
                  "BrandHive Privacy Policy governs data protection. Read details on our website.",
                )
              }
            />
            <MenuItem
              icon="document-outline"
              title="Terms & Conditions"
              onPress={() =>
                router.push("/Buyer/Authentication/TermsconditionsScreen")
              }
            />
            <MenuItem
              icon="star-outline"
              title="Rate BrandHive"
              isLast={true}
              onPress={() =>
                Alert.alert(
                  "Rate BrandHive",
                  "Thank you for supporting us! App store rating will be available soon.",
                )
              }
            />
          </MenuSection>

          {/* ABOUT SECTION */}
          <MenuSection title="ABOUT">
            <MenuItem
              icon="information-circle-outline"
              title="About BrandHive"
              onPress={() =>
                Alert.alert(
                  "About BrandHive",
                  "BrandHive is the premium platform connecting brands with advertising spaces.",
                )
              }
            />
            <MenuItem
              icon="phone-portrait-outline"
              title="App Version"
              value="1.0.0"
              hideChevron={true}
              isLast={true}
            />
          </MenuSection>

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

      <EditProfileScreen
        visible={isEditProfileVisible}
        onClose={() => setIsEditProfileVisible(false)}
        user={user}
        onSave={(updatedUser) => setUser(updatedUser)}
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;

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
    paddingBottom: hp(18), // Extra space to scroll clear of the absolute floating bottom tab bar
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
  },
  menuItemValue: {
    fontSize: wp(3.8),
    fontWeight: "600",
    color: colors.textSecondary,
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
