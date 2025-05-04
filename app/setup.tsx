import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Image, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import { Link, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { apiFetch } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from './contexts/ThemeContext';

export default function Setup() {
  const colorScheme = useColorScheme();
  const { theme } = useTheme();
  const styles = theme === 'dark' ? darkStyles : lightStyles;
  const router = useRouter();

  const [tags, setTags] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [profileBanner, setProfileBanner] = useState('');
  const [selectedProfilePic, setSelectedProfilePic] = useState('');  
  const [selectedProfileBanner, setSelectedProfileBanner] = useState('');  


  const skipSetup = async () => {
    router.push('/home');
  };
  // const saveSetup = async () => {
  //   router.push('/home');

  //   const res_register = await apiFetch('/auth/register', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //     },
  //     body: formData.toString(),
  //   });
  // };

  const saveSetup = useCallback(async () => {
    const formData = new URLSearchParams();
    formData.append('tags', tags);
  
    try {

      const res = await apiFetch('/users/update-tags', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });
      // const res_profile_pic = await apiFetch('/users/update-pictures', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/x-www-form-urlencoded',
      //   },
      //   body: formData.toString(),
      // });

      // const res_banner = await apiFetch('/users/update-pictures', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/x-www-form-urlencoded',
      //   },
      //   body: formData.toString(),
      // });
      router.push('/home');
      
    } catch (err) {
      console.error('Register error:', err);
      alert('Register failed. Please try again.');
    }
  }, [tags, router]);


  const handleProfilePicSelect = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access media library is required!');
      return;
    }
  
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true, 
      aspect: [1, 1],
      quality: 1, 
    });
  
    if (!pickerResult.canceled && pickerResult.assets.length > 0) {
      const { uri } = pickerResult.assets[0];
      setSelectedProfilePic(uri);
  
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        alert('User not authenticated');
        return;
      }
  
      const fileName = uri.split('/').pop() || 'photo.jpg';
      const fileType = fileName.split('.').pop();
  
      const formData = new FormData();
      formData.append('profile_picture', {
        uri,
        name: fileName,
        type: `image/${fileType}`,
      } as any);
  
      try {
        await apiFetch('/users/update-pictures', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });
  
        console.log('Profile picture uploaded successfully');
      } catch (error) {
        console.error('Failed to upload profile picture:', error);
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
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 2],
      quality: 1,
    });
  
    if (!pickerResult.canceled && pickerResult.assets.length > 0) {
      const { uri } = pickerResult.assets[0];
      setSelectedProfileBanner(uri);
  
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        alert('User not authenticated');
        return;
      }
  
      const fileName = uri.split('/').pop() || 'banner.jpg';
      const fileType = fileName.split('.').pop();
  
      const formData = new FormData();
      formData.append('banner', {
        uri,
        name: fileName,
        type: `image/${fileType}`,
      } as any);
  
      try {
        await apiFetch('/users/update-pictures', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });
  
        console.log('Banner uploaded successfully');
      } catch (error) {
        console.error('Failed to upload banner:', error);
      }
    }
  };
  






  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        {/* Tags Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.header}>Let's start by setting up the basics for your account...</Text>

          <Text style={styles.label}>Tags:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter tags..."
            placeholderTextColor={colorScheme === 'dark' ? '#FFF' : '#000'}
            value={tags}
            onChangeText={setTags}
          />
        </View>

        {/* Profile Picture */}
        <View style={styles.add_img_container}>
          <View style={styles.imageGroup}>
            <Text style={styles.label}>Profile Picture:</Text>
            <TouchableOpacity onPress={handleProfilePicSelect}>
              <Image
                source={profilePic ? { uri: profilePic } : require('../assets/images/add_img.png')}
                style={styles.image}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.imageGroup}>
            <Text style={styles.label}>Profile Banner:</Text>
            <TouchableOpacity onPress={handleProfileBannerSelect}>
              <Image
                source={profileBanner ? { uri: profileBanner } : require('../assets/images/add_img.png')}
                style={styles.image}
              />
            </TouchableOpacity>
          </View>
        </View>


        {/* Preview */}
        <View style={styles.previewContainer}>
          <Text style={styles.label}>Preview:</Text>
          <View style={styles.previewBox}>
            <Image
              source={selectedProfileBanner ? { uri: selectedProfileBanner } : require('../assets/images/banner_background.jpg')}
              style={styles.bannerPreview}
            />
            <Image
              source={selectedProfilePic ? { uri: selectedProfilePic } : require('../assets/images/default.jpg')}
              style={styles.profilePreview}
            />
          </View>
        </View>

        {/* Save Button */}
        {/* <Button title="Save" color="#7B61FF" onPress={() => console.log('Save pressed')} /> */}
        <View style={styles.save_container}>
          <TouchableOpacity style={styles.customButton} onPress={saveSetup}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>




          {/* Skip Account Setup Link */}
          <Link href="/home" style={styles.skipLink} onPress={skipSetup}>
            <Text style={styles.skipText}>Skip Account Setup →</Text>
          </Link>
        </View>
      </View>
    </View>
  );
}


const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#000',
  },
  formContainer: {
    backgroundColor: '#EEE',
    padding: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: "90%",
  },
  save_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  input: {
    height: 40,
    paddingHorizontal: 8,
    borderRadius: 5,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#000', 
  },
  imageGroup: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignItems: 'center',
  },
  add_img_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 22,
    backgroundColor: '#ccc',
  },
  previewContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  previewBox: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  bannerPreview: {
    width: '90%',
    height: 150,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profilePreview: {
    width: 120,
    height: 120,
    borderRadius: 100,
    marginTop: -80,
    borderWidth: 8,
    borderColor: '#fff',
  },
  customButton: {
    backgroundColor: '#7B61FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: "50%",
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipLink: {
    marginTop: 15,
    alignSelf: 'center',
  },
  skipText: {
    color: '#7B61FF',
    textDecorationLine: 'underline',
  },
});

const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#000',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#FFF',
  },
  formContainer: {
    backgroundColor: '#222',
    padding: 20,
    marginVertical: 20,
    height: "90%",
    borderRadius: 20,
  },
  save_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#FFF',
  },
  input: {
    height: 40,
    paddingHorizontal: 8,
    borderRadius: 5,
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#666',
    color: '#FFF',  
  },
  imageGroup: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignItems: 'center',
  },
  add_img_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 22,
    backgroundColor: '#666',
  },
  previewContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  previewBox: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  bannerPreview: {
    width: '90%',
    height: 170,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profilePreview: {
    width: 120,
    height: 120,
    borderRadius: 100,
    marginTop: -80,
    borderWidth: 8,
    borderColor: '#333',
  },
  customButton: {
    backgroundColor: '#7B61FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: "50%",
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipLink: {
    marginTop: 15,
    alignSelf: 'center',
  },
  skipText: {
    color: '#7B61FF',
    textDecorationLine: 'underline',
  },
});

