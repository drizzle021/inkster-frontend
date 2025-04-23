import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import BottomNavigation from './components/navigation';
import TopNavigation from './components/top_navigation';
import { Link, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface UserPost {
  id: number;
  title: string;
  caption: string;
  description: string;
  post_type: string;
  software: string;
  is_spoilered: boolean;
  created_at: string;
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
}


const ProfileScreen = () => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);
    const router = useRouter();

    const [user, setUser] = useState<UserProfile | null>(null);
    useEffect(() => {
      const fetchUser = async () => {
        const token = await AsyncStorage.getItem('token');
        try {
          const res = await fetch('http://localhost:5000/users/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
    
          if (!res.ok) throw new Error('Failed to fetch user');
          const data = await res.json();
          setUser(data); 
          setLoggedInUserId(data.id);
        } catch (err) {
          console.error('Error loading user:', err);
        }
      };
    
      fetchUser();
    }, []);
    
    const openPost = async () => {
        router.push('/profile');
    };

    const toggleFollow = () => {
        setIsFollowing((prev) => !prev);  // Toggle follow/unfollow
    };

    return (
        <View style={styles.container}>
            <TopNavigation />

            
            <ScrollView style={styles.scrollContainer}>
            {/* Profile Section */}
            <View style={styles.profileSection}>
                <Image
                    source={require('../assets/images/banner_background.jpg')}
                    style={styles.bannerPic}
                />
                <Image 
                source={require('../assets/images/bing.png')} 
                style={styles.profilePic} 
                />
                <View style={styles.userInfo}>
                <View style={styles.nameFollowContainer}>
                    {/* Empty left column */}
                    <View style={styles.column}></View>
                    
                    {/* Center column for name */}
                    <Text style={styles.userName}>{user?.username}</Text>
                    
                    {/* Right column for follow button */}
                    {loggedInUserId !== user?.id && (
                      <TouchableOpacity
                      style={[
                      styles.followButton,
                      {
                          backgroundColor: isFollowing ? '#fff' : '#7B61FF', 
                          borderColor: isFollowing ? '#7B61FF' : 'transparent', 
                          borderWidth: isFollowing ? 2 : 2, 
                      },
                      ]}
                      onPress={toggleFollow}>
                        <Text
                        style={[
                            styles.followButtonText,
                            { color: isFollowing ? '#7B61FF' : '#fff' }, 
                        ]}
                        >
                        {isFollowing ? 'Unfollow' : 'Follow'}
                        </Text>
                      </TouchableOpacity>
                    )}

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
            <View style={styles.postsContainer}>
            <View style={styles.postsContainer}>
              {user?.posts.map((post) => (
                <TouchableOpacity
                  key={post.id}
                  style={styles.postItem}
                  onPress={openPost}
                >
                  <View style={styles.postItem}>
                    <Text>{post.title}</Text>
                  </View>
                </TouchableOpacity>
              ))}
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
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',  
  },
  column: {
    flex: 1,
    justifyContent: 'center',  
    alignItems: 'center',       
  },
  userName: {
    fontSize: 24,
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',  
  },
  followButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    width: 100,  
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 20
  },
  followButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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

export default ProfileScreen;
