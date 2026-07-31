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
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import colors from "../../../Theme/colors";

const ResetPasswordScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setErrorMessage("Please enter your email address.");
      setShowErrorModal(true);
      return;
    }
    if (!emailRegex.test(email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      setShowErrorModal(true);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
    }, 500);
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setErrorMessage("Please enter the verification code.");
      setShowErrorModal(true);
      return;
    }
    if (otp.trim().length !== 6) {
      setErrorMessage("The verification code must be exactly 6 digits.");
      setShowErrorModal(true);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.replace("/Buyer/Authentication/NewPasswordScreen");
    }, 500);
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
            <Ionicons name="arrow-back" size={wp("5%")} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>


        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Forgot Password</Text>
          <Text style={styles.subtitleText}>
            {!otpSent ? (
              "Enter your email address below. We'll send you an OTP to reset your password."
            ) : (
              <Text>
                Enter the OTP verification code sent to{" "}
                <Text style={styles.emailHighlight}>{email || "your email address"}</Text>.
              </Text>
            )}
          </Text>
        </View>

        
        <View style={styles.form}>
      
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={[styles.input, otpSent && styles.disabledInput]}
              placeholder="prashant123@gmail.com"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!otpSent}
            />
          </View>


          {otpSent && (
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
          )}
        </View>

        {!otpSent ? (
          <TouchableOpacity
            style={[styles.actionButton, isLoading && styles.actionButtonDisabled]}
            onPress={handleSendOtp}
            activeOpacity={0.9}
            disabled={isLoading}
          >
            <Text style={styles.actionButtonText}>
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </Text>
          </TouchableOpacity>
        ) : (
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
        )}

     
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Remembered your password? </Text>
          <TouchableOpacity
            onPress={() => router.push("/Buyer/Authentication/LoginScreen")}
            activeOpacity={0.7}
          >
            <Text style={styles.loginText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>

      <Modal
        visible={showErrorModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowErrorModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.errorModalContent}>
            <View style={styles.errorIconContainer}>
              <Ionicons name="alert-circle" size={wp("14%")} color={colors.error} />
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

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
    marginTop: hp("2.5%"),
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
  disabledInput: {
    backgroundColor: "#F2F2F2",
    color: "#A3A3A3",
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
  disabledButton: {
    backgroundColor: "#A3A3A3",
    opacity: 0.6,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: wp("4%"),
    fontWeight: "700",
  },
  actionButtonDisabled: {
    opacity: 0.7,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp("1.2%"),
  },
  footerText: {
    fontSize: wp("3.6%"),
    color: colors.textSecondary,
  },
  loginText: {
    fontSize: wp("3.6%"),
    fontWeight: "700",
    color: colors.textPrimary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp("6%"),
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
});
