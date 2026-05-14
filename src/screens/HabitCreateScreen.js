import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useHabits } from '../context/HabitsContext';
import { colors } from '../theme/colors';

const habitIcons = [
  { name: 'water', icon: 'water' },
  { name: 'fitness', icon: 'fitness' },
  { name: 'book', icon: 'book' },
  { name: 'code', icon: 'code-slash' },
  { name: 'meditate', icon: 'leaf' },
  { name: 'music', icon: 'musical-notes' },
  { name: 'food', icon: 'restaurant' },
  { name: 'sleep', icon: 'moon' },
];

export default function HabitCreateScreen({ navigation }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('binary');
  const [targetValue, setTargetValue] = useState(1);
  const [selectedColor, setSelectedColor] = useState(colors.habitColors[0]);
  const [selectedIcon, setSelectedIcon] = useState('star');
  const { addHabit } = useHabits();

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }

    addHabit({
      name: name.trim(),
      type,
      targetValue: type === 'volume' ? targetValue : 1,
      color: selectedColor,
      icon: selectedIcon,
    });

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>New Habit</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveBtn}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Habit Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Drink water, Exercise, Read"
            value={name}
            onChangeText={setName}
            placeholderTextColor={colors.textMuted}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Type</Text>
          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[styles.typeBtn, type === 'binary' && styles.typeBtnActive]}
              onPress={() => setType('binary')}
            >
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={type === 'binary' ? '#fff' : colors.textSecondary}
              />
              <Text
                style={[
                  styles.typeText,
                  type === 'binary' && styles.typeTextActive,
                ]}
              >
                Binary
              </Text>
              <Text style={styles.typeHint}>Yes/No</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeBtn, type === 'volume' && styles.typeBtnActive]}
              onPress={() => setType('volume')}
            >
              <Ionicons
                name="remove-circle"
                size={24}
                color={type === 'volume' ? '#fff' : colors.textSecondary}
              />
              <Text
                style={[
                  styles.typeText,
                  type === 'volume' && styles.typeTextActive,
                ]}
              >
                Volume
              </Text>
              <Text style={styles.typeHint}>Counter</Text>
            </TouchableOpacity>
          </View>
        </View>

        {type === 'volume' && (
          <View style={styles.section}>
            <Text style={styles.label}>Daily Target</Text>
            <View style={styles.targetContainer}>
              <TouchableOpacity
                style={styles.targetBtn}
                onPress={() => setTargetValue(Math.max(1, targetValue - 1))}
              >
                <Ionicons name="remove" size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={styles.targetValue}>{targetValue}</Text>
              <TouchableOpacity
                style={styles.targetBtn}
                onPress={() => setTargetValue(targetValue + 1)}
              >
                <Ionicons name="add" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.label}>Color</Text>
          <View style={styles.colorGrid}>
            {colors.habitColors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.colorSelected,
                ]}
                onPress={() => setSelectedColor(color)}
              >
                {selectedColor === color && (
                  <Ionicons name="checkmark" size={20} color="#fff" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Icon</Text>
          <View style={styles.iconGrid}>
            {habitIcons.map((item) => (
              <TouchableOpacity
                key={item.name}
                style={[
                  styles.iconOption,
                  selectedIcon === item.name && styles.iconSelected,
                ]}
                onPress={() => setSelectedIcon(item.name)}
              >
                <Ionicons
                  name={item.icon}
                  size={24}
                  color={selectedIcon === item.name ? colors.primary : colors.textSecondary}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  saveBtn: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 10,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
  },
  section: {
    marginTop: 24,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeBtn: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  typeBtnActive: {
    backgroundColor: colors.primary,
  },
  typeText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
  },
  typeTextActive: {
    color: '#fff',
  },
  typeHint: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  targetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginHorizontal: 40,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: colors.text,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  iconOption: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSelected: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
});