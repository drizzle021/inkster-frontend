// app/search.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import TopNavigation from './components/top_navigation';
import { useTheme } from './contexts/ThemeContext';

export default function SearchPage() {
  const [selectedType, setSelectedType] = useState('Artist');
  const [keywords, setKeywords] = useState('');
  const [tags, setTags] = useState('');
  const router = useRouter();
  const { theme } = useTheme();
  const styles = theme === 'dark' ? darkStyles : lightStyles;

  const search = async () => {
    router.push({
      pathname: './searchResults',
      params: {
        keywords,
        tags,
        type: selectedType
      }
    });
  };


  const renderOption = (label: string) => (
    <TouchableOpacity
      style={styles.radioOption}
      onPress={() => setSelectedType(label)}
    >
      <View style={[styles.radioCircle, selectedType === label && styles.radioSelected]} />
      <Text style={styles.radioLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TopNavigation />

      <View style={styles.form}>
      {renderOption('Artist')}
      {renderOption('Illustration')}
      {renderOption('Novel')}

      <Text style={styles.label}>Search Keywords</Text>
      <TextInput
        placeholder="Keywords..."
        value={keywords}
        onChangeText={setKeywords}
        style={styles.input}
      />

      <Text style={styles.label}>Tags</Text>
      <TextInput
        placeholder="Enter tags..."
        value={tags}
        onChangeText={setTags}
        style={styles.input}
      />

      <TouchableOpacity style={styles.searchBtn} onPress={search}>
        <Text style={styles.searchBtnText}>Search</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}

const lightStyles = StyleSheet.create({
  container: {
    // padding: 20,
    // paddingTop: 50,
    backgroundColor: '#fff',
    flex: 1,
  },
  form: {
    padding: 20,
    paddingTop: 30,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#999',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  radioLabel: {
    fontSize: 16,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    borderRadius: 4,
  },
  searchBtn: {
    backgroundColor: '#000',
    marginTop: 30,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  searchBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

const darkStyles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flex: 1,
  },
  form: {
    padding: 20,
    paddingTop: 30,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#666',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    backgroundColor: '#7B61FF',
    borderColor: '#7B61FF',
  },
  radioLabel: {
    fontSize: 16,
    color: '#eee',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 6,
    color: '#eee',
  },
  input: {
    borderWidth: 1,
    borderColor: '#666',
    padding: 10,
    borderRadius: 4,
    color: '#eee',
    backgroundColor: '#333',
  },
  searchBtn: {
    backgroundColor: '#7B61FF',
    marginTop: 30,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  searchBtnText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
