import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Switch } from 'react-native';
import BottomNavigation from './components/navigation';
import TopNavigation from './components/top_navigation';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/AntDesign';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [selectedProfilePic, setSelectedProfilePic] = useState('');  
    const [selectedProfileBanner, setSelectedProfileBanner] = useState('');  
    

    const router = useRouter();

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        router.push('/auth/login');
    };
    const openReports = () => {
        router.push('/reports');
    };


    const handleProfilePicSelect = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
        alert('Permission to access media library is required!');
        return;
    }
    
    // Launch the image picker to select an image
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true, 
        aspect: [4, 4], 
        quality: 1, 
    });

    if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
        const {uri} = pickerResult.assets[0];
        setSelectedProfilePic(uri);
        // setProfilePic(uri);  
    }
    };


    
    const handleProfileBannerSelect = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
        alert('Permission to access media library is required!');
        return;
    }
    
    // Launch the image picker to select an image
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true, 
        aspect: [4, 4], 
        quality: 1, 
    });
    
    if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
        const {uri} = pickerResult.assets[0];
        setSelectedProfileBanner(uri);

    }
    };


    const toggleDarkMode = () => setIsDarkMode(prev => !prev);  // Toggle Dark Mode

    return (
        <View style={styles.container}>
            <TopNavigation />

            <ScrollView style={styles.container}>
                <View style={styles.profileSection}>
                    <Image
                        source={selectedProfileBanner ? { uri: selectedProfileBanner } : require('../assets/images/banner_background.jpg')}
                        style={styles.bannerPic}
                    />
                    <Image 
                        source={selectedProfilePic ? { uri: selectedProfilePic } : require('../assets/images/shaq.png')} 
                        style={styles.profilePic} 
                    />
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

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Moderation</Text>
                    <TouchableOpacity style={styles.optionButton} onPress={openReports}>
                        <Text style={styles.optionText}>Reports</Text>
                        <Icon name="right" size={16} color="#000" />
                    </TouchableOpacity>
                </View>

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
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        flex: 1,
        paddingBottom: 60, 
    },
    profileSection: {
        alignItems: 'center',
    },
    profilePic: {
        width: 150,
        height: 150,
        borderRadius: 100,
        marginTop: -80,
        borderWidth: 8,
        borderColor: '#fff',
    },
    bannerPic: {
        width: '90%',
        height: 180,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    section: {
        marginTop: 20,
        marginBottom: 15,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    optionButton: {
        backgroundColor: '#F5F5F5',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
    logoutContainer: {
        alignItems: 'center',
        marginTop: 30,
    },
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
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SettingsScreen;
