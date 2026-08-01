import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  Image,
  BackHandler,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import colors from "../../../Theme/colors";
import * as ImagePicker from "expo-image-picker";
import { profileSetupApi, userInfo } from "../Api/userApi";
import { detectUserLocation } from "../Utils/locationHelper";

const ProfileSetupScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const initialEmail = params.email ? String(params.email).trim() : "";
  const initialUsername = params.username
    ? String(params.username).trim()
    : initialEmail
    ? initialEmail.split("@")[0]
    : "";

  const [first_name, setName] = useState("");
  const [last_name, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [username, setUsername] = useState(initialUsername);
  const [email, setEmail] = useState(initialEmail);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [completedActiveRole, setCompletedActiveRole] = useState("buyer");

  useEffect(() => {
    const rawEmail = params.email ? String(params.email).trim() : "";
    const rawUsername = params.username
      ? String(params.username).trim()
      : rawEmail
      ? rawEmail.split("@")[0]
      : "";

    if (rawUsername) setUsername(rawUsername);
    if (rawEmail) setEmail(rawEmail);

    const loadUserData = async () => {
      try {
        const res = await userInfo();
        if (res?.user) {
          const u = res.user;
          const uName =
            u.username || rawUsername || (u.email ? u.email.split("@")[0] : "");
          if (uName) setUsername(uName);
          if (u.email) setEmail(u.email);
          if (u.firstName) setName(u.firstName);
          if (u.lastName) setLastName(u.lastName);
          if (u.mobileNumber) setMobileNumber(u.mobileNumber);
          if (u.city) setCity(u.city);
          if (u.state) setState(u.state);
          if (u.bio) setBio(u.bio);
          if (u.profileImage) setProfileImage(u.profileImage);
          if (u.activeRole) setCompletedActiveRole(u.activeRole);
        }
      } catch (e) {
        if (rawEmail) {
          setUsername(rawEmail.split("@")[0]);
        }
      }
    };
    loadUserData();
  }, [params.username, params.email]);

  const handleGetLocation = async () => {
    setIsLocating(true);
    try {
      const loc = await detectUserLocation();
      if (loc.success) {
        if (loc.city) setCity(loc.city);
        if (loc.state) setState(loc.state);
      } else if (loc.message) {
        setErrorMessage(loc.message);
        setShowErrorModal(true);
      }
    } catch (e) {
      setErrorMessage("Failed to detect location.");
      setShowErrorModal(true);
    } finally {
      setIsLocating(false);
    }
  };

  useEffect(() => {
    const onBackPress = () => {
      if (!router.canGoBack()) {
        router.replace("/Buyer/Authentication/LoginScreen");
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress,
    );

    return () => subscription.remove();
  }, [router]);

  const handleProceedAfterProfile = () => {
    setShowSuccessModal(false);
    if (completedActiveRole === "seller") {
      router.replace("/Seller/Screens/DashboardScreen");
    } else {
      router.replace("/Buyer/Screens/HomeScreen");
    }
  };

  const handleSaveProfile = async () => {
    if (!first_name.trim()) {
      setErrorMessage("Please enter your first name.");
      setShowErrorModal(true);
      return;
    }

    if (!last_name.trim()) {
      setErrorMessage("Please enter your last name.");
      setShowErrorModal(true);
      return;
    }

    if (mobileNumber.trim() && mobileNumber.trim().length !== 10) {
      setErrorMessage("Mobile number must be exactly 10 digits.");
      setShowErrorModal(true);
      return;
    }

    if (!city.trim()) {
      setErrorMessage("Please enter your city.");
      setShowErrorModal(true);
      return;
    }

    if (!state.trim()) {
      setErrorMessage("Please enter your state.");
      setShowErrorModal(true);
      return;
    }

    setIsLoading(true);

    try {
      const res = await profileSetupApi({
        firstName: first_name.trim(),
        lastName: last_name.trim(),
        mobileNumber: mobileNumber.trim(),
        city: city.trim(),
        state: state.trim(),
        bio: bio.trim(),
        profileImage,
      });

      const user = res?.user || {};
      if (user.activeRole) {
        setCompletedActiveRole(user.activeRole);
      }

      setShowSuccessModal(true);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message);
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAvatar = async () => {
    Alert.alert("Select Image", "Choose image source", [
      {
        text: "Camera",
        onPress: () => pickImage("camera"),
      },
      {
        text: "Gallery",
        onPress: () => pickImage("gallery"),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const pickImage = async (sourceType) => {
    const permissionResult =
      sourceType === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission denied", "Please allow access to continue.");
      return;
    }

    const result =
      sourceType === "camera"
        ? await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.7,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            quality: 0.7,
          });

    if (!result.canceled) {
      const selectedImage = result.assets[0];
      setProfileImage(selectedImage.uri);
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
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/Buyer/Authentication/LoginScreen");
              }
            }}
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
          <Text style={styles.titleText}>Setup Profile</Text>
          <Text style={styles.subtitleText}>
            Personalize your BrandHive experience by completing your profile.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={handleSelectAvatar}
          activeOpacity={0.8}
        >
          <View style={styles.avatarInner}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.avatarImage}
              />
            ) : (
              <Ionicons
                name="camera-outline"
                size={wp("8%")}
                color={colors.textSecondary}
              />
            )}
          </View>
          <View style={styles.avatarAddBadge}>
            <Ionicons name="add" size={wp("4%")} color={colors.white} />
          </View>
        </TouchableOpacity>

        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              placeholderTextColor={colors.textMuted}
              value={first_name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              placeholderTextColor={colors.textMuted}
              value={last_name}
              onChangeText={setLastName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile Number</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="call-outline"
                size={wp("5%")}
                color={colors.textSecondary}
                style={styles.inputIcon}
              />
              <Text
                style={{
                  fontSize: 15,
                  color: colors.textPrimary,
                  fontWeight: "600",
                  marginRight: wp("2%"),
                }}
              >
                +91
              </Text>
              <TextInput
                style={styles.inputWithIcon}
                placeholder="Mobile Number"
                placeholderTextColor={colors.textMuted}
                value={mobileNumber}
                onChangeText={(text) => {
                  const cleaned = text.replace(/[^0-9]/g, "");
                  if (cleaned.length <= 10) {
                    setMobileNumber(cleaned);
                  }
                }}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={[styles.input, styles.readOnlyInput]}
              placeholder="Username"
              placeholderTextColor={colors.textMuted}
              value={username}
              editable={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={[styles.input, styles.readOnlyInput]}
              placeholder="Email Address"
              placeholderTextColor={colors.textMuted}
              value={email}
              editable={false}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: hp("1%"),
              }}
            >
              <Text style={[styles.label, { marginBottom: 0 }]}>City</Text>
              <TouchableOpacity
                onPress={() => handleGetLocation()}
                disabled={isLocating}
                activeOpacity={0.7}
              >
                <Text
                  style={{
                    fontSize: 13,
                    color: colors.primary,
                    fontWeight: "600",
                  }}
                >
                  {isLocating ? "Detecting..." : "Detect Location"}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="location-outline"
                size={wp("5%")}
                color={colors.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.inputWithIcon}
                placeholder="Enter city..."
                placeholderTextColor={colors.textMuted}
                value={city}
                onChangeText={setCity}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>State</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="map-outline"
                size={wp("5%")}
                color={colors.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.inputWithIcon}
                placeholder="Enter state..."
                placeholderTextColor={colors.textMuted}
                value={state}
                onChangeText={setState}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Bio <Text style={styles.optionalLabel}>(optional)</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              placeholder="Tell us about your brand..."
              placeholderTextColor={colors.textMuted}
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.actionButton,
            isLoading && styles.actionButtonDisabled,
          ]}
          onPress={handleSaveProfile}
          activeOpacity={0.9}
          disabled={isLoading}
        >
          <Text style={styles.actionButtonText}>
            {isLoading ? "Complete Profile..." : "Complete Profile"}
          </Text>
        </TouchableOpacity>
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
              <Ionicons
                name="alert-circle"
                size={wp("14%")}
                color={colors.error}
              />
            </View>
            <Text style={styles.errorModalTitle}>Validation Error</Text>
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

      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleProceedAfterProfile}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.errorModalContent}>
            <View style={styles.errorIconContainer}>
              <Ionicons
                name="checkmark-circle"
                size={wp("14%")}
                color={colors.success}
              />
            </View>
            <Text style={styles.errorModalTitle}>Success</Text>
            <Text style={styles.errorModalMessage}>
              Profile completed successfully!
            </Text>
            <TouchableOpacity
              style={[
                styles.errorModalButton,
                { backgroundColor: colors.success },
              ]}
              onPress={handleProceedAfterProfile}
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

