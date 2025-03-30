// HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import BottomNavigation from './components/navigation';
import TopNavigation from './components/top_navigation';
import { Link, useRouter } from 'expo-router';

const SavedPostsScreen = () => {
  const router = useRouter();
  const openPost = async () => {
      router.push('/saved');
  };


  return (
    <View style={styles.container}>
        <TopNavigation />

        <View style={styles.postType}>
            <View style={styles.postGroup}>
                <Text style={styles.label}>Illustrations</Text>
            </View>
            <View style={styles.postGroup}>
                <Text style={styles.label}>Novels</Text>
            </View>
        </View>
        <View style={styles.header}>
            <Text style={styles.label}>
                Saved
            </Text>
        </View>
        <ScrollView style={styles.container}>
            {/* Posts Grid */}
            <View style={styles.postsContainer}>
              <View style={styles.postRow}>
                  <TouchableOpacity style={styles.postItem} onPress={openPost}>
                      <View style={styles.postItem}></View>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.postItem} onPress={openPost}>
                      <View style={styles.postItem}></View>
                  </TouchableOpacity>
              </View>
              <View style={styles.postRow}>
                  <TouchableOpacity style={styles.postItem} onPress={openPost}>
                      <View style={styles.postItem}></View>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.postItem} onPress={openPost}>
                      <View style={styles.postItem}></View>
                  </TouchableOpacity>
              </View>
              <View style={styles.postRow}>
                  <TouchableOpacity style={styles.postItem} onPress={openPost}>
                      <View style={styles.postItem}></View>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.postItem} onPress={openPost}>
                      <View style={styles.postItem}></View>
                  </TouchableOpacity>
              </View>
              <View style={styles.postRow}>
                  <TouchableOpacity style={styles.postItem} onPress={openPost}>
                      <View style={styles.postItem}></View>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.postItem} onPress={openPost}>
                      <View style={styles.postItem}></View>
                  </TouchableOpacity>
              </View>
              <View style={styles.postRow}>
                  <TouchableOpacity style={styles.postItem} onPress={openPost}>
                      <View style={styles.postItem}></View>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.postItem} onPress={openPost}>
                      <View style={styles.postItem}></View>
                  </TouchableOpacity>
              </View>
              <View style={styles.postRow}>
                  <TouchableOpacity style={styles.postItem} onPress={openPost}>
                      <View style={styles.postItem}></View>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.postItem} onPress={openPost}>
                      <View style={styles.postItem}></View>
                  </TouchableOpacity>
              </View>
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
    postType: {
      flexDirection: 'row',
      marginBottom: 10,
      
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    postGroup: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginLeft: 30,
        marginRight: 50,
        marginTop: 20,
        alignItems: 'center',
    },
    header:{
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    postsContainer: {
      paddingHorizontal: 10,
      paddingBottom: 20,
    },
    postRow: {
      flexDirection: 'row',
      marginBottom: 10,
      alignItems: 'center',
  
    },
    postItem: {
      width: '48%',
      height: 150,
      backgroundColor: '#ccc',
      borderRadius: 10,
      marginRight: '4%',
    },
  });
  
export default SavedPostsScreen;
