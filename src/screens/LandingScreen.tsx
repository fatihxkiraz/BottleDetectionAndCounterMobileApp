import React, { useState } from 'react';
import { StyleSheet, View, Text, ImageBackground, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Camera, useCameraPermissions } from 'expo-camera';
import { Button } from '@/components/Button';
import { theme } from '@/styles/theme';
import { detectItems } from '@/services/api';

const DRINK_OPTIONS = [
  'Coca-Cola Kutu', "Coca-Cola Sise", "Coca-Cola Cam", "Fanta Sise", 
  "Fanta Kutu", "Sprite Sise", "Sprite Kutu", "FuseTea Sise", "FuseTea Kutu" 
];

export const LandingScreen = () => {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDrinks, setSelectedDrinks] = useState<string[]>([]);

  const handleDirectScan = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (granted) {
        navigation.navigate('Camera' as never);
      }
    } else {
      navigation.navigate('Camera' as never);
    }
  };

  const handleSubmitSelection = () => {
    setModalVisible(false);
    // @ts-ignore
    navigation.navigate('Camera' as never, { selections: selectedDrinks } as never);
  };

  const handleSelectionFlow = () => {
    setModalVisible(true);
  };

  const toggleDrinkSelection = (drink: string) => {
    setSelectedDrinks(prev => 
      prev.includes(drink) 
        ? prev.filter(d => d !== drink)
        : [...prev, drink]
    );
  };


  return (
    <ImageBackground
      source={require('@/assets/background.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Welcome to{'\n'}Drink Cabinet Counter</Text>
          <Text style={styles.subtitle}>
            Scan your drink cabinet to get an instant inventory of your collection
          </Text>
          <Button
            title="Scan Directly"
            onPress={handleDirectScan}
            style={styles.button}
          />
          <Button
            title="Scan Selection"
            onPress={handleSelectionFlow}
            // @ts-ignore
            style={[styles.button, styles.secondaryButton]}
          />
        </View>
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Your Drinks</Text>
            <ScrollView style={styles.optionsList}>
              {DRINK_OPTIONS.map((drink) => (
                <TouchableOpacity
                  key={drink}
                  style={[
                    styles.optionItem,
                    selectedDrinks.includes(drink) && styles.selectedOption
                  ]}
                  onPress={() => toggleDrinkSelection(drink)}
                >
                  <Text style={styles.optionText}>{drink}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => setModalVisible(false)}
                style={styles.modalButton}
              />
              <Button
                title="Submit"
                onPress={handleSubmitSelection}
                style={styles.modalButton}
                disabled={selectedDrinks.length === 0}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: theme.spacing.l,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: 24,
  },
  button: {
    width: '100%',
    maxWidth: 300,
  },
  secondaryButton: {
    marginTop: theme.spacing.m,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    padding: theme.spacing.l,
    width: '80%',
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: theme.spacing.m,
    textAlign: 'center',
  },
  optionsList: {
    marginVertical: theme.spacing.m,
  },
  optionItem: {
    padding: theme.spacing.m,
    borderBottomWidth: 1,
    // @ts-ignore
    borderBottomColor: theme.colors.border,
  },
  selectedOption: {
    backgroundColor: theme.colors.primary + '20',
  },
  optionText: {
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.m,
    gap: theme.spacing.s,
  },
  modalButton: {
   },
});