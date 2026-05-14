import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { useHabits } from '../context/HabitsContext';
import { colors } from '../theme/colors';
import { getWeekDates, getMonthDates } from '../utils/dateUtils';

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
    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
    labelColor: () => colors.textSecondary,
    style: { borderRadius: 16 },
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: colors.primary,
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
        <Text style={styles.subtitle}>Track your progress</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="leaf" size={24} color={colors.primary} />
            <Text style={styles.statValue}>{stats.totalHabits}</Text>
            <Text style={styles.statLabel}>Active Habits</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
            <Text style={styles.statValue}>{stats.totalCompletions}</Text>
            <Text style={styles.statLabel}>Total Done</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="flame" size={24} color={colors.secondary} />
            <Text style={styles.statValue}>{stats.totalStreaks}</Text>
            <Text style={styles.statLabel}>Combined Streaks</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trophy" size={24} color="#FFD700" />
            <Text style={styles.statValue}>{stats.longestStreak}</Text>
            <Text style={styles.statLabel}>Best Streak</Text>
          </View>
        </View>

        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <View style={styles.chartCard}>
            <LineChart
              data={weeklyData}
              width={width - 60}
              height={180}
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
              width={width - 60}
              height={180}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>
        </View>

        <View style={styles.habitLeaderboard}>
          <Text style={styles.sectionTitle}>Habit Leaderboard</Text>
          {habits
            .sort((a, b) => (b.longestStreak || 0) - (a.longestStreak || 0))
            .slice(0, 5)
            .map((habit, index) => (
              <View key={habit.id} style={styles.leaderboardItem}>
                <Text style={styles.rank}>#{index + 1}</Text>
                <View style={[styles.colorDot, { backgroundColor: habit.color }]} />
                <Text style={styles.habitName}>{habit.name}</Text>
                <Text style={styles.habitStreak}>
                  <Ionicons name="flame" size={14} color={colors.secondary} /> {habit.longestStreak}
                </Text>
              </View>
            ))}
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 10,
  },
  statCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  chartSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    overflow: 'hidden',
  },
  chart: {
    borderRadius: 16,
  },
  habitLeaderboard: {
    marginTop: 24,
    marginBottom: 30,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  rank: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textMuted,
    width: 30,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  habitName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  habitStreak: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});