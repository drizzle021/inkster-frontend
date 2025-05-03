import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { SheetManager } from 'react-native-actions-sheet';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Feather';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { useSelectedPost } from '../contexts/selectedPostContext';
import { apiFetch, getUserProfileImageUrl } from '../api';

// const comments = [
//   { id: '1', name: 'Name', time: '8m ago', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.' },
//   { id: '2', name: 'Name', time: '8m ago', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.' },
//   { id: '3', name: 'Name', time: '8m ago', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.' },
//   { id: '4', name: 'Name', time: '8m ago', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.' },
//   { id: '5', name: 'Name', time: '8m ago', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.' },
//   { id: '6', name: 'Name', time: '8m ago', text: 'Lorem ipsum dolor sit amet,Lorem ipsum dolor sit amet,Lorem ipsum dolor sit amet,Lorem ipsum dolor sit amet,Lorem ipsum dolor sit amet,Lorem ipsum dolor sit amet,Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.' },
//   { id: '7', name: 'Name', time: '8m ago', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.' },
//   { id: '8', name: 'Name', time: '8m ago', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.' },

// ];

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

  const [newComment, setNewComment] = useState('');               // holds current input
  const [newComments, setNewComments] = useState<Comment[]>([]);  // holds new comment objects
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchComments = async () => {
      if (!selectedPost) return;

      try {
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

  const openProfile = async () => {
    await SheetManager.hide('comments-sheet');
    router.push('../profile');
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
          'Content-Type': 'multipart/form-data', // because you're using request.form.get()
        },
      });
  
      // After posting, refetch comments to update list
      const updatedComments = await apiFetch<Comment[]>(`/posts/comments/${selectedPost.id}`);
      setComments(updatedComments.data);
      setNewComment(''); // Clear input box
  
    } catch (error) {
      console.error('Failed to send comment:', error);
    }
  };
  
  
  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentRow}>
      <TouchableOpacity onPress={openProfile}>
        <Image
          source={item.author.profile_picture
            ? { uri: getUserProfileImageUrl(item.author.id) }
            : require('../../assets/images/penguin.png')
          }
          style={styles.avatar}
        />
      </TouchableOpacity>
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <TouchableOpacity onPress={openProfile}>
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

const styles = StyleSheet.create({
  container: {
    // padding: 12,
    // height: '90%',
    flex: 1,
    // justifyContent: 'space-between',
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
    position: 'relative',
    bottom: -90,
    // left: 12,
    // right: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    justifyContent: 'flex-end',
    // marginBottom: 10,
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