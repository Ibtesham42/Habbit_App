# CLAUDE.md

## Project Overview

**Habit Tracker** - Expo/React Native mobile app for building daily habits through challenges, streaks, and rewards.

## Tech Stack

- **Runtime**: Expo SDK 54, React Native 0.81.5
- **Navigation**: React Navigation v7 (native-stack + bottom-tabs)
- **State**: React Context API with usePersistence hooks
- **Storage**: @react-native-async-storage/async-storage
- **Animation**: react-native-reanimated, expo-haptics

## Architecture

```
App.js                    # Entry with providers + DevPanel overlay
src/
├── navigation/           # RootNavigator, MainTabs
├── screens/              # 9 screens (Onboarding, Dashboard, Analytics, etc.)
├── components/           # HabitCard, ProgressRing, CelebrationOverlay, DevPanel
├── context/              # HabitsContext, ChallengesContext, UserContext
├── hooks/                # usePersistence
├── theme/                # colors (palette + shadow system)
├── utils/                # dateUtils, streakCalculator, responsive
└── data/                 # challenges, achievements definitions
```

## State Management

### HabitsContext
- Manages habits array, todayLogs, completion tracking
- Methods: addHabit, toggleHabit, incrementHabit, resetToday
- Streaks calculated via streakCalculator utility

### ChallengesContext
- Active/completed challenges, achievements tracking
- Methods: startChallenge, updateChallengeProgress, checkAchievements

### UserContext
- Preferences: notifications, sound, haptics, streakFreezes
- onboardingComplete flag controls flow

## Challenge & Reward Flow

1. **Onboarding** → 4-step walkthrough explaining features
2. **Challenge Setup** → Select 3/7/21/30 day challenge
3. **Daily Tracking** → Toggle habits, build streaks
4. **Challenge Completion** → Triggers celebration overlay, updates achievements

## Responsive Design

Use `src/utils/responsive.js` for device-aware styling:
- `isSmallPhone` / `isTablet` breakpoints
- `spacing`, `fontSize`, `borderRadius`, `iconSize` scale objects

## Developer Testing

**DevPanel** - Orange button (top-right). Contains:
- Day simulation (complete today/yesterday/past dates)
- Challenge simulation (start/complete challenges)
- Reward triggers (streak milestone, all-complete, challenge complete)
- Streak controls (increment/decrement/break)
- Quick actions (toggle onboarding, reset data)
- Status display (onboarding, challenges, achievements)

## Design System

`src/theme/colors.js` exports:
- Primary palette (green-based)
- Semantic colors (streak=orange, reward=purple, info=blue)
- Shadow presets: `sm`, `md`, `lg`, `xl`
- Progress gradient: 0→25→50→75→100

## Commands

```bash
npm start        # Metro bundler
npm run web      # Browser preview
npm run android  # Android build
```

## Known Constraints

- Package version warnings (expo-haptics, react-native-reanimated) - app functions but should update
- No dark mode implementation yet
- No authentication or cloud sync