import React, { useState, useCallback } from "react";
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
import { userInfo } from "../../Buyer/Api/userApi";

const SellerProfileScreen = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    firstName: "", lastName: "", email: "", role: "seller",
    username: "", city: "", state: "", profileImage: "",
  });
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await userInfo();
      if (res?.user) setUser(res.user);
    } catch (e) { console.log("SellerProfileScreen fetchUser Error:", e); }
    finally { setLoading(false); }
  };

  useFocusEffect(useCallback(() => { fetchUser(); }, []));

  const handleSignOut = async () => {
    try {
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
    } catch (e) { console.log("Signout error:", e); }
    router.replace("/Buyer/Authentication/LoginScreen");
  };

  const handleSwitchRole = async () => {
    Alert.alert("Switch Mode", "Would you like to switch to Buyer mode?", [
      { text: "Cancel", style: "cancel" },
      { text: "Switch to Buyer", onPress: () => router.replace("/Buyer/Screens/HomeScreen") },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your Seller account? All listed ad spaces and payouts data will be deleted.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete Account", style: "destructive", onPress: handleSignOut },
      ]
    );
  };

  const name = user?.firstName ? `${user.firstName} ${user?.lastName ?? ""}`.trim() : "Seller Profile";
  const email = user?.email || "Not specified";
  const dp = user?.profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop";
  const username = user?.username ? `@${user.username}` : "";
  const location = user?.city ? `${user.city}${user?.state ? `, ${user.state}` : ""}`.trim() : "Location not set";

  const MenuItem = ({ icon, title, subtitle, value, badge, onPress, isDestructive, hideChevron, isLast }) => (
    <Pressable
      style={({ pressed }) => [styles.menuItem, isLast && styles.noBorder, pressed && styles.menuItemPressed]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.menuItemLeft}>
        <View style={[styles.iconBadge, isDestructive && styles.destructiveIconBadge]}>
          <Ionicons name={icon} size={18} color={isDestructive ? colors.error : colors.textPrimary} />
        </View>
        <View style={styles.menuTextWrapper}>
          <Text style={[styles.menuItemText, isDestructive && styles.destructiveText]}>{title}</Text>
          {subtitle ? <Text style={styles.menuItemSubtext}>{subtitle}</Text> : null}
        </View>
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
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        ) : null}
      </View>
    </Pressable>
  );

  const MenuSection = ({ title, children }) => (
    <View style={styles.sectionContainer}>
      {title ? <Text style={styles.sectionLabel}>{title}</Text> : null}
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.textPrimary} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* ── Profile Card ── */}
          <View style={styles.profileCard}>
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: dp }} style={styles.avatar} />
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-sharp" size={12} color="#FFF" />
              </View>
            </View>

            <Text style={styles.nameText}>{name}</Text>
            {username ? <Text style={styles.usernameText}>{username}</Text> : null}

            <View style={styles.roleChip}>
              <Ionicons name="briefcase-outline" size={12} color={colors.textSecondary} />
              <Text style={styles.roleChipText}>Verified Seller</Text>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoPill}>
                <Ionicons name="mail-outline" size={14} color={colors.textSecondary} />
                <Text style={styles.infoPillText} numberOfLines={1}>{email}</Text>
              </View>
              <View style={styles.infoPill}>
                <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
                <Text style={styles.infoPillText} numberOfLines={1}>{location}</Text>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [styles.editButton, pressed && styles.editButtonPressed]}
              onPress={() => router.push("/Buyer/components/Profile/EditProfileScreen")}
            >
              <Ionicons name="create-outline" size={17} color="#FFF" />
              <Text style={styles.editButtonText}>Edit Business Profile</Text>
            </Pressable>
          </View>

          <MenuSection title="BUSINESS & INVENTORY">
            <MenuItem icon="business-outline" title="Business Information" subtitle="Company details, address & GST"
              onPress={() => Alert.alert("Business Info", "Business Information settings coming soon!")} />
            <MenuItem icon="id-card-outline" title="KYC Verification" subtitle="Identity and business verification"
              badge="Verified" onPress={() => Alert.alert("KYC", "Your seller KYC is verified!")} />
            <MenuItem icon="card-outline" title="Bank Account & Payouts" subtitle="Manage bank accounts & withdrawal methods"
              onPress={() => Alert.alert("Payouts", "Bank account settings coming soon!")} />
            <MenuItem icon="swap-horizontal-outline" title="Switch to Buyer Mode" subtitle="Browse and book ad spaces"
              isLast={true} onPress={handleSwitchRole} />
          </MenuSection>

          <MenuSection title="SELLER SETTINGS & SUPPORT">
            <MenuItem icon="notifications-outline" title="Notification Settings" subtitle="Booking alerts & payout notifications"
              onPress={() => Alert.alert("Notifications", "Notification settings coming soon!")} />
            <MenuItem icon="help-circle-outline" title="Seller Help Desk" subtitle="24/7 Priority support for sellers"
              onPress={() => Alert.alert("Support", "Seller priority support desk coming soon!")} />
            <MenuItem icon="document-text-outline" title="Terms & Seller Policy" isLast={true}
              onPress={() => router.push("/Buyer/Authentication/TermsconditionsScreen")} />
          </MenuSection>

          <MenuSection title="APPLICATION">
            <MenuItem icon="phone-portrait-outline" title="App Version" value="v1.0.0 (Seller)" hideChevron={true} isLast={true} />
          </MenuSection>

          <MenuSection>
            <MenuItem icon="trash-outline" title="Delete Seller Account" subtitle="Permanently remove your listings & account"
              isDestructive={true} isLast={true} onPress={handleDeleteAccount} />
          </MenuSection>

          <Pressable
            style={({ pressed }) => [styles.logoutBtn, pressed && styles.logoutBtnPressed]}
            onPress={() => {
              Alert.alert("Log Out", "Are you sure you want to log out of BrandHive?", [
                { text: "Cancel", style: "cancel" },
                { text: "Log Out", onPress: handleSignOut, style: "destructive" },
              ]);
            }}
          >
            <Ionicons name="log-out-outline" size={18} color={colors.error} />
            <Text style={styles.logoutText}>Log Out Account</Text>
          </Pressable>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default SellerProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
  headerTitle: { fontSize: 28, fontWeight: "800", color: colors.textPrimary, letterSpacing: -0.5 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: hp("16%") },

  // ── Profile Card
  profileCard: {
    backgroundColor: colors.white, borderRadius: 24,
    paddingVertical: 24, paddingHorizontal: 20, alignItems: "center",
    borderWidth: 1, borderColor: colors.border, marginBottom: 24,
    shadowColor: "#111827", shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05, shadowRadius: 14, elevation: 2,
  },
  avatarWrapper: { position: "relative", marginBottom: 14 },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: colors.border },
  verifiedBadge: {
    position: "absolute", bottom: 2, right: 2,
    backgroundColor: colors.textPrimary, width: 22, height: 22,
    borderRadius: 11, justifyContent: "center", alignItems: "center",
    borderWidth: 2, borderColor: colors.white,
  },
  nameText: { fontSize: 20, fontWeight: "700", color: colors.textPrimary, letterSpacing: -0.3, marginBottom: 3 },
  usernameText: { fontSize: 13, fontWeight: "500", color: colors.textSecondary, marginBottom: 10 },
  roleChip: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: colors.neutralLight, paddingHorizontal: 12,
    paddingVertical: 5, borderRadius: 20, marginBottom: 20,
  },
  roleChipText: { fontSize: 12, fontWeight: "600", color: colors.textSecondary },
  infoRow: { width: "100%", gap: 8, marginBottom: 20 },
  infoPill: {
    flexDirection: "row", alignItems: "center", gap: 10,
    backgroundColor: colors.background, paddingHorizontal: 14,
    paddingVertical: 12, borderRadius: 14, borderWidth: 1, borderColor: colors.border,
  },
  infoPillText: { flex: 1, fontSize: 13, color: colors.textPrimary, fontWeight: "500" },
  editButton: {
    width: "100%", height: 52, backgroundColor: colors.button,
    borderRadius: 26, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
  },
  editButtonPressed: { opacity: 0.88 },
  editButtonText: { color: colors.white, fontSize: 15, fontWeight: "700" },

  // ── Menu Sections
  sectionContainer: { marginBottom: 20 },
  sectionLabel: { fontSize: 12, fontWeight: "700", color: colors.textMuted, marginBottom: 8, letterSpacing: 0.8, paddingLeft: 4 },
  sectionCard: {
    backgroundColor: colors.white, borderRadius: 20,
    borderWidth: 1, borderColor: colors.border, overflow: "hidden",
    shadowColor: "#111827", shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 1,
  },
  menuItem: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingVertical: 14, paddingHorizontal: 16,
    borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  noBorder: { borderBottomWidth: 0 },
  menuItemPressed: { backgroundColor: colors.background },
  menuItemLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  iconBadge: {
    width: 36, height: 36, borderRadius: 11,
    backgroundColor: colors.neutralLight,
    justifyContent: "center", alignItems: "center", flexShrink: 0,
  },
  destructiveIconBadge: { backgroundColor: "#FEF2F2" },
  menuTextWrapper: { flex: 1 },
  menuItemText: { fontSize: 14, fontWeight: "600", color: colors.textPrimary },
  menuItemSubtext: { fontSize: 12, fontWeight: "400", color: colors.textSecondary, marginTop: 2 },
  menuItemRight: { flexDirection: "row", alignItems: "center", gap: 8, paddingLeft: 8 },
  menuItemValue: { fontSize: 13, fontWeight: "500", color: colors.textSecondary },
  badgeContainer: {
    backgroundColor: colors.neutralLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
  },
  badgeText: { fontSize: 11, color: colors.textPrimary, fontWeight: "700" },
  destructiveText: { color: colors.error },

  // ── Logout
  logoutBtn: {
    height: 52, backgroundColor: colors.white, borderRadius: 26,
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, borderWidth: 1, borderColor: colors.border, marginBottom: 8,
    shadowColor: "#111827", shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 1,
  },
  logoutBtnPressed: { backgroundColor: "#FEF2F2" },
  logoutText: { fontSize: 15, fontWeight: "700", color: colors.error },
});
