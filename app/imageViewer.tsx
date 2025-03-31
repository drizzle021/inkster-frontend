import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  Dimensions, TouchableOpacity, Image,
  ScrollView, NativeSyntheticEvent, NativeScrollEvent
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useRouter } from 'expo-router';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const hardcodedImages = [
  require('../assets/images/bing.png'),
  require('../assets/images/penguin.png'),
];

export default function ImageViewer() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setCurrentIndex(index);
  };

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.container}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
    >
      {/* Image Viewer */}
      <FlatList
        data={hardcodedImages}
        horizontal
        pagingEnabled
        keyExtractor={(_, i) => i.toString()}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        renderItem={({ item }) => (
          <Image source={item} style={styles.image} resizeMode="contain" />
        )}
      />

      {/* Slide-up Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.handleBar} />

        <View style={styles.userRow}>
          <Image source={require('../assets/images/penguin.png')} style={styles.avatar} />
          <Text style={styles.username}>Name</Text>
          <Icon name="message-circle" size={20} style={styles.icon} />
          <Text style={styles.stat}>500</Text>
          <Icon name="heart" size={20} style={styles.icon} />
          <Text style={styles.stat}>2.8k</Text>
        </View>

        <Text style={styles.title}>Post Name</Text>
        <Text style={styles.description}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
        </Text>
        <Text style={styles.timestamp}>8m ago</Text>
        <Text style={styles.software}>
          <Text style={{ fontWeight: 'bold' }}>Software:</Text> Clip Studio Paint
        </Text>
        <Text style={styles.tags}>
          <Text style={styles.tag}>#lorem </Text>
          <Text style={styles.tag}>#ipsum </Text>
          <Text style={styles.tag}>#dolor </Text>
          <Text style={styles.tag}>#sit </Text>
          <Text style={styles.tag}>#amet</Text>
        </Text>
      </View>

      <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
        <Icon name="x" size={28} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.imageCount}>
        {currentIndex + 1}/{hardcodedImages.length}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  image: {
    width: screenWidth,
    height: screenHeight,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  imageCount: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    color: '#fff',
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  detailsContainer: {
    backgroundColor: '#fff',
    marginTop: -100,
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
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
  },
  icon: {
    marginLeft: 10,
  },
  stat: {
    marginLeft: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 10,
  },
  software: {
    fontSize: 14,
    marginBottom: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    color: '#7B61FF',
    fontSize: 14,
  },
});
