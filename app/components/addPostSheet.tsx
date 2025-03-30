import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { SheetManager } from 'react-native-actions-sheet';
import { useRouter } from 'expo-router';

export default function AddPostSheet() {
    const router = useRouter();
    
    const closeSheet = () => {
        SheetManager.hide('add-post-sheet');
    };

    return (
        <ActionSheet id="add-post-sheet">
        <View style={styles.sheet}>
            <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>Illustration</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>Novel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>⋮⋮⋮</Text>
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
