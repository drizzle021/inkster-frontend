import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { SheetManager } from 'react-native-actions-sheet';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function AddPostSheet() {
    const router = useRouter();
    
    const closeSheet = () => {
      SheetManager.hide('add-post-sheet');
    };


    // const addPost = async (postType: 'illustration' | 'novel') => {
    //   try {
    //     const result = await ImagePicker.launchImageLibraryAsync({
    //       allowsMultipleSelection: true,
    //       mediaTypes: 'images',
    //       quality: 1,
    //       selectionLimit: 10, // iOS only, allows up to 10 images
    //     });
  
    //     if (!result.canceled && result.assets) {
    //       SheetManager.hide('add-post-sheet');
    //       router.push({
    //         pathname: '../addPost',
    //         params: {
    //           postType,
    //           images: JSON.stringify(result.assets),
    //         },
    //       });
    //     }
    //   } catch (err) {
    //     Alert.alert('Error', 'Failed to open gallery.');
    //     console.error(err);
    //   }
    // };

    const addPost = (postType: 'ILLUSTRATION' | 'NOVEL') => {
      SheetManager.hide('add-post-sheet');
      console.log("POST TYPE: ", postType)
      router.push({
        pathname: '../addPost',
        params: { postType },
      });
    };

    return (
        <ActionSheet id="add-post-sheet">
        <View style={styles.sheet}>
            <TouchableOpacity style={styles.option} onPress={() => addPost('ILLUSTRATION')}>
            <Text style={styles.optionText}>Illustration</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={() => addPost('NOVEL')}>
            <Text style={styles.optionText}>Novel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancel} onPress={closeSheet}>
            <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
        </View>
        </ActionSheet>
    );
}

const styles = StyleSheet.create({
  sheet: {
    padding: 20,
    alignItems: 'center',
    gap: 12,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  optionText: {
    fontSize: 16,
    color: "#7B61FF",
    fontWeight: '600',
  },
  cancel: {
    marginTop: 8,
    backgroundColor: '#e0e0e0',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});
