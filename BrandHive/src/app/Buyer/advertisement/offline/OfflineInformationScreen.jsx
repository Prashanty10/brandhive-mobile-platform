import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import colors from "../../../../Theme/colors";

const OfflineInformationScreen = () => {
  const router = useRouter();
  const { categoryName } = useLocalSearchParams();

  const title = categoryName
    ? String(categoryName).replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    : "Offline Information";

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: wp("10%") }} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="information-circle-outline" size={wp("14%")} color={colors.primary} />
        </View>
        <Text style={styles.welcomeTitle}>{title} Details</Text>
        <Text style={styles.welcomeSubtitle}>
          Explore specs, audience demographics, and placement options for {title}.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default OfflineInformationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    height: hp("7%"),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp("5%"),
    backgroundColor: colors.background,
  },
  backButton: {
    width: wp("10%"),
    height: wp("10%"),
    borderRadius: wp("5%"),
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  headerTitle: {
    fontSize: wp("4.5%"),
    fontWeight: "700",
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp("8%"),
    paddingBottom: hp("12%"),
  },
  iconCircle: {
    width: wp("20%"),
    height: wp("20%"),
    borderRadius: wp("10%"),
    backgroundColor: colors.accentLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp("2%"),
  },
  welcomeTitle: {
    fontSize: wp("5.5%"),
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: hp("1%"),
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontSize: wp("3.6%"),
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: wp("5.2%"),
  },
});
