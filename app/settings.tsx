import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import BottomNavigation from './components/navigation';
import TopNavigation from './components/top_navigation';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/AntDesign';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch, getUserProfileImageUrl, getUserBannerImageUrl } from './api';
import FastImage from 'react-native-fast-image';

interface UserProfile {
  id: number;
  username: string;
  role: string;
}

const SettingsScreen = () => {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [selectedProfilePic, setSelectedProfilePic] = useState<string | null>(null);
  const [selectedProfileBanner, setSelectedProfileBanner] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (!storedToken) {
          router.push('/auth/login');
          return;
        }
        setToken(storedToken);

        const userData = await apiFetch<UserProfile>('/users/me', {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        setUser(userData.data);
      } catch (err: any) {
        console.error('Failed to fetch user:', err.message || err);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      if (!storedToken) {
        router.push('/auth/login');
        return;
      }

      await apiFetch('/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      await AsyncStorage.removeItem('token');
      router.push('/auth/login');
    } catch (err: any) {
      console.error('Logout failed:', err.message || err);
      alert('Logout failed. Please try again.');
    }
  };

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const openReports = () => {
    router.push('/reports');
  };

  const handleProfilePicSelect = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access media library is required!');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!pickerResult.canceled && pickerResult.assets.length > 0) {
      setSelectedProfilePic(pickerResult.assets[0].uri);
    }
  };

  const handleProfileBannerSelect = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access media library is required!');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!pickerResult.canceled && pickerResult.assets.length > 0) {
      setSelectedProfileBanner(pickerResult.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <TopNavigation />

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.profileSection}>
          {user && token ? (
            <>
              <FastImage
                source={{
                  uri: selectedProfileBanner || getUserBannerImageUrl(user.id),
                  headers: { Authorization: `Bearer ${token}` },
                  priority: FastImage.priority.normal,
                }}
                style={styles.bannerPic}
                resizeMode={FastImage.resizeMode.cover}
              />
              <FastImage
                source={{
                  uri: selectedProfilePic || getUserProfileImageUrl(user.id),
                  headers: { Authorization: `Bearer ${token}` },
                  priority: FastImage.priority.normal,
                }}
                style={styles.profilePic}
                resizeMode={FastImage.resizeMode.cover}
              />
            </>
          ) : (
            <>
              {/* Fallback local images if user not loaded */}
              <FastImage
                source={require('../assets/images/banner_background.jpg')}
                style={styles.bannerPic}
                resizeMode={FastImage.resizeMode.cover}
              />
              <FastImage
                source={require('../assets/images/shaq.png')}
                style={styles.profilePic}
                resizeMode={FastImage.resizeMode.cover}
              />
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <TouchableOpacity style={styles.optionButton} onPress={handleProfilePicSelect}>
            <Text style={styles.optionText}>Change Profile Picture</Text>
            <Icon name="right" size={16} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={handleProfileBannerSelect}>
            <Text style={styles.optionText}>Change Banner</Text>
            <Icon name="right" size={16} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.optionButton}>
            <Text style={styles.optionText}>Dark Mode</Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: "#000", true: "#000" }}
              thumbColor={isDarkMode ? "#000" : "#fff"}
            />
          </View>
        </View>

        {/* Moderation section for MODERATOR */}
        {user?.role === 'MODERATOR' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Moderation</Text>
            <TouchableOpacity style={styles.optionButton} onPress={openReports}>
              <Text style={styles.optionText}>Reports</Text>
              <Icon name="right" size={16} color="#000" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.customButton} onPress={handleLogout}>
            <Text style={styles.buttonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { flex: 1, paddingBottom: 60 },
  profileSection: { alignItems: 'center' },
  profilePic: { width: 150, height: 150, borderRadius: 100, marginTop: -80, borderWidth: 8, borderColor: '#fff' },
  bannerPic: { width: '90%', height: 180, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  section: { marginTop: 20, marginBottom: 15, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  optionButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
  },
  optionText: { fontSize: 16, color: '#333' },
  logoutContainer: { alignItems: 'center', marginTop: 30 },
  customButton: {
    backgroundColor: '#FF4D4D',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default SettingsScreen;
