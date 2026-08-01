import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../Theme/colors";

const TAB_BAR_BG = "#000";
const TAB_ACTIVE_COLOR = "#FFFFFF";
const TAB_INACTIVE_COLOR = "#8E8E93";
const ACTIVE_PILL = "#2C2C2E";

const SellerTabScreen = () => {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        sceneContainerStyle: { backgroundColor: colors.background },

        tabBarStyle: {
          position: "absolute",
          bottom: 40,
          left: 20,
          right: 20,
          height: 68,
          borderRadius: 36,
          backgroundColor: TAB_BAR_BG,
          borderWidth: 0,
          borderTopWidth: 0,
          paddingBottom: Platform.OS === "ios" ? 10 : 8,
          paddingTop: 8,
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.25,
          shadowRadius: 24,
          elevation: 16,
          marginHorizontal:20
        },

        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          marginTop: 1,
          letterSpacing: 0.1,
        },

        tabBarActiveTintColor: TAB_ACTIVE_COLOR,
        tabBarInactiveTintColor: TAB_INACTIVE_COLOR,

        tabBarIcon: ({ focused, color }) => {
          let iconName;

          if (route.name === "DashboardScreen") {
            iconName = focused ? "grid" : "grid-outline";
          } else if (route.name === "AdvertisementsScreen") {
            iconName = focused ? "megaphone" : "megaphone-outline";
          } else if (route.name === "BookingsScreen") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "SellerProfileScreen") {
            iconName = focused ? "person" : "person-outline";
          }

          return (
            <View style={[styles.iconWrapper, focused && styles.activeIconWrapper]}>
              <Ionicons name={iconName} size={25} color={color} />
            </View>
          );
        },
      })}
    >
      <Tabs.Screen name="DashboardScreen" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="AdvertisementsScreen" options={{ title: "Ads" }} />
      <Tabs.Screen name="BookingsScreen" options={{ title: "Bookings" }} />
      <Tabs.Screen name="SellerProfileScreen" options={{ title: "Profile" }} />
    </Tabs>
  );
};

export default SellerTabScreen;

const styles = StyleSheet.create({
  iconWrapper: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  activeIconWrapper: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
});
