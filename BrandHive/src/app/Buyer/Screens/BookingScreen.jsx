import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../Theme/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const BookingScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Booking</Text>
      </View>

      {/* Simplified Welcome Content */}
      <View style={styles.content}>
        <Ionicons name="calendar-outline" size={wp(16)} color={colors.primary} style={styles.welcomeIcon} />
        <Text style={styles.welcomeTitle}>Booking Screen</Text>
        <Text style={styles.welcomeSubtitle}>
          Welcome to the Booking section.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default BookingScreen;

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
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(8),
    paddingBottom: hp(12),
  },
  welcomeIcon: {
    marginBottom: hp(2),
  },
  welcomeTitle: {
    fontSize: wp(5.5),
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: hp(1),
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontSize: wp(3.8),
    fontWeight: "500",
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: wp(5.5),
  },
});
