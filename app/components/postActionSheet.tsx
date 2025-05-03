import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import ActionSheet from 'react-native-actions-sheet';
import { SheetManager } from 'react-native-actions-sheet';
import { useSelectedPost } from '../contexts/selectedPostContext';
import { apiFetch } from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useSelectedReportPost } from '../contexts/selectedReportContext';

type PayloadType = {
  onDeletePost?: (deletedPostId: number) => void;
};

export default function PostActionsSheet() {
  const { selectedPost } = useSelectedPost();
  // const { setSelectedReportPost } = useSelectedReportPost();
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await apiFetch('/users/me');
        setUserId(response.data.id);
      } catch (error) {
        console.error('Failed to load current user', error);
      }
    };
  
    fetchUserId();
  }, []);

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
    } catch (err) {
      console.error('Failed to delete post', err);
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

  const isOwner = selectedPost?.author.id === userId;

  return (
    <ActionSheet id="post-actions">
      <View style={styles.sheet}>
        {isOwner ? (
          <>
            <TouchableOpacity style={styles.option}>
              <Text style={styles.optionText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option}>
              <Text style={styles.optionText}>Save Image</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={() => deletePost(selectedPost.id)}>
              <Text style={[styles.optionText, { color: 'red' }]}>Delete</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.option}>
              <Text style={styles.optionText}>Save Image</Text>
            </TouchableOpacity>

            {selectedPost && (
              <TouchableOpacity style={styles.option} onPress={() => reportPost(selectedPost.id)}>
                <Text style={[styles.optionText, { color: 'red' }]}>Report</Text>
              </TouchableOpacity>
            )}
          </>
        )}
        <TouchableOpacity style={styles.cancel} onPress={cancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  sheet: { padding: 20, alignItems: 'center', gap: 12 },
  option: { paddingVertical: 12, paddingHorizontal: 40, borderRadius: 8, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#ccc' },
  optionText: { fontSize: 16, color: '#000', fontWeight: '600' },
  cancel: { marginTop: 8, backgroundColor: '#e0e0e0', paddingVertical: 12, paddingHorizontal: 40, borderRadius: 8, width: '100%', alignItems: 'center' },
  cancelText: { fontSize: 16, fontWeight: 'bold', color: '#000' },
});
