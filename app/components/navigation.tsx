import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SheetManager } from 'react-native-actions-sheet';
import { useSelectedUser } from '../contexts/selectedUserContext';

const BottomNavigation = () => {
  const router = useRouter();
  const { setSelectedUser } = useSelectedUser();

  const openHome = async () => {
    router.push('../home');
  };

  const openMap = async () => {
    router.push('../map');
  };
  
  const addPost = async () => {
    router.push('../addPost');
  };

  const openSavedPosts = async () => {
    router.push('../saved');
  };

  const openProfile = async () => {
    setSelectedUser(null);
    router.push('../profile');
  };


  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.icon} onPress={openHome}>
        <Image
          source={require('../../assets/images/home_icon.png')}
          style={styles.iconImage}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.icon} onPress={openMap}>
        <Image
          source={require('../../assets/images/pin_icon.png')}
          style={styles.iconImage}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.icon} onPress={() => SheetManager.show('add-post-sheet')}>
        <Image
          source={require('../../assets/images/plus_icon.png')}
          style={styles.iconImage}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.icon} onPress={openSavedPosts}>
        <Image
          source={require('../../assets/images/saved_icon.png')}
          style={styles.iconImage}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.icon} onPress={openProfile}>
        <Image
          source={require('../../assets/images/profile_icon.png')} 
          style={styles.iconImage}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    position: 'relative',
    bottom: 0,
    left: 0,
    right: 0,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: 25,
    height: 25,
    tintColor: '#000',
  },

  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default BottomNavigation;
