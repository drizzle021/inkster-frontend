import React, { useState, useEffect } from 'react';
import MapView, { PROVIDER_DEFAULT, Region, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigation from './components/navigation';
import TopNavigation from './components/top_navigation';
import { useTheme } from './contexts/ThemeContext';
import { apiFetch } from './api';
import { useRouter } from 'expo-router';
import { SheetManager } from 'react-native-actions-sheet';

type Exhibition = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number | string;
  website: string | undefined;
  gmaps: string;
  directions_link: string;
  summary: {
    text?: string;
    languageCode?: string;
  };
};

type LocationType = {
  coords: {
    latitude: number;
    longitude: number;
    altitude?: number | null;
    accuracy?: number | null;
    heading?: number | null;
    speed?: number | null;
  };
  timestamp: number;
};



const MapScreen = () => {
  const { theme } = useTheme();
  const styles = theme === 'dark' ? darkStyles : lightStyles;
  const router = useRouter();
  const [region, setRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<LocationType | null>(null);
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
 
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location access is required to show the map.');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setLoading(false);
      setLocation(location);
    })();
  }, []);


  useEffect(() => {
    if (!location) return;
  
    const fetchExhibitions = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          await AsyncStorage.removeItem('token');
          router.push('/auth/login');
          return;
        }
  
        const { latitude, longitude } = location.coords;
  
        const response = await apiFetch(
          `/map/nearby-exhibitions?lat=${latitude}&lng=${longitude}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        setExhibitions(response.data);
        console.log(response.data)
      } catch (err: any) {
        console.error('Error fetching exhibitions:', err.message || err);
      }
    };
  
    fetchExhibitions();
  }, [location]);
  

  return (
    <View style={styles.container}>
      <TopNavigation />

      <View style={styles.content}>
        {loading || !region ? (
          <ActivityIndicator size="large" color="#7B61FF" />
        ) : (
          <MapView
            style={styles.map}
            provider={PROVIDER_DEFAULT}
            region={region}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {exhibitions.map((exhibition) => (
              <Marker
                key={exhibition.id}
                coordinate={{
                  latitude: exhibition.latitude,
                  longitude: exhibition.longitude,
                }}
                title={exhibition.name}
                description={exhibition.address}
                onCalloutPress={() => {
                  SheetManager.show('exhibition-details', {
                    payload: exhibition,
                  });
                }}
              />
            ))}
          </MapView>
        )}
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
  map: {
    width: '100%',
    height: '100%',
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
  errorText: {
    color: 'red',
    marginTop: 20,
  },

});

const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  header: {
    color: '#FFFFFF',
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
    backgroundColor: '#1A1A1A',
  },
  errorText: {
    color: '#FF5A5F', 
    marginTop: 20,
    fontSize: 14,
  },
});


export default MapScreen;