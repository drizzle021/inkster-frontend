import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import TopNavigation from './components/top_navigation';
import BottomNavigation from './components/navigation';
import { useRouter } from 'expo-router';

const issues = [
  'Hate',
  'Abuse & harassment',
  'Violent Speech',
  'Privacy',
  'Spam',
  'Impersonation',
];

export default function SubmitReport() {
    const router = useRouter();
    const [selectedIssue, setSelectedIssue] = useState('Hate');
    const [description, setDescription] = useState('');

    const handleSubmit = () => {
        console.log('Submitted Report:', { selectedIssue, description });
        router.push('../home');
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
                    <Text style={styles.radioText}>{issue}</Text>
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

const styles = StyleSheet.create({
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
    width: 100,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
