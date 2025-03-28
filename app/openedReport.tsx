import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import BottomNavigation from './components/navigation';
import TopNavigation from './components/top_navigation';
import Icon from 'react-native-vector-icons/AntDesign';
import { useRouter } from 'expo-router';

const ReportsScreen = () => {
    const router = useRouter();
    const openReport = () => {
        router.push('/openedReport');
    };
    return (
        <View style={styles.container}>
            <TopNavigation />

            
            <ScrollView style={styles.container}>
                <View style={styles.postImage}>
                    <Image style={styles.image}
                    source={require('../assets/images/shaq.png')}
                    />
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
    postImage: {

        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 200,
        height: 200,

    },
  });
  
export default ReportsScreen;
