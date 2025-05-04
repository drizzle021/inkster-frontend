import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import TopNavigation from './components/top_navigation';
import BottomNavigation from './components/navigation';
import { useRouter } from 'expo-router';
import { useSelectedPost } from './contexts/selectedPostContext';
import { apiFetch } from './api';
import { useTheme } from './contexts/ThemeContext';

const issues = [
  'HATE',
  'ABUSE',
  'VIOLENT_SPEECH',
  'PRIVACY',
  'SPAM',
  'IMPERSONATION',
];

export default function SubmitReport() {
  const router = useRouter();
  const { selectedPost } = useSelectedPost();
  const { theme } = useTheme();
  const styles = theme === 'dark' ? darkStyles : lightStyles;
  const [selectedIssue, setSelectedIssue] = useState('HATE');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    if (!selectedPost) {
      Alert.alert('Error', 'No post selected to report.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('report_type', selectedIssue);
      formData.append('description', description.trim());
      console.log(selectedPost.id)
      await apiFetch(`/posts/report/${selectedPost.id}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Success', 'Report submitted successfully.');
      router.push('/home');
    } catch (error) {
      console.error('Failed to submit report:', error);
      Alert.alert('Error', 'Failed to submit report. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <TopNavigation />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Issue:</Text>

        <View style={styles.optionsContainer}>
          {issues.map((issue) => (
            <TouchableOpacity
              key={issue}
              style={styles.radioContainer}
              onPress={() => setSelectedIssue(issue)}
            >
              <View style={styles.outerCircle}>
                {selectedIssue === issue && <View style={styles.innerCircle} />}
              </View>
              <Text style={styles.radioText}>{issue.replace('_', ' ')}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Report description:</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Enter description..."
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Submit</Text>
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
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    marginTop: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionsContainer: {
    flex: 1,
    marginLeft: 20,
  },
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
  textArea: {
    borderColor: '#aaa',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
    marginTop: 6,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
    width: 120,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

const darkStyles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#000',
  },
  content: {
      padding: 20,
      paddingBottom: 40,
  },
  label: {
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 10,
      marginTop: 10,
      color: '#eee',
  },
  radioContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
  },
  optionsContainer: {
      flex: 1,
      marginLeft: 20,
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
  textArea: {
      borderColor: '#555',
      borderWidth: 1,
      borderRadius: 4,
      padding: 10,
      height: 100,
      textAlignVertical: 'top',
      marginTop: 6,
      backgroundColor: '#333',
      color: '#eee',
  },
  buttonContainer: {
      flex: 1,
      alignItems: 'center',
  },
  submitButton: {
      backgroundColor: '#7B61FF',
      paddingVertical: 12,
      borderRadius: 6,
      alignItems: 'center',
      marginTop: 20,
      width: 120,
  },
  submitText: {
      color: '#000',
      fontWeight: 'bold',
      fontSize: 16,
  },
});