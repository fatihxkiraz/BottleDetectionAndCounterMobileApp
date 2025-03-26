import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button } from '@/components/Button';
import { theme } from '@/styles/theme';
import { detectItems } from '@/services/api';

import { CameraView, useCameraPermissions } from 'expo-camera';


export const CameraScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const route = useRoute();
  const selections = (route.params as any)?.selections || [];

  const cameraRef = useRef<CameraView | null>(null);
  const navigation = useNavigation();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Camera access needed to scan your drink cabinet</Text>
        <Button 
          title="Grant Permission"
          onPress={requestPermission}
        />
      </View>
    );
  }

  const processImage = async (uri: string) => {
    try {
      setIsProcessing(true);
      const processedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1080 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      const analysis = await detectItems(processedImage.uri, selections);
      // @ts-ignore
      navigation.navigate('Results' as never, { analysis, selections } as never);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  const takePicture = async () => {
    if (isProcessing || !cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync();
      await processImage(photo!.uri);
    } catch (error) {
      Alert.alert('Error', 'Failed to take picture');
    }
  };

  const pickImage = async () => {
    if (isProcessing) return;
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      await processImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={'back'}
      >
        <View style={styles.overlay}>
          <Text style={styles.hint}>Position your drink cabinet in frame</Text>
          <View style={styles.buttonContainer}>
            <Button
              title={isProcessing ? 'Processing...' : 'Capture'}
              onPress={takePicture}
              disabled={isProcessing}
              style={styles.button}
            />
            <Button
              title="Upload from Library"
              onPress={pickImage}
              disabled={isProcessing}
              style={StyleSheet.flatten([styles.button, styles.uploadButton])}
              textStyle={styles.uploadButtonText}
            />
          </View>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'space-between',
    padding: theme.spacing.xl,
  },
  hint: {
    color: theme.colors.white,
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: theme.spacing.m,
    borderRadius: 8,
    marginTop: theme.spacing.xl,
  },
  buttonContainer: {
    gap: theme.spacing.m,
    marginBottom: theme.spacing.xl,
  },
  button: {
    marginBottom: 0,
  },
  uploadButton: {
    backgroundColor: theme.colors.white,
  },
  uploadButtonText: {
    color: theme.colors.primary,
  },
  message: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.l,
    padding: theme.spacing.m,
  },
});