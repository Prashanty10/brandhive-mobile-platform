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

const ProfileSetupScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [first_name, setName] = useState("Ethan");
  const [last_name, setLastName] = useState("Miller");
  const [mobileNumber, setMobileNumber] = useState("9876543210");
  const [username, setUsername] = useState(params.username || "ethan_m");
  const [email, setEmail] = useState(params.email || "ethan@brandhive.com");
  const [city, setCity] = useState("New York");
  const [state, setState] = useState("NY");
  const [bio, setBio] = useState("Marketing enthusiast & brand manager.");
  const [profileImage, setProfileImage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [locationCoords, setLocationCoords] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  const handleGetLocation = async () => {
    setIsLocating(true);
    setTimeout(() => {
      setCity("New York");
      setState("NY");
      setIsLocating(false);
    }, 600);
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
      onBackPress
    );

    return () => subscription.remove();
  }, [router]);

  const [completedActiveRole, setCompletedActiveRole] = useState("buyer");

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
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccessModal(true);
    }, 500);
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
            mediaTypes: ['images'],
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
        {/* Header Back Button */}
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

        {/* Title Area */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Profile Setup</Text>
          <Text style={styles.subtitleText}>
            Complete your profile details to personalize your experience on
            BrandHive.
          </Text>
        </View>

        {/* Avatar Container */}
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={handleSelectAvatar}
          activeOpacity={0.8}
        >
          <View style={styles.avatarInner}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatarImage} />
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

        {/* Form */}
        <View style={styles.form}>
          {/* First Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Ethan"
              placeholderTextColor={colors.textSecondary}
              value={first_name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          {/* Last Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Miller"
              placeholderTextColor={colors.textSecondary}
              value={last_name}
              onChangeText={setLastName}
              autoCapitalize="words"
            />
          </View>

          {/* Mobile Number Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile Number</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="call-outline"
                size={wp("5%")}
                color={colors.textSecondary}
                style={styles.inputIcon}
              />
              <Text style={{ fontSize: wp("3.8%"), color: colors.textPrimary, fontWeight: "600", marginRight: wp("2%") }}>
                +91
              </Text>
              <TextInput
                style={styles.inputWithIcon}
                placeholder="9876543210"
                placeholderTextColor={colors.textSecondary}
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

          {/* Username Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="ethan_miller_007"
              placeholderTextColor={colors.textSecondary}
              value={username}
              editable={false}
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="ethan_miller007@gmail.com"
              placeholderTextColor={colors.textSecondary}
              value={email}
              editable={false}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* City Input */}
          <View style={styles.inputGroup}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: hp("1%") }}>
              <Text style={[styles.label, { marginBottom: 0 }]}>City</Text>
              <TouchableOpacity onPress={() => handleGetLocation(true)} disabled={isLocating} activeOpacity={0.7}>
                <Text style={{ fontSize: wp("3.2%"), color: colors.primary, fontWeight: "600" }}>
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
                placeholderTextColor={colors.textSecondary}
                value={city}
                onChangeText={setCity}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* State Input */}
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
                placeholderTextColor={colors.textSecondary}
                value={state}
                onChangeText={setState}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Bio Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Bio <Text style={styles.optionalLabel}>(optional)</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              placeholder="Tell us about yourself..."
              placeholderTextColor={colors.textSecondary}
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity
          style={[styles.actionButton, isLoading && styles.actionButtonDisabled]}
          onPress={handleSaveProfile}
          activeOpacity={0.9}
          disabled={isLoading}
        >
          <Text style={styles.actionButtonText}>
            {isLoading ? "Saving Profile..." : "Complete & Go to Home"}
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>

      {/* Error Modal */}
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
            <Text style={styles.errorModalTitle}>Required Field</Text>
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

      {/* Success Modal */}
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
            <Text style={styles.errorModalMessage}>Profile updated successfully!</Text>
            <TouchableOpacity
              style={[styles.errorModalButton, { backgroundColor: colors.success }]}
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
    marginTop: hp("2%"),
    alignItems: "center",
    marginBottom: hp("2.5%"),
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
  avatarContainer: {
    alignSelf: "center",
    marginTop: hp("1%"),
    marginBottom: hp("3%"),
    position: "relative",
  },
  avatarInner: {
    width: wp("24%"),
    height: wp("24%"),
    borderRadius: wp("12%"),
    backgroundColor: colors.inputBg,
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
    width: wp("6.5%"),
    height: wp("6.5%"),
    borderRadius: wp("3.25%"),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.white,
  },
  form: {
    marginBottom: hp("3%"),
  },
  inputGroup: {
    marginBottom: hp("2.5%"),
  },
  label: {
    fontSize: wp("3.6%"),
    fontWeight: "600",
    color: colors.black,
    marginBottom: hp("1%"),
  },
  optionalLabel: {
    fontSize: wp("3.2%"),
    fontWeight: "400",
    color: colors.textSecondary,
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
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: hp("6%"),
    borderRadius: wp("6%"),
    backgroundColor: colors.inputBg,
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
    fontSize: wp("3.8%"),
    color: colors.textPrimary,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: wp("2%"),
    marginTop: hp("1.2%"),
  },
  chip: {
    paddingHorizontal: wp("3.5%"),
    paddingVertical: hp("0.8%"),
    borderRadius: wp("4%"),
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: wp("3.2%"),
    color: colors.textSecondary,
    fontWeight: "500",
  },
  activeChipText: {
    color: colors.white,
    fontWeight: "600",
  },
  bioInput: {
    height: hp("11%"),
    borderRadius: wp("4%"),
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("5%"),
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
