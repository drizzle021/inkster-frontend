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
                <View>
                    <TouchableOpacity style={styles.optionButton} onPress={openReport}>
                        <Text style={styles.optionText}># Report ID</Text>
                        <Icon name="right" size={16} color="#000" /> 
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity style={styles.optionButton} onPress={openReport}>
                        <Text style={styles.optionText}># Report ID</Text>
                        <Icon name="right" size={16} color="#000" /> 
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity style={styles.optionButton} onPress={openReport}>
                        <Text style={styles.optionText}># Report ID</Text>
                        <Icon name="right" size={16} color="#000" /> 
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity style={styles.optionButton} onPress={openReport}>
                        <Text style={styles.optionText}># Report ID</Text>
                        <Icon name="right" size={16} color="#000" /> 
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity style={styles.optionButton} onPress={openReport}>
                        <Text style={styles.optionText}># Report ID</Text>
                        <Icon name="right" size={16} color="#000" /> 
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity style={styles.optionButton} onPress={openReport}>
                        <Text style={styles.optionText}># Report ID</Text>
                        <Icon name="right" size={16} color="#000" /> 
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
    optionText: {
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold',
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

    },
  });
  
export default ReportsScreen;
