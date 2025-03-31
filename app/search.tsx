// app/search.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function SearchPage() {
  const [selectedType, setSelectedType] = useState('Artist');
  const [keywords, setKeywords] = useState('');
  const [tags, setTags] = useState('');
  const router = useRouter();

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
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    flex: 1,
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
