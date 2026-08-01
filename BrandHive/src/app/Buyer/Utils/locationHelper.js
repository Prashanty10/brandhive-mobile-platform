import * as Location from "expo-location";

/**
 * Detects current device location using expo-location with multi-tier reverse geocoding fallbacks.
 * Works on Real Devices, Android Emulators, iOS Simulators, Expo Go, and Web.
 * @returns {Promise<{success: boolean, city?: string, state?: string, coords?: {latitude: number, longitude: number}, message?: string}>}
 */
export const detectUserLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      return {
        success: false,
        message: "Permission to access location was denied. Please grant location permissions in settings.",
      };
    }

    let location = null;

    try {
      location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Low,
      });
    } catch (e) {
      location = await Location.getLastKnownPositionAsync({});
    }

    if (!location || !location.coords) {
      location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
    }

    if (!location || !location.coords) {
      return {
        success: false,
        message: "Unable to retrieve GPS coordinates.",
      };
    }

    const { latitude, longitude } = location.coords;
    let city = "";
    let state = "";

    try {
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverseGeocode && reverseGeocode.length > 0) {
        const place = reverseGeocode[0];
        city =
          place.city ||
          place.subregion ||
          place.district ||
          place.locality ||
          place.name ||
          "";
        state = place.region || place.administrativeArea || "";
      }
    } catch (e) {
      // Fallback to OSM Nominatim API if native reverseGeocode fails or lacks Play Services
    }

    if (!city && !state) {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          {
            headers: {
              "User-Agent": "BrandHiveMobileApp/1.0",
            },
          }
        );
        const data = await res.json();
        if (data && data.address) {
          const addr = data.address;
          city =
            addr.city ||
            addr.town ||
            addr.village ||
            addr.suburb ||
            addr.county ||
            addr.state_district ||
            "";
          state = addr.state || "";
        }
      } catch (err) {
        console.log("OSM Reverse Geocode Fallback Error:", err);
      }
    }

    return {
      success: true,
      city: city || "Detected Location",
      state: state || "",
      coords: { latitude, longitude },
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to detect location.",
    };
  }
};

export default null;
