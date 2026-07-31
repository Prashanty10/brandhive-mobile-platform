import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
  StatusBar,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import colors from "../../../../Theme/colors";
import { ONLINE_PLATFORMS_MAP } from "../../../../data/onlineInformation";
import { LinearGradient } from "expo-linear-gradient";

const HERO_HEIGHT = hp("34%");

const OnlineInformationScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { platformId } = useLocalSearchParams();
  const [activeFaqIndex, setActiveFaqIndex] = useState(null);
  const [imageError, setImageError] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const platform = ONLINE_PLATFORMS_MAP?.[platformId];

  const headerOpacity = scrollY.interpolate({
    inputRange: [HERO_HEIGHT * 0.6, HERO_HEIGHT * 0.85],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  if (!platform) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorIconWrapper}>
          <Ionicons name="alert-circle-outline" size={52} color={colors.error} />
        </View>
        <Text style={styles.errorTitle}>Platform Not Found</Text>
        <Text style={styles.errorSubtitle}>
          The requested platform could not be found. Please go back and try again.
        </Text>
        <TouchableOpacity
          style={styles.errorBtn}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={16} color={colors.white} />
          <Text style={styles.errorBtnText}>  Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleFaq = (index) => {
    setActiveFaqIndex(activeFaqIndex === index ? null : index);
  };

  const handleOpenLink = async (url) => {
    if (url) {
      try {
        await Linking.openURL(url);
      } catch (err) {
        console.error("Failed to open link:", err);
      }
    }
  };

  // Safe area top for the back button
  const backBtnTop = insets.top + 12;
  // Safe area top for sticky header
  const stickyHeaderPaddingTop = insets.top;

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* ── Animated Sticky Header (appears on scroll) ── */}
      <Animated.View
        style={[
          styles.stickyHeader,
          {
            opacity: headerOpacity,
            paddingTop: stickyHeaderPaddingTop + 10,
          },
        ]}
        pointerEvents="none"
      >
        <View style={styles.stickyInner}>
          <View
            style={[
              styles.stickyIconBadge,
              { backgroundColor: platform.bgTint || colors.accentLight },
            ]}
          >
            <Ionicons
              name={platform.icon}
              size={14}
              color={platform.iconColor || colors.primary}
            />
          </View>
          <Text style={styles.stickyTitle} numberOfLines={1}>
            {platform.title}
          </Text>
        </View>
      </Animated.View>

      {/* ── Floating Back Button (always visible over hero) ── */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={[styles.floatingBackButton, { top: backBtnTop }]}
        activeOpacity={0.85}
      >
        <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
      </TouchableOpacity>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* ══════════════════════════════════
            HERO / COVER IMAGE SECTION
        ══════════════════════════════════ */}
        <View style={styles.heroContainer}>
          {/* Background: cover image or brand gradient fallback */}
          {!imageError && platform.coverImage ? (
            <Image
              source={{ uri: platform.coverImage }}
              style={styles.coverImage}
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <LinearGradient
              colors={[
                platform.iconColor || colors.primary,
                platform.bgTint || "#C7D2FE",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.coverFallback}
            />
          )}

          {/* Gradient overlay: top transparent → bottom dark */}
          <LinearGradient
            colors={[
              "rgba(0,0,0,0.0)",
              "rgba(0,0,0,0.15)",
              "rgba(5,15,35,0.80)",
            ]}
            locations={[0, 0.45, 1]}
            style={styles.heroOverlay}
          />

          {/* Platform Info at bottom of hero */}
          <View style={styles.heroInfo}>
            {/* Icon badge */}
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: platform.bgTint || "#EEF2FF" },
              ]}
            >
              <Ionicons
                name={platform.icon}
                size={30}
                color={platform.iconColor || colors.primary}
              />
            </View>

            {/* Title, subtitle, tags */}
            <View style={styles.heroTitles}>
              <Text style={styles.heroTitle} numberOfLines={1}>
                {platform.title}
              </Text>
              <Text style={styles.heroSubtitle} numberOfLines={2}>
                {platform.subtitle}
              </Text>
              <View style={styles.tagsRow}>
                {(platform.tags || []).slice(0, 3).map((tag, i) => (
                  <View key={i} style={styles.heroTag}>
                    <Text style={styles.heroTagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* ══════════════════════════════════
            MAIN CONTENT
        ══════════════════════════════════ */}
        <View style={styles.contentContainer}>

          {/* ─── Overview ─── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconBadge}>
                <Ionicons
                  name="information-circle-outline"
                  size={16}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.sectionTitle}>Overview</Text>
            </View>

            <Text style={styles.overviewText}>{platform.shortOverview}</Text>

            <View style={styles.detailsCard}>
              {/* What is it */}
              <View style={styles.detailRow}>
                <View
                  style={[styles.detailIconBadge, { backgroundColor: "#EFF6FF" }]}
                >
                  <Ionicons
                    name="help-circle-outline"
                    size={15}
                    color="#3B82F6"
                  />
                </View>
                <View style={styles.detailTextBlock}>
                  <Text style={styles.detailTitle}>What is it?</Text>
                  <Text style={styles.detailDescription}>
                    {platform.whatIsIt}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              {/* How it works */}
              <View style={styles.detailRow}>
                <View
                  style={[styles.detailIconBadge, { backgroundColor: "#F0FDF4" }]}
                >
                  <Ionicons name="cog-outline" size={15} color="#10B981" />
                </View>
                <View style={styles.detailTextBlock}>
                  <Text style={styles.detailTitle}>How it works</Text>
                  <Text style={styles.detailDescription}>
                    {platform.howItWorks}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* ─── Audience Reach ─── */}
          {platform.audienceReach && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconBadge}>
                  <Ionicons
                    name="people-outline"
                    size={16}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.sectionTitle}>Audience Reach</Text>
              </View>

              {/* Row 1 */}
              <View style={styles.audienceRow}>
                <View
                  style={[
                    styles.audienceCard,
                    { backgroundColor: "#EFF6FF", borderColor: "#DBEAFE" },
                  ]}
                >
                  <View style={[styles.audienceIconBadge, { backgroundColor: "#DBEAFE" }]}>
                    <Ionicons name="globe-outline" size={18} color="#3B82F6" />
                  </View>
                  <Text style={[styles.audienceValue, { color: "#3B82F6" }]} numberOfLines={2}>
                    {platform.audienceReach.globalUsers}
                  </Text>
                  <Text style={styles.audienceLabel}>Global Users</Text>
                </View>

                <View
                  style={[
                    styles.audienceCard,
                    { backgroundColor: "#F0FDF4", borderColor: "#D1FAE5" },
                  ]}
                >
                  <View style={[styles.audienceIconBadge, { backgroundColor: "#D1FAE5" }]}>
                    <Ionicons name="flag-outline" size={18} color="#10B981" />
                  </View>
                  <Text style={[styles.audienceValue, { color: "#10B981" }]} numberOfLines={2}>
                    {platform.audienceReach.activeUsers}
                  </Text>
                  <Text style={styles.audienceLabel}>India Presence</Text>
                </View>
              </View>

              {/* Row 2 */}
              <View style={[styles.audienceRow, { marginTop: hp("1.2%") }]}>
                <View
                  style={[
                    styles.audienceCard,
                    { backgroundColor: "#FFFBEB", borderColor: "#FDE68A" },
                  ]}
                >
                  <View style={[styles.audienceIconBadge, { backgroundColor: "#FDE68A" }]}>
                    <Ionicons name="earth-outline" size={18} color="#F59E0B" />
                  </View>
                  <Text style={[styles.audienceValue, { color: "#F59E0B" }]} numberOfLines={2}>
                    {platform.audienceReach.supportedCountries}
                  </Text>
                  <Text style={styles.audienceLabel}>Countries</Text>
                </View>

                <View
                  style={[
                    styles.audienceCard,
                    { backgroundColor: "#FDF4FF", borderColor: "#E9D5FF" },
                  ]}
                >
                  <View style={[styles.audienceIconBadge, { backgroundColor: "#E9D5FF" }]}>
                    <Ionicons name="person-outline" size={18} color="#8B5CF6" />
                  </View>
                  <Text style={[styles.audienceValue, { color: "#8B5CF6" }]} numberOfLines={2}>
                    {platform.audienceReach.keyDemographics}
                  </Text>
                  <Text style={styles.audienceLabel}>Demographics</Text>
                </View>
              </View>
            </View>
          )}

          {/* ─── Pricing & Budget ─── */}
          {platform.pricingModel && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconBadge}>
                  <Ionicons name="cash-outline" size={16} color={colors.primary} />
                </View>
                <Text style={styles.sectionTitle}>Pricing & Estimations</Text>
              </View>

              <View style={styles.pricingCard}>
                {platform.pricingModel.cpc && (
                  <View style={styles.pricingRow}>
                    <View
                      style={[
                        styles.pricingIconWrapper,
                        { backgroundColor: "#EFF6FF" },
                      ]}
                    >
                      <Ionicons name="hand-right-outline" size={17} color="#3B82F6" />
                    </View>
                    <View style={styles.pricingTextBlock}>
                      <Text style={styles.pricingLabel}>Cost Per Click (CPC)</Text>
                      <Text style={styles.pricingValue}>
                        {platform.pricingModel.cpc}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.pricingBadge,
                        { backgroundColor: "#DBEAFE" },
                      ]}
                    >
                      <Text style={[styles.pricingBadgeText, { color: "#2563EB" }]}>
                        CPC
                      </Text>
                    </View>
                  </View>
                )}

                {platform.pricingModel.cpm && (
                  <>
                    <View style={styles.divider} />
                    <View style={styles.pricingRow}>
                      <View
                        style={[
                          styles.pricingIconWrapper,
                          { backgroundColor: "#F0FDF4" },
                        ]}
                      >
                        <Ionicons name="eye-outline" size={17} color="#10B981" />
                      </View>
                      <View style={styles.pricingTextBlock}>
                        <Text style={styles.pricingLabel}>
                          Cost Per 1,000 Impressions (CPM)
                        </Text>
                        <Text style={styles.pricingValue}>
                          {platform.pricingModel.cpm}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.pricingBadge,
                          { backgroundColor: "#D1FAE5" },
                        ]}
                      >
                        <Text
                          style={[styles.pricingBadgeText, { color: "#059669" }]}
                        >
                          CPM
                        </Text>
                      </View>
                    </View>
                  </>
                )}

                {platform.pricingModel.cpa && (
                  <>
                    <View style={styles.divider} />
                    <View style={styles.pricingRow}>
                      <View
                        style={[
                          styles.pricingIconWrapper,
                          { backgroundColor: "#FEF2F2" },
                        ]}
                      >
                        <Ionicons name="cart-outline" size={17} color="#EF4444" />
                      </View>
                      <View style={styles.pricingTextBlock}>
                        <Text style={styles.pricingLabel}>
                          Cost Per Acquisition (CPA)
                        </Text>
                        <Text style={styles.pricingValue}>
                          {platform.pricingModel.cpa}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.pricingBadge,
                          { backgroundColor: "#FEE2E2" },
                        ]}
                      >
                        <Text
                          style={[styles.pricingBadgeText, { color: "#DC2626" }]}
                        >
                          CPA
                        </Text>
                      </View>
                    </View>
                  </>
                )}

                {/* Budget separator */}
                <View style={styles.budgetSeparator}>
                  <View style={styles.budgetLine} />
                  <Text style={styles.budgetSeparatorText}>
                    Recommended Budgets
                  </Text>
                  <View style={styles.budgetLine} />
                </View>

                {/* Budget cards */}
                <View style={styles.budgetRow}>
                  <View style={styles.budgetCard}>
                    <Text style={styles.budgetLabel}>Daily</Text>
                    <Text style={styles.budgetValue}>
                      {platform.pricingModel.dailyBudget}
                    </Text>
                  </View>
                  <View style={[styles.budgetCard, styles.budgetCardHighlight]}>
                    <Text style={[styles.budgetLabel, { color: "rgba(255,255,255,0.8)" }]}>
                      Weekly
                    </Text>
                    <Text style={[styles.budgetValue, { color: colors.white }]}>
                      {platform.pricingModel.weeklyBudget}
                    </Text>
                  </View>
                  <View style={styles.budgetCard}>
                    <Text style={styles.budgetLabel}>Monthly</Text>
                    <Text style={styles.budgetValue}>
                      {platform.pricingModel.monthlyBudget}
                    </Text>
                  </View>
                </View>

                {platform.pricingModel.note && (
                  <View style={styles.pricingNoteRow}>
                    <Ionicons
                      name="information-circle-outline"
                      size={13}
                      color={colors.textMuted}
                    />
                    <Text style={styles.pricingNote}>
                      {platform.pricingModel.note}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* ─── Best Use Cases ─── */}
          {platform.bestUseCases?.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconBadge}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={16}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.sectionTitle}>Best Use Cases</Text>
              </View>
              <View style={styles.listCard}>
                {platform.bestUseCases.map((useCase, index) => (
                  <View
                    key={index}
                    style={[
                      styles.listItemRow,
                      index < platform.bestUseCases.length - 1 &&
                        styles.listItemBorder,
                    ]}
                  >
                    <View style={styles.listCheckBadge}>
                      <Ionicons name="checkmark" size={11} color={colors.white} />
                    </View>
                    <Text style={styles.listItemText}>{useCase}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ─── Ad Formats ─── */}
          {platform.adTypes?.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconBadge}>
                  <Ionicons
                    name="layers-outline"
                    size={16}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.sectionTitle}>Supported Ad Formats</Text>
              </View>
              {platform.adTypes.map((adType, index) => (
                <View key={index} style={styles.formatCard}>
                  <View style={styles.formatHeader}>
                    <View
                      style={[
                        styles.formatIconBadge,
                        {
                          backgroundColor:
                            platform.bgTint || colors.accentLight,
                        },
                      ]}
                    >
                      <Ionicons
                        name="layers-outline"
                        size={13}
                        color={platform.iconColor || colors.primary}
                      />
                    </View>
                    <Text style={styles.formatName}>{adType.name}</Text>
                  </View>
                  <Text style={styles.formatDesc}>{adType.description}</Text>
                  {adType.specs && (
                    <View style={styles.formatSpecsBox}>
                      <Ionicons
                        name="code-slash-outline"
                        size={11}
                        color={colors.textMuted}
                      />
                      <Text style={styles.formatSpecsText}>{adType.specs}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* ─── Targeting Options ─── */}
          {platform.targetingOptions?.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconBadge}>
                  <Ionicons
                    name="locate-outline"
                    size={16}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.sectionTitle}>Targeting Options</Text>
              </View>
              <View style={styles.targetingWrap}>
                {platform.targetingOptions.map((option, index) => (
                  <View key={index} style={styles.targetingChip}>
                    <Ionicons
                      name="radio-button-on"
                      size={7}
                      color={colors.primary}
                    />
                    <Text style={styles.targetingChipText}>{option}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ─── Pros & Cons ─── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconBadge}>
                <Ionicons name="scale-outline" size={16} color={colors.primary} />
              </View>
              <Text style={styles.sectionTitle}>Pros & Cons</Text>
            </View>

            {platform.advantages?.length > 0 && (
              <View style={styles.prosCard}>
                <View style={styles.prosConsHeader}>
                  <View
                    style={[
                      styles.prosConsIconBadge,
                      { backgroundColor: "#DCFCE7" },
                    ]}
                  >
                    <Ionicons name="thumbs-up" size={13} color="#16A34A" />
                  </View>
                  <Text style={[styles.prosConsTitle, { color: "#16A34A" }]}>
                    Advantages
                  </Text>
                </View>
                {platform.advantages.map((adv, index) => (
                  <View key={index} style={styles.bulletRow}>
                    <View
                      style={[styles.bulletDot, { backgroundColor: "#16A34A" }]}
                    />
                    <Text style={styles.bulletText}>{adv}</Text>
                  </View>
                ))}
              </View>
            )}

            {platform.disadvantages?.length > 0 && (
              <View style={[styles.consCard, { marginTop: hp("1.5%") }]}>
                <View style={styles.prosConsHeader}>
                  <View
                    style={[
                      styles.prosConsIconBadge,
                      { backgroundColor: "#FEE2E2" },
                    ]}
                  >
                    <Ionicons name="thumbs-down" size={13} color="#DC2626" />
                  </View>
                  <Text style={[styles.prosConsTitle, { color: "#DC2626" }]}>
                    Disadvantages
                  </Text>
                </View>
                {platform.disadvantages.map((dis, index) => (
                  <View key={index} style={styles.bulletRow}>
                    <View
                      style={[styles.bulletDot, { backgroundColor: "#DC2626" }]}
                    />
                    <Text style={styles.bulletText}>{dis}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* ─── Launch Guide ─── */}
          {(platform.setupRequirements?.length > 0 ||
            platform.tipsAndBestPractices?.length > 0) && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconBadge}>
                  <Ionicons
                    name="rocket-outline"
                    size={16}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.sectionTitle}>Launch Guide</Text>
              </View>

              {platform.setupRequirements?.length > 0 && (
                <View style={styles.listCard}>
                  <Text style={styles.listCardHeading}>
                    Requirements to Start
                  </Text>
                  {platform.setupRequirements.map((req, index) => (
                    <View
                      key={index}
                      style={[
                        styles.listItemRow,
                        index < platform.setupRequirements.length - 1 &&
                          styles.listItemBorder,
                      ]}
                    >
                      <View
                        style={[
                          styles.listCheckBadge,
                          { backgroundColor: colors.primary },
                        ]}
                      >
                        <Text style={styles.listStepNumber}>{index + 1}</Text>
                      </View>
                      <Text style={styles.listItemText}>{req}</Text>
                    </View>
                  ))}
                </View>
              )}

              {platform.tipsAndBestPractices?.length > 0 && (
                <View style={[styles.tipsCard, { marginTop: hp("1.5%") }]}>
                  <View style={styles.prosConsHeader}>
                    <View
                      style={[
                        styles.prosConsIconBadge,
                        { backgroundColor: "#FEF3C7" },
                      ]}
                    >
                      <Ionicons name="bulb-outline" size={13} color="#D97706" />
                    </View>
                    <Text style={[styles.prosConsTitle, { color: "#D97706" }]}>
                      Tips & Best Practices
                    </Text>
                  </View>
                  {platform.tipsAndBestPractices.map((tip, index) => (
                    <View key={index} style={styles.bulletRow}>
                      <Ionicons
                        name="bulb-outline"
                        size={13}
                        color="#D97706"
                        style={{ marginRight: 8, marginTop: 2 }}
                      />
                      <Text style={styles.bulletText}>{tip}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* ─── FAQs ─── */}
          {platform.faqs?.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconBadge}>
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={16}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.sectionTitle}>FAQs</Text>
              </View>
              {platform.faqs.map((faq, index) => {
                const isOpen = activeFaqIndex === index;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.faqCard,
                      isOpen && styles.faqCardActive,
                      index > 0 && { marginTop: hp("1%") },
                    ]}
                    activeOpacity={0.8}
                    onPress={() => toggleFaq(index)}
                  >
                    <View style={styles.faqHeader}>
                      <View
                        style={[
                          styles.faqNumberBadge,
                          isOpen && { backgroundColor: colors.primary },
                        ]}
                      >
                        <Text
                          style={[
                            styles.faqNumber,
                            isOpen && { color: colors.white },
                          ]}
                        >
                          {index + 1}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.faqQuestion,
                          isOpen && { color: colors.primary },
                        ]}
                      >
                        {faq.question}
                      </Text>
                      <Ionicons
                        name={isOpen ? "chevron-up" : "chevron-down"}
                        size={16}
                        color={isOpen ? colors.primary : colors.textMuted}
                      />
                    </View>
                    {isOpen && (
                      <View style={styles.faqAnswerContainer}>
                        <Text style={styles.faqAnswer}>{faq.answer}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* ─── CTA Button ─── */}
          {platform.officialWebsite && (
            <TouchableOpacity
              style={styles.ctaButton}
              activeOpacity={0.85}
              onPress={() => handleOpenLink(platform.officialWebsite.url)}
            >
              <LinearGradient
                colors={[
                  platform.iconColor || colors.primary,
                  platform.iconColor
                    ? platform.iconColor + "BB"
                    : colors.accent,
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.ctaGradient}
              >
                <Ionicons
                  name="open-outline"
                  size={17}
                  color={colors.white}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.ctaText}>
                  {platform.officialWebsite.name || "Visit Official Portal"}
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={15}
                  color="rgba(255,255,255,0.7)"
                  style={{ marginLeft: 8 }}
                />
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default OnlineInformationScreen;

/* ════════════════════════════════════════════════
   STYLES
════════════════════════════════════════════════ */
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: hp("8%"),
  },

  /* ── Error State ── */
  errorContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp("10%"),
  },
  errorIconWrapper: {
    width: wp("20%"),
    height: wp("20%"),
    borderRadius: wp("10%"),
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp("2.5%"),
  },
  errorTitle: {
    fontSize: wp("5.5%"),
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: hp("1%"),
    textAlign: "center",
  },
  errorSubtitle: {
    fontSize: wp("3.8%"),
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: wp("5.5%"),
    marginBottom: hp("3%"),
  },
  errorBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: wp("7%"),
    paddingVertical: hp("1.5%"),
    borderRadius: 30,
  },
  errorBtnText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: wp("3.8%"),
  },

  /* ── Floating Back Button ── */
  floatingBackButton: {
    position: "absolute",
    left: wp("5%"),
    zIndex: 200,
    width: wp("10%"),
    height: wp("10%"),
    borderRadius: wp("5%"),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },

  /* ── Sticky Header ── */
  stickyHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 150,
    backgroundColor: colors.white,
    paddingHorizontal: wp("5%"),
    paddingBottom: hp("1.2%"),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 4,
  },
  stickyInner: {
    flexDirection: "row",
    alignItems: "center",
  },
  stickyIconBadge: {
    width: wp("7%"),
    height: wp("7%"),
    borderRadius: wp("2%"),
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  stickyTitle: {
    fontSize: wp("4.2%"),
    fontWeight: "700",
    color: colors.textPrimary,
    flex: 1,
  },

  /* ── Hero / Cover ── */
  heroContainer: {
    width: "100%",
    height: HERO_HEIGHT,
    position: "relative",
    overflow: "hidden",
    backgroundColor: colors.inputBg,
  },
  coverImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  coverFallback: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: wp("5%"),
    paddingBottom: hp("3%"),
  },
  iconContainer: {
    width: wp("14%"),
    height: wp("14%"),
    borderRadius: wp("3.5%"),
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp("3.5%"),
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  heroTitles: {
    flex: 1,
  },
  heroTitle: {
    fontSize: wp("5.8%"),
    fontWeight: "800",
    color: colors.white,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
    marginBottom: 3,
  },
  heroSubtitle: {
    fontSize: wp("3.1%"),
    color: "rgba(255,255,255,0.88)",
    marginBottom: hp("0.8%"),
    lineHeight: wp("4.5%"),
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  heroTag: {
    backgroundColor: "rgba(255,255,255,0.22)",
    borderRadius: 20,
    paddingHorizontal: wp("2.5%"),
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    marginRight: 6,
    marginBottom: 4,
  },
  heroTagText: {
    fontSize: wp("2.5%"),
    color: colors.white,
    fontWeight: "700",
  },

  /* ── Content ── */
  contentContainer: {
    paddingHorizontal: wp("5%"),
    paddingTop: hp("2.5%"),
  },

  /* ── Section Header ── */
  section: {
    marginBottom: hp("3%"),
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("1.5%"),
  },
  sectionIconBadge: {
    width: wp("7.5%"),
    height: wp("7.5%"),
    borderRadius: wp("2%"),
    backgroundColor: colors.accentLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: wp("4.4%"),
    fontWeight: "800",
    color: colors.textPrimary,
  },

  /* ── Overview ── */
  overviewText: {
    fontSize: wp("3.8%"),
    lineHeight: wp("5.8%"),
    color: colors.textSecondary,
    marginBottom: hp("1.5%"),
  },
  detailsCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: wp("4%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  detailIconBadge: {
    width: wp("8%"),
    height: wp("8%"),
    borderRadius: wp("2%"),
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 1,
  },
  detailTextBlock: {
    flex: 1,
  },
  detailTitle: {
    fontSize: wp("3.6%"),
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  detailDescription: {
    fontSize: wp("3.4%"),
    lineHeight: wp("5%"),
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: hp("1.5%"),
  },

  /* ── Audience Grid ── */
  audienceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  audienceCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: wp("3.5%"),
    marginHorizontal: wp("0.8%"),
    minHeight: hp("12%"),
    justifyContent: "center",
  },
  audienceIconBadge: {
    width: wp("8%"),
    height: wp("8%"),
    borderRadius: wp("2%"),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp("0.8%"),
  },
  audienceValue: {
    fontSize: wp("3.6%"),
    fontWeight: "800",
    marginBottom: 3,
    lineHeight: wp("5%"),
  },
  audienceLabel: {
    fontSize: wp("2.8%"),
    color: colors.textMuted,
    fontWeight: "600",
  },

  /* ── Pricing ── */
  pricingCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: wp("4.5%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  pricingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  pricingIconWrapper: {
    width: wp("9%"),
    height: wp("9%"),
    borderRadius: wp("2.5%"),
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  pricingTextBlock: {
    flex: 1,
    marginRight: 8,
  },
  pricingLabel: {
    fontSize: wp("2.8%"),
    fontWeight: "600",
    color: colors.textMuted,
    marginBottom: 2,
  },
  pricingValue: {
    fontSize: wp("3.6%"),
    fontWeight: "700",
    color: colors.textPrimary,
  },
  pricingBadge: {
    paddingHorizontal: wp("2.2%"),
    paddingVertical: 4,
    borderRadius: 8,
  },
  pricingBadgeText: {
    fontSize: wp("2.7%"),
    fontWeight: "800",
  },
  budgetSeparator: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: hp("2%"),
  },
  budgetLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  budgetSeparatorText: {
    fontSize: wp("3%"),
    fontWeight: "700",
    color: colors.textMuted,
    marginHorizontal: 10,
  },
  budgetRow: {
    flexDirection: "row",
  },
  budgetCard: {
    flex: 1,
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("1%"),
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 3,
  },
  budgetCardHighlight: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  budgetLabel: {
    fontSize: wp("2.7%"),
    fontWeight: "600",
    color: colors.textMuted,
    marginBottom: 4,
  },
  budgetValue: {
    fontSize: wp("2.8%"),
    fontWeight: "800",
    color: colors.primary,
    textAlign: "center",
  },
  pricingNoteRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: hp("1.5%"),
  },
  pricingNote: {
    fontSize: wp("3%"),
    color: colors.textMuted,
    fontStyle: "italic",
    flex: 1,
    lineHeight: wp("4.3%"),
    marginLeft: 6,
  },

  /* ── List Card (use cases / requirements) ── */
  listCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  listCardHeading: {
    fontSize: wp("3.5%"),
    fontWeight: "700",
    color: colors.textPrimary,
    paddingHorizontal: wp("4%"),
    paddingTop: hp("1.5%"),
    paddingBottom: hp("1%"),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  listItemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1.3%"),
  },
  listItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  listCheckBadge: {
    width: wp("5.5%"),
    height: wp("5.5%"),
    borderRadius: wp("2.8%"),
    backgroundColor: colors.success,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  listStepNumber: {
    color: colors.white,
    fontSize: wp("2.5%"),
    fontWeight: "800",
  },
  listItemText: {
    fontSize: wp("3.5%"),
    lineHeight: wp("5%"),
    color: colors.textSecondary,
    flex: 1,
  },

  /* ── Ad Formats ── */
  formatCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: wp("4%"),
    marginBottom: hp("1.2%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  formatHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("0.8%"),
  },
  formatIconBadge: {
    width: wp("6.5%"),
    height: wp("6.5%"),
    borderRadius: wp("1.8%"),
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  formatName: {
    fontSize: wp("3.8%"),
    fontWeight: "700",
    color: colors.textPrimary,
  },
  formatDesc: {
    fontSize: wp("3.4%"),
    lineHeight: wp("4.8%"),
    color: colors.textSecondary,
    marginBottom: hp("0.8%"),
    paddingLeft: wp("6.5%") + 10,
  },
  formatSpecsBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.inputBg,
    borderRadius: 8,
    paddingHorizontal: wp("2.5%"),
    paddingVertical: hp("0.5%"),
    alignSelf: "flex-start",
    marginLeft: wp("6.5%") + 10,
  },
  formatSpecsText: {
    fontSize: wp("2.8%"),
    color: colors.textMuted,
    marginLeft: 5,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },

  /* ── Targeting Chips ── */
  targetingWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  targetingChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.accentLight,
    borderRadius: 20,
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("0.7%"),
    borderWidth: 1,
    borderColor: colors.primary + "30",
    marginRight: 8,
    marginBottom: 8,
  },
  targetingChipText: {
    fontSize: wp("3%"),
    fontWeight: "600",
    color: colors.primary,
    marginLeft: 5,
  },

  /* ── Pros / Cons / Tips ── */
  prosCard: {
    backgroundColor: "#F0FDF4",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D1FAE5",
    padding: wp("4%"),
  },
  consCard: {
    backgroundColor: "#FEF2F2",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FEE2E2",
    padding: wp("4%"),
  },
  tipsCard: {
    backgroundColor: "#FFFBEB",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FDE68A",
    padding: wp("4%"),
  },
  prosConsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("1.2%"),
  },
  prosConsIconBadge: {
    width: wp("7%"),
    height: wp("7%"),
    borderRadius: wp("2%"),
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  prosConsTitle: {
    fontSize: wp("3.8%"),
    fontWeight: "700",
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: hp("0.8%"),
  },
  bulletDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginTop: hp("0.7%"),
    marginRight: 10,
  },
  bulletText: {
    fontSize: wp("3.4%"),
    lineHeight: wp("4.8%"),
    color: colors.textSecondary,
    flex: 1,
  },

  /* ── FAQs ── */
  faqCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: wp("4%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  faqCardActive: {
    borderColor: colors.primary + "55",
    backgroundColor: "#F5F9FF",
  },
  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  faqNumberBadge: {
    width: wp("7%"),
    height: wp("7%"),
    borderRadius: wp("2%"),
    backgroundColor: colors.inputBg,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  faqNumber: {
    fontSize: wp("3%"),
    fontWeight: "800",
    color: colors.textMuted,
  },
  faqQuestion: {
    fontSize: wp("3.5%"),
    fontWeight: "700",
    color: colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  faqAnswerContainer: {
    marginTop: hp("1.2%"),
    paddingTop: hp("1.2%"),
    paddingLeft: wp("7%") + 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  faqAnswer: {
    fontSize: wp("3.4%"),
    lineHeight: wp("5%"),
    color: colors.textSecondary,
  },

  /* ── CTA Button ── */
  ctaButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 5,
    marginTop: hp("1%"),
  },
  ctaGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: hp("2%"),
    paddingHorizontal: wp("5%"),
  },
  ctaText: {
    color: colors.white,
    fontSize: wp("4%"),
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
