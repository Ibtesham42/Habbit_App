# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **Expo/React Native** mobile application - a Habit Tracker app with full feature set including onboarding, challenges, streaks, analytics, achievements, and retention hooks.

## Tech Stack

- **Framework**: Expo SDK 54
- **Runtime**: React Native 0.81.5
- **Navigation**: React Navigation v7 (native-stack + bottom-tabs)
- **State**: React Context API with usePersistence hooks
- **Storage**: @react-native-async-storage/async-storage
- **Animation**: react-native-reanimated

## Commands

```bash
# Install dependencies (after package.json changes)
npm install

# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## Architecture

```
App.js                    # Entry point with providers
src/
├── navigation/           # RootNavigator, MainTabs
├── screens/              # 7 screens (Onboarding, Dashboard, HabitCreate, etc.)
├── components/           # HabitCard, ProgressRing, CelebrationOverlay
├── context/              # HabitsContext, ChallengesContext, UserContext
├── hooks/                # usePersistence
├── services/             # notificationService
├── data/                 # challenges.js, achievements.js
├── utils/                # dateUtils, streakCalculator
└── theme/                # colors.js
```

### Context Providers

- **HabitsContext**: Manages habits, completion tracking, streaks, persistence
- **ChallengesContext**: Active/completed challenges, achievements
- **UserContext**: Preferences, onboarding state, notifications settings

### Screens

1. OnboardingScreen - Welcome flow with feature highlights
2. ChallengeSetupScreen - Choose initial challenge
3. DashboardScreen - Today's habits with progress ring
4. HabitCreateScreen - Binary/volume habit creation
5. HabitDetailScreen - Habit stats and history
6. ActiveChallengeScreen - Challenge progress tracking
7. AnalyticsScreen - Charts, streaks, leaderboard
8. RewardsScreen - Achievements and badges
9. SettingsScreen - Preferences and streak protection