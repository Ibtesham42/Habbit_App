import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

export default function CelebrationOverlay({ visible, type, onHide }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(confettiAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => onHide());
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const getContent = () => {
    switch (type) {
      case 'streak':
        return {
          icon: 'flame',
          title: 'Streak Milestone!',
          subtitle: 'Amazing consistency! Keep it going!',
          color: colors.secondary,
        };
      case 'allComplete':
        return {
          icon: 'trophy',
          title: 'All Done!',
          subtitle: 'You completed all habits today!',
          color: colors.primary,
        };
      case 'achievement':
        return {
          icon: 'medal',
          title: 'Achievement Unlocked!',
          subtitle: 'You earned a new badge!',
          color: '#FFD700',
        };
      default:
        return {
          icon: 'checkmark-circle',
          title: 'Great Job!',
          subtitle: 'Keep up the good work!',
          color: colors.primary,
        };
    }
  };

  if (!visible) return null;

  const content = getContent();

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ scale: scaleAnim }],
              borderColor: content.color,
            },
          ]}
        >
          <View style={[styles.iconContainer, { backgroundColor: content.color }]}>
            <Ionicons name={content.icon} size={50} color="#fff" />
          </View>
          <Text style={styles.title}>{content.title}</Text>
          <Text style={styles.subtitle}>{content.subtitle}</Text>
        </Animated.View>

        <Animated.View style={[styles.confetti, { opacity: confettiAnim }]}>
          {[...Array(20)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.confettiPiece,
                {
                  left: Math.random() * width,
                  backgroundColor: [
                    colors.primary,
                    colors.secondary,
                    '#FFD700',
                    '#9C27B0',
                  ][Math.floor(Math.random() * 4)],
                  transform: [{ rotate: Math.random() * 360 + 'deg' }],
                },
              ]}
            />
          ))}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    borderWidth: 3,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  confetti: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  confettiPiece: {
    position: 'absolute',
    top: -20,
    width: 10,
    height: 10,
    borderRadius: 2,
  },
});