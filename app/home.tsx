import React, { useState, useEffect } from 'react';
import {
  Dimensions, View, Text, Image, StyleSheet,
  TouchableOpacity, ScrollView, FlatList, NativeSyntheticEvent, NativeScrollEvent, Button
} from 'react-native';
import BottomNavigation from './components/navigation';
import TopNavigation from './components/top_navigation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Feather';
import { useRouter } from 'expo-router';
import { SheetManager } from 'react-native-actions-sheet';
import { TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch, getImageUrl, getUserProfileImageUrl } from './api';
import { useSelectedPost } from './contexts/selectedPostContext';
import { useSelectedUser } from './contexts/selectedUserContext';
import FastImage from 'react-native-fast-image';
import { BlurView } from 'expo-blur';
import { useTheme } from './contexts/ThemeContext';
import { PostType } from './contexts/selectedPostContext'
import analytics from '@react-native-firebase/analytics';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';

const screenWidth = Dimensions.get('window').width;


const PostCarousel = ({images,onImageTap}: {
  images: any[];
  onImageTap: (index: number) => void;
}) => {
  const [index, setIndex] = useState(0);
  const screenWidth = Dimensions.get('window').width;
  const { theme } = useTheme();
  const styles = theme === 'dark' ? darkStyles : lightStyles;
  
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setIndex(newIndex);
  };

  return (
    <TouchableWithoutFeedback onPress={() => onImageTap(index)}>
      <View>
        <FlatList
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <Image source={item} style={styles.carouselImage} />
          )}
        />
        <View style={styles.dotContainer}>
          {images.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.activeDot]} />
          ))}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};


interface PostNovelProps {
  post: PostType;
  onDeletePost: (deletedPostId: number) => void;
}


