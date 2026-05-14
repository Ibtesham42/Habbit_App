import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { usePersistence } from '../hooks/usePersistence';
import { getToday, getDaysInRange } from '../utils/dateUtils';
import { CHALLENGES } from '../data/challenges';
import { ACHIEVEMENTS } from '../data/achievements';

const ChallengesContext = createContext();

export function ChallengesProvider({ children }) {
  const { data: challenges, saveData: saveChallenges } = usePersistence('@challenges', { activeChallenge: null, completedChallenges: [] });
  const { data: achievements, saveData: saveAchievements } = usePersistence('@achievements', []);

  const startChallenge = useCallback((challengeId) => {
    const challenge = CHALLENGES.find(c => c.id === challengeId);
    if (!challenge) return;

    const activeChallenge = {
      ...challenge,
      startDate: getToday(),
      progress: 0,
      completedDates: [],
      habitIds: [],
    };
    saveChallenges({ ...challenges, activeChallenge });
  }, [challenges, saveChallenges]);

  const updateChallengeProgress = useCallback((date = getToday()) => {
    if (!challenges.activeChallenge) return;

    const { activeChallenge } = challenges;
    if (activeChallenge.completedDates.includes(date)) return;

    const completedDates = [...activeChallenge.completedDates, date];
    const progress = Math.round((completedDates.length / activeChallenge.duration) * 100);
    const isComplete = completedDates.length >= activeChallenge.duration;

    if (isComplete) {
      saveChallenges({
        ...challenges,
        activeChallenge: null,
        completedChallenges: [
          ...challenges.completedChallenges,
          { ...activeChallenge, completedDates, progress: 100, completedAt: getToday() }
        ],
      });
      checkAchievements('challengesCompleted');
    } else {
      saveChallenges({
        ...challenges,
        activeChallenge: { ...activeChallenge, completedDates, progress },
      });
    }
  }, [challenges, saveChallenges]);

  const checkAchievements = useCallback((type, value = 1) => {
    const currentAchievements = achievements.map(a => a.id);

    ACHIEVEMENTS.forEach(achievement => {
      if (currentAchievements.includes(achievement.id)) return;
      if (achievement.requirement.type !== type) return;
      if (value >= achievement.requirement.value) {
        saveAchievements([...achievements, { ...achievement, unlockedAt: getToday() }]);
      }
    });
  }, [achievements, saveAchievements]);

  const getAchievements = useCallback(() => {
    return ACHIEVEMENTS.map(a => {
      const unlocked = achievements.find(u => u.id === a.id);
      return { ...a, unlocked: !!unlocked, unlockedAt: unlocked?.unlockedAt };
    });
  }, [achievements]);

  const value = {
    activeChallenge: challenges.activeChallenge,
    completedChallenges: challenges.completedChallenges,
    achievements: getAchievements(),
    startChallenge,
    updateChallengeProgress,
    checkAchievements,
  };

  return (
    <ChallengesContext.Provider value={value}>
      {children}
    </ChallengesContext.Provider>
  );
}

export const useChallenges = () => {
  const context = useContext(ChallengesContext);
  if (!context) {
    throw new Error('useChallenges must be used within a ChallengesProvider');
  }
  return context;
};