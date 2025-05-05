import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, ActivityIndicator, Linking } from 'react-native';

import BottomNavigation from './components/navigation';
import TopNavigation from './components/top_navigation';
import { useTheme } from './contexts/ThemeContext';
import { apiFetch } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface Exhibition {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number | string;
  website: string;
  gmaps: string;
  summary: { languageCode: string; text: string } | null;
}

const MapScreen = () => {
  // const [location, setLocation] = useState<LocationObject | null>(null);
  const [nearbyExhibitions, setNearbyExhibitions] = useState<Exhibition[]>([]); // Explicitly type
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [loadingExhibitions, setLoadingExhibitions] = useState(true);
  const { theme } = useTheme();
  const styles = theme === 'dark' ? darkStyles : lightStyles;
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // const getPermissionsAndLocation = async () => {
    //   let { status } = await Location.requestForegroundPermissionsAsync();
    //   if (status !== 'granted') {
    //     Alert.alert('Permission denied', 'Location access was not granted');
    //     setLoadingLocation(false);
    //     return;
    //   }

    //   try {
    //     let currentLocation = await Location.getCurrentPositionAsync({});
    //     setLocation(currentLocation);
    //   } catch (error) {
    //     console.error('Error getting current location:', error);
    //     Alert.alert('Error', 'Failed to get current location.');
    //   } finally {
    //     setLoadingLocation(false);
    //   }
    // };

    // getPermissionsAndLocation();
  }, []);

  useEffect(() => {
    // const fetchExhibitions = async () => {
    //   if (location) {
    //     try {
    //       const storedToken = await AsyncStorage.getItem('token');
    //       if (!storedToken) {
    //         console.error('No token found');
    //         setLoadingExhibitions(false);
    //         return;
    //       }
    //       setToken(storedToken);

    //       const response = await apiFetch<Exhibition[]>( // Explicitly type response data
    //         `/map/nearby-exhibitions?lat=${location.coords.latitude}&lng=${location.coords.longitude}`
    //       );
    //       if (response.status >= 200 && response.status < 300) {
    //         setNearbyExhibitions(response.data);
    //       } else {
    //         console.error('Failed to fetch nearby exhibitions:', response.status);
    //         Alert.alert('Error', 'Failed to fetch nearby exhibitions.');
    //       }
    //     } catch (error) {
    //       console.error('Error fetching exhibitions:', error);
    //       Alert.alert('Error', 'Failed to fetch nearby exhibitions.');
    //     } finally {
    //       setLoadingExhibitions(false);
    //     }
    //   }
    // };

    // fetchExhibitions();
  }, [location]);

  return (
    <View style={styles.container}>
      <TopNavigation />

      <View style={styles.content}>
        <Text style={styles.header}>Map HEHE</Text>

        {/* <View style={styles.mapContainer}>
          {loadingLocation || loadingExhibitions ? (
            <ActivityIndicator size="large" />
          ) : location ? (
            <MapView
              style={styles.map}
              initialCamera={{
                center: {
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                },
                zoom: 14,
              }}
            >
              <MapView.Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="Your Location"
              />
              {nearbyExhibitions.map((exhibition) => (
                <MapView.Marker
                  key={exhibition.id}
                  coordinate={{
                    latitude: exhibition.latitude,
                    longitude: exhibition.longitude,
                  }}
                  title={exhibition.name}
                  description={exhibition.address}
                  onPress={() => {
                    Alert.alert(
                      exhibition.name,
                      `${exhibition.address}\nRating: ${exhibition.rating}\nWebsite: ${exhibition.website}`,
                      [
                        { text: 'Open in Maps', onPress: () => Linking.openURL(exhibition.gmaps) },
                        { text: 'Cancel', style: 'cancel' },
                      ]
                    );
                  }}
                />
              ))}
            </MapView>
          ) : (
            <Text style={styles.errorText}>Location not available.</Text>
          )}
        </View> */}
      </View>

      <BottomNavigation />
    </View>
  );
};

const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  header: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  mapContainer: {
    width: '100%',
    height: 400,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 20,
  },
  map: {
    flex: 1,
  },
  errorText: {
    color: 'red',
    marginTop: 20,
  },

});

const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  header: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  mapContainer: {
    width: '100%',
    height: 400,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 20,
  },
  map: {
    flex: 1,
  },
  errorText: {
    color: '#ff4d4d',
    marginTop: 20,
  },

});

export default MapScreen;