import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image, ScrollView, Switch } from 'react-native';
import BottomNavigation from './components/navigation';
import TopNavigation from './components/top_navigation';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Feather';
import { Dimensions, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch, getImageUrl } from './api';
import { useTheme } from './contexts/ThemeContext';
import { useSelectedPost } from './contexts/selectedPostContext';
import FastImage from 'react-native-fast-image';
import { useSocket } from './contexts/SocketContext';

const screenWidth = Dimensions.get('window').width;
const softwares = [
  'Photoshop',
  'Clip Studio Paint',
  'Krita',
  'Procreate',
  'MS Paint',
];


export default function AddPost() {
  const { postType } = useLocalSearchParams<{ postType?: string }>();
  const resolvedPostType = Array.isArray(postType) ? postType[0] : postType;

  const { socket } = useSocket();

  const [isEditing, setIsEditing] = useState(false); 
  const [isNewPost, setIsNewPost] = useState(false);
  
  const { selectedPost } = useSelectedPost();

  const { theme } = useTheme();
  const styles = theme === 'dark' ? darkStyles : lightStyles;

  const [images, setImages] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  // const { post_type, PostType } = useLocalSearchParams();
  // const selectedImages = images ? JSON.parse(images as string) : [];


  const [selectedSoftware, setSelectedSoftware] = useState('');
  const [showSoftwareOptions, setShowSoftwareOptions] = useState(false);

  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  const [altText, setAltText] = useState('');
  const [spoiler, setSpoiler] = useState(false);

  const pickImages = async () => {
    if (postType === "NOVEL"){
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsMultipleSelection: true,
        mediaTypes: 'images',
        quality: 1,
        selectionLimit: 1,
      });
      if (!result.canceled && result.assets.length > 0) {
        setImages(result.assets);
        setIsNewPost(true);
      } else {
        router.back();
      }
    }
    else if (postType === "ILLUSTRATION"){
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsMultipleSelection: true,
        mediaTypes: 'images',
        quality: 1,
        selectionLimit: 10,
      });
      if (!result.canceled && result.assets.length > 0) {
        setImages(result.assets);
        setIsNewPost(true);
      } else {
        router.back();
      }
    }
  

  };


  const loadPost = async () => {

    if (selectedPost?.images) {
      const formattedImages = selectedPost.images.map(img => ({
        uri: getImageUrl(img.image_name),
      }));
      setImages(formattedImages);
      setTitle(selectedPost.title);
      setCaption(selectedPost.caption);
      setTags(selectedPost.tags.join(', '));
      setAltText(selectedPost.description);
      setSpoiler(selectedPost.is_spoilered);
      setSelectedSoftware(selectedPost.software);
      setIsEditing(true);
    } else {

      setImages([]); 
    }

    
  };

  useEffect(() => {
    if (!selectedPost && !isNewPost){
      pickImages();

    } else if (selectedPost && !isEditing) {
      loadPost();

    }


  }, [selectedPost, pickImages, isEditing]);

  const submitPost = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
  
      const formData = new FormData();
      formData.append('title', title);
      formData.append('caption', caption);
      formData.append('description', altText);
      formData.append('is_spoilered', spoiler.toString());
      formData.append('software', 'Procreate');
      formData.append('post_type', resolvedPostType);
      formData.append('software', selectedSoftware);


      formData.append('tags', tags);

  
      // Append image files
      if (!isEditing){
        images.forEach((img, index) => {
          const uriParts = img.uri.split('.');
          const fileType = uriParts[uriParts.length - 1];
        
          formData.append('images', {
            uri: img.uri,
            name: `image_${index}.${fileType}`,
            type: `image/${fileType}`,
          } as any);
        });
      }

  
      if (isEditing){

        const res = await apiFetch(`/posts/${selectedPost?.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });
        console.log(res)
      }

      if (!isEditing){
        const res = await apiFetch('/posts', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });


        socket?.emit('new_post', {
          token: token,
          post_title: title,
        });
      }






      
      router.push('/profile');
    } catch (err: any) {
      const errorText = err?.error || err?.message || '';
    
      if (typeof errorText === 'string' && errorText.toLowerCase().includes('file size exceeds the limit')) {
        Alert.alert(
          'Image too large',
          'One or more selected images exceed the size limit. Please choose smaller images.',
          [
            {
              text: 'OK',
              onPress: () => {
                pickImages();
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        alert('Error creating post: ' + errorText);
      }
    }
    
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
                <FastImage
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
            maxLength={100}
          />

          <Text style={styles.label}>Caption<Text style={styles.required}>*</Text></Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter caption..."
            value={caption}
            onChangeText={setCaption}
            multiline
            maxLength={3000}
          />

          <Text style={styles.label}>Tags<Text style={styles.required}>*</Text> (comma separated)</Text>
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
            maxLength={300}
          />
          <Text style={styles.helperText}>Adding description (alt-text) can help people with vision impairment</Text>

          <View style={styles.switchRow}>
            <Switch value={spoiler} onValueChange={setSpoiler}/>
            <Text style={styles.switchLabel}>Spoiler/NSFW</Text>
          </View>

          <View>
            <TouchableOpacity
              style={styles.softwareRow}
              onPress={() => setShowSoftwareOptions(!showSoftwareOptions)}
            >
              <Text style={styles.softwareText}>Software: {selectedSoftware}</Text>
              <Icon name={showSoftwareOptions ? 'chevron-up' : 'chevron-down'} size={20} />
            </TouchableOpacity>

            {showSoftwareOptions && (
              <View style={styles.softwareDropdown}>
                {softwares.map((software) => (
                  <TouchableOpacity
                    key={software}
                    style={styles.radioContainer}
                    onPress={() => {
                      setSelectedSoftware(software);
                      // setShowSoftwareOptions(false);
                    }}
                  >
                    <View style={styles.outerCircle}>
                      {selectedSoftware === software && <View style={styles.innerCircle} />}
                    </View>
                    <Text style={styles.radioText}>{software.replace('_', ' ')}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>



          <TouchableOpacity style={styles.postButton} onPress={submitPost}>
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNavigation />
    </View>
  );
}

const lightStyles = StyleSheet.create({
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
  optionsContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingLeft: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  // optionsContainer: {
  //   flex: 1,
  //   marginLeft: 20,
  // },
  outerCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  innerCircle: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#000',
  },
  radioText: {
    fontSize: 15,
    textTransform: 'capitalize',
  },
  softwareDropdown: {
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    zIndex: 100,

  },
  spoilerSwitch: {
    color: "fff"
  }
});


const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  imageCarouselContainer: {
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#1a1a1a'
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
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: '#eee',
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
    color: '#eee',
  },
  required: {
    color: '#ff4d4d',
  },
  input: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
    fontSize: 14,
    backgroundColor: '#333',
    color: '#eee',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: 12,
    color: '#999',
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
    color: '#eee',
  },
  softwareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#333',
    marginBottom: 30,
  },
  softwareText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#eee',
  },
  postButton: {
    backgroundColor: '#7B61FF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  postButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  optionsContainer: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingLeft: 10,
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 4,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  outerCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#666',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  innerCircle: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#7B61FF',
  },
  radioText: {
    fontSize: 15,
    textTransform: 'capitalize',
    color: '#eee',
  },
  softwareDropdown: {
    left: 0,
    right: 0,
    backgroundColor: '#1a1a1a',
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    zIndex: 100,
  },
  spoilerSwitch: {
    color: "fff"
  }
});