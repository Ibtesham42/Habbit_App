import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useHabits } from '../context/HabitsContext';
import { useChallenges } from '../context/ChallengesContext';
import { colors } from '../theme/colors';
import { getToday } from '../utils/dateUtils';
import { spacing, fontSize, borderRadius, isSmallPhone, hitSlop } from '../utils/responsive';
import ProgressRing from '../components/ProgressRing';
import HabitCard from '../components/HabitCard';
import CelebrationOverlay from '../components/CelebrationOverlay';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
  const { habits, todayLogs, toggleHabit, incrementHabit, getTodayProgress, resetToday } = useHabits();
  const { activeChallenge } = useChallenges();
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationType, setCelebrationType] = useState(null);

  const progress = getTodayProgress();
  const completedCount = habits.filter(h => todayLogs[h.id]?.completed).length;
  const totalHabits = habits.length;

  const handleToggle = (id) => {
    const habit = habits.find(h => h.id === id);
    const wasCompleted = todayLogs[id]?.completed;

    toggleHabit(id);

    if (!wasCompleted) {
      if (habit.currentStreak > 0 && (habit.currentStreak + 1) % 7 === 0) {
        setCelebrationType('streak');
        setShowCelebration(true);
      } else if (completedCount + 1 === totalHabits) {
        setCelebrationType('allComplete');
        setShowCelebration(true);
      }
    }
  };

  const handleIncrement = (id) => {
    incrementHabit(id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Today</Text>
          <Text style={styles.subtitle}>
            {completedCount} of {totalHabits} completed
          </Text>
        </View>
        <ProgressRing progress={progress} size={70} />
      </View>

      {activeChallenge && (
        <TouchableOpacity
          style={styles.challengeBanner}
          onPress={() => navigation.navigate('ActiveChallenge')}
        >
          <Ionicons name="flame" size={20} color="#fff" />
          <Text style={styles.challengeText}>
            {activeChallenge.name} - Day {activeChallenge.completedDates?.length || 0}/{activeChallenge.duration}
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>
      )}

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HabitCard
            habit={item}
            todayLog={todayLogs[item.id]}
            onToggle={() => handleToggle(item.id)}
            onIncrement={() => handleIncrement(item.id)}
            onPress={() => navigation.navigate('HabitDetail', { habitId: item.id })}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="leaf" size={60} color={colors.textMuted} />
            <Text style={styles.emptyText}>No habits yet</Text>
            <Text style={styles.emptySubtext}>Tap + to create your first habit</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('HabitCreate')}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <CelebrationOverlay
        visible={showCelebration}
        type={celebrationType}
        onHide={() => setShowCelebration(false)}
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.header,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  challengeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.streak,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    ...colors.shadows.md,
  },
  challengeText: {
    flex: 1,
    color: '#fff',
    fontWeight: '600',
    marginHorizontal: spacing.sm,
    fontSize: fontSize.sm,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xxl,
  },
  emptyText: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: 30,
    width: isSmallPhone ? 54 : 60,
    height: isSmallPhone ? 54 : 60,
    borderRadius: 27,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...colors.shadows.lg,
  },
});