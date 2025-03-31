import React from 'react';
import { View, FlatList, TextInput, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import BottomNavigation from './components/navigation';
import TopNavigation from './components/top_navigation';
import Icon from 'react-native-vector-icons/Feather';

const screenWidth = Dimensions.get('window').width;
const itemSize = (screenWidth - 3 * 16) / 2; 

type ResultItem = {
  id: string;
  image: any;
};

const data: ResultItem[] = [
  { id: '1', image: require('../assets/images/bing.png') },
  { id: '2', image: require('../assets/images/penguin.png') },
  { id: '3', image: require('../assets/images/bing.png') },
  { id: '4', image: require('../assets/images/penguin.png') },
  { id: '5', image: require('../assets/images/bing.png') },
  { id: '6', image: require('../assets/images/penguin.png') },
  { id: '7', image: require('../assets/images/bing.png') },
  { id: '8', image: require('../assets/images/penguin.png') },
];

export default function SearchResults() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const renderItem = ({ item }: { item: ResultItem }) => (
        <TouchableOpacity
        style={styles.gridItem}
        onPress={() => router.push('/imageViewer')}
        >
        <Image source={item.image} style={styles.image} />
        </TouchableOpacity>
    );

    const search = async () => {
        router.push('./search');

    };


  return (
    <View style={styles.container}>
        <TopNavigation />

        <View style={styles.searchWrapper}>
            <TextInput
                placeholder="Search..."
                style={styles.searchInput}
            />
            <TouchableOpacity onPress={search}>
                <Icon name="search" size={20} color="#777" style={styles.searchIcon} />
            </TouchableOpacity>
        </View>

        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            contentContainerStyle={{ padding: 16 }}
        />

      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  searchIcon: {
    marginLeft: 8,
  },
  gridItem: {
    width: itemSize,
    height: itemSize + 20,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#eee',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
