import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { HabitsProvider } from './src/context/HabitsContext';
import { ChallengesProvider } from './src/context/ChallengesContext';
import { UserProvider } from './src/context/UserContext';
import RootNavigator from './src/navigation/RootNavigator';
import DevPanel from './src/components/DevPanel';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <UserProvider>
          <HabitsProvider>
            <ChallengesProvider>
              <RootNavigator />
              <StatusBar style="dark" />
              <DevPanel />
            </ChallengesProvider>
          </HabitsProvider>
        </UserProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}