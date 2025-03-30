// HomeScreen.js
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView  } from 'react-native';
import BottomNavigation from './components/navigation';
import TopNavigation from './components/top_navigation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Feather';
import { useRouter } from 'expo-router';
import { SheetManager } from 'react-native-actions-sheet';

const HomeScreen = () => {
  const router = useRouter();
  const [likedPost, setLikedPost] = useState(false);
  const [activeTab, setActiveTab] = useState('Illustration');


  const openImage = async () => {
    router.push('./imageViewer');
  };
  const openSearch = async () => {
    router.push('./search');
  };

  return (
    <View style={styles.container}>
      <TopNavigation />

      <View style={styles.topTabs}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('Illustration')}>
          <Text style={[styles.tabText, activeTab === 'Illustration' && styles.activeTabText]}>
            Illustration
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={openSearch}>
          <Text style={[styles.tabText, activeTab === 'Search' && styles.activeTabText]}>
            Search
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('Novels')}>
          <Text style={[styles.tabText, activeTab === 'Novels' && styles.activeTabText]}>
            Novels
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.postContainer}>
          <View style={styles.header}>
            <Image source={require('../assets/images/penguin.png')} style={styles.avatar} />
            <View>
              <Text style={styles.name}>Name</Text>
              <Text style={styles.subtext}>post name</Text>
            </View>
            <TouchableOpacity style={styles.menuIcon} onPress={() => SheetManager.show('post-actions')}>
              <Icon name="more-vertical" size={25} style={styles.menuIcon} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={openImage}>
            <Image source={require('../assets/images/bing.png')} style={styles.postImage}/>
          </TouchableOpacity>

          <View style={styles.actions}>
            <TouchableOpacity onPress={() => setLikedPost(!likedPost)}>
              <FontAwesome
                name={likedPost ? 'heart' : 'heart-o'}
                size={24}
                color={likedPost ? 'red' : 'black'}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.commentIcon}><Icon name="message-circle" size={24} /></TouchableOpacity>
          
            <Icon name="more-horizontal" size={25} style={styles.swipeIcon} />

          </View>

          <Text style={styles.caption}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
          </Text>
          <Text style={styles.timestamp}>8m ago</Text>
        </View>

        <View style={styles.postContainer}>
          <View style={styles.header}>
            <Image source={require('../assets/images/penguin.png')} style={styles.avatar} />
            <View>
              <Text style={styles.name}>Name</Text>
              <Text style={styles.subtext}>post name</Text>
            </View>
            <TouchableOpacity style={styles.menuIcon}>
              <Icon name="more-vertical" size={25} style={styles.menuIcon} onPress={() => SheetManager.show('post-actions')}/>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={openImage}>
            <Image source={require('../assets/images/bing.png')} style={styles.postImage}/>
          </TouchableOpacity>

          <View style={styles.actions}>
            <TouchableOpacity onPress={() => setLikedPost(!likedPost)}>
              <FontAwesome
                name={likedPost ? 'heart' : 'heart-o'}
                size={24}
                color={likedPost ? 'red' : 'black'}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.commentIcon}><Icon name="message-circle" size={24} /></TouchableOpacity>
            <Icon name="more-horizontal" size={25} style={styles.swipeIcon} />

          </View>

          <Text style={styles.caption}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
          </Text>
          <Text style={styles.timestamp}>8m ago</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    marginLeft: 10,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  subtext: {
    fontSize: 12,
    color: 'gray',
  },
  menuIcon: {
    marginLeft: "48%",
    color: 'gray',
  },
  swipeIcon: {
    marginLeft: "70%",
    color: 'gray',
  },
  postImage: {
    width: '100%',
    height: 300,
    marginVertical: 10,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginLeft: 10,
  },
  commentIcon: {
    marginLeft: 16,
  },
  caption: {
    marginTop: 8,
    fontSize: 16,
    marginLeft: 10,
  },
  timestamp: {
    fontSize: 14,
    color: 'gray',
    marginTop: 4,
    marginLeft: 10,
  },
  topTabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 10,
    marginBottom: 30,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'normal',
  },
  activeTabText: {
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  postContainer: {
    marginBottom: 30,
    paddingBottom: 10,

  },
  
});


export default HomeScreen;