export default ProfileSetupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: wp("5.5%"),
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
    backgroundColor: colors.surface,
  },
  titleContainer: {
    marginTop: hp("1.5%"),
    alignItems: "center",
    marginBottom: hp("2.5%"),
  },
  titleText: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
    letterSpacing: -0.6,
    marginBottom: hp("0.8%"),
  },
  subtitleText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: wp("4%"),
  },
  avatarContainer: {
    alignSelf: "center",
    marginTop: hp("0.5%"),
    marginBottom: hp("3%"),
    position: "relative",
  },
  avatarInner: {
    width: wp("22%"),
    height: wp("22%"),
    borderRadius: wp("11%"),
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarAddBadge: {
    position: "absolute",
    bottom: wp("0.5%"),
    right: wp("0.5%"),
    backgroundColor: colors.primary,
    width: wp("6%"),
    height: wp("6%"),
    borderRadius: wp("3%"),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.surface,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: wp(4.5),
    marginBottom: hp("3%"),
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: hp("2.2%"),
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: hp("0.8%"),
  },
  optionalLabel: {
    fontSize: 13,
    fontWeight: "400",
    color: colors.textSecondary,
  },
  input: {
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: wp("4%"),
    fontSize: 15,
    color: colors.textPrimary,
  },
  readOnlyInput: {
    backgroundColor: colors.background,
    color: colors.textSecondary,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: wp("4%"),
  },
  inputIcon: {
    marginRight: wp("2%"),
  },
  inputWithIcon: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    color: colors.textPrimary,
  },
  bioInput: {
    height: hp("11%"),
    borderRadius: 16,
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("4%"),
  },
  actionButton: {
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp("3%"),
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
  },
  actionButtonDisabled: {
    opacity: 0.7,
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
    backgroundColor: colors.surface,
    borderRadius: 20,
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
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: hp("1%"),
    textAlign: "center",
  },
  errorModalMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: hp("2.5%"),
  },
  errorModalButton: {
    width: "100%",
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.error,
    justifyContent: "center",
    alignItems: "center",
  },
  errorModalButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
  },
});
