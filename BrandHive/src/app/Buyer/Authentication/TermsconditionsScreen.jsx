import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import colors from "../../../Theme/colors";

const TermsconditionsScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
  
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={wp("5%")} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <View style={{ width: wp("10%") }} /> 
      </View>

      
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>1. Welcome to BrandHive</Text>
        <Text style={styles.bodyText}>
          By registering an account and using the BrandHive application, you agree to comply with
          and be bound by these terms and conditions. If you do not agree, please do not access or use the application.
        </Text>

        <Text style={styles.sectionTitle}>2. Use of Services</Text>
        <Text style={styles.bodyText}>
          You agree to use BrandHive solely for lawful advertising and discovering services. You represent
          and warrant that any information you provide is true, accurate, and up-to-date.
        </Text>

        <Text style={styles.sectionTitle}>3. User Accounts & Privacy</Text>
        <Text style={styles.bodyText}>
          You are responsible for safeguarding your account details, including your email and password.
          BrandHive respects your privacy and handles all data in accordance with our Privacy Policy.
        </Text>

        <Text style={styles.sectionTitle}>4. Advertisements & Earnings</Text>
        <Text style={styles.bodyText}>
          Any promotional posts, deals, or rewards are subject to verification by BrandHive. BrandHive reserves the right
          to suspend rewards or block accounts suspected of malicious activity, fake reviews, or spam advertising.
        </Text>

        <Text style={styles.sectionTitle}>5. Modifications</Text>
        <Text style={styles.bodyText}>
          We reserve the right to modify these Terms and Conditions at any time. Your continued use of the
          application following changes indicates your acceptance of the revised terms.
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => router.back()}
          activeOpacity={0.9}
        >
          <Text style={styles.acceptButtonText}>Accept & Close</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TermsconditionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    height: hp("7%"),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp("6%"),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: wp("6%"),
    paddingVertical: hp("3%"),
  },
  sectionTitle: {
    fontSize: wp("4%"),
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: hp("2.5%"),
    marginBottom: hp("1%"),
  },
  bodyText: {
    fontSize: wp("3.6%"),
    color: colors.textSecondary,
    lineHeight: wp("5.5%"),
    marginBottom: hp("1.2%"),
  },
  footer: {
    paddingHorizontal: wp("6%"),
    paddingVertical: hp("2%"),
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  acceptButton: {
    height: hp("6.5%"),
    borderRadius: wp("6.5%"),
    backgroundColor: colors.button,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  acceptButtonText: {
    color: colors.white,
    fontSize: wp("4%"),
    fontWeight: "700",
  },
});
