import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useUser } from '../context/UserContext';

import OnboardingScreen from '../screens/OnboardingScreen';
import ChallengeSetupScreen from '../screens/ChallengeSetupScreen';
import MainTabs from './MainTabs';
import HabitCreateScreen from '../screens/HabitCreateScreen';
import HabitDetailScreen from '../screens/HabitDetailScreen';
import ActiveChallengeScreen from '../screens/ActiveChallengeScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { onboardingComplete } = useUser();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {!onboardingComplete ? (
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="ChallengeSetup" component={ChallengeSetupScreen} />
          </>
        ) : null}
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen
          name="HabitCreate"
          component={HabitCreateScreen}
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="HabitDetail"
          component={HabitDetailScreen}
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen
          name="ActiveChallenge"
          component={ActiveChallengeScreen}
          options={{ presentation: 'fullScreenModal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}