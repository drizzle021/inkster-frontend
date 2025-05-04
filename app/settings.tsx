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
import { useTheme } from './contexts/ThemeContext';

interface UserProfile {
  id: number;
  username: string;
  role: string;
  profile_picture: string;
  banner: string;
}

const SettingsScreen = () => {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const styles = theme === 'dark' ? darkStyles : lightStyles; 

  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [selectedProfilePic, setSelectedProfilePic] = useState<string | null>(null);
  const [selectedProfileBanner, setSelectedProfileBanner] = useState<string | null>(null);
  // const [profileImageError, setProfileImageError] = useState(false);
  const isDefaultProfilePicture = user?.profile_picture?.includes('default');
  const isDefaultBanner = user?.banner?.includes('background');


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


  const openReports = () => {
    router.push('/reports');
  };


  const refreshUser = async () => {
    try {
      const userData = await apiFetch<UserProfile>('/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userData.data);
    } catch (err) {
      console.error('Failed to refresh user data:', err);
    }
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
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!pickerResult.canceled && pickerResult.assets.length > 0) {
      const image = pickerResult.assets[0];
      const fileUri = image.uri;
      const fileName = fileUri.split('/').pop() || 'photo.jpg';
      const fileType = fileName.split('.').pop();
  
      const formData = new FormData();
      formData.append('profile_picture', {
        uri: fileUri,
        name: fileName,
        type: `image/${fileType}`,
      } as any);
  
      try {
        const res = await apiFetch('/users/update-pictures', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });
  
        setSelectedProfilePic(fileUri);
        await refreshUser();
        console.log('Profile picture updated successfully');
      } catch (err) {
        console.error('Failed to upload profile picture:', err);
      }
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
      aspect: [4, 2],
      quality: 1,
    });
  
    if (!pickerResult.canceled && pickerResult.assets.length > 0) {
      const image = pickerResult.assets[0];
      const fileUri = image.uri;
      const fileName = fileUri.split('/').pop() || 'banner.jpg';
      const fileType = fileName.split('.').pop();
  
      const formData = new FormData();
      formData.append('banner', {
        uri: fileUri,
        name: fileName,
        type: `image/${fileType}`,
      } as any);
  
      try {
        const res = await apiFetch('/users/update-pictures', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });
  
        setSelectedProfileBanner(fileUri);
        await refreshUser();
        console.log('Banner image updated successfully');
      } catch (err) {
        console.error('Failed to upload banner image:', err);
      }
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
                source={
                  isDefaultBanner
                    ? require('../assets/images/banner_background.jpg')
                    : {
                        uri: getUserBannerImageUrl(user.banner),
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                        priority: FastImage.priority.normal,
                      }
                }
                style={styles.bannerPic}

                // onError={() => setProfileImageError(true)}
              />
              <FastImage
                source={
                  isDefaultProfilePicture
                    ? require('../assets/images/default.jpg')
                    : {
                        uri: getUserProfileImageUrl(user.profile_picture),
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                        priority: FastImage.priority.normal,
                      }
                }
                style={styles.profilePic}

                // onError={() => setProfileImageError(true)}
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
                source={require('../assets/images/default.jpg')}
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
            <TouchableOpacity style={styles.button} onPress={toggleTheme}>
              <Text style={styles.buttonTextTheme}>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</Text>

              {/* <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={24} color={theme === 'dark' ? '#eee' : '#333'} /> */}
            </TouchableOpacity>
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

const lightStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { flex: 1, paddingBottom: 60 },
  profileSection: { alignItems: 'center' },
  profilePic: { width: 150, height: 150, borderRadius: 100, marginTop: -80, borderWidth: 8, borderColor: '#fff' },
  bannerPic: { width: '90%', height: 180, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  section: { marginTop: 20, marginBottom: 15, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#000' },
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
    borderColor: '#ddd',
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
  optionIconColor: {color: '#000'},
  switchTrackColor: {color: '#ccc'},
  switchThumbColor: {color: '#fff'},
  button: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
    alignItems: 'flex-end',
  },
  buttonTextTheme: {
    fontSize: 16,
    color: "#fff"
  },
});



const darkStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scrollContainer: { flex: 1, paddingBottom: 60 },
  profileSection: { alignItems: 'center' },
  profilePic: { width: 150, height: 150, borderRadius: 100, marginTop: -80, borderWidth: 8, borderColor: '#333' },
  bannerPic: { width: '90%', height: 180, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  section: { marginTop: 20, marginBottom: 15, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#fff' },
  optionButton: {
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#555',
  },
  optionText: { fontSize: 16, color: '#eee' },
  logoutContainer: { alignItems: 'center', marginTop: 30 },
  customButton: {
    backgroundColor: '#8B0000', 
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  optionIconColor: {color: '#fff'},
  switchTrackColor: {color: '#555'},
  switchThumbColor: {color: '#000'},
  button: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    alignItems: 'flex-end',
  },
  buttonTextTheme: {
    fontSize: 16,
    color: "#000"
  },
});

export default SettingsScreen;
