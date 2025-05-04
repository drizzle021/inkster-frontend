import { View, FlatList, TextInput, StyleSheet, TouchableOpacity, Dimensions, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import BottomNavigation from './components/navigation';
import TopNavigation from './components/top_navigation';
import Icon from 'react-native-vector-icons/Feather';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch, getImageUrl, getUserProfileImageUrl } from './api';
import FastImage from 'react-native-fast-image';
import { useSelectedPost } from './contexts/selectedPostContext';
import { useSelectedUser } from './contexts/selectedUserContext';
import { useTheme } from './contexts/ThemeContext';

const screenWidth = Dimensions.get('window').width;
const itemSize = (screenWidth - 3 * 16) / 2;

interface PostType {
  id: number;
  title: string;
  caption: string;
  post_type: string;
  created_at: string;
  thumbnail: string;
  is_spoilered: boolean;
  is_liked: boolean;
  is_saved: boolean;
}

export default function SearchResults() {
  const [data, setData] = useState<PostType[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const { setSelectedPost } = useSelectedPost();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { setSelectedUser } = useSelectedUser();
  const { theme } = useTheme();
  const styles = theme === 'dark' ? darkStyles : lightStyles;

  const { keywords, tags, type } = params;

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (!storedToken) {
          router.push('/auth/login');
          return;
        }
        setToken(storedToken);
  
        const query = new URLSearchParams();
        if (keywords) query.append('keywords', String(keywords));
        if (tags) query.append('tags', String(tags));
  
        let response;
        if (type === 'Artist') {
          // Fetch users
          response = await apiFetch(`/users?${query.toString()}`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
  
          setData(response.data); // assumes user list
        } else {
          // Fetch posts
          if (type) query.append('post_type', String(type).toUpperCase());
  
          response = await apiFetch(`/posts?${query.toString()}`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
  
          setData(response.data); 
        }
  
      } catch (err: any) {
        console.error('Error fetching search results:', err.message || err);
      }
    };
  
    fetchResults();
  }, [keywords, tags, type]);
  
  const openProfile = async (userId: number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        router.push('/auth/login');
        return;
      }

      const user = await apiFetch(`/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
  
      setSelectedUser(user.data);
      router.push('/profile');
    } catch (err) {
      console.error('Failed to load post details', err);
    }
  };

  const openImage = async (postId: number) => {
    try {
      if (!token) return;
      const post = await apiFetch(`/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedPost(post.data);
      router.push('/imageViewer');
    } catch (err) {
      console.error('Failed to open post', err);
    }
  };
  
  const openNovel = async (postId: number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        router.push('/auth/login');
        return;
      }
  
      const post = await apiFetch(`/posts/${postId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
  
      setSelectedPost(post.data);
      console.log(post.data)
      router.push('/openedNovel');
    } catch (err) {
      console.error('Failed to load post details', err);
    }
  };

  const renderItem = ({ item }: { item: any }) => {

    if (type === 'Artist') {
      console.log(item)
      return (
        <TouchableOpacity
          key={item.id}
          style={styles.userItem}
          onPress={() => openProfile(item.id)}
        >
          <FastImage
            source={
              item.profile_picture.includes('default')
                ? require('../assets/images/default.jpg')
                : {
                    uri: getUserProfileImageUrl(item.profile_picture),
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                    priority: FastImage.priority.normal,
                  }
            }
            style={styles.userAvatar}
          />
          <Text style={styles.username}>{item.username}</Text>
        </TouchableOpacity>
      );
    }
  
    // Default post item
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.postItem}
        activeOpacity={0.8}
        onPress={() => {
          if (item.post_type === 'ILLUSTRATION') {
            openImage(item.id);
          } else if (item.post_type === 'NOVEL') {
            openNovel(item.id);
          }
        }}
      >
        <View style={styles.imageWrapper}>
          <FastImage
            source={{
              uri: getImageUrl(item.thumbnail),
              headers: token ? { Authorization: `Bearer ${token}` } : {},
              priority: FastImage.priority.normal,
            }}
            style={styles.postImage}
            resizeMode={FastImage.resizeMode.cover}
          />
          {item.is_spoilered && (
            <View style={styles.spoilerOverlay}>
              <Text style={styles.spoilerText}>Spoilered</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  

  return (
    <View style={styles.container}>
      <TopNavigation />
      <TouchableOpacity onPress={() => router.push('./search')}>
        <View style={styles.searchWrapper}>
          <TextInput
            placeholder="Search..."
            style={styles.searchInput}
            editable={false}
            value={String(keywords || '')}
          />
          
            <Icon name="search" size={20} color="#777" style={styles.searchIcon} />
        
        </View>
      </TouchableOpacity>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={type === 'Artist' ? 1 : 2}
        columnWrapperStyle={
          type === 'Artist' ? undefined : { justifyContent: 'space-between', paddingHorizontal: 10 }
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <BottomNavigation />
    </View>
  );
}

const lightStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  searchIcon: {
    marginLeft: 8,
  },
  postItem: {
    width: itemSize,
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#eee',
    overflow: 'hidden',
  },
  imageWrapper: {
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  spoilerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  spoilerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
  },
});

const darkStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#333',
    paddingHorizontal: 12,
    backgroundColor: '#333',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#eee',
    backgroundColor: '#333',
  },
  searchIcon: {
    marginLeft: 8,
    color: '#999',
  },
  postItem: {
    width: itemSize,
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#333',
    overflow: 'hidden',
  },
  imageWrapper: {
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  spoilerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  spoilerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#333',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderColor: '#666',
    borderWidth: 1
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#eee',
  },
});
