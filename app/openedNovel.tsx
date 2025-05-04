import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  Dimensions, TouchableOpacity, Image,
  NativeSyntheticEvent, NativeScrollEvent, ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useRouter } from 'expo-router';
import { useSelectedPost } from './contexts/selectedPostContext';
import FastImage from 'react-native-fast-image';
import { apiFetch, getImageUrl, getUserProfileImageUrl } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SheetManager } from 'react-native-actions-sheet';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import BottomNavigation from './components/navigation';
import TopNavigation from './components/top_navigation';
import { useTheme } from './contexts/ThemeContext';

export default function OpenedNovel() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const { selectedPost } = useSelectedPost();
  const { setSelectedPost } = useSelectedPost();
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

      if (selectedPost?.images?.length) {
        const builtImages = selectedPost.images.map((img: { image_name: string }) => ({
          uri: getImageUrl(img.image_name),
        }));
        setImages(builtImages);
      } else {
        setImages([{ uri: Image.resolveAssetSource(require('../assets/images/penguin.png')).uri }]);
      }
    };
    console.log(selectedPost)
    setSelectedPost(selectedPost);
    loadTokenAndImages();
  }, [selectedPost]);


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

  
  return (
    <View style={styles.container}>
      <TopNavigation />

        <ScrollView style={styles.scrollContainer}>

            <FastImage
            source={{
                uri: images[0]?.uri,
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            }}
            style={styles.postImage}
            />
            
            <View style={styles.details}>
                <View style={styles.userRow}>
                    <Text style={styles.title}>{selectedPost?.title}</Text>    
                    
                    <TouchableOpacity
                        style={styles.menuIconContainer}
                        onPress={() => {
                            setSelectedPost(selectedPost);
                            SheetManager.show('post-actions', {
                            payload: {
                                // onDeletePost,
                                source: 'viewer',
                                position: 0
                            }
                            });
                        }}
                        >
                        <Icon name="more-vertical" size={24} color="gray" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.usernameRow}>
                    <Text>by </Text>
                    <Text style={styles.username}>{selectedPost?.author?.username || 'Unknown User'}</Text>

                </Text>

                <View style={styles.tagsContainer}>
                    {selectedPost?.tags && selectedPost.tags.length > 0 ? (
                        selectedPost.tags.map((tag: string, index: number) => (
                        <Text key={index} style={styles.tag}>#{tag} </Text>
                        ))
                    ) : (
                        <Text style={styles.tag}>#NoTags</Text>
                    )}
                </View>

                <Text>{selectedPost?.created_at}</Text>

                <View style={styles.actions}>
                    <Text style={{ marginRight: 8 }}>{likeCount}</Text>
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

                <View style={styles.separator} />
                <Text style={styles.description}>
                    {selectedPost?.caption || 'No caption provided.'}
                </Text>
        

            </View>         



        </ScrollView>

      <BottomNavigation />
    </View>
  );
};

const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  username: { 
    fontWeight: 'bold', 
    fontSize: 16, 
    marginRight: 10,
  },
  usernameRow: {
    marginLeft: 10
  },
  title: { 
    fontSize: 28, 
    fontWeight: '600', 

  },
  commentIcon: {
    marginLeft: 16,
  },
  actions: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginLeft: 10,
  },
  userRow: { 
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between', 
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  tagsContainer: { 
    marginLeft: 10,
    marginTop: 10,
    flexDirection: 'row', 
    flexWrap: 'wrap' 
  },
  tag: { 
    color: '#7B61FF', 
    fontSize: 14 
  },
  menuIconContainer: {
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postImage: {
    width: '100%',
    height: 300,

    marginVertical: 10,
  },
  description: { 
    fontSize: 14, 
    color: '#444', 
    margin: 10
  },
  separator: {
    height: 2,
    backgroundColor: '#e0e0e0',
    marginVertical: 10, 
    marginHorizontal: 10, 
  },
  caption: {
    marginTop: 8,
    fontSize: 16,
    marginLeft: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
    marginLeft: 20,
  },
  details: {
    margin: 10
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
    backgroundColor: '#000',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
    color: '#eee',
  },
  usernameRow: {
    marginLeft: 10,
    color: '#eee',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#eee',
  },
  commentIcon: {
    marginLeft: 16,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  tagsContainer: {
    marginLeft: 10,
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  tag: {
    color: '#7B61FF',
    fontSize: 14
  },
  menuIconContainer: {
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postImage: {
    width: '100%',
    height: 300,
    marginVertical: 10,
  },
  description: {
    fontSize: 14,
    color: '#999',
    margin: 10
  },
  separator: {
    height: 2,
    backgroundColor: '#333',
    marginVertical: 10,
    marginHorizontal: 10,
  },
  caption: {
    marginTop: 8,
    fontSize: 16,
    marginLeft: 10,
    color: '#eee',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
    marginLeft: 20,
    color: '#eee',
  },
  details: {
    margin: 10
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
