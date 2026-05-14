import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function HabitCard({ habit, todayLog, onToggle, onIncrement, onPress }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const checkAnim = useRef(new Animated.Value(todayLog?.completed ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(checkAnim, {
      toValue: todayLog?.completed ? 1 : 0,
      useNativeDriver: true,
    }).start();
  }, [todayLog?.completed]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const isVolume = habit.type === 'volume';
  const isCompleted = todayLog?.completed;
  const progress = isVolume ? (todayLog?.value || 0) / habit.targetValue : (isCompleted ? 1 : 0);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity
          style={[
            styles.checkbox,
            isCompleted && { backgroundColor: habit.color, borderColor: habit.color },
          ]}
          onPress={onToggle}
        >
          <Animated.View style={{ opacity: checkAnim }}>
            <Ionicons name="checkmark" size={20} color="#fff" />
          </Animated.View>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={[styles.name, isCompleted && styles.nameCompleted]}>
            {habit.name}
          </Text>
          {isVolume && (
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progress * 100}%`, backgroundColor: habit.color },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {todayLog?.value || 0}/{habit.targetValue}
              </Text>
            </View>
          )}
        </View>

        {habit.currentStreak > 0 && (
          <View style={styles.streakBadge}>
            <Ionicons name="flame" size={14} color={colors.secondary} />
            <Text style={styles.streakText}>{habit.currentStreak}</Text>
          </View>
        )}

        {isVolume && !isCompleted && (
          <TouchableOpacity style={styles.incrementBtn} onPress={onIncrement}>
            <Ionicons name="add" size={24} color={habit.color} />
          </TouchableOpacity>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
    ...colors.shadows.md,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  nameCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    marginRight: 10,
    overflow: 'hidden',
    backgroundColor: colors.border,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    width: 35,
    textAlign: 'right',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff7ed',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.streakGlow,
  },
  streakText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.streak,
    marginLeft: 2,
  },
  incrementBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
});