import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  TextInput,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from "../../Theme/colors";
import { OFFLINE_AD_CATEGORIES } from "../Buyer/advertisement/offline/OfflineCategoryScreen";

// Form Fields Data directly inlined
const COMMON_FIELDS = [
  { id: "title", label: "Ad Title", type: "text", required: true },
  { id: "description", label: "Description", type: "textarea", required: true },
  { id: "price", label: "Price per day (₹)", type: "number", required: true },
];

const CATEGORY_FIELDS = {
  hoarding: [
    { id: "height", label: "Height (ft)", type: "number", required: true },
    { id: "width", label: "Width (ft)", type: "number", required: true },
    { id: "lighting", label: "Lighting Type", type: "dropdown", options: ["Lit", "Non-Lit", "Front Lit", "Back Lit"] },
  ],
};

const CreateAdvertisement = () => {
  const router = useRouter();
  const { categoryName } = useLocalSearchParams();

  // Category Info Lookup
  const categoryInfo = OFFLINE_AD_CATEGORIES.find(
    (c) => c.categoryName === categoryName
  ) || { title: categoryName || "Advertisement", iconColor: colors.primary };

  const categoryFieldsList = CATEGORY_FIELDS[categoryName] || [];
  const allFields = [...COMMON_FIELDS, ...categoryFieldsList];

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    contactNumber: "",
    location: null,
    images: [],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  // Input change handler
  const handleInputChange = (fieldId, value) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: null }));
    }
  };

  // Image Picker Logic (Camera & Gallery)
  const handlePickImage = async (useCamera = false) => {
    try {
      const permissionResult = useCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          `Please grant ${useCamera ? "camera" : "gallery"} permissions to upload photos.`
        );
        return;
      }

      const result = useCamera
        ? await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            selectionLimit: 5,
            quality: 0.8,
          });

      if (!result.canceled && result.assets) {
        const newUris = result.assets.map((asset) => asset.uri);
        const currentImages = formData.images || [];
        setFormData((prev) => ({ ...prev, images: [...currentImages, ...newUris] }));
        if (errors.images) {
          setErrors((prev) => ({ ...prev, images: null }));
        }
      }
    } catch (err) {
      console.error("Error picking image:", err);
    }
  };

  const handleRemoveImage = (index) => {
    const currentImages = formData.images || [];
    setFormData((prev) => ({
      ...prev,
      images: currentImages.filter((_, i) => i !== index),
    }));
  };

  // GPS Location Fetching
  const handleFetchCurrentLocation = async () => {
    try {
      setGettingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Permission to access location was denied.");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      let addressString = `Lat: ${loc.coords.latitude.toFixed(4)}, Long: ${loc.coords.longitude.toFixed(4)}`;

      try {
        const [geocode] = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });

        if (geocode) {
          const parts = [
            geocode.name || geocode.street,
            geocode.district || geocode.subregion,
            geocode.city,
            geocode.region,
          ].filter(Boolean);
          if (parts.length > 0) {
            addressString = parts.join(", ");
          }
        }
      } catch (gErr) {
        console.log("Geocode error:", gErr);
      }

      const locationObj = {
        address: addressString,
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };

      setFormData((prev) => ({ ...prev, location: locationObj }));
      if (errors.location) {
        setErrors((prev) => ({ ...prev, location: null }));
      }
    } catch (err) {
      Alert.alert("Location Error", "Unable to fetch location. Please try again.");
    } finally {
      setGettingLocation(false);
    }
  };

  const handleSubmit = async () => {
    const newErrors = {};
    allFields.forEach((field) => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = `${field.label || field.id} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Alert.alert("Validation Error", "Please fill in all required fields accurately.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        "Success 🎉",
        `Your ${categoryInfo.title || "advertisement"} has been published successfully!`,
        [
          {
            text: "My Advertisements",
            onPress: () => router.push("/Seller/Screens/AdvertisementsScreen"),
          },
        ]
      );
    }, 600);
  };

  const iconName = Array.isArray(categoryInfo.icon)
    ? categoryInfo.icon[0]
    : categoryInfo.icon;

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Inlined Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitleText} numberOfLines={1}>
              {categoryInfo.title ? `Post ${categoryInfo.title} Ad` : "Post Advertisement"}
            </Text>
          </View>
          <View style={{ width: wp("10%") }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Hero Category Banner */}
          <View style={styles.topTitleSection}>
            <View
              style={[
                styles.heroIconBg,
                { backgroundColor: `${categoryInfo.iconColor || colors.primary}12` },
              ]}
            >
              <Ionicons
                name={iconName || "megaphone-outline"}
                size={28}
                color={categoryInfo.iconColor || colors.primary}
              />
            </View>
            <Text style={styles.mainHeading}>
              Create {categoryInfo.title || "Ad"} Advertisement
            </Text>
            <Text style={styles.subHeading}>
              Fill the information below to publish your advertisement.
            </Text>
          </View>

          {/* Form Fields Section */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionIconBg}>
                <Ionicons name="create-outline" size={18} color={colors.primary} />
              </View>
              <Text style={styles.sectionTitle}>Ad Details</Text>
            </View>

            {allFields.map((field) => (
              <View key={field.id} style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>
                  {field.label} {field.required && <Text style={styles.requiredStar}>*</Text>}
                </Text>

                <TextInput
                  style={[
                    styles.input,
                    field.type === "textarea" && styles.textarea,
                    errors[field.id] && styles.inputError,
                  ]}
                  value={formData[field.id] || ""}
                  onChangeText={(val) => handleInputChange(field.id, val)}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  placeholderTextColor={colors.textMuted}
                  keyboardType={field.type === "number" ? "numeric" : "default"}
                  multiline={field.type === "textarea"}
                  numberOfLines={field.type === "textarea" ? 3 : 1}
                />

                {errors[field.id] && <Text style={styles.errorText}>{errors[field.id]}</Text>}
              </View>
            ))}

            {/* Location Section */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Location</Text>
              <TouchableOpacity
                style={styles.locationButton}
                onPress={handleFetchCurrentLocation}
                disabled={gettingLocation}
              >
                {gettingLocation ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <>
                    <Ionicons name="location-outline" size={18} color={colors.white} />
                    <Text style={styles.locationBtnText}>Use Current GPS Location</Text>
                  </>
                )}
              </TouchableOpacity>

              {formData.location && (
                <View style={styles.locationBox}>
                  <Ionicons name="location" size={16} color={colors.primary} />
                  <Text style={styles.locationText}>{formData.location.address}</Text>
                </View>
              )}
            </View>

            {/* Images Upload Section */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Upload Photos</Text>
              <View style={styles.imagePickerRow}>
                <TouchableOpacity
                  style={styles.pickBtn}
                  onPress={() => handlePickImage(false)}
                >
                  <Ionicons name="images-outline" size={18} color={colors.primary} />
                  <Text style={styles.pickBtnText}>Gallery</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.pickBtn}
                  onPress={() => handlePickImage(true)}
                >
                  <Ionicons name="camera-outline" size={18} color={colors.primary} />
                  <Text style={styles.pickBtnText}>Camera</Text>
                </TouchableOpacity>
              </View>

              {formData.images.length > 0 && (
                <View style={styles.imageGrid}>
                  {formData.images.map((uri, idx) => (
                    <View key={idx} style={styles.imageWrapper}>
                      <Image source={{ uri }} style={styles.previewImage} />
                      <TouchableOpacity
                        style={styles.removeBtn}
                        onPress={() => handleRemoveImage(idx)}
                      >
                        <Ionicons name="close-circle" size={18} color={colors.error} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Bottom Action Bar */}
        <View style={styles.bottomActionBar}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              isSubmitting && styles.submitButtonDisabled,
            ]}
            activeOpacity={0.8}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <>
                <Text style={styles.submitButtonText}>Publish Advertisement</Text>
                <Ionicons name="arrow-forward" size={18} color={colors.white} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateAdvertisement;

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
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitleText: {
    fontSize: wp("4.5%"),
    fontWeight: "700",
    color: colors.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: wp("5%"),
    paddingBottom: hp("12%"),
  },
  topTitleSection: {
    marginTop: hp("1.5%"),
    marginBottom: hp("2.5%"),
    alignItems: "flex-start",
  },
  heroIconBg: {
    width: wp("13%"),
    height: wp("13%"),
    borderRadius: wp("3.5%"),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp("1.5%"),
  },
  mainHeading: {
    fontSize: wp("5.8%"),
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: hp("0.8%"),
  },
  subHeading: {
    fontSize: wp("3.5%"),
    color: colors.textSecondary,
    lineHeight: wp("5%"),
  },
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: wp("4.5%"),
    marginBottom: hp("2.2%"),
    elevation: 2,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("2%"),
    paddingBottom: hp("1%"),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 10,
  },
  sectionIconBg: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.accentLight,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: wp("4.2%"),
    fontWeight: "700",
    color: colors.textPrimary,
  },
  fieldContainer: {
    marginBottom: hp("2%"),
  },
  fieldLabel: {
    fontSize: wp("3.6%"),
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: hp("0.8%"),
  },
  requiredStar: {
    color: colors.error,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: wp("3.5%"),
    paddingVertical: hp("1.2%"),
    fontSize: wp("3.8%"),
    color: colors.textPrimary,
  },
  textarea: {
    height: hp("10%"),
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    fontSize: wp("3%"),
    color: colors.error,
    marginTop: 4,
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    paddingVertical: hp("1.2%"),
    borderRadius: 12,
    gap: 8,
  },
  locationBtnText: {
    color: colors.white,
    fontWeight: "600",
    fontSize: wp("3.5%"),
  },
  locationBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: wp("3%"),
    marginTop: hp("1%"),
    gap: 8,
  },
  locationText: {
    fontSize: wp("3.4%"),
    color: colors.textPrimary,
    flex: 1,
  },
  imagePickerRow: {
    flexDirection: "row",
    gap: wp("3%"),
  },
  pickBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: hp("1.2%"),
    gap: 6,
  },
  pickBtnText: {
    fontSize: wp("3.4%"),
    fontWeight: "600",
    color: colors.textPrimary,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: wp("2%"),
    marginTop: hp("1%"),
  },
  imageWrapper: {
    position: "relative",
    width: wp("20%"),
    height: wp("20%"),
    borderRadius: 10,
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  removeBtn: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: colors.white,
    borderRadius: 10,
  },
  bottomActionBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("1.8%"),
    elevation: 10,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: hp("1.6%"),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: wp("4%"),
    fontWeight: "700",
  },
});
