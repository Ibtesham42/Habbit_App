import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useChallenges } from '../context/ChallengesContext';
import { colors } from '../theme/colors';
import ProgressRing from '../components/ProgressRing';

export default function ActiveChallengeScreen({ navigation }) {
  const { activeChallenge, completedChallenges } = useChallenges();

  if (!activeChallenge) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={28} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Challenge</Text>
          <View style={{ width: 28 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="trophy" size={80} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>No Active Challenge</Text>
          <Text style={styles.emptySubtitle}>
            Join a challenge from the Dashboard to start building consistency
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const progress = activeChallenge.progress || 0;
  const daysCompleted = activeChallenge.completedDates?.length || 0;
  const daysRemaining = activeChallenge.duration - daysCompleted;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{activeChallenge.name}</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.badgeContainer}>
          <Text style={styles.badge}>{activeChallenge.badge}</Text>
        </View>

        <ProgressRing progress={progress} size={120} strokeWidth={10} />

        <Text style={styles.progressText}>{progress}% Complete</Text>
        <Text style={styles.daysText}>
          {daysCompleted} of {activeChallenge.duration} days
        </Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>{activeChallenge.description}</Text>
        </View>

        {daysRemaining > 0 && (
          <View style={styles.motivationCard}>
            <Ionicons name="sparkles" size={24} color={colors.primary} />
            <Text style={styles.motivationText}>
              Only {daysRemaining} more day{daysRemaining > 1 ? 's' : ''} to go!
            </Text>
          </View>
        )}

        {completedChallenges.length > 0 && (
          <View style={styles.historySection}>
            <Text style={styles.historyTitle}>Completed Challenges</Text>
            {completedChallenges.slice(-3).reverse().map((challenge, index) => (
              <View key={index} style={styles.historyItem}>
                <Text style={styles.historyBadge}>{challenge.badge}</Text>
                <Text style={styles.historyName}>{challenge.name}</Text>
                <Text style={styles.historyDate}>{challenge.completedAt}</Text>
              </View>
            ))}
          </View>
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  badgeContainer: {
    marginBottom: 20,
  },
  badge: {
    fontSize: 80,
  },
  progressText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 20,
  },
  daysText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 5,
  },
  infoCard: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    marginTop: 30,
    width: '100%',
  },
  infoTitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  motivationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    width: '100%',
  },
  motivationText: {
    fontSize: 15,
    color: colors.text,
    marginLeft: 10,
    fontWeight: '500',
  },
  historySection: {
    marginTop: 30,
    width: '100%',
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  historyBadge: {
    fontSize: 24,
    marginRight: 10,
  },
  historyName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  historyDate: {
    fontSize: 12,
    color: colors.textMuted,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },
});