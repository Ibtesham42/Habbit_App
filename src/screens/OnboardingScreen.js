import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { colors } from '../theme/colors';
import { spacing, fontSize, borderRadius, iconSize, isSmallPhone } from '../utils/responsive';

const { width } = Dimensions.get('window');

const features = [
  {
    icon: 'checkmark-circle',
    title: 'Daily Habits',
    description: 'Create simple habits you want to build. Track them daily with just one tap.',
    color: colors.primary,
  },
  {
    icon: 'flame',
    title: 'Build Streaks',
    description: 'Each day you complete a habit, your streak grows. Never break the chain!',
    color: colors.streak,
  },
  {
    icon: 'flag',
    title: '3-Day Challenge',
    description: 'Start with a 3-day challenge to build momentum. Complete it to unlock rewards!',
    color: colors.info,
  },
  {
    icon: 'trophy',
    title: 'Earn Rewards',
    description: 'Unlock achievements and badges for your consistency. Share your progress!',
    color: colors.reward,
  },
];

const featureIcons = {
  'checkmark-circle': '✓',
  'flame': '🔥',
  'flag': '🚩',
  'trophy': '🏆',
};

export default function OnboardingScreen({ navigation }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { setOnboardingComplete } = useUser();
  const scrollX = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: currentSlide,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [currentSlide]);

  const handleNext = () => {
    if (currentSlide < features.length) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setOnboardingComplete();
      navigation.replace('ChallengeSetup');
    }
  };

  const handleSkip = () => {
    setOnboardingComplete();
    navigation.replace('Main');
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleDotPress = (index) => {
    setCurrentSlide(index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [
              {
                scale: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.9],
                }),
              },
            ],
          },
        ]}
      >
        <View style={[styles.iconCircle, { backgroundColor: features[currentSlide]?.color || colors.primary }]}>
          <Text style={styles.featureEmoji}>
            {featureIcons[features[currentSlide]?.icon] || '✓'}
          </Text>
        </View>
      </Animated.View>

      <View style={styles.content}>
        <Animated.Text
          style={[
            styles.title,
            {
              opacity: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
            },
          ]}
        >
          {features[currentSlide]?.title || 'Welcome!'}
        </Animated.Text>
        <Animated.Text
          style={[
            styles.subtitle,
            {
              opacity: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
            },
          ]}
        >
          {features[currentSlide]?.description}
        </Animated.Text>
      </View>

      <View style={styles.pagination}>
        {features.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleDotPress(index)}
            style={styles.dotButton}
          >
            <View
              style={[
                styles.dot,
                currentSlide === index && styles.dotActive,
                currentSlide === index && { backgroundColor: features[index]?.color },
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        {currentSlide > 0 && (
          <TouchableOpacity style={styles.prevBtn} onPress={handlePrev}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
            <Text style={styles.prevBtnText}>Back</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.nextBtn,
            { backgroundColor: features[currentSlide]?.color || colors.primary },
          ]}
          onPress={handleNext}
        >
          <Text style={styles.nextBtnText}>
            {currentSlide === features.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  skipBtn: {
    position: 'absolute',
    top: spacing.xl + 10,
    right: spacing.lg,
    zIndex: 10,
    padding: spacing.sm,
  },
  skipText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xxl,
  },
  iconCircle: {
    width: isSmallPhone ? 120 : 140,
    height: isSmallPhone ? 120 : 140,
    borderRadius: isSmallPhone ? 60 : 70,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  featureEmoji: {
    fontSize: isSmallPhone ? 48 : 56,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  title: {
    fontSize: fontSize.header,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: fontSize.lg * 1.6,
    paddingHorizontal: spacing.md,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  dotButton: {
    padding: spacing.xs,
  },
  dot: {
    width: isSmallPhone ? 8 : 10,
    height: isSmallPhone ? 8 : 10,
    borderRadius: borderRadius.round,
    backgroundColor: colors.border,
  },
  dotActive: {
    width: isSmallPhone ? 24 : 28,
    height: isSmallPhone ? 8 : 10,
    borderRadius: borderRadius.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  prevBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  prevBtnText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  nextBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  nextBtnText: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: '#fff',
  },
});