import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image, ScrollView, Switch } from 'react-native';
import BottomNavigation from './components/navigation';
import TopNavigation from './components/top_navigation';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Feather';
import { Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';


const screenWidth = Dimensions.get('window').width;

export default function AddPost() {
  const { postType } = useLocalSearchParams();
  const [images, setImages] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  // const { images, postType } = useLocalSearchParams();
  // const selectedImages = images ? JSON.parse(images as string) : [];


  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  const [altText, setAltText] = useState('');
  const [spoiler, setSpoiler] = useState(false);


  useEffect(() => {
    (async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsMultipleSelection: true,
        mediaTypes: 'images',
        quality: 1,
        selectionLimit: 10,
      });

      if (!result.canceled && result.assets.length > 0) {
        setImages(result.assets);
      } else {
        router.back(); // go back if user cancels
      }
    })();
  }, []);

  const openProfile = async () => {
    router.push('../profile');
  };

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setCurrentIndex(index);

  };

  return (
    <View style={styles.container}>
      <TopNavigation />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.imageCarouselContainer}>
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            onScroll={handleScroll}
            renderItem={({ item }) => {
              return (
                <Image
                  source={{ uri: item.uri }}
                  style={styles.carouselImage}
                />
              );
            }}
          />
          <Text style={styles.imageIndex}>
            {currentIndex + 1}/{images.length}
          </Text>
        </View>


        <View style={styles.form}>
          <Text style={styles.label}>Title<Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Enter title..."
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Caption</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter caption..."
            value={caption}
            onChangeText={setCaption}
            multiline
          />

          <Text style={styles.label}>Tags<Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Enter tags..."
            value={tags}
            onChangeText={setTags}
          />

          <Text style={styles.label}>Description (alt-text)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter description..."
            value={altText}
            onChangeText={setAltText}
          />
          <Text style={styles.helperText}>Adding description (alt-text) can help people with vision impairment</Text>

          <View style={styles.switchRow}>
            <Switch value={spoiler} onValueChange={setSpoiler} />
            <Text style={styles.switchLabel}>Spoiler/NSFW</Text>
          </View>

          <TouchableOpacity style={styles.softwareRow}>
            <Text style={styles.softwareText}>Software</Text>
            <Icon name="chevron-right" size={20} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.postButton} onPress={openProfile}>
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  imageCarouselContainer: {
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#000'
  },
  carouselImage: {
    alignItems: 'center',
    width: screenWidth,
    height: 200,
    resizeMode: 'contain',
  },
  imageIndex: {
    position: 'absolute',
    bottom: 5,
    alignSelf: 'center',
    fontSize: 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  
  form: {
    marginTop: 20,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  required: {
    color: 'red',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 10,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchLabel: {
    marginLeft: 10,
    fontSize: 14,
  },
  softwareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginBottom: 30,
  },
  softwareText: {
    fontSize: 14,
    fontWeight: '500',
  },
  postButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