const PostIllustration = ({ post, onDeletePost }: { post: any, onDeletePost: (deletedPostId: number) => void }) => {
  const [likedPost, setLikedPost] = useState(post.is_liked);
  const [savedPost, setSavedPost] = useState(post.is_saved);
  const [token, setToken] = useState<string | null>(null);
  const { setSelectedPost } = useSelectedPost();
  const { setSelectedUser } = useSelectedUser();
  const [profileImageError, setProfileImageError] = useState(false);
  const { theme } = useTheme();
  const styles = theme === 'dark' ? darkStyles : lightStyles;

  const { currentUser } = useSelectedUser();
  const isOwner = post.author.id === currentUser?.id;

  const router = useRouter();

  const [userId, setUserId] = useState<number | null>(null);

  const getRelativeTime = (dateString: string): string => {
    const now = new Date().getTime();
    const posted = new Date(dateString).getTime();
    const diff = Math.floor((now - posted) / 1000); // in seconds
  
    const intervals: [Intl.RelativeTimeFormatUnit, number][] = [
      ['year', 31536000],
      ['month', 2592000],
      ['week', 604800],
      ['day', 86400],
      ['hour', 3600],
      ['minute', 60],
      ['second', 1],
    ];
  
    for (let i = 0; i < intervals.length; i++) {
      const [label, seconds] = intervals[i];
      const value = Math.floor(diff / seconds);
      if (value > 0) {
        return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(-value, label);
      }
    }
  
    return 'just now';
  };
  
  const handleLike = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        router.push('/auth/login');
        return;
      }
  
      await apiFetch(`/posts/like/${post.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const newLikeState = !likedPost;
      setLikedPost(newLikeState);

      await analytics().logEvent('post_like_toggle', {
        post_id: post.id.toString(),
        liked: newLikeState,
        author_id: post.author.id.toString(),
        post_type: post.post_type,
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

      await apiFetch(`/posts/save/${post.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const newSaveState = !savedPost;
      setSavedPost(newSaveState);

      await analytics().logEvent('post_save_toggle', {
        post_id: post.id.toString(),
        saved: newSaveState,
        author_id: post.author.id.toString(),
        post_type: post.post_type,
      });
    } catch (err: any) {
      console.error('Failed to save post:', err.message || err);
    }
  };


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
      // console.log(post.data)

      await analytics().logEvent('post_image_opened', {
        post_id: post.data.id.toString(),
        author_id: post.data.author.id.toString(),
        post_type: post.data.post_type,
      });

      router.push({
        pathname: '/imageViewer',
        params: { 
          source: 'home'  
        },
      });
    } catch (err) {
      console.error('Failed to load post details', err);
    }
  };

  const openComments = async (postId: number) => {
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
      SheetManager.show('comments-sheet')
    } catch (err) {
      console.error('Failed to load post details', err);
    }
  };

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

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      setToken(storedToken);
    };
    loadToken();

  }, []);
  

  return (
    <View style={styles.postContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => openProfile(post.author.id)}>
          <FastImage
            source={
              post.author?.profile_picture.includes('default')
                ? require('../assets/images/default.jpg')
                : {
                    uri: getUserProfileImageUrl(post.author.profile_picture),
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                    priority: FastImage.priority.normal,
                  }
            }
            style={styles.avatar}
            // onError={() => setProfileImageError(true)}
          />
        </TouchableOpacity>

        {/* Flex container for username and title */}
        <TouchableOpacity onPress={() => openProfile(post.author.id)} style={styles.textContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.name} numberOfLines={1}>{post.author.username}</Text>
            <Text style={styles.subtext} numberOfLines={1}>{post.title}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuIconContainer}
          onPress={() => {
            setSelectedPost(post);
            SheetManager.show('post-actions', {
              payload: {
                // onDeletePost,
                source: 'home',
                position: 0,
                isOwner,
              }
            });
          }}
        >
          <Icon name="more-vertical" size={24} color="gray" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity activeOpacity={1} onPress={() => openImage(post.id)}>
        {/* <PostCarousel images={post.images} onImageTap={openImage} /> */}
        {/* <Image source={require('../assets/images/penguin.png')} style={styles.carouselImage}/> */}
        {/* <Image
          source={{ uri: getImageUrl(post.id, 1) }}
          style={styles.carouselImage}
        /> */}
        <View style={styles.imageWrapper}>
          {token && (
            <FastImage
              source={{
                uri: getImageUrl(post.thumbnail),
                headers: { Authorization: `Bearer ${token}` },
                priority: FastImage.priority.normal,
              }}
              style={styles.carouselImage}
              resizeMode={FastImage.resizeMode.cover}
            />

          )}

          {post.is_spoilered && (
            <View style={styles.spoilerOverlay}>
              <Text style={styles.spoilerText}>Spoilered</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity onPress={
            handleLike
          }
        >
          <FontAwesome
            name={likedPost ? 'heart' : 'heart-o'}
            size={24}
            color={likedPost ? 'red' : 'black'}
            style={styles.likeButton}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.commentIcon}
          onPress={() => openComments(post.id)}>
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
      <Button
        title="Press me"
        // Logs in the firebase analytics console as "select_content" event
        // only accepts the two object properties which accept strings.
        onPress={async () =>
          await analytics().logSelectContent({
            content_type: 'clothing',
            item_id: 'abcd',
          })
        }
      />
      <Text style={styles.caption}>{post.caption}</Text>
      <Text style={styles.timestamp}>{post.created_at}</Text>    
      <Text style={styles.caption}>ID: {post.id}</Text>

    </View>
  );
};



const PostNovel: React.FC<PostNovelProps> = ({ post, onDeletePost }) => {
  const { setSelectedPost } = useSelectedPost();
  const { setSelectedUser } = useSelectedUser();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const { theme } = useTheme();
  const styles = theme === 'dark' ? darkStyles : lightStyles;
  const { currentUser } = useSelectedUser();
  const isOwner = post.author.id === currentUser?.id;

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      setToken(storedToken);
    };
    loadToken();
  }, []);

  const openProfile = async (userId: number) => {
    const user = await apiFetch(`/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSelectedUser(user.data);
    router.push('/profile');
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
      // console.log(post.data)

      await analytics().logEvent('post_novel_opened', {
        post_id: post.data.id.toString(),
        author_id: post.data.author.id.toString(),
        post_type: post.data.post_type,
      });

      router.push('/openedNovel');
    } catch (err) {
      console.error('Failed to load post details', err);
    }
  };

  return (
    <View style={styles.novelContainer}>
      <TouchableOpacity onPress={() => openNovel(post.id)}>
        <FastImage
          source={{
            uri: getImageUrl(post.thumbnail),
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }}
          style={styles.novelThumbnail}
        />
        {post.is_spoilered && (
            <View style={styles.spoilerOverlayNovel}>
              <Text style={styles.spoilerTextNovel}>Spoilered</Text>
            </View>
        )}
      </TouchableOpacity>
        <View style={styles.novelContent}>
          <TouchableOpacity onPress={() => openNovel(post.id)}>
            <Text style={styles.novelTitle}>{post.title}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => openProfile(post.author.id)}>
            <Text style={styles.novelAuthor}>by {post.author.username}</Text>
          </TouchableOpacity>

          <View style={styles.novelTags}>
            {post.tags && post.tags.map((tag: string, index: number) => (
              <Text key={index} style={styles.novelTag}>#{tag} </Text>
            ))}
          </View>

          <Text style={styles.novelTime}>{post.created_at}</Text>
        </View>

        {/* <TouchableOpacity style={styles.novelMenu}>
          <Icon name="more-vertical" size={20} style={styles.iconColor} />
        </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.novelMenu}
          onPress={() => {
            setSelectedPost(post);
            SheetManager.show('post-actions', {
              payload: {
                // onDeletePost,
                source: 'home',
                position: 0,
                isOwner,
              }
            });
          }}
        >
          <Icon name="more-vertical" size={20} style={styles.iconColor} />
        </TouchableOpacity>
    </View>
  );
};

const HomeScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Illustration');
  const [data, setData] = useState<PostType[]>([]);
  const { theme } = useTheme();
  const styles = theme === 'dark' ? darkStyles : lightStyles;
  const { setCurrentUser } = useSelectedUser();

  const openSearch = async () => {
    router.push('./search');
  };

  const requestAndroidNotificationPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Notification permission granted');
        return true;
      } else {
        console.warn('Notification permission denied');
        return false;
      }
    } catch (err) {
      console.error('Failed to request notification permission', err);
      return false;
    }
  } else {
    // Pre-Android 13 or iOS (no POST_NOTIFICATIONS permission needed)
    return true;
  }
};

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          console.warn('Token expired. Redirecting to login.');
          await AsyncStorage.removeItem('token');
          router.push('/auth/login');
          return;
        }
  
        const posts = await apiFetch<PostType[]>('/posts', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        const sorted = [...posts.data].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        
        await AsyncStorage.setItem('cachedPosts', JSON.stringify(sorted));
        
        setData(sorted);
      } catch (err: any) {
        
        const cached = await AsyncStorage.getItem('cachedPosts');
        if (cached) {
          setData(JSON.parse(cached));
          console.log('Loaded posts from cache');
        } else {
          console.error('No cached posts available');
        }
      }
    };

    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const response = await apiFetch('/users/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCurrentUser(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      }
    };
  
    fetchUser();
  
    fetchPosts();
  }, []);
  
  useEffect(() => {
    const setupFCM = async () => {
      const permissionGranted = await requestAndroidNotificationPermission();
      if (!permissionGranted) return;
      // console.log(permissionGranted)
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      console.log(enabled)
      if (enabled) {
        const fcmToken = await messaging().getToken();
        await AsyncStorage.setItem('fcmToken', fcmToken);
        console.log(fcmToken)
        const token = await AsyncStorage.getItem('token');
        
        // Send this token to your backend to associate with the logged-in user
        await apiFetch('/users/fcm-token', {
          method: 'POST',
          body: JSON.stringify({ token: fcmToken }),
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    };
    setupFCM();
  }, []);
  

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
      {data
        .filter((post) => {
          if (activeTab === 'Novels') return post.post_type === 'NOVEL';
          if (activeTab === 'Illustration') return post.post_type === 'ILLUSTRATION';
          return true;
        })
        .map((post, index) =>
          post.post_type === 'ILLUSTRATION' ? (
            <PostIllustration
              key={index}
              post={post}
              onDeletePost={(deletedPostId: number) => {
                setData(prevData => prevData.filter(p => p.id !== deletedPostId));
              }}
            />
          ) : (
            <PostNovel
              key={index}
              post={post}
              onDeletePost={(deletedPostId: number) => {
                setData(prevData => prevData.filter(p => p.id !== deletedPostId));
              }}
            />
          )
        )
        
      }
      </ScrollView>

      <BottomNavigation />
    </View>
  );
};

const lightStyles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  subtext: {
    fontSize: 12,
    color: 'gray',
  },
  menuIconContainer: {
    paddingLeft: 10,
    paddingRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  swipeIcon: {
    marginLeft: '70%', 
    color: 'gray',
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
    marginBottom: 30,
  },
  tabItem: {
    flex: 1, 
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16, 
    color: '#000',
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
  carouselImage: {
    width: screenWidth,
    height: 300,
    resizeMode: 'cover',
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#000',
  },
  imageWrapper: {
    position: 'relative',
    width: screenWidth,
    height: 300,
    overflow: 'hidden',
  },
  
  spoilerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  spoilerOverlayNovel: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
    zIndex: 10,
  },
  spoilerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  spoilerTextNovel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  novelContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  novelThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#ccc',
  },
  novelContent: {
    flex: 1,
  },
  novelTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  novelAuthor: {
    color: '#444',
    fontSize: 14,
  },
  novelExcerpt: {
    color: '#666',
    fontSize: 13,
    marginTop: 2,
  },
  novelTags: {
    color: '#7B61FF',
    fontSize: 13,
    marginTop: 2,
    flexDirection: 'row'
  },
  novelTag: {
    color: '#7B61FF',
    fontSize: 13,
    marginRight: 5, 
  },
  novelTime: {
    color: 'gray',
    fontSize: 12,
    marginTop: 2,
  },
  novelMenu: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#eee',
  },
  subtext: {
    fontSize: 12,
    color: '#999',
  },
  menuIconContainer: {
    paddingLeft: 10,
    paddingRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeIcon: {
    marginLeft: '70%',
    color: '#999',
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
    color: '#eee',
  },
  timestamp: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
    marginLeft: 10,
  },
  topTabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 30,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    color: '#fff',
  },
  activeTabText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  postContainer: {
    marginBottom: 30,
    paddingBottom: 10,
    borderColor: '#333',
    borderBottomWidth: 1,
  },
  carouselImage: {
    width: screenWidth,
    height: 300,
    resizeMode: 'cover',
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#555',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#fff',
  },
  imageWrapper: {
    position: 'relative',
    width: screenWidth,
    height: 300,
    overflow: 'hidden',
  },
  spoilerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgb(0, 0, 0)',
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
  spoilerOverlayNovel: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
    zIndex: 10,
  },
  spoilerTextNovel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  novelContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#333',
  },
  novelThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#333',
  },
  novelContent: {
    flex: 1,
  },
  novelTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#eee',
  },
  novelAuthor: {
    color: '#999',
    fontSize: 14,
  },
  novelExcerpt: {
    color: '#666',
    fontSize: 13,
    marginTop: 2,
  },
  novelTags: {
    color: '#7B61FF',
    fontSize: 13,
    marginTop: 2,
    flexDirection: 'row'
  },
  novelTag: {
    color: '#7B61FF',
    fontSize: 13,
    marginRight: 5,
  },
  novelTime: {
    color: '#999',
    fontSize: 12,
    marginTop: 2,
  },
  novelMenu: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
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

export default HomeScreen;
