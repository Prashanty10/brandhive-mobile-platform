import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../Theme/colors";

const TabScreen = () => {
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
          paddingHorizontal: 0,
          backgroundColor: colors.structureDark,
          borderTopWidth: 0,
          marginHorizontal: 20,
          paddingVertical: 0,
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

          if (route.name === "HomeScreen") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "DiscoverScreen") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "BookingScreen") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "ProfileScreen") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen
        name="HomeScreen"
        options={{
          title: "Home",
        }}
      />

      <Tabs.Screen
        name="DiscoverScreen"
        options={{
          title: "Discover",
        }}
      />

      <Tabs.Screen
        name="BookingScreen"
        options={{
          title: "Booking",
        }}
      />

      <Tabs.Screen
        name="ProfileScreen"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  );
};

export default TabScreen;
