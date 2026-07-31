import React, { useEffect, useRef, useState } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import colors from "../Theme/colors";

const SplashScreen = () => {
  const [showLoading, setShowLoading] = useState(false);
  const [dots, setDots] = useState("");
  const router = useRouter();

  const iconTranslateY = useRef(new Animated.Value(-600)).current;
  const iconTranslateX = useRef(new Animated.Value(80)).current;
  const textTranslateX = useRef(new Animated.Value(-40)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const loadingOpacity = useRef(new Animated.Value(0)).current;

  const checkAuth = async () => {
    try {
      router.replace("/Buyer/Authentication/RoleSelectionScreen");
    } catch (error) {
      console.log("Splash Screen checkAuth Error:", error.message);
      router.replace("/Buyer/Authentication/RoleSelectionScreen");
    }
  };

 
  useEffect(() => {
   
    Animated.spring(iconTranslateY, {
      toValue: 0,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start(() => {
     
      Animated.parallel([
        Animated.timing(iconTranslateX, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateX, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]).start(() => {
        
        setShowLoading(true);
      });
    });
    
  }, []);


  useEffect(() => {
    if (!showLoading) return;

    let timerid;

    const action = () => {
      setDots((prev) => {
        if (prev === "...") return "";
        return prev + ".";
      });

      timerid = setTimeout(action, 500);
    };

    action();

    return () => clearTimeout(timerid);
  }, [showLoading]);

  useEffect(() => {
    if (!showLoading) return;

    Animated.timing(loadingOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      checkAuth();
    }, 2000);

    return () => clearTimeout(timer);
  }, [showLoading]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.logoContainer}>
          <Animated.Image
            source={require("../../assets/images/icon.png")}
            style={[
              styles.logoIcon,
              {
                transform: [
                  { translateY: iconTranslateY },
                  { translateX: iconTranslateX },
                ],
              },
            ]}
            resizeMode="contain"
          />

          <Animated.View
            style={[
              styles.textContainer,
              {
                opacity: textOpacity,
                transform: [{ translateX: textTranslateX }],
              },
            ]}
          >
            <Text style={styles.brandText}>Brand</Text>
            <Text style={styles.hiveText}>Hive</Text>
          </Animated.View>
        </View>

        <Animated.View
          style={[styles.loadingContainer, { opacity: loadingOpacity }]}
        >
          {showLoading && <Text style={styles.loadingText}>Loading{dots}</Text>}
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logoIcon: {
    width: wp("12%"),
    height: wp("12%"),
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: wp("1%"),
  },
  brandText: {
    fontSize: wp("8%"),
    fontWeight: "700",
    color: colors.textPrimary,
  },
  hiveText: {
    fontSize: wp("8%"),
    fontWeight: "700",
    color: colors.textPrimary,
  },
  loadingContainer: {
    position: "absolute",
    bottom: wp("15%"),
    alignItems: "center",
  },
  loadingText: {
    fontSize: wp("4%"),
    fontWeight: "500",
    color: colors.textSecondary,
    letterSpacing: 1.2,
  },
});
