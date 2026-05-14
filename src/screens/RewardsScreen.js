import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useChallenges } from '../context/ChallengesContext';
import { colors } from '../theme/colors';

export default function RewardsScreen() {
  const { achievements, completedChallenges } = useChallenges();

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Rewards</Text>
        <Text style={styles.subtitle}>
          {unlockedCount} of {totalCount} achievements unlocked
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {completedChallenges.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Completed Challenges</Text>
            <View style={styles.badgesRow}>
              {completedChallenges.map((challenge, index) => (
                <View key={index} style={styles.challengeBadge}>
                  <Text style={styles.challengeBadgeEmoji}>{challenge.badge}</Text>
                  <Text style={styles.challengeBadgeName}>{challenge.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          {achievements.map((achievement) => (
            <View
              key={achievement.id}
              style={[
                styles.achievementCard,
                !achievement.unlocked && styles.achievementLocked,
              ]}
            >
              <Text style={styles.achievementIcon}>{achievement.icon}</Text>
              <View style={styles.achievementInfo}>
                <Text
                  style={[
                    styles.achievementName,
                    !achievement.unlocked && styles.textLocked,
                  ]}
                >
                  {achievement.name}
                </Text>
                <Text style={styles.achievementDesc}>{achievement.description}</Text>
              </View>
              {achievement.unlocked ? (
                <Ionicons name="checkmark-circle" size={28} color={colors.primary} />
              ) : (
                <Ionicons name="lock-closed" size={24} color={colors.textMuted} />
              )}
            </View>
          ))}
        </View>

        <View style={styles.motivationSection}>
          <Text style={styles.motivationTitle}>Stay Motivated!</Text>
          <Text style={styles.motivationText}>
            Keep building your streaks and completing challenges to unlock more achievements.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  challengeBadge: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: 100,
  },
  challengeBadgeEmoji: {
    fontSize: 36,
  },
  challengeBadgeName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    marginTop: 6,
    textAlign: 'center',
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
  },
  achievementLocked: {
    opacity: 0.6,
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: 14,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  textLocked: {
    color: colors.textMuted,
  },
  achievementDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  motivationSection: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  motivationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  motivationText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});