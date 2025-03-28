import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Touchable } from 'react-native';
import { useRouter, Link, usePathname } from 'expo-router';


const TopNavigation = () => {
    const router = useRouter();
    const pathname = usePathname(); 

    const openSettings = async () => {
        router.push('../settings');
    };
    const goBack = async () => {
        router.back();
    };
    const isOnSettingsPage = pathname === '/settings'; 

    return(
        <View style={styles.container}>
            <TouchableOpacity onPress={goBack}>
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            {!isOnSettingsPage && (
                <TouchableOpacity onPress={openSettings}>
                    <Text style={styles.settingsButtonText}>Settings</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 40,
        paddingHorizontal: 10,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        position: 'relative',
    },
    settingsButtonText: {
        color: "#7B61FF",
        fontWeight: 'bold',
        marginRight: 20,
        fontSize: 16
    },
    backButtonText: {
        color: "#7B61FF",
        fontWeight: 'bold',
        marginLeft: 20,
        fontSize: 16
    }
});

export default TopNavigation;
