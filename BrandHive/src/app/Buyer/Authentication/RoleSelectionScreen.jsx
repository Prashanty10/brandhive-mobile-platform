import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Pressable,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import colors from "../../../Theme/colors";

const RoleSelectionScreen = () => {
  const router = useRouter()
  const centerScale = useRef(new Animated.Value(0)).current;
  const centerOpacity = useRef(new Animated.Value(0)).current;

  const leftTranslateX = useRef(new Animated.Value(0)).current;
  const rightTranslateX = useRef(new Animated.Value(0)).current;

  const leftRotate = useRef(new Animated.Value(0)).current;
  const rightRotate = useRef(new Animated.Value(0)).current;

  const contentTranslateY = useRef(new Animated.Value(600)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(centerScale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),

      Animated.parallel([
        Animated.timing(leftTranslateX, {
          toValue: -80,
          duration: 700,
          useNativeDriver: true,
        }),

        Animated.timing(rightTranslateX, {
          toValue: 80,
          duration: 700,
          useNativeDriver: true,
        }),

        Animated.timing(leftRotate, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),

        Animated.timing(rightRotate, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),

      Animated.parallel([
        Animated.timing(contentTranslateY, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>

        <Animated.Image
          source={{
            uri: "https://i.pinimg.com/1200x/73/9a/78/739a789fb56fc0caf72d54b928363534.jpg",
          }}
          style={[
            styles.leftimage,
            {
              transform: [
                { translateX: leftTranslateX },
                {
                  rotate: leftRotate.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "-15deg"],
                  }),
                },
              ],
            },
          ]}
        />

   
        <Animated.Image
          source={{
            uri: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/realistic-mall-billboard-mockup-template-design-4a63f77b538de2deacf32790f036581c_screen.jpg?ts=1667582409",
          }}
          style={[
            styles.centerimage,
            {
              transform: [{ scale: centerScale }],
            },
          ]}
        />


        <Animated.Image
          source={{
            uri: "https://i.pinimg.com/1200x/86/de/27/86de270a748729d689030837d46fc313.jpg",
          }}
          style={[
            styles.rightimage,
            {
              transform: [
                { translateX: rightTranslateX },
                {
                  rotate: rightRotate.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "15deg"],
                  }),
                },
              ],
            },
          ]}
        />
      </View>

      <Animated.View
        style={{
          transform: [{ translateY: contentTranslateY }],
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Text style={styles.title}>Welcome to BrandHive</Text>

          <Text style={styles.subtitle}>
            How would you like to get started
          </Text>
        </View>

        <Pressable style={styles.card} onPress={()=>router.push({
          pathname:"/Buyer/Authentication/RegisterScreen",
          params:{role:"buyer"}
        })}>
          <View style={styles.row}>
            <Ionicons
              name="search"
              size={wp("6%")}
              color={colors.primary}
            />

            <Text style={styles.cardTitle}>
              Discover Ads
            </Text>
          </View>

          <Text style={styles.cardText}>
            Find nearby and online advertisements,
          </Text>

          <Text style={styles.cardText}>
            deals and services around you
          </Text>
        </Pressable>


        <Pressable style={styles.card} onPress={()=>router.push({
          pathname:"/Buyer/Authentication/RegisterScreen",
          params:{role:"seller"}
        })}>
          <View style={styles.row}>
            <Ionicons
              name="megaphone-outline"
              size={wp("6%")}
              color={colors.primary}
            />

            <Text style={styles.cardTitle}>
              Promote & Earn
            </Text>
          </View>

          <Text style={styles.cardText}>
            Advertise your business, products,
          </Text>

          <Text style={styles.cardText}>
            services and earn rewards
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
};

export default RoleSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    height: hp("45%"),
    justifyContent: "center",
    alignItems: "center",
  },

  centerimage: {
    width: wp("42%"),
    height: hp("30%"),
    borderRadius: wp("5%"),
    zIndex: 10,
  },

  leftimage: {
    position: "absolute",
    width: wp("38%"),
    height: hp("28%"),
    borderRadius: wp("5%"),
    left: wp("10%"),
  },

  rightimage: {
    position: "absolute",
    width: wp("38%"),
    height: hp("28%"),
    borderRadius: wp("5%"),
    right: wp("10%"),
  },

  title: {
    fontSize: wp("7.5%"),
    fontWeight: "700",
    color: colors.textPrimary,
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: wp("3.8%"),
    marginTop: hp("0.8%"),
  },

  card: {
    alignSelf: "center",
    width: wp("85%"),
    marginTop: hp("3%"),
    paddingHorizontal: wp("6%"),
    paddingVertical: hp("3%"),
    borderRadius: wp("5%"),
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,

    elevation: 4,

    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("2%"),
    marginBottom: hp("1%"),
  },

  cardTitle: {
    fontSize: wp("5.5%"),
    fontWeight: "700",
    color: colors.textPrimary,
  },

  cardText: {
    color: colors.textSecondary,
    fontSize: wp("3.8%"),
    lineHeight: wp("5.5%"),
  },
});