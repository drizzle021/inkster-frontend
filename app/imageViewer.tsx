// app/image-viewer.js
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default function ImageViewer() {
  const { image } = useLocalSearchParams(); // get passed image
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
        <Icon name="x" size={28} color="#fff" />
      </TouchableOpacity>
      <Image source={require('../assets/images/bing.png')} style={styles.image} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
});
