import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../Theme/colors";

const SellerTabScreen = () => {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarStyle: {
          position: "absolute",
          bottom: 40,
          left: 20,
          right: 20,
          height: 65,
          borderRadius: 40,
          paddingHorizontal: -5,
          backgroundColor: colors.structureDark,
          borderTopWidth: 0,
          marginHorizontal: 20,
          paddingVertical: -20,
          paddingTop: 2,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },

        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.iconSecondary,

        tabBarIcon: ({ focused, color, size }) => {
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

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen
        name="DashboardScreen"
        options={{
          title: "Dashboard",
        }}
      />
      <Tabs.Screen
        name="AdvertisementsScreen"
        options={{
          title: "Advertisements",
        }}
      />
      <Tabs.Screen
        name="BookingsScreen"
        options={{
          title: "Bookings",
        }}
      />
      <Tabs.Screen
        name="SellerProfileScreen"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  );
};

export default SellerTabScreen;
