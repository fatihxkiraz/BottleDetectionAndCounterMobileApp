import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { DetectedItem } from '@/types/inventory';
import { theme } from '@/styles/theme';
import { getCategoryColor } from '@/utils/colors';

interface ItemListProps {
  items: DetectedItem[];
}

export const ItemList = ({ items }: ItemListProps) => (
  <View style={styles.container}>
    {items.map((item) => (
      <View key={item.id} style={styles.item}>
        <View style={styles.itemHeader}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={[styles.badge, { backgroundColor: getCategoryColor(item.category) }]}>
            <Text style={styles.badgeText}>{item.category}</Text>
          </View>
        </View>
        {item.confidence && (
          <Text style={styles.brand}>
            {(item.confidence * 100).toFixed(1)}% confidence
          </Text>
        )}
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  item: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  brand: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: theme.colors.white,
  },
});