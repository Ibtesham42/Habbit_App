import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useChallenges } from '../context/ChallengesContext';
import { useUser } from '../context/UserContext';
import { colors } from '../theme/colors';
import { CHALLENGES } from '../data/challenges';

export default function ChallengeSetupScreen({ navigation }) {
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const { startChallenge } = useChallenges();
  const { setOnboardingComplete } = useUser();

  const handleJoinChallenge = () => {
    if (selectedChallenge) {
      startChallenge(selectedChallenge);
      setOnboardingComplete();
      navigation.replace('Main');
    }
  };

  const handleSkip = () => {
    setOnboardingComplete();
    navigation.replace('Main');
  };

  const renderChallenge = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.challengeCard,
        selectedChallenge === item.id && { borderColor: item.color, borderWidth: 3 },
      ]}
      onPress={() => setSelectedChallenge(item.id)}
    >
      <Text style={styles.badge}>{item.badge}</Text>
      <View style={styles.challengeInfo}>
        <Text style={styles.challengeName}>{item.name}</Text>
        <Text style={styles.challengeDesc}>{item.description}</Text>
        <Text style={[styles.duration, { color: item.color }]}>
          {item.duration} days
        </Text>
      </View>
      {selectedChallenge === item.id && (
        <Ionicons name="checkmark-circle" size={28} color={item.color} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your First Challenge</Text>
        <Text style={styles.subtitle}>
          Join a challenge to build early momentum and stay motivated
        </Text>
      </View>

      <FlatList
        data={CHALLENGES}
        keyExtractor={(item) => item.id}
        renderItem={renderChallenge}
        contentContainerStyle={styles.list}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.joinBtn, !selectedChallenge && styles.joinBtnDisabled]}
          onPress={handleJoinChallenge}
          disabled={!selectedChallenge}
        >
          <Text style={styles.joinBtnText}>Join Challenge</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
          <Text style={styles.skipBtnText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  challengeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  badge: {
    fontSize: 40,
    marginRight: 16,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  challengeDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  duration: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 6,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  joinBtn: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  joinBtnDisabled: {
    backgroundColor: colors.border,
  },
  joinBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  skipBtn: {
    alignItems: 'center',
    marginTop: 15,
  },
  skipBtnText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});