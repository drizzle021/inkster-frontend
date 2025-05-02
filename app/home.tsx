import React, { useState, useEffect } from 'react';
import {
  Dimensions, View, Text, Image, StyleSheet,
  TouchableOpacity, ScrollView, FlatList, NativeSyntheticEvent, NativeScrollEvent
} from 'react-native';
import BottomNavigation from './components/navigation';
import TopNavigation from './components/top_navigation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Feather';
import { useRouter } from 'expo-router';
import { SheetManager } from 'react-native-actions-sheet';
import { TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch, getImageUrl } from './api';
import { useSelectedPost } from './contexts/selectedPostContext';
import { useSelectedUser } from './contexts/selectedUserContext';
import FastImage from 'react-native-fast-image';
import { BlurView } from 'expo-blur';

const screenWidth = Dimensions.get('window').width;


const PostCarousel = ({images,onImageTap}: {
  images: any[];
  onImageTap: (index: number) => void;
}) => {
  const [index, setIndex] = useState(0);
  const screenWidth = Dimensions.get('window').width;

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

interface PostType {
  id: string | number;
  title: string;
  caption: string;
  post_type: string;
  created_at: string;
  author: {
    username: string;
    profile_picture: string;
  };
  tags: string[];
  is_liked: boolean;
  is_saved: boolean;
  // images?: string[]; // if you want to use this later
}

declare module 'react-native-actions-sheet' {
  interface Sheets {
    'post-actions': {
      onDeletePost?: (deletedPostId: number) => void;
    };
  }
}


const Post = ({ post, onDeletePost }: { post: any, onDeletePost: (deletedPostId: number) => void }) => {
  const [likedPost, setLikedPost] = useState(post.is_liked);
  const [savedPost, setSavedPost] = useState(post.is_saved);
  const [token, setToken] = useState<string | null>(null);
  const { setSelectedPost } = useSelectedPost();
  const { setSelectedUser } = useSelectedUser();
  const router = useRouter();

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
      console.log(post.id)
      setLikedPost(!likedPost); 
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
      console.log('Saved post:', post.id);
      setSavedPost(!savedPost);
    } catch (err: any) {
      console.error('Failed to save post:', err.message || err);
    }
  };

  // const openImage = async () => {
  //   setSelectedPost(post);
  //   router.push('/imageViewer');
  // };
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
          <Image source={require('../assets/images/penguin.png')} style={styles.avatar} />
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
                onDeletePost,
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
          <FastImage
            source={{
              uri: getImageUrl(post.id),
              headers: {
                Authorization: `Bearer ${token}`, 
              },
              priority: FastImage.priority.normal,
            }}
            style={styles.carouselImage}
            resizeMode={FastImage.resizeMode.cover}
          />

          {post.is_spoilered && (
            <View style={styles.spoilerOverlay}>
              <Text style={styles.spoilerText}>Spoilered</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity onPress={handleLike}>
          <FontAwesome
            name={likedPost ? 'heart' : 'heart-o'}
            size={24}
            color={likedPost ? 'red' : 'black'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.commentIcon}
          onPress={() => SheetManager.show('comments-sheet')}>
          <Icon name="message-circle" size={24} />
        </TouchableOpacity>
        {/* <Icon name="more-horizontal" size={25} style={styles.swipeIcon} /> */}
        <TouchableOpacity
          style={styles.commentIcon}
          onPress={handleSave}>
          <FontAwesome
            name={savedPost ? 'bookmark' : 'bookmark-o'}
            size={24}
            color={savedPost ? '#7B61FF' : 'black'}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.caption}>{post.caption}</Text>
      {/* <Text style={styles.timestamp}>{getRelativeTime(post.created_at)}</Text>     */}
      <Text style={styles.caption}>ID: {post.id}</Text>

    </View>
  );
};

const HomeScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Illustration');
  const [data, setData] = useState<PostType[]>([]);

  // const posts = [
  //   {
  //     id: '1',
  //     user: 'Name',
  //     title: 'post name',
  //     images: [
  //       require('../assets/images/bing.png'),
  //       require('../assets/images/penguin.png'),
  //     ],
  //   },
  //   {
  //     id: '2',
  //     user: 'Name',
  //     title: 'post name',
  //     images: [
  //       require('../assets/images/penguin.png'),
  //       require('../assets/images/bing.png'),
  //       require('../assets/images/penguin.png'),
  //     ],
  //   },
  // ];

  const openSearch = async () => {
    router.push('./search');
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
  
        setData(posts.data);
      } catch (err: any) {
        console.error('Error fetching posts:', err.message || err);
      }
    };
  
    fetchPosts();
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
        .map((post, index) => (
          <Post 
            key={index} 
            post={post} 
            onDeletePost={(deletedPostId) => {
              setData(prevData => prevData.filter(p => p.id !== deletedPostId));
            }} 
          />
        ))
      }
      </ScrollView>

      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
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
  
  spoilerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;
