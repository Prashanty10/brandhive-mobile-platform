import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  StatusBar,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import colors from "../../../../Theme/colors";

const EditProfileScreen = ({ visible, onClose, user, onSave }) => {
  const router = useRouter();

  const [firstName, setFirstName] = useState(user?.firstName || "Vanessa");
  const [lastName, setLastName] = useState(user?.lastName || "Miller");
  const [email, setEmail] = useState(user?.email || "vanessa@brandhive.com");
  const [mobileNumber, setMobileNumber] = useState(user?.mobileNumber || "9876543210");
  const [city, setCity] = useState(user?.city || "New York");
  const [state, setState] = useState(user?.state || "NY");
  const [bio, setBio] = useState(user?.bio || "Marketing strategist & brand campaign manager.");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "Vanessa");
      setLastName(user.lastName || "Miller");
      setEmail(user.email || "vanessa@brandhive.com");
      setCity(user.city || "New York");
      setState(user.state || "NY");
    }
  }, [user]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  const handleSave = () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert("Validation Error", "Please enter your first and last name.");
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      const updatedUser = {
        ...user,
        firstName,
        lastName,
        email,
        mobileNumber,
        city,
        state,
        bio,
      };

      if (onSave) {
        onSave(updatedUser);
      }

      Alert.alert("Profile Updated 🎉", "Your profile details have been saved successfully.", [
        { text: "OK", onPress: handleClose },
      ]);
    }, 500);
  };

  const renderContent = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleClose}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: wp("10%") }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.formSection}>
          {/* First Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First Name"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          {/* Last Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last Name"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={email}
              editable={false}
              placeholder="Email"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          {/* Phone */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile Number</Text>
            <TextInput
              style={styles.input}
              value={mobileNumber}
              onChangeText={setMobileNumber}
              keyboardType="phone-pad"
              placeholder="Mobile Number"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          {/* City */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="City"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          {/* State */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>State</Text>
            <TextInput
              style={styles.input}
              value={state}
              onChangeText={setState}
              placeholder="State"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          {/* Bio */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              placeholder="Tell us about yourself..."
              placeholderTextColor={colors.textMuted}
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            activeOpacity={0.8}
            onPress={handleSave}
            disabled={isSaving}
          >
            <Text style={styles.saveButtonText}>
              {isSaving ? "Saving Changes..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  if (visible !== undefined) {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
        {renderContent()}
      </Modal>
    );
  }

  return renderContent();
};

export default EditProfileScreen;

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
  scrollContent: {
    paddingHorizontal: wp("5%"),
    paddingTop: hp("2%"),
    paddingBottom: hp("10%"),
  },
  formSection: {
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: wp("5%"),
    gap: hp("2%"),
  },
  inputGroup: {
    gap: hp("0.8%"),
  },
  label: {
    fontSize: wp("3.5%"),
    fontWeight: "600",
    color: colors.textPrimary,
  },
  input: {
    height: hp("6%"),
    borderRadius: 14,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: wp("4%"),
    fontSize: wp("3.8%"),
    color: colors.textPrimary,
  },
  disabledInput: {
    backgroundColor: "#F1F5F9",
    color: colors.textMuted,
  },
  bioInput: {
    height: hp("12%"),
    paddingVertical: hp("1.5%"),
  },
  saveButton: {
    backgroundColor: colors.primary,
    height: hp("6.2%"),
    borderRadius: 16,
    justifyContent:"center",
    alignItems: "center",
    marginTop: hp("1.5%"),
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: wp("4%"),
    fontWeight: "700",
  },
});
