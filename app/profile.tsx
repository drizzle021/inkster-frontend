import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import BottomNavigation from './components/navigation';
import TopNavigation from './components/top_navigation';
import { Link, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch, getImageUrl, getUserBannerImageUrl, getUserProfileImageUrl } from './api';
import { useSelectedPost } from './contexts/selectedPostContext';
import { useSelectedUser } from './contexts/selectedUserContext';
import FastImage from 'react-native-fast-image';
import { useTheme } from './contexts/ThemeContext';

interface UserPost {
  id: number;
  title: string;
  caption: string;
  description: string;
  post_type: string;
  software: string;
  is_spoilered: boolean;
  created_at: string;
  thumbnail: string;
}

interface UserProfile {
  id: number;
  username: string;
  email: string;
  profile_picture: string;
  banner: string;
  followers: number;
  following: number;
  posts: UserPost[];
  tags: string[];
  role: string;
  is_following?: boolean;
}


const ProfileScreen = () => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);
    const router = useRouter();

    const { theme } = useTheme();
    const styles = theme === 'dark' ? darkStyles : lightStyles;

    const [user, setUser] = useState<UserProfile | null>(null);
    const { setSelectedPost } = useSelectedPost();
    const { selectedUser } = useSelectedUser();
    const [token, setToken] = useState<string | null>(null);
    // const [profileImageError, setProfileImageError] = useState(false);
    const isDefaultProfilePicture = user?.profile_picture?.includes('default');
    const isDefaultBanner = user?.banner?.includes('background');
  

    useEffect(() => {
      const fetchData = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          if (!token) {
            console.error('No token found');
            return;
          }
    
          setToken(token);
    

          const loggedInUser = await apiFetch<UserProfile>('/users/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setLoggedInUserId(loggedInUser.data.id); 
    
          // 2. Fetch the selected profile
          const url = selectedUser ? `/users/${selectedUser.id}` : '/users/me';
          const userData = await apiFetch<UserProfile>(url, {
            headers: { Authorization: `Bearer ${token}` },
          });
    
          setUser(userData.data);
          setIsFollowing(userData.data.is_following || false);
        } catch (err: any) {
          console.error('Error loading user:', err.message || err);
        }
      };
    
      fetchData();
    }, [selectedUser]);
    

    function formatTags(tags: string[] = []) {
      return tags.map(tag => `#${tag}`).join(' ');
    }

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

    const toggleFollow = async () => {
      if (!user) return;
    
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          router.push('/auth/login');
          return;
        }
    
        // Toggle follow API
        await apiFetch(`/users/follow/${user.id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
    
        // 1. Update local follow state
        setIsFollowing((prev) => !prev);
    
        // 2. Update "followers" count for the viewed user
        setUser((prevUser) => 
          prevUser
            ? { ...prevUser, followers: prevUser.followers + (isFollowing ? -1 : 1) }
            : prevUser
        );
    
        // 3. If viewing your own profile, update "following" counter too
        if (loggedInUserId === user?.id) {
          setUser((prevUser) => 
            prevUser
              ? { ...prevUser, following: prevUser.following + (isFollowing ? -1 : 1) }
              : prevUser
          );
        }
    
      } catch (err: any) {
        console.error('Failed to toggle follow:', err.message || err);
      }
    };
    
    

    return (
        <View style={styles.container}>
            <TopNavigation />

            
            <ScrollView style={styles.scrollContainer}>
            {/* Profile Section */}
            <View style={styles.profileSection}>
              {user && token ? (
                  <>
                    <FastImage
                      source={
                        isDefaultBanner
                          ? require('../assets/images/banner_background.jpg')
                          : {
                              uri: getUserBannerImageUrl(user.banner),
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                              priority: FastImage.priority.normal,
                            }
                      }
                      style={styles.bannerPic}

                      // onError={() => setProfileImageError(true)}
                    />
                    <FastImage
                      source={
                        isDefaultProfilePicture
                          ? require('../assets/images/default.jpg')
                          : {
                              uri: getUserProfileImageUrl(user.profile_picture),
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                              priority: FastImage.priority.normal,
                            }
                      }
                      style={styles.profilePic}

                      // onError={() => setProfileImageError(true)}
                    />
                  </>
                ) : (
                  <>
                    {/* Fallback local images if user not loaded */}
                    <FastImage
                      source={require('../assets/images/banner_background.jpg')}
                      style={styles.bannerPic}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                    <FastImage
                      source={require('../assets/images/default.jpg')}
                      style={styles.profilePic}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                  </>
                )}
                <View style={styles.userInfo}>
                <View style={styles.nameFollowContainer}>
                  <View style={styles.spacer} />

                  <View style={styles.usernameContainer}>
                    <Text style={styles.userName}>{user?.username}</Text>
                  </View>

                  {loggedInUserId !== user?.id ? (
                    <TouchableOpacity
                      style={styles.followButton}
                      onPress={toggleFollow}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.followButtonText,
                        { color: '#fff' },
                      ]}>
                        {isFollowing ? 'Unfollow' : 'Follow'}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.followButtonPlaceholder} />
                  )}
                </View>


                <View>
                  <Text style={styles.tags}>{ formatTags(user?.tags) }</Text>
                </View>

                {/* Stats Section - Posts, Followers, Following */}
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{user?.posts.length}</Text>
                        <Text style={styles.statLabel}>Posts</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{user?.followers}</Text>
                        <Text style={styles.statLabel}>Followers</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{user?.following}</Text>
                        <Text style={styles.statLabel}>Following</Text>
                    </View>
                </View>

                </View>
            </View>

            {/* Posts Grid */}
            {/* <View style={styles.postsContainer}>
              {user?.posts.map((post) => (
                <TouchableOpacity activeOpacity={1} onPress={() => openImage(post.id)}>
                  <FastImage
                    source={{
                      uri: getImageUrl(post.id),
                      headers: {
                        Authorization: `Bearer ${token}`, 
                      },
                      priority: FastImage.priority.normal,
                    }}
                    style={styles.postItem}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </TouchableOpacity>
              ))}
            </View> */}

            <View style={styles.postsContainer}>
              {user?.posts && user.posts.length > 0 && (
                [...user.posts]
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) // NEW: sort by date
                  .reduce((rows: UserPost[][], post, index) => {
                    if (index % 2 === 0) rows.push([post]);
                    else rows[rows.length - 1].push(post);
                    return rows;
                  }, [])
                  .map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.postRow}>
                      {row.map((post) => (
                        <TouchableOpacity
                          key={post.id}
                          style={styles.postItem}
                          activeOpacity={0.8}
                          onPress={() => {
                            if (post.post_type === 'ILLUSTRATION') {
                              openImage(post.id);
                            } else if (post.post_type === 'NOVEL') {
                              openNovel(post.id);
                            }
                          }}
                        >
                        <View style={styles.imageWrapper}>
                          <FastImage
                            source={{
                              uri: getImageUrl(post.thumbnail),
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
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

const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    // paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 100,
    marginTop: -80,
    borderWidth: 8,
    borderColor: '#fff',
  },
  bannerPic: {
    width: '90%',
    height: 180,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  userInfo: {
    alignItems: 'center',
  },
  nameFollowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  
  spacer: {
    width: 100, // Same as button width to balance the left
  },
  
  usernameContainer: {
    flex: 1,
    alignItems: 'center',
  },
  
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  followButton: {
    width: 100,
    paddingVertical: 8,
    backgroundColor: '#7B61FF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  followButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  
  followButtonPlaceholder: {
    width: 100, // Same width as the real button
    height: 36, // Approx height of button
  },
  
  
  
  

  /* Stats Row */
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  statItem: {
    marginHorizontal: 10,
    alignItems: 'center',
    backgroundColor: '#F2F2F2',  
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
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
    aspectRatio: 1, // keep it square
    backgroundColor: '#ccc',
    borderRadius: 10,
  },
  postImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  tags: {
    color: "#7B61FF",
    fontWeight: 'bold',
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

const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContainer: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginBottom: 20,
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 100,
    marginTop: -80,
    borderWidth: 8,
    borderColor: '#333',
  },
  bannerPic: {
    width: '90%',
    height: 180,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  userInfo: {
    alignItems: 'center',
  },
  nameFollowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  spacer: {
    width: 100,
  },
  usernameContainer: {
    flex: 1,
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#eee',
  },
  followButton: {
    width: 100,
    paddingVertical: 8,
    backgroundColor: '#7B61FF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
  },
  followButtonPlaceholder: {
    width: 100,
    height: 36,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  statItem: {
    marginHorizontal: 10,
    alignItems: 'center',
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#eee',
  },
  statLabel: {
    fontSize: 14,
    color: '#999',
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
    backgroundColor: '#333',
    borderRadius: 10,
  },
  postImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  tags: {
    color: '#A7F3D0',
    fontWeight: 'bold',
  },
  imageWrapper: {
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
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
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ProfileScreen;
