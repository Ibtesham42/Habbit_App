import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useChallenges } from '../context/ChallengesContext';
import { useUser } from '../context/UserContext';
import { colors } from '../theme/colors';
import { CHALLENGES } from '../data/challenges';
import { spacing, fontSize, borderRadius, isSmallPhone } from '../utils/responsive';

const { width } = Dimensions.get('window');

export default function ChallengeSetupScreen({ navigation }) {
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const { startChallenge } = useChallenges();
  const { setOnboardingComplete } = useUser();

  const handleJoinChallenge = () => {
    if (selectedChallenge) {
      startChallenge(selectedChallenge);
      setOnboardingComplete();
      navigation.replace('Main');
    }
  };

  const handleSkip = () => {
    setOnboardingComplete();
    navigation.replace('Main');
  };

  const renderChallenge = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.challengeCard,
        selectedChallenge === item.id && { borderColor: item.color, borderWidth: 3 },
      ]}
      onPress={() => setSelectedChallenge(item.id)}
    >
      <View style={[styles.badgeContainer, { backgroundColor: item.color + '20' }]}>
        <Text style={styles.badge}>{item.badge}</Text>
      </View>
      <View style={styles.challengeInfo}>
        <Text style={styles.challengeName}>{item.name}</Text>
        <Text style={styles.challengeDesc}>{item.description}</Text>
        <View style={styles.durationRow}>
          <View style={[styles.durationBadge, { backgroundColor: item.color }]}>
            <Text style={styles.durationText}>{item.duration} days</Text>
          </View>
        </View>
      </View>
      {selectedChallenge === item.id && (
        <View style={[styles.checkCircle, { backgroundColor: item.color }]}>
          <Ionicons name="checkmark" size={18} color="#fff" />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your First Challenge</Text>
        <Text style={styles.subtitle}>
          Join a challenge to build early momentum and stay motivated
        </Text>
      </View>

      <FlatList
        data={CHALLENGES}
        keyExtractor={(item) => item.id}
        renderItem={renderChallenge}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.joinBtn,
            !selectedChallenge && styles.joinBtnDisabled,
            selectedChallenge && { backgroundColor: CHALLENGES.find(c => c.id === selectedChallenge)?.color || colors.primary },
          ]}
          onPress={handleJoinChallenge}
          disabled={!selectedChallenge}
        >
          <Text style={styles.joinBtnText}>Join Challenge</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
          <Text style={styles.skipBtnText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: fontSize.md * 1.5,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  challengeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
    ...colors.shadows.md,
  },
  badgeContainer: {
    width: isSmallPhone ? 56 : 64,
    height: isSmallPhone ? 56 : 64,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  badge: {
    fontSize: isSmallPhone ? 28 : 32,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeName: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
  },
  challengeDesc: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: fontSize.sm * 1.4,
  },
  durationRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  durationBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  durationText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: '#fff',
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  joinBtn: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...colors.shadows.md,
  },
  joinBtnDisabled: {
    backgroundColor: colors.border,
  },
  joinBtnText: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: '#fff',
  },
  skipBtn: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  skipBtnText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
});