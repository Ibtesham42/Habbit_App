import { getToday, isConsecutiveDay } from './dateUtils';

export const calculateStreak = (completedDates) => {
  if (!completedDates || completedDates.length === 0) return 0;

  const sorted = [...completedDates].sort().reverse();
  const today = getToday();

  let streak = 0;
  let checkDate = today;

  if (!sorted.includes(today)) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    checkDate = yesterday.toISOString().split('T')[0];

    if (!sorted.includes(checkDate)) {
      return 0;
    }
  }

  while (sorted.includes(checkDate)) {
    streak++;
    const prevDate = new Date(checkDate);
    prevDate.setDate(prevDate.getDate() - 1);
    checkDate = prevDate.toISOString().split('T')[0];
  }

  return streak;
};

export const getLongestStreak = (completedDates) => {
  if (!completedDates || completedDates.length === 0) return 0;

  const sorted = [...completedDates].sort();
  let longest = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    if (isConsecutiveDay(sorted[i - 1], sorted[i])) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }

  return longest;
};

export const getCompletionRate = (completedDates, totalDays = 7) => {
  if (!completedDates || completedDates.length === 0) return 0;

  const today = getToday();
  const dates = [];

  for (let i = totalDays - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }

  const completed = completedDates.filter(d => dates.includes(d)).length;
  return Math.round((completed / totalDays) * 100);
};