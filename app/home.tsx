import React, { useState } from 'react';
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

const screenWidth = Dimensions.get('window').width;


const PostCarousel = ({
  images,
  onImageTap,
}: {
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




const Post = ({ post }: { post: any }) => {
  const [likedPost, setLikedPost] = useState(false);
  const router = useRouter();

  const openImage = async () => {
    router.push('./imageViewer');
  };

  return (
    <View style={styles.postContainer}>
      <View style={styles.header}>
        <Image source={require('../assets/images/penguin.png')} style={styles.avatar} />
        <View>
          <Text style={styles.name}>{post.user}</Text>
          <Text style={styles.subtext}>{post.title}</Text>
        </View>
        <TouchableOpacity style={styles.menuIcon} onPress={() => SheetManager.show('post-actions')}>
          <Icon name="more-vertical" size={25} style={styles.menuIcon} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity  activeOpacity={1}>
        <PostCarousel images={post.images} onImageTap={openImage} />
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => setLikedPost(!likedPost)}>
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
      </View>

      <Text style={styles.caption}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
      </Text>
      <Text style={styles.timestamp}>8m ago</Text>
    </View>
  );
};

const HomeScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Illustration');

  const posts = [
    {
      id: '1',
      user: 'Name',
      title: 'post name',
      images: [
        require('../assets/images/bing.png'),
        require('../assets/images/penguin.png'),
      ],
    },
    {
      id: '2',
      user: 'Name',
      title: 'post name',
      images: [
        require('../assets/images/penguin.png'),
        require('../assets/images/bing.png'),
        require('../assets/images/penguin.png'),
      ],
    },
  ];

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
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
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
    marginLeft: '48%', 
    color: 'gray',
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
});

export default HomeScreen;
