import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Linking,
  Pressable,
  ScrollView,
} from 'react-native';
import ActionSheet, { SheetProps } from 'react-native-actions-sheet';
import { useTheme } from '../contexts/ThemeContext';

type Exhibition = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number | string;
  website: string | undefined;
  gmaps: string;
  directions_link: string;
  summary: {
    text?: string;
    languageCode?: string;
  };
};

const ExhibitionDetailsSheet = (props: SheetProps<"exhibition-details">) => {
  const { theme } = useTheme();
  const styles = theme === 'dark' ? darkStyles : lightStyles;
  const { payload } = props;
  const openURL = async (url: string | undefined) => {
    if (url){
        const supported = await Linking.canOpenURL(url);
        if (supported) await Linking.openURL(url);
    }

  };

  return (
    <ActionSheet id={props.sheetId}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{payload?.name}</Text>
        <Text style={styles.label}>Address:</Text>
        <Text style={styles.text}>{payload?.address}</Text>

        {payload?.summary?.text && (
          <>
            <Text style={styles.label}>About:</Text>
            <Text style={styles.text}>{payload.summary.text}</Text>
          </>
        )}

        <Text style={styles.label}>Rating:</Text>
        <Text style={styles.text}>{payload?.rating}</Text>

        {payload?.website !== 'Not available' && (
          <Pressable style={styles.button} onPress={() => openURL(payload?.website)}>
            <Text style={styles.buttonText}>Visit Website</Text>
          </Pressable>
        )}

        <Pressable style={styles.button} onPress={() => openURL(payload?.directions_link)}>
          <Text style={styles.buttonText}>Get Directions</Text>
        </Pressable>
      </ScrollView>
    </ActionSheet>
  );
};

export default ExhibitionDetailsSheet;


 
const lightStyles = StyleSheet.create({
container: {
    padding: 20,
    gap: 12,
    },
    title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    },
    label: {
    fontWeight: '600',
    fontSize: 14,
    },
    text: {
    fontSize: 14,
    lineHeight: 20,
    },
    button: {
    marginTop: 10,
    backgroundColor: '#7B61FF',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    },
    buttonText: {
    color: '#fff',
    fontWeight: '600',
    },
});

const darkStyles = StyleSheet.create({
    container: {
      padding: 20,
      gap: 12,
      backgroundColor: '#0D0D0D', 
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      marginBottom: 10,
      color: '#FFFFFF',
    },
    label: {
      fontWeight: '600',
      fontSize: 14,
      color: '#CCCCCC',
    },
    text: {
      fontSize: 14,
      lineHeight: 20,
      color: '#E0E0E0',
    },
    button: {
      marginTop: 10,
      backgroundColor: '#7B61FF',
      padding: 12,
      borderRadius: 6,
      alignItems: 'center',
    },
    buttonText: {
      color: '#FFFFFF',
      fontWeight: '600',
    },
  });
  
