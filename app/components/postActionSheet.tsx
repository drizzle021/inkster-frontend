import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import ActionSheet from 'react-native-actions-sheet';
import { SheetManager } from 'react-native-actions-sheet';
import { useSelectedPost } from '../contexts/selectedPostContext';
import { apiFetch, getImageUrl } from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useSelectedReportPost } from '../contexts/selectedReportContext';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-media-library';
import { useSheetPayload } from 'react-native-actions-sheet';
import type { SheetProps } from 'react-native-actions-sheet';
import {SheetDefinition, registerSheet} from 'react-native-actions-sheet';
import { useTheme } from '../contexts/ThemeContext';

export default function PostActionsSheet(props: SheetProps<"post-actions">) {
  const { payload } = props;
  const source = payload?.source ?? 'home'; 
  const position = payload?.position ?? 0;
  const isOwner = payload?.isOwner;
  
  const { selectedPost, setSelectedPost } = useSelectedPost();

  const { theme } = useTheme();
  const styles = theme === 'dark' ? darkStyles : lightStyles;
  
  // const { setSelectedReportPost } = useSelectedReportPost();
  
  const router = useRouter();

  const [currentImagePosition, setCurrentImagePosition] = useState<number | null>(null);

  const isViewer = source === 'viewer';

  useEffect(() => {


    // if (typeof position === 'number') {
    //   setCurrentImagePosition(position);
    // }
  

  }, []);


  const saveImageToGallery = async (imageUrl: string) => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access media library is required!');
        return;
      }
  
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        alert('User is not authenticated.');
        return;
      }
  
      const response = await fetch(imageUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
  
      const blob = await response.blob();
      const reader = new FileReader();
  
      reader.onloadend = async () => {
        const base64data = reader.result?.toString().split(',')[1];
        if (!base64data) {
          alert('Failed to read image data.');
          return;
        }
  
        const fileName = imageUrl.split('/').pop() || 'download.jpg';
        const fileUri = FileSystem.documentDirectory + fileName;
  
        await FileSystem.writeAsStringAsync(fileUri, base64data, {
          encoding: FileSystem.EncodingType.Base64,
        });
  
        const asset = await MediaLibrary.createAssetAsync(fileUri);
        await MediaLibrary.createAlbumAsync('Downloads', asset, false);
        alert('Image saved to gallery!');
      };
  
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error saving image:', error);
      alert('Failed to save image.');
    }
  };
  
  

  
  const cancel = async () => {
    await SheetManager.hide('post-actions');
  };

  const deletePost = async (postId: number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        router.push('/auth/login');
        return;
      }

      await apiFetch(`/posts/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      // if (onDeletePost) {
      //   onDeletePost(postId);
      // }

      await SheetManager.hide('post-actions');
      if (source === "home") {
        router.push('/home');
      }
      else{
        router.push('/profile');
      }
      
    } catch (err) {
      console.error('Failed to delete post', err);
    }
  };

  const editPost = async (postId: number) => {
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

      await SheetManager.hide('post-actions');
      router.push('/addPost');
      
    } catch (err) {
      console.error('Failed to edit post', err);
    }
  };

  const reportPost = async (postId: number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        router.push('/auth/login');
        return;
      }
      
      // setSelectedReportPost(selectedPost);
      
      await SheetManager.hide('post-actions');
      router.push('/submitReport');
    } catch (err) {
      console.error('Failed to navigate to report page', err);
    }
  };

  const renderOwnerOptions = () => (
    <>
      <TouchableOpacity style={styles.option} onPress={() => editPost(selectedPost!.id)}>
        <Text style={styles.optionText}>Edit</Text>
      </TouchableOpacity>

      {isViewer && (
        // <TouchableOpacity style={styles.option} onPress={saveImageToGallery}>
        //   <Text style={styles.optionText}>Save Image</Text>
        // </TouchableOpacity>
        <TouchableOpacity
          style={styles.option}
          onPress={() => {
            const imageUri =
            typeof position === 'number' &&
            selectedPost?.images?.[position]?.image_name
              ? getImageUrl(selectedPost.images[position].image_name)
              : null;

            if (imageUri) {
              saveImageToGallery(imageUri);
            } else {
              alert('No image available to save.');
            }
          }}
        >
          <Text style={styles.optionText}>Save Image</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.option} onPress={() => deletePost(selectedPost!.id)}>
        <Text style={[styles.optionText, { color: 'red' }]}>Delete</Text>
      </TouchableOpacity>
    </>
  );

  const renderViewerOptions = () => (
    <>
      {isViewer && (
        // <TouchableOpacity style={styles.option} onPress={saveImageToGallery}>
        //   <Text style={styles.optionText}>Save Image</Text>
        // </TouchableOpacity>
        <TouchableOpacity
          style={styles.option}
          onPress={() => {
            const imageUri =
            typeof position === 'number' &&
            selectedPost?.images?.[position]?.image_name
              ? getImageUrl(selectedPost.images[position].image_name)
              : null;

            if (imageUri) {
              saveImageToGallery(imageUri);
            } else {
              alert('No image available to save.');
            }
          }}
        >
          <Text style={styles.optionText}>Save Image</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.option} onPress={() => reportPost(selectedPost!.id)}>
        <Text style={[styles.optionText, { color: 'red' }]}>Report</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <ActionSheet id={props.sheetId}>
      <View style={styles.sheet}>
        {isOwner ? renderOwnerOptions() : renderViewerOptions()}
        {/* {renderViewerOptions()} */}
        <TouchableOpacity style={styles.cancel} onPress={() => cancel()}>
          <Text style={styles.cancelText}>Cancel</Text>
          <Text style={styles.cancelText}>{isOwner ? 'a': 'b'}</Text>
          
        </TouchableOpacity>
      </View>
    </ActionSheet>
  );

  // return (
  //   <ActionSheet id={props.sheetId}>
  //     <View style={styles.sheet}>
  //       {isOwner ? (
  //         <>
  //           <TouchableOpacity style={styles.option} onPress={() => editPost(selectedPost.id)}>
  //             <Text style={styles.optionText}>Edit</Text>
  //           </TouchableOpacity>

  //           {source === 'viewer' && (
  //             <TouchableOpacity
  //               style={styles.option}
  //               onPress={() => {
  //                 const imageUri =
  //                 typeof position === 'number' &&
  //                 selectedPost?.images?.[position]?.image_name
  //                   ? getImageUrl(selectedPost.images[position].image_name)
  //                   : null;

  //                 if (imageUri) {
  //                   saveImageToGallery(imageUri);
  //                 } else {
  //                   alert('No image available to save.');
  //                 }
  //               }}
  //             >
  //               <Text style={styles.optionText}>Save Image</Text>
  //             </TouchableOpacity>
  //           )}

  //           <TouchableOpacity style={styles.option} onPress={() => deletePost(selectedPost.id)}>
  //             <Text style={[styles.optionText, { color: 'red' }]}>Delete</Text>
  //           </TouchableOpacity>
  //         </>
  //       ) : (
  //         <>
  //           {source === 'viewer' && (
  //             <TouchableOpacity
  //               style={styles.option}
  //               onPress={() => {
  //                 const imageUri =
  //                 typeof position === 'number' &&
  //                 selectedPost?.images?.[position]?.image_name
  //                   ? getImageUrl(selectedPost.images[position].image_name)
  //                   : null;

  //                 if (imageUri) {
  //                   saveImageToGallery(imageUri);
  //                 } else {
  //                   alert('No image available to save.');
  //                 }
  //               }}
  //             >
  //               <Text style={styles.optionText}>Save Image</Text>
  //             </TouchableOpacity>
  //           )}


  //           {selectedPost && (
  //             <TouchableOpacity style={styles.option} onPress={() => reportPost(selectedPost.id)}>
  //               <Text style={[styles.optionText, { color: 'red' }]}>Report</Text>
  //             </TouchableOpacity>
  //           )}
  //         </>
  //       )}
  //       <TouchableOpacity style={styles.cancel} onPress={cancel}>
  //         <Text style={styles.cancelText}>Cancel</Text>
  //       </TouchableOpacity>
  //     </View>
  //   </ActionSheet>
  // );
}

const lightStyles = StyleSheet.create({
  sheet: { padding: 20, alignItems: 'center', gap: 12 },
  option: { paddingVertical: 12, paddingHorizontal: 40, borderRadius: 8, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#ccc' },
  optionText: { fontSize: 16, color: '#000', fontWeight: '600' },
  cancel: { marginTop: 8, backgroundColor: '#e0e0e0', paddingVertical: 12, paddingHorizontal: 40, borderRadius: 8, width: '100%', alignItems: 'center' },
  cancelText: { fontSize: 16, fontWeight: 'bold', color: '#000' },
});

const darkStyles = StyleSheet.create({
  sheet: { padding: 20, alignItems: 'center', gap: 12, backgroundColor: '#1a1a1a' },
  option: { paddingVertical: 12, paddingHorizontal: 40, borderRadius: 8, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  optionText: { fontSize: 16, color: '#eee', fontWeight: '600' },
  cancel: { marginTop: 8, backgroundColor: '#333', paddingVertical: 12, paddingHorizontal: 40, borderRadius: 8, width: '100%', alignItems: 'center' },
  cancelText: { fontSize: 16, fontWeight: 'bold', color: '#eee' },
});