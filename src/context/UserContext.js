import React, { createContext, useContext, useState, useCallback } from 'react';
import { usePersistence } from '../hooks/usePersistence';

const UserContext = createContext();

const defaultPrefs = {
  onboardingComplete: false,
  notificationsEnabled: true,
  reminderTime: '09:00',
  soundEnabled: true,
  hapticsEnabled: true,
  streakFreezes: 2,
};

export function UserProvider({ children }) {
  const { data: prefs, saveData } = usePersistence('@userPrefs', defaultPrefs);

  const setOnboardingComplete = useCallback(() => {
    saveData({ ...prefs, onboardingComplete: true });
  }, [prefs, saveData]);

  const updatePreference = useCallback((key, value) => {
    saveData({ ...prefs, [key]: value });
  }, [prefs, saveData]);

  const useStreakFreeze = useCallback(() => {
    if (prefs.streakFreezes > 0) {
      saveData({ ...prefs, streakFreezes: prefs.streakFreezes - 1 });
      return true;
    }
    return false;
  }, [prefs, saveData]);

  const value = {
    ...prefs,
    setOnboardingComplete,
    updatePreference,
    useStreakFreeze,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};