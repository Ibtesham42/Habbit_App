import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { useHabits } from '../context/HabitsContext';
import { colors } from '../theme/colors';

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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 15,
    color: colors.text,
    marginLeft: 12,
  },
  streakFreezeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
  },
  streakFreezeInfo: {
    flex: 1,
    marginLeft: 14,
  },
  streakFreezeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  streakFreezeCount: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  useFreezeBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  useFreezeBtnDisabled: {
    backgroundColor: colors.border,
  },
  useFreezeBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 12,
  },
  actionLabel: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 12,
  },
  aboutCard: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  appVersion: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
  },
  appTagline: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 10,
  },
});