import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import BottomNavigation from './components/navigation';
import TopNavigation from './components/top_navigation';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch, getImageUrl } from './api';
import FastImage from 'react-native-fast-image';
import { useSelectedPost } from './contexts/selectedPostContext';

const SavedPostsScreen = () => {
    const router = useRouter();
    const [savedPosts, setSavedPosts] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'Illustration' | 'Novels'>('Illustration');
    const [token, setToken] = useState<string | null>(null);
    const { setSelectedPost } = useSelectedPost();

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (!storedToken) {
          console.error('No token found');
          router.push('/auth/login');
          return;
        }
        setToken(storedToken);

        const posts = await apiFetch('/users/saved', {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        setSavedPosts(posts.data);
      } catch (err: any) {
        console.error('Error fetching saved posts:', err.message || err);
      }
    };

    fetchSavedPosts();
  }, []);

  const openImage = async (postId: number) => {
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
      router.push('/imageViewer');
    } catch (err) {
      console.error('Failed to load post details', err);
    }
  };

  const filteredPosts = savedPosts.filter(post => {
    const type = post.post_type?.toUpperCase();
    if (activeTab === 'Illustration') return type === 'ILLUSTRATION';
    if (activeTab === 'Novels') return type === 'NOVEL';
    return true;
  });

  return (
    <View style={styles.container}>
      <TopNavigation />

      {/* Tabs */}
      <View style={styles.postType}>
        <TouchableOpacity style={styles.postGroup} onPress={() => setActiveTab('Illustration')}>
          <Text style={[styles.label, activeTab === 'Illustration' && styles.activeTab]}>
            Illustrations
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.postGroup} onPress={() => setActiveTab('Novels')}>
          <Text style={[styles.label, activeTab === 'Novels' && styles.activeTab]}>
            Novels
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <Text style={styles.label}>Saved</Text>
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.postsContainer}>
          {filteredPosts.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 50 }}>No saved posts yet!</Text>
          ) : (
            [...filteredPosts]
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) // sort
              .reduce((rows: any[][], post, index) => {
                if (index % 2 === 0) rows.push([post]);
                else rows[rows.length - 1].push(post);
                return rows;
              }, [])
              .map((row, rowIndex) => (
                <View key={rowIndex} style={styles.postRow}>
                  {row.map(post => (
                    <TouchableOpacity
                      key={post.id}
                      style={styles.postItem}
                      activeOpacity={0.8}
                      onPress={() => openImage(post.id)}
                    >
                    <View style={styles.imageWrapper}>
                      <FastImage
                        source={{
                          uri: post.images && post.images.length > 0 ? post.images[0] : getImageUrl(post.id),
                          headers: { Authorization: `Bearer ${token}` },
                          priority: FastImage.priority.normal,
                        }}
                        style={styles.postImage}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                      {post.is_spoilered && (
                        <View style={styles.spoilerOverlay}>
                          <Text style={styles.spoilerText}>Spoilered</Text>
                        </View>
                      )}
                    </View>
                    </TouchableOpacity>
                  ))}
                </View>
              ))
          )}
        </View>
      </ScrollView>

      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  postType: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
  },
  postGroup: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: '#000',
  },
  header: {
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
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  postItem: {
    width: '48%',
    aspectRatio: 1, 
    backgroundColor: '#ccc',
    borderRadius: 10,
  },
  postImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  imageWrapper: {
    position: 'relative',

    borderRadius: 10,
    overflow: 'hidden',
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
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SavedPostsScreen;
