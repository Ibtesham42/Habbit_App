import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHabits } from '../context/HabitsContext';
import { useChallenges } from '../context/ChallengesContext';
import { useUser } from '../context/UserContext';
import { colors } from '../theme/colors';
import { getToday, getYesterday, getDaysAgo } from '../utils/dateUtils';
import { calculateStreak } from '../utils/streakCalculator';
import CelebrationOverlay from './CelebrationOverlay';

const { width } = Dimensions.get('window');
const isSmallPhone = width < 375;

export default function DevPanel() {
  const [visible, setVisible] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationType, setCelebrationType] = useState(null);

  const { habits, todayLogs, toggleHabit, saveData: saveHabits, getTodayProgress } = useHabits();
  const { activeChallenge, startChallenge, updateChallengeProgress, completedChallenges, checkAchievements, achievements } = useChallenges();
  const { onboardingComplete, setOnboardingComplete, updatePreference, streakFreezes, useStreakFreeze } = useUser();

  const triggerCelebration = useCallback((type) => {
    setCelebrationType(type);
    setShowCelebration(true);
  }, []);

  const simulateDay = useCallback((daysAgo) => {
    const targetDate = daysAgo === 0 ? getToday() : getDaysAgo(daysAgo);
    const updatedHabits = habits.map(h => {
      const newCompletedDates = [...(h.completedDates || []), targetDate];
      const newStreak = calculateStreak(newCompletedDates);
      return {
        ...h,
        completedDates: newCompletedDates,
        currentStreak: newStreak,
        longestStreak: Math.max(h.longestStreak || 0, newStreak),
      };
    });
    saveHabits(updatedHabits);
    Alert.alert('Simulated', `Habits completed for ${daysAgo === 0 ? 'today' : daysAgo + ' days ago'}`);
  }, [habits, saveHabits]);

  const simulate3DayKickstart = useCallback(() => {
    const dates = [getDaysAgo(2), getYesterday(), getToday()];
    const updatedHabits = habits.map(h => {
      const newCompletedDates = [...(h.completedDates || []), ...dates];
      const newStreak = calculateStreak(newCompletedDates);
      return {
        ...h,
        completedDates: newCompletedDates,
        currentStreak: newStreak,
        longestStreak: Math.max(h.longestStreak || 0, newStreak),
      };
    });
    saveHabits(updatedHabits);
    triggerCelebration('challenge');
    Alert.alert('Reward Triggered', '3-Day Kickstart Complete reward triggered!');
  }, [habits, saveHabits, triggerCelebration]);

  const resetChallenge = useCallback(() => {
    if (activeChallenge) {
      updateChallengeProgress(getToday());
    } else {
      Alert.alert('No Active Challenge', 'Start a challenge first');
    }
  }, [activeChallenge, updateChallengeProgress]);

  const start3DayChallenge = useCallback(() => {
    startChallenge('3-day-starter');
    Alert.alert('Challenge Started', '3-Day Starter challenge started');
  }, [startChallenge]);

  const completeChallenge = useCallback(() => {
    if (activeChallenge) {
      for (let i = 0; i < activeChallenge.duration; i++) {
        updateChallengeProgress(getDaysAgo(activeChallenge.duration - 1 - i));
      }
      triggerCelebration('challenge');
      Alert.alert('Challenge Completed', `${activeChallenge.name} completed!`);
    }
  }, [activeChallenge, updateChallengeProgress, triggerCelebration]);

  const simulateStreakIncrease = useCallback(() => {
    const updatedHabits = habits.map(h => {
      const newStreak = (h.currentStreak || 0) + 1;
      return {
        ...h,
        currentStreak: newStreak,
        longestStreak: Math.max(h.longestStreak || 0, newStreak),
      };
    });
    saveHabits(updatedHabits);
    if (habits.length > 0) {
      triggerCelebration('streak');
    }
  }, [habits, saveHabits, triggerCelebration]);

  const simulateStreakDecrease = useCallback(() => {
    const updatedHabits = habits.map(h => ({
      ...h,
      currentStreak: Math.max(0, (h.currentStreak || 0) - 1),
    }));
    saveHabits(updatedHabits);
    Alert.alert('Streaks Reduced', 'All habit streaks decreased by 1');
  }, [habits, saveHabits]);

  const simulateMissedHabit = useCallback(() => {
    const updatedHabits = habits.map(h => ({
      ...h,
      currentStreak: 0,
    }));
    saveHabits(updatedHabits);
    Alert.alert('Streak Broken', 'All habit streaks reset to 0 (missed habit)');
  }, [habits, saveHabits]);

  const useStreakFreezeSimulation = useCallback(() => {
    const success = useStreakFreeze();
    if (success) {
      Alert.alert('Streak Freeze Used', `Remaining freezes: ${streakFreezes - 1}`);
    } else {
      Alert.alert('No Freezes', 'No streak freezes available');
    }
  }, [useStreakFreeze, streakFreezes]);

  const toggleOnboarding = useCallback(() => {
    if (onboardingComplete) {
      updatePreference('onboardingComplete', false);
      Alert.alert('Onboarding', 'Onboarding reset - will show on next app launch');
    } else {
      setOnboardingComplete();
      Alert.alert('Onboarding', 'Marked as complete');
    }
  }, [onboardingComplete, setOnboardingComplete, updatePreference]);

  const resetAllData = useCallback(() => {
    Alert.alert(
      'Reset All Data',
      'This will delete all habits, challenges, and achievements. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            saveHabits([]);
            Alert.alert('Reset Complete', 'All habit data cleared');
          },
        },
      ]
    );
  }, [saveHabits]);

  const toggleAllComplete = useCallback(() => {
    habits.forEach(h => {
      if (!todayLogs[h.id]?.completed) {
        toggleHabit(h.id);
      }
    });
    if (getTodayProgress() === 100) {
      triggerCelebration('allComplete');
    }
  }, [habits, todayLogs, toggleHabit, getTodayProgress, triggerCelebration]);

  const Section = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );

  const Button = ({ title, onPress, color = colors.primary, icon = 'play' }) => (
    <TouchableOpacity style={[styles.btn, { backgroundColor: color }]} onPress={onPress}>
      <Ionicons name={icon} size={16} color="#fff" />
      <Text style={styles.btnText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity style={styles.devButton} onPress={() => setVisible(true)}>
        <Ionicons name="construct" size={20} color="#fff" />
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Developer Tools</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
              <Section title="Day Simulation">
                <Button title="Complete Today" onPress={() => simulateDay(0)} icon="today" />
                <Button title="Complete Yesterday" onPress={() => simulateDay(1)} icon="calendar" />
                <Button title="Complete Day 2 ago" onPress={() => simulateDay(2)} icon="calendar-outline" />
              </Section>

              <Section title="Challenge Simulation">
                <Button title="Start 3-Day Challenge" onPress={start3DayChallenge} color="#2196F3" icon="flag" />
                <Button title="Complete Today (Challenge)" onPress={resetChallenge} color="#2196F3" icon="checkmark" />
                <Button title="Complete Challenge" onPress={completeChallenge} color="#4CAF50" icon="trophy" />
              </Section>

              <Section title="Reward/Milestone Simulation">
                <Button title="3-Day Kickstart Reward" onPress={simulate3DayKickstart} color="#FF9800" icon="gift" />
                <Button title="Trigger Streak Celebration" onPress={() => triggerCelebration('streak')} color="#FF5722" icon="flame" />
                <Button title="Trigger All-Complete" onPress={() => triggerCelebration('allComplete')} color="#9C27B0" icon="star" />
              </Section>

              <Section title="Streak Controls">
                <Button title="Increment Streaks" onPress={simulateStreakIncrease} icon="add" />
                <Button title="Decrement Streaks" onPress={simulateStreakDecrease} icon="remove" />
                <Button title="Break All Streaks" onPress={simulateMissedHabit} color="#FF4444" icon="broken-image" />
                <Button title="Use Streak Freeze" onPress={useStreakFreezeSimulation} color="#00BCD4" icon="snow" />
              </Section>

              <Section title="Quick Actions">
                <Button title="Complete All Today" onPress={toggleAllComplete} color="#4CAF50" icon="checkmark-done" />
                <Button title="Toggle Onboarding" onPress={toggleOnboarding} color="#607D8B" icon="refresh" />
                <Button title="Reset All Data" onPress={resetAllData} color="#FF4444" icon="trash" />
              </Section>

              <Section title="Status">
                <View style={styles.statusItem}>
                  <Text style={styles.statusLabel}>Onboarding:</Text>
                  <Text style={styles.statusValue}>{onboardingComplete ? 'Complete' : 'Incomplete'}</Text>
                </View>
                <View style={styles.statusItem}>
                  <Text style={styles.statusLabel}>Active Challenge:</Text>
                  <Text style={styles.statusValue}>{activeChallenge?.name || 'None'}</Text>
                </View>
                <View style={styles.statusItem}>
                  <Text style={styles.statusLabel}>Completed Challenges:</Text>
                  <Text style={styles.statusValue}>{completedChallenges?.length || 0}</Text>
                </View>
                <View style={styles.statusItem}>
                  <Text style={styles.statusLabel}>Streak Freezes:</Text>
                  <Text style={styles.statusValue}>{streakFreezes}</Text>
                </View>
                <View style={styles.statusItem}>
                  <Text style={styles.statusLabel}>Achievements:</Text>
                  <Text style={styles.statusValue}>{achievements?.filter(a => a.unlocked)?.length || 0}/{achievements?.length || 0}</Text>
                </View>
              </Section>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <CelebrationOverlay
        visible={showCelebration}
        type={celebrationType}
        onHide={() => setShowCelebration(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  devButton: {
    position: 'absolute',
    top: 60,
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF5722',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 999,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  btnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    width: '100%',
  },
  statusLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
});