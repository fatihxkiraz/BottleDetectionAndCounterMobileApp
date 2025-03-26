import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import ImageView from 'react-native-image-viewing';
import { RouteProp, useRoute } from '@react-navigation/native';
import { InventoryAnalysis } from '@/types/inventory';
import { CategoryCard } from '@/components/CategoryCard';
import { ItemList } from '@/components/ItemList';
import { theme } from '@/styles/theme';
import { exportToExcel } from '@/utils/excelExport';

type RouteParams = {
  Results: {
    analysis: InventoryAnalysis;
    selections: string[];
  };
};

export const ResultsScreen = () => {
  const route = useRoute<RouteProp<RouteParams, 'Results'>>();
  const { analysis, selections } = route.params;
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);

  const images = analysis.image ? [
    {
      uri: `data:image/jpeg;base64,${analysis.image}`,
    }
  ] : [];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Scan Results</Text>
          <TouchableOpacity 
            style={styles.exportButton}
            onPress={() => exportToExcel(analysis)}
          >
            <Text style={styles.exportButtonText}>Export</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.totalCount}>{analysis.totalCount} items detected</Text>
        {selections.length > 0 && (
          <View style={styles.selectionsContainer}>
            <Text style={styles.selectionsTitle}>Filtered by:</Text>
            <View style={styles.selectionTags}>
              {selections.map((selection) => (
                <View key={selection} style={styles.selectionTag}>
                  <Text style={styles.selectionText}>{selection}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      {analysis.image && (
        <>
          <TouchableOpacity 
            onPress={() => setIsImageViewVisible(true)}
            activeOpacity={0.9}
          >
            <Image
              source={{ uri: `data:image/jpeg;base64,${analysis.image}` }}
              style={styles.resultImage}
              resizeMode="contain"
            />
            <Text style={styles.tapToZoom}>Tap to zoom</Text>
          </TouchableOpacity>

          <ImageView
            images={images}
            imageIndex={0}
            visible={isImageViewVisible}
            onRequestClose={() => setIsImageViewVisible(false)}
            swipeToCloseEnabled={true}
            doubleTapToZoomEnabled={true}
          />
        </>
      )}

      <View style={styles.categories}>
        {Object.entries(analysis.categories).map(([category, count]) => (
          <CategoryCard
            key={category}
            title={category}
            count={count}
          />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Identified Items</Text>
        <ItemList items={analysis.items} />
      </View>

      {analysis.error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{analysis.error}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.l,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  totalCount: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  exportButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: 8,
  },
  exportButtonText: {
    color: theme.colors.white,
    fontWeight: '600',
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: theme.spacing.m,
    justifyContent: 'space-between',
  },
  section: {
    padding: theme.spacing.m,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.m,
  },
  errorContainer: {
    margin: theme.spacing.m,
    padding: theme.spacing.m,
    backgroundColor: theme.colors.error,
    borderRadius: 12,
  },
  errorText: {
    color: theme.colors.white,
    fontSize: 16,
  },
  resultImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#f0f0f0',
    marginBottom: theme.spacing.m,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.m,
    backgroundColor: theme.colors.white,
    marginBottom: theme.spacing.s,
    borderRadius: 8,
  },
  itemName: {
    fontSize: 16,
    color: theme.colors.text,
  },
  itemConfidence: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  tapToZoom: {
    position: 'absolute',
    bottom: theme.spacing.m + 4,
    right: theme.spacing.m,
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: theme.colors.white,
    padding: theme.spacing.s,
    borderRadius: 4,
    fontSize: 12,
  },
  selectionsContainer: {
    marginTop: theme.spacing.m,
  },
  selectionsTitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.s,
  },
  selectionTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.s,
  },
  selectionTag: {
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: 16,
  },
  selectionText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});