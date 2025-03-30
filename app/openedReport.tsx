import React from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import BottomNavigation from './components/navigation';
import TopNavigation from './components/top_navigation';
import Icon from 'react-native-vector-icons/Feather';
import { useRouter } from 'expo-router';

const ReportScreen = () => {
    const router = useRouter();
    const deletePost = () => {
        router.push('/reports');
    };
    const ignoreReport = () => {
        router.push('/reports');
    };
    const openImage = async () => {
      router.push('./imageViewer');
    };
    
    return (
        <View style={styles.container}>
            <TopNavigation />

            
            <ScrollView style={styles.container}>
                <View style={styles.postContainer}>
                    <View style={styles.header}>
                        <Image source={require('../assets/images/penguin.png')} style={styles.avatar} />
                        <View>
                        <Text style={styles.name}>Name</Text>
                        <Text style={styles.subtext}>post name</Text>
                        </View>
                        
                    </View>

                    <TouchableOpacity onPress={openImage}>
                      <Image source={require('../assets/images/bing.png')} style={styles.postImage} resizeMode="contain" />
                    </TouchableOpacity>

                    <View style={styles.actions}>

                        <Icon name="more-horizontal" size={25} style={styles.menuIcon} />

                    </View>

                    <Text style={styles.caption}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
                    </Text>
                </View>

                <View>
                    <Text style={styles.label}>
                        Report category: <Text style={styles.value}>Hate</Text>
                    </Text>

                    <Text style={styles.label}>Report description</Text>
                    <TextInput
                        style={styles.textArea}
                        multiline
                        numberOfLines={4}
                        editable={false} // disables editing
                        value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod."
                    />

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.button} onPress={deletePost}>
                        <Text style={styles.buttonText}>Delete</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={ignoreReport}>
                        <Text style={styles.buttonText}>Ignore</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>

            <BottomNavigation />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      },
      avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 10,
        marginLeft: 10,
      },
      name: {
        fontWeight: 'bold',
        fontSize: 16,
      },
      subtext: {
        fontSize: 12,
        color: 'gray',
      },
      menuIcon: {
        marginLeft: "48%",
        color: 'gray',
      },
      postImage: {
        width: '100%',
        height: 300,
        borderRadius: 10,
        marginVertical: 10,
      },
      actions: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
        // marginLeft: 10,
      },
      caption: {
        marginTop: 8,
        fontSize: 16,
        marginLeft: 10,
      },

      label: {
        fontWeight: 'bold',
        marginBottom: 8,
        fontSize: 16,
        marginLeft: 20,
      },
      value: {
        fontWeight: 'normal',
      },
      textArea: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 10,
        fontSize: 14,
        backgroundColor: '#f9f9f9',
        color: '#333',
        marginBottom: 20,
        marginHorizontal: 20
      },
      buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20
      },
      button: {
        backgroundColor: '#000',
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 6,
      },
      buttonText: {
        color: '#fff',
        fontWeight: 'bold',
      },
      scrollContainer: {
        flex: 1,
        backgroundColor: '#fff',
      },
      postContainer: {
        marginBottom: 10,
        paddingBottom: 10,
        marginTop: 10,
      },
      
  });
  
export default ReportScreen;
