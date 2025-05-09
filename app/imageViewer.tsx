import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  Dimensions, TouchableOpacity, Image,
  NativeSyntheticEvent, NativeScrollEvent, ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useRouter } from 'expo-router';
import { useSelectedPost } from './contexts/selectedPostContext';
import { useSelectedUser } from './contexts/selectedUserContext';
import FastImage from 'react-native-fast-image';
import { apiFetch, getImageUrl, getUserProfileImageUrl } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SheetManager } from 'react-native-actions-sheet';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useTheme } from './contexts/ThemeContext';
import { useLocalSearchParams } from 'expo-router';
import { useReaderMode } from './contexts/ReaderModeContext';
import { AccessibilityInfo } from 'react-native';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function ImageViewer() {
  const params = useLocalSearchParams();
  const source = params?.source

  const { readerEnabled } = useReaderMode();

  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [token, setToken] = useState<string | null>(null);
  const { selectedPost } = useSelectedPost();

  // const { setSelectedPost } = useSelectedPost();
  const { currentUser } = useSelectedUser();
  const isOwner = selectedPost?.author.id === currentUser?.id;


  const flatListRef = useRef<FlatList>(null);
  const [images, setImages] = useState<{ uri: string }[]>([]);

  const { theme } = useTheme();
  const styles = theme === 'dark' ? darkStyles : lightStyles;

  const [likedPost, setLikedPost] = useState(selectedPost?.is_liked);
  const [likeCount, setLikeCount] = useState(selectedPost?.likes);
  const [savedPost, setSavedPost] = useState(selectedPost?.is_saved);

  useEffect(() => {
    const loadTokenAndImages = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      setToken(storedToken);
      
      console.log(selectedPost)
      if (selectedPost?.images?.length) {
        const builtImages = selectedPost.images.map((img: { image_name: string }) => ({
          uri: getImageUrl(img.image_name),
        }));
        setImages(builtImages);
      } else {
        setImages([{ uri: Image.resolveAssetSource(require('../assets/images/penguin.png')).uri }]);
      }
    };

    loadTokenAndImages();

  }, []);

  
  useEffect(() => {
    if (!readerEnabled || !selectedPost?.title) return;
  
    const content = `Title: ${selectedPost.title}. Caption: ${selectedPost.caption || 'No caption provided.'}`;
    
    const timeoutId = setTimeout(() => {
      AccessibilityInfo.announceForAccessibility(content);
    }, 1000);
  
    return () => clearTimeout(timeoutId);
  }, [readerEnabled, selectedPost?.id]); // Use selectedPost.id instead of full object to avoid unnecessary re-runs
  

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    console.log("INDEX " + index)
    setCurrentIndex(index);
  };

  const handleLike = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        router.push('/auth/login');
        return;
      }
  
      await apiFetch(`/posts/like/${selectedPost?.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setLikedPost((prev) => {
        const newLikedState = !prev;
        setLikeCount((count) => (count || 0) + (newLikedState ? 1 : -1));
        return newLikedState;
      });
      
    } catch (err: any) {
      console.error('Failed to like post:', err.message || err);
    }
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        router.push('/auth/login');
        return;
      }

      await apiFetch(`/posts/save/${selectedPost?.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('Saved post:', selectedPost?.id);
      setSavedPost(!savedPost);
    } catch (err: any) {
      console.error('Failed to save post:', err.message || err);
    }
  };


  
  const closePost = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        router.push('/auth/login');
        return;
      }

      if (source === 'home'){
        router.push('/home')
      }
      else if (source !== 'home'){
        router.back()
      }
      
    } catch (err: any) {
      console.error('Failed to save post:', err.message || err);
    }
  };




  if (!selectedPost || !token || images.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* FastImage horizontal carousel */}
      <View style={styles.imageWrapper}>
        <FlatList
          ref={flatListRef}
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <FastImage
              source={{
                uri: item.uri,
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                priority: FastImage.priority.normal,
              }}
              style={styles.image}
              resizeMode={FastImage.resizeMode.contain}
            />
          )}
        />

        {/* Image Count Overlay */}
        <Text style={styles.imageCount}>
          {images.length > 0 ? `${currentIndex + 1}/${images.length}` : '0/0'}
        </Text>

        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={() => closePost()}>
          <Icon name="x" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Details Section */}
      <View style={styles.detailsContainer}>
        <View style={styles.handleBar} />

        <View style={styles.userRow}>
          <View style={styles.userInfo}>
            <FastImage
              source={
                selectedPost.author?.profile_picture.includes('default')
                  ? require('../assets/images/default.jpg')
                  : {
                      uri: getUserProfileImageUrl(selectedPost.author.profile_picture),
                      headers: token ? { Authorization: `Bearer ${token}` } : {},
                      priority: FastImage.priority.normal,
                    }
              }
              style={styles.avatar}
              // onError={() => setProfileImageError(true)}
            />
            <Text style={styles.username}>{selectedPost.author?.username || 'Unknown User'}</Text>
          </View>


          <View style={styles.rightActions}>
            <View style={styles.actions}>
            <Text style={styles.likeCount}>{likeCount}</Text>
              <TouchableOpacity onPress={handleLike}>
                <FontAwesome
                  name={likedPost ? 'heart' : 'heart-o'}
                  size={24}
                  color={likedPost ? 'red' : 'black'}
                  style={styles.likeButton}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.commentIcon}
                onPress={() => SheetManager.show('comments-sheet')}>
                <Icon name="message-circle" size={24} style={styles.iconColor}/>
              </TouchableOpacity>
              {/* <Icon name="more-horizontal" size={25} style={styles.swipeIcon} /> */}
              <TouchableOpacity
                style={styles.commentIcon}
                onPress={handleSave}>
                <FontAwesome
                  name={savedPost ? 'bookmark' : 'bookmark-o'}
                  size={24}
                  color={savedPost ? '#7B61FF' : 'black'}
                  style={styles.saveButton}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.menuIconContainer}
              onPress={() => {
                // setSelectedPost(selectedPost);
                SheetManager.show('post-actions', {
                  payload: {
                    // onDeletePost,
                    source: 'viewer',
                    position: currentIndex,
                    isOwner,
                  }
                });
              }}
            >
              <Icon name="more-vertical" size={24} color="gray" />
            </TouchableOpacity>
          </View>
        </View>





        <Text style={styles.title}
          accessible={readerEnabled}
          accessibilityLabel={`Title: ${selectedPost.title || 'Untitled Post'}`}
        >
          {selectedPost.title || 'Untitled Post'}
        </Text>

        <Text style={styles.description}>
          {selectedPost.caption || 'No caption provided.'}
        </Text>

        <Text style={styles.description}
          accessible={readerEnabled}
          accessibilityLabel={`Caption: ${selectedPost.caption || 'No caption provided.'}`}
        >
          <Text style={{ fontWeight: 'bold' }}>Description: </Text>
          {selectedPost.description || 'No description available.'}
        </Text>

        <Text style={styles.timestamp}>
          {selectedPost.created_at || 'created at'}
        </Text>

        <Text style={styles.software}>
          <Text style={{ fontWeight: 'bold' }}>Software: </Text>
          {selectedPost.software || 'No software mentioned'}
        </Text>

        <View style={styles.tagsContainer}>
          {selectedPost.tags && selectedPost.tags.length > 0 ? (
            selectedPost.tags.map((tag: string, index: number) => (
              <Text key={index} style={styles.tag}>#{tag} </Text>
            ))
          ) : (
            <Text style={styles.tag}>#NoTags</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const lightStyles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000' 
  },
  centeredContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#000' 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  errorText: { 
    color: 'white', 
    fontSize: 18, 
    marginBottom: 12 
  },
  imageWrapper: { 
    width: screenWidth, 
    height: screenHeight 
  },
  image: { 
    width: screenWidth, 
    height: screenHeight 
  },
  closeButton: { 
    position: 'absolute', 
    top: 50, 
    right: 20, 
    zIndex: 10 
  },
  imageCount: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 16,
  },
  detailsContainer: {
    backgroundColor: '#fff',
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: screenHeight * 0.5,
  },
  handleBar: {
    width: 50,
    height: 5,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    borderRadius: 5,
    marginBottom: 15,
  },
  menuIconContainer: {
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginLeft: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentIcon: {
    marginLeft: 16,
  },
  userRow: { 
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between', 
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  avatar: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    marginRight: 10 
  },
  username: { 
    fontWeight: 'bold', 
    fontSize: 16, 
    marginRight: 10 
  },
  title: { 
    fontSize: 18, 
    fontWeight: '600', 
    marginBottom: 8 
  },
  description: { 
    fontSize: 14, 
    color: '#444', 
    marginBottom: 4 
  },
  timestamp: { 
    fontSize: 12, 
    color: 'gray', 
    marginBottom: 10 
  },
  software: { 
    fontSize: 14, 
    marginBottom: 8 
  },
  tagsContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap' 
  },
  tag: { 
    color: '#7B61FF', 
    fontSize: 14 
  },
  likeCount: {
    margin: 8,
    color: '#000'
  },
  iconColor: {
    color: '#000'
  },
  likeButton:{
    color: 'red'
  },
  saveButton:{
    color: "#7B61FF"
  }
});


const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  errorText: {
    color: '#eee',
    fontSize: 18,
    marginBottom: 12
  },
  imageWrapper: {
    width: screenWidth,
    height: screenHeight
  },
  image: {
    width: screenWidth,
    height: screenHeight
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10
  },
  imageCount: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 16,
  },
  detailsContainer: {
    backgroundColor: '#1a1a1a',
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: screenHeight * 0.5,
  },
  handleBar: {
    width: 50,
    height: 5,
    backgroundColor: '#555',
    alignSelf: 'center',
    borderRadius: 5,
    marginBottom: 15,
  },
  menuIconContainer: {
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentIcon: {
    marginLeft: 16,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
    color: '#eee'
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#eee'
  },
  description: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10
  },
  software: {
    fontSize: 14,
    marginBottom: 8,
    color: '#eee'
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  tag: {
    color: '#7B61FF',
    fontSize: 14
  },
  likeCount: {
    margin: 8,
    color: '#fff'
  },
  iconColor: {
    color: '#fff'
  },
  likeButton:{
    color: '#fff'
  },
  saveButton:{
    color: "#fff"
  }
});