import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const usePersistence = (key, initialValue) => {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = await AsyncStorage.getItem(key);
        if (stored !== null) {
          setData(JSON.parse(stored));
        }
      } catch (error) {
        console.error(`Error loading ${key}:`, error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [key]);

  const saveData = useCallback(async (newData) => {
    try {
      setData(newData);
      await AsyncStorage.setItem(key, JSON.stringify(newData));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  }, [key]);

  const clearData = useCallback(async () => {
    try {
      setData(initialValue);
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error clearing ${key}:`, error);
    }
  }, [key, initialValue]);

  return { data, loading, saveData, clearData };
};