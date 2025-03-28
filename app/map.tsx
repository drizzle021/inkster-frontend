// HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomNavigation from './components/navigation';
import TopNavigation from './components/top_navigation';

const MapScreen = () => {
  return (
    <View style={styles.container}>
        <TopNavigation />
        
        <View style={styles.content}>

            <Text>Map HEHE</Text>
        </View>
        
        {/* Bottom navigation bar */}
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
