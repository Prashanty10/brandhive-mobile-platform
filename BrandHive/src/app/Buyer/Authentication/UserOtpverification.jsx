import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import colors from "../../../Theme/colors";
import { verifyUser } from "../Api/userApi";

const UserOtpverification = () => {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const email = searchParams.email ? String(searchParams.email).trim() : "";
  const username = searchParams.username ? String(searchParams.username).trim() : "";
  const [otp, setOtp] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verifiedUserData, setVerifiedUserData] = useState(null);

  const handleVerifyOtp = async () => {
    const cleanEmail = email ? String(email).trim() : "";
    if (!cleanEmail) {
      setErrorMessage("Email address is missing. Please try signing up again.");
      setShowErrorModal(true);
      return;
    }
    if (!otp.trim()) {
      setErrorMessage("Please enter the verification code.");
      setShowErrorModal(true);
      return;
    }

    setIsLoading(true);
    try {
      const res = await verifyUser(cleanEmail, otp.trim());
      setVerifiedUserData(res?.user || null);
      setShowSuccessModal(true);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message);
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    const cleanEmail = email ? String(email).trim() : "";
    const cleanUsername = verifiedUserData?.username || username || (cleanEmail ? cleanEmail.split("@")[0] : "");

    if (verifiedUserData?.isProfileCompleted) {
      if (verifiedUserData.activeRole === "seller") {
        router.replace("/Seller/Screens/DashboardScreen");
      } else {
        router.replace("/Buyer/Screens/HomeScreen");
      }
    } else {
      router.replace({
        pathname: "/Buyer/Authentication/ProfileSetupScreen",
        params: {
          email: cleanEmail,
          username: cleanUsername,
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid={true}
        extraScrollHeight={20}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back"
              size={wp("5%")}
              color={colors.textPrimary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Verify OTP</Text>
          <Text style={styles.subtitleText}>
            Enter the code sent to{" "}
            <Text style={styles.emailHighlight}>{email || "your email address"}</Text> to verify your account.
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Verification Code (OTP)</Text>
            <TextInput
              style={styles.input}
              placeholder="123456"
              placeholderTextColor={colors.textSecondary}
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.actionButton, isLoading && styles.actionButtonDisabled]}
          onPress={handleVerifyOtp}
          activeOpacity={0.9}
          disabled={isLoading}
        >
          <Text style={styles.actionButtonText}>
            {isLoading ? "Verifying OTP..." : "Verify OTP"}
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>

      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons
              name="checkmark-circle"
              size={wp("14%")}
              color={colors.success}
            />
            <Text style={styles.modalTitle}>Account Created!</Text>
            <Text style={styles.modalMessage}>
              Your account is ready. Please complete the profile setup.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleModalClose}
              activeOpacity={0.8}
            >
              <Text style={styles.modalButtonText}>Complete Profile Setup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showErrorModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowErrorModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.errorModalContent}>
            <View style={styles.errorIconContainer}>
              <Ionicons
                name="alert-circle"
                size={wp("14%")}
                color={colors.error}
              />
            </View>
            <Text style={styles.errorModalTitle}>Verification Error</Text>
            <Text style={styles.errorModalMessage}>{errorMessage}</Text>
            <TouchableOpacity
              style={styles.errorModalButton}
              onPress={() => setShowErrorModal(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.errorModalButtonText}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default UserOtpverification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: wp("6%"),
    paddingBottom: hp("4%"),
  },
  header: {
    height: hp("7%"),
    justifyContent: "center",
    alignItems: "flex-start",
    marginTop: hp("1%"),
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
  titleContainer: {
    marginTop: hp("2%"),
    alignItems: "center",
    marginBottom: hp("3.5%"),
  },
  titleText: {
    fontSize: wp("7.5%"),
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: hp("1%"),
  },
  subtitleText: {
    fontSize: wp("3.6%"),
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: wp("5.2%"),
    paddingHorizontal: wp("4%"),
  },
  emailHighlight: {
    fontWeight: "700",
    color: colors.textPrimary,
  },
  form: {
    marginBottom: hp("3.5%"),
    marginTop: hp("1.2%"),
  },
  inputGroup: {
    marginBottom: hp("2.5%"),
  },
  label: {
    fontSize: wp("3.6%"),
    fontWeight: "500",
    color: colors.textSecondary,
    marginBottom: hp("1%"),
  },
  input: {
    height: hp("6%"),
    borderRadius: wp("6%"),
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: wp("5%"),
    fontSize: wp("3.8%"),
    color: colors.textPrimary,
  },
  actionButton: {
    height: hp("6.5%"),
    borderRadius: wp("6.5%"),
    backgroundColor: colors.button,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp("3%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: wp("4%"),
    fontWeight: "700",
  },
  actionButtonDisabled: {
    opacity: 0.7,
  },
  errorModalContent: {
    width: wp("80%"),
    backgroundColor: colors.white,
    borderRadius: wp("5%"),
    paddingVertical: hp("3%"),
    paddingHorizontal: wp("5%"),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  errorIconContainer: {
    marginBottom: hp("1.5%"),
    justifyContent: "center",
    alignItems: "center",
  },
  errorModalTitle: {
    fontSize: wp("5%"),
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: hp("1%"),
    textAlign: "center",
  },
  errorModalMessage: {
    fontSize: wp("3.6%"),
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: wp("5%"),
    marginBottom: hp("2.5%"),
  },
  errorModalButton: {
    width: "100%",
    height: hp("5.5%"),
    borderRadius: wp("5.5%"),
    backgroundColor: colors.error,
    justifyContent: "center",
    alignItems: "center",
  },
  errorModalButtonText: {
    color: colors.white,
    fontSize: wp("3.8%"),
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp("6%"),
  },
  modalContent: {
    width: wp("85%"),
    backgroundColor: colors.white,
    borderRadius: wp("6%"),
    paddingVertical: hp("4%"),
    paddingHorizontal: wp("6%"),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  modalTitle: {
    fontSize: wp("5.5%"),
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: hp("2%"),
    marginBottom: hp("1%"),
    textAlign: "center",
  },
  modalMessage: {
    fontSize: wp("3.8%"),
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: wp("5.4%"),
    marginBottom: hp("3%"),
  },
  modalButton: {
    width: "100%",
    height: hp("6%"),
    borderRadius: wp("6%"),
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  modalButtonText: {
    color: colors.white,
    fontSize: wp("4%"),
    fontWeight: "700",
  },
});
