import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import * as Location from 'expo-location';
import BottomNavigation from './components/navigation';
import TopNavigation from './components/top_navigation';
import NotificationPopup from './components/notification';

const MapScreen = () => {
  const [showDialog, setShowDialog] = useState(false);

  const requestLocationPermission = async (type: 'always' | 'once') => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location access was not granted');
        return;
      }

      if (type === 'once') {
        const location = await Location.getCurrentPositionAsync({});
        console.log('Location (once):', location);
      } else {
        const location = await Location.getCurrentPositionAsync({});
        console.log('Location (always):', location);
      }

    } catch (error) {
      console.error('Error requesting location:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TopNavigation />
      
      <View style={styles.content}>
        <Text>Map HEHE</Text>
        <Button title="Show Notification" onPress={() => setShowDialog(true)} />

        <NotificationPopup
          visible={showDialog}
          title='Allow this app to access your location?'
          onAllowAlways={() => {
            setShowDialog(false);
            requestLocationPermission('always');
          }}
          onAllowOnce={() => {
            setShowDialog(false);
            requestLocationPermission('once');
          }}
          onDeny={() => {
            setShowDialog(false);
            console.log('Permission denied');
          }}
        />
      </View>

      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  content: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapScreen;
