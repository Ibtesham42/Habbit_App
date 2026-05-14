import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { usePersistence } from '../hooks/usePersistence';
import { getToday, isConsecutiveDay } from '../utils/dateUtils';
import { calculateStreak, getLongestStreak } from '../utils/streakCalculator';
import { colors } from '../theme/colors';

const HabitsContext = createContext();

const defaultHabits = [
  { id: '1', name: 'Drink water', type: 'volume', targetValue: 8, currentValue: 0, completed: false, color: colors.habitColors[0], icon: 'water', createdAt: getToday(), completedDates: [], currentStreak: 0, longestStreak: 0 },
  { id: '2', name: 'Exercise', type: 'binary', targetValue: 1, currentValue: 0, completed: false, color: colors.habitColors[1], icon: 'fitness', createdAt: getToday(), completedDates: [], currentStreak: 0, longestStreak: 0 },
  { id: '3', name: 'Read', type: 'binary', targetValue: 1, currentValue: 0, completed: false, color: colors.habitColors[2], icon: 'book', createdAt: getToday(), completedDates: [], currentStreak: 0, longestStreak: 0 },
];

const getDefaultColor = (index) => colors.habitColors[index % colors.habitColors.length];

export function HabitsProvider({ children }) {
  const { data: habits, loading, saveData } = usePersistence('@habits', defaultHabits);
  const [todayLogs, setTodayLogs] = useState({});

  useEffect(() => {
    if (!loading) {
      const logs = {};
      habits.forEach(habit => {
        logs[habit.id] = { value: 0, completed: false };
      });
      setTodayLogs(logs);
    }
  }, [loading, habits]);

  const addHabit = useCallback((habitData) => {
    const newHabit = {
      id: Date.now().toString(),
      name: habitData.name,
      type: habitData.type || 'binary',
      targetValue: habitData.targetValue || 1,
      currentValue: 0,
      completed: false,
      color: habitData.color || getDefaultColor(habits.length),
      icon: habitData.icon || 'star',
      createdAt: getToday(),
      completedDates: [],
      currentStreak: 0,
      longestStreak: 0,
    };
    saveData([...habits, newHabit]);
    return newHabit;
  }, [habits, saveData]);

  const updateHabit = useCallback((id, updates) => {
    saveData(habits.map(h => h.id === id ? { ...h, ...updates } : h));
  }, [habits, saveData]);

  const deleteHabit = useCallback((id) => {
    saveData(habits.filter(h => h.id !== id));
  }, [habits, saveData]);

  const toggleHabit = useCallback((id) => {
    const today = getToday();
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const isCompleted = !todayLogs[id]?.completed;
    const completedDates = isCompleted
      ? [...habit.completedDates, today]
      : habit.completedDates.filter(d => d !== today);

    const newStreak = calculateStreak(completedDates);
    const longestStreak = Math.max(habit.longestStreak, newStreak);

    saveData(habits.map(h => {
      if (h.id === id) {
        return {
          ...h,
          completed: isCompleted,
          completedDates,
          currentStreak: newStreak,
          longestStreak,
        };
      }
      return h;
    }));

    setTodayLogs(prev => ({
      ...prev,
      [id]: { value: isCompleted ? habit.targetValue : 0, completed: isCompleted },
    }));
  }, [habits, todayLogs, saveData]);

  const incrementHabit = useCallback((id) => {
    const habit = habits.find(h => h.id === id);
    if (!habit || !todayLogs[id]?.completed) return;

    const newValue = Math.min((todayLogs[id]?.value || 0) + 1, habit.targetValue);
    const isComplete = newValue >= habit.targetValue;

    setTodayLogs(prev => ({
      ...prev,
      [id]: { value: newValue, completed: isComplete },
    }));

    if (isComplete && !todayLogs[id]?.completed) {
      const today = getToday();
      if (!habit.completedDates.includes(today)) {
        const completedDates = [...habit.completedDates, today];
        const newStreak = calculateStreak(completedDates);
        const longestStreak = Math.max(habit.longestStreak, newStreak);

        saveData(habits.map(h => {
          if (h.id === id) {
            return { ...h, completed: true, completedDates, currentStreak: newStreak, longestStreak };
          }
          return h;
        }));
      }
    }
  }, [habits, todayLogs, saveData]);

  const resetToday = useCallback(() => {
    const logs = {};
    habits.forEach(habit => {
      logs[habit.id] = { value: 0, completed: false };
    });
    setTodayLogs(logs);
    saveData(habits.map(h => ({ ...h, completed: false })));
  }, [habits, saveData]);

  const getTodayProgress = useCallback(() => {
    const total = habits.length;
    const completed = habits.filter(h => todayLogs[h.id]?.completed).length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }, [habits, todayLogs]);

  const value = {
    habits,
    todayLogs,
    loading,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabit,
    incrementHabit,
    resetToday,
    getTodayProgress,
  };

  return (
    <HabitsContext.Provider value={value}>
      {children}
    </HabitsContext.Provider>
  );
}

export const useHabits = () => {
  const context = useContext(HabitsContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitsProvider');
  }
  return context;
};