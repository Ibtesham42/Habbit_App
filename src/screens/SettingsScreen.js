import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { useHabits } from '../context/HabitsContext';
import { colors } from '../theme/colors';
import { spacing, fontSize, borderRadius, isSmallPhone } from '../utils/responsive';

export default function SettingsScreen() {
  const {
    notificationsEnabled,
    soundEnabled,
    hapticsEnabled,
    streakFreezes,
    updatePreference,
    useStreakFreeze,
  } = useUser();
  const { resetToday } = useHabits();

  const handleResetToday = () => {
    Alert.alert(
      'Reset Today\'s Progress',
      'This will reset all habits as incomplete for today. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => resetToday(),
        },
      ]
    );
  };

  const handleUseStreakFreeze = () => {
    if (streakFreezes > 0) {
      Alert.alert(
        'Use Streak Freeze',
        'This will protect your current streak from resetting. Use 1 of your {streakFreezes} streak freezes?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Use Freeze',
            onPress: () => useStreakFreeze(),
          },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications" size={22} color={colors.textSecondary} />
              <Text style={styles.settingLabel}>Daily Reminders</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={(value) => updatePreference('notificationsEnabled', value)}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Feedback</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="volume-high" size={22} color={colors.textSecondary} />
              <Text style={styles.settingLabel}>Sound Effects</Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={(value) => updatePreference('soundEnabled', value)}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="phone-portrait" size={22} color={colors.textSecondary} />
              <Text style={styles.settingLabel}>Haptic Feedback</Text>
            </View>
            <Switch
              value={hapticsEnabled}
              onValueChange={(value) => updatePreference('hapticsEnabled', value)}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Streak Protection</Text>
          <View style={styles.streakFreezeCard}>
            <Ionicons name="snow" size={40} color="#00BCD4" />
            <View style={styles.streakFreezeInfo}>
              <Text style={styles.streakFreezeTitle}>Streak Freezes</Text>
              <Text style={styles.streakFreezeCount}>{streakFreezes} available</Text>
            </View>
            <TouchableOpacity
              style={[styles.useFreezeBtn, streakFreezes === 0 && styles.useFreezeBtnDisabled]}
              onPress={handleUseStreakFreeze}
              disabled={streakFreezes === 0}
            >
              <Text style={styles.useFreezeBtnText}>Use</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <TouchableOpacity style={styles.actionRow} onPress={handleResetToday}>
            <Ionicons name="refresh" size={22} color={colors.secondary} />
            <Text style={[styles.actionLabel, { color: colors.secondary }]}>
              Reset Today's Progress
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.aboutCard}>
            <Text style={styles.appName}>Habit Tracker</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
            <Text style={styles.appTagline}>Build better habits, one day at a time</Text>
          </View>
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
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  section: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    ...colors.shadows.sm,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: fontSize.md,
    color: colors.text,
    marginLeft: spacing.md,
  },
  streakFreezeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    ...colors.shadows.sm,
  },
  streakFreezeInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  streakFreezeTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  streakFreezeCount: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  useFreezeBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  useFreezeBtnDisabled: {
    backgroundColor: colors.border,
  },
  useFreezeBtnText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: '#fff',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    ...colors.shadows.sm,
  },
  actionLabel: {
    fontSize: fontSize.md,
    fontWeight: '500',
    marginLeft: spacing.md,
  },
  aboutCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    ...colors.shadows.sm,
  },
  appName: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.text,
  },
  appVersion: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  appTagline: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
});