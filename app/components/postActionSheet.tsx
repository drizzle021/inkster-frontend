import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { useRouter } from 'expo-router';
import { SheetManager } from 'react-native-actions-sheet';

export default function PostActionsSheet() {
    const router = useRouter();
    const cancel = async () => {
        await SheetManager.hide('post-actions');
    };
    const saveImage = async () => {
        router.push('../home');
        await SheetManager.hide('post-actions');

    };
    const report = async () => {
        router.push('../submitReport');
        await SheetManager.hide('post-actions');

    };
    const editPost = async () => {
        router.push('../addPost');
        await SheetManager.hide('post-actions');

    };
    return (
        <ActionSheet id="post-actions">
        <View style={styles.sheet}>
            <TouchableOpacity style={styles.option} onPress={editPost}>
            <Text style={styles.optionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={saveImage}>
            <Text style={styles.optionText}>Save Image</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={report}>
            <Text style={[styles.optionText, { color: 'red' }]}>Report</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancel} onPress={cancel}>
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
      gap: 12, // spacing between buttons
    },
    option: {
    //   backgroundColor: 'gray',
      paddingVertical: 12,
      paddingHorizontal: 40,
      borderRadius: 8,
      width: '100%',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: "#ccc"
    },
    optionText: {
      fontSize: 16,
      color: '#000',
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
  
