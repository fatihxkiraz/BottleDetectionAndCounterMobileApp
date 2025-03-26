import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { theme } from '@/styles/theme';

interface CategoryCardProps {
  title: string;
  count: number;
}

export const CategoryCard = ({ title, count }: CategoryCardProps) => (
  <View style={styles.container}>
    <Text style={styles.count}>{count}</Text>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    margin: 4,
  },
  count: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    color: theme.colors.text,
    textTransform: 'capitalize',
  },
});