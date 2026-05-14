import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { useHabits } from '../context/HabitsContext';
import { colors } from '../theme/colors';
import { getWeekDates, getMonthDates } from '../utils/dateUtils';
import { spacing, fontSize, borderRadius, isSmallPhone, isTablet, responsiveWidth } from '../utils/responsive';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const { habits } = useHabits();

  const weeklyData = useMemo(() => {
    const dates = getWeekDates();
    const completions = dates.map(date => {
      return habits.filter(h => h.completedDates?.includes(date)).length;
    });
    return { labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'], datasets: [{ data: completions }] };
  }, [habits]);

  const monthlyData = useMemo(() => {
    const dates = getMonthDates();
    const completions = dates.map(date => {
      return habits.filter(h => h.completedDates?.includes(date)).length;
    });
    return { labels: [], datasets: [{ data: completions }] };
  }, [habits]);

  const stats = useMemo(() => {
    let totalCompletions = 0;
    let totalStreaks = 0;
    let longestStreak = 0;

    habits.forEach(h => {
      totalCompletions += h.completedDates?.length || 0;
      totalStreaks += h.currentStreak || 0;
      longestStreak = Math.max(longestStreak, h.longestStreak || 0);
    });

    return { totalHabits: habits.length, totalCompletions, totalStreaks, longestStreak };
  }, [habits]);

  const chartConfig = {
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
    labelColor: () => colors.textSecondary,
    style: { borderRadius: 16 },
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: colors.primary,
    },
  };

  const chartWidth = isTablet ? Math.min(width - 80, 600) : width - 60;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
        <Text style={styles.subtitle}>Track your progress</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.primary + '20' }]}>
              <Ionicons name="leaf" size={isSmallPhone ? 20 : 24} color={colors.primary} />
            </View>
            <Text style={styles.statValue}>{stats.totalHabits}</Text>
            <Text style={styles.statLabel}>Active Habits</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.primary + '20' }]}>
              <Ionicons name="checkmark-circle" size={isSmallPhone ? 20 : 24} color={colors.primary} />
            </View>
            <Text style={styles.statValue}>{stats.totalCompletions}</Text>
            <Text style={styles.statLabel}>Total Done</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.streak + '20' }]}>
              <Ionicons name="flame" size={isSmallPhone ? 20 : 24} color={colors.streak} />
            </View>
            <Text style={styles.statValue}>{stats.totalStreaks}</Text>
            <Text style={styles.statLabel}>Combined Streaks</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.reward + '20' }]}>
              <Ionicons name="trophy" size={isSmallPhone ? 20 : 24} color={colors.reward} />
            </View>
            <Text style={styles.statValue}>{stats.longestStreak}</Text>
            <Text style={styles.statLabel}>Best Streak</Text>
          </View>
        </View>

        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <View style={styles.chartCard}>
            <LineChart
              data={weeklyData}
              width={chartWidth}
              height={isSmallPhone ? 160 : 180}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>
        </View>

        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>This Month</Text>
          <View style={styles.chartCard}>
            <LineChart
              data={monthlyData}
              width={chartWidth}
              height={isSmallPhone ? 160 : 180}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>
        </View>

        <View style={styles.habitLeaderboard}>
          <Text style={styles.sectionTitle}>Habit Leaderboard</Text>
          {habits.length === 0 ? (
            <Text style={styles.emptyText}>No habits yet</Text>
          ) : (
            habits
              .sort((a, b) => (b.longestStreak || 0) - (a.longestStreak || 0))
              .slice(0, 5)
              .map((habit, index) => (
                <View key={habit.id} style={styles.leaderboardItem}>
                  <Text style={styles.rank}>#{index + 1}</Text>
                  <View style={[styles.colorDot, { backgroundColor: habit.color }]} />
                  <Text style={styles.habitName}>{habit.name}</Text>
                  <View style={styles.streakBadge}>
                    <Ionicons name="flame" size={14} color={colors.streak} />
                    <Text style={styles.habitStreak}>{habit.longestStreak}</Text>
                  </View>
                </View>
              ))
          )}
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
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
    ...colors.shadows.md,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: spacing.sm,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  chartSection: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    overflow: 'hidden',
    ...colors.shadows.md,
  },
  chart: {
    borderRadius: borderRadius.lg,
  },
  habitLeaderboard: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    ...colors.shadows.sm,
  },
  rank: {
    fontSize: fontSize.sm,
    fontWeight: 'bold',
    color: colors.textMuted,
    width: 30,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.md,
  },
  habitName: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.text,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  habitStreak: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.streak,
  },
});