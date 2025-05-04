import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { SheetManager } from 'react-native-actions-sheet';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Feather';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { useSelectedPost } from '../contexts/selectedPostContext';
import { apiFetch, getUserProfileImageUrl } from '../api';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelectedUser } from '../contexts/selectedUserContext';
import { useTheme } from '../contexts/ThemeContext';

type Comment = {
  id: number;
  content: string;
  author: {
    id: number;
    username: string;
    profile_picture: string;
    date_joined: string;
  };
  created_at: string;
};

export default function OpenCommentsSheet() {
  const router = useRouter();
  const { selectedPost } = useSelectedPost();
  const { theme } = useTheme();
  const styles = theme === 'dark' ? darkStyles : lightStyles;
  const [newComment, setNewComment] = useState('');               
  const [newComments, setNewComments] = useState<Comment[]>([]);  
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [profileImageError, setProfileImageError] = useState(false);
  const { setSelectedUser } = useSelectedUser();
  const { setSelectedPost } = useSelectedPost();

  useEffect(() => {
    const fetchComments = async () => {
      if (!selectedPost) return;

      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }
        setToken(token);

        const data = await apiFetch<Comment[]>(`/posts/comments/${selectedPost.id}`);
        setComments(data.data);
        console.log(data)
      } catch (error) {
        console.error('Failed to load comments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [selectedPost]);

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
      await SheetManager.hide('comments-sheet');
      router.push('/profile');
    } catch (err) {
      console.error('Failed to load post details', err);
    }
  };
  
  const handleSendComment = async () => {
    if (!newComment.trim() || !selectedPost) return;
  
    try {
      const formData = new FormData();
      formData.append('content', newComment.trim());
  
      await apiFetch(`/posts/comments/${selectedPost.id}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  

      const updatedComments = await apiFetch<Comment[]>(`/posts/comments/${selectedPost.id}`);
      setComments(updatedComments.data);
      setNewComment(''); // Clear input box
  
    } catch (error) {
      console.error('Failed to send comment:', error);
    }
  };
  
  
  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentRow}>
      <TouchableOpacity onPress={() => openProfile(item.author.id)}>
        <FastImage
          source={
            item.author?.profile_picture.includes('default')
              ? require('../../assets/images/default.jpg')
              : {
                  uri: getUserProfileImageUrl(item.author.profile_picture),
                  headers: token ? { Authorization: `Bearer ${token}` } : {},
                  priority: FastImage.priority.normal,
                }
          }
          style={styles.avatar}
          // onError={() => setProfileImageError(true)}
        />
      </TouchableOpacity>
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <TouchableOpacity onPress={() => openProfile(item.author.id)}>
            <Text style={styles.commentName}>{item.author.username}</Text>
          </TouchableOpacity>
          <Text style={styles.commentTime}>{item.created_at}</Text>
        </View>
        <Text style={styles.commentText}>{item.content}</Text>
      </View>
    </View>
  );
  

  return (
    <ActionSheet
      id="comments-sheet"
      gestureEnabled={false}
      defaultOverlayOpacity={0.3}
      indicatorStyle={{ backgroundColor: '#ccc' }}
      containerStyle={{ height: '90%' }}
      // snapPoints={[80]}
    >
      <View style={{height: '90%'}}>
        {/* <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0} 
        >  */}
        <View style={styles.container}>
          <View style={styles.commentContainer}>
            <Text style={styles.heading}>Comments</Text>
          
            <FlatList
              data={[...newComments, ...comments]}
              renderItem={renderComment}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              style={styles.commentList}
              scrollEnabled={true}
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 20 }}
            />

          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Write a comment..."
              value={newComment}
              onChangeText={setNewComment}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSendComment}>
              <Icon name="arrow-up" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        {/* </KeyboardAvoidingView> */}
      </View>
    </ActionSheet>
  );
}

const lightStyles = StyleSheet.create({
  container: {
    // padding: 12,
    // height: '90%',
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  commentContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 12,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    alignSelf: 'center',
    marginBottom: 12,
  },
  commentList: {
    // flexGrow: 0,
    flex: 1,
    // marginBottom: 80,
  },
  commentRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },

  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commentName: {
    fontWeight: 'bold',
  },
  commentTime: {
    fontSize: 12,
    color: 'gray',
  },
  commentText: {
    marginTop: 2,
    fontSize: 14,
  },
  inputContainer: {
    // position: 'relative',
    // bottom: -90,
    // left: 12,
    // right: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    // justifyContent: 'flex-end',
    margin: 10,
    // position: 'fixed',
    // bottom: '-15%'
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: '#007aff',
    padding: 10,
    borderRadius: 20,
    marginLeft: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 18,
    marginRight: 10,
    marginLeft: 10,
  },
});

const darkStyles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'space-between',
      backgroundColor: '#000',
  },
  commentContainer: {
      flex: 1,
      paddingHorizontal: 10,
      paddingTop: 12,
  },
  heading: {
      fontSize: 18,
      fontWeight: '600',
      alignSelf: 'center',
      marginBottom: 12,
      color: '#eee',
  },
  commentList: {
      flex: 1,
  },
  commentRow: {
      flexDirection: 'row',
      marginBottom: 16,
  },

  commentContent: {
      flex: 1,
  },
  commentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
  },
  commentName: {
      fontWeight: 'bold',
      color: '#eee',
  },
  commentTime: {
      fontSize: 12,
      color: '#999',
  },
  commentText: {
      marginTop: 2,
      fontSize: 14,
      color: '#eee',
  },
  inputContainer: {
      backgroundColor: '#1a1a1a',
      borderRadius: 25,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 15,
      paddingVertical: 8,
      margin: 10,
  },
  scrollContainer: {
      flex: 1,
      backgroundColor: '#000',
  },
  input: {
      flex: 1,
      fontSize: 14,
      color: '#eee',
      backgroundColor: '#1a1a1a',
  },
  sendButton: {
      backgroundColor: '#7B61FF',
      padding: 10,
      borderRadius: 20,
      marginLeft: 8,
  },
  avatar: {
      width: 40,
      height: 40,
      borderRadius: 18,
      marginRight: 10,
      marginLeft: 10,
      borderColor: '#666',
      borderWidth: 1
  },
});