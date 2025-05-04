import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import BottomNavigation from './components/navigation';
import TopNavigation from './components/top_navigation';
import Icon from 'react-native-vector-icons/Feather';
import { useRouter } from 'expo-router';
import { apiFetch, getImageUrl, getUserProfileImageUrl } from './api';
import { useSelectedReport } from './contexts/selectedReportContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';
import { useSelectedUser } from './contexts/selectedUserContext';
import { useTheme } from './contexts/ThemeContext';

const ReportScreen = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = theme === 'dark' ? darkStyles : lightStyles;
  const { selectedReportId } = useSelectedReport();
  const [report, setReport] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [profileImageError, setProfileImageError] = useState(false);
  // const [loading, setLoading] = useState(true);
  const { setSelectedUser } = useSelectedUser();

  useEffect(() => {
    const fetchReport = async () => {
      console.log(selectedReportId);
      if (!selectedReportId) return;
  
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }
  
        const data = await apiFetch(`/reports/${selectedReportId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setToken(token);
        setReport(data.data);
        // console.log(selectedReportId);
        console.log(data.data);
      } catch (error) {
        console.error('Failed to load report:', error);
      } finally {
        // setLoading(false);
      }
    };
  
    fetchReport();
  }, [selectedReportId]);
  
  
  const openProfile = async (userId: number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        router.push('/auth/login');
        return;
      }

      const user = await apiFetch(`/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
  
      setSelectedUser(user.data);
      router.push('/profile');
    } catch (err) {
      console.error('Failed to load post details', err);
    }
  };

  const deletePost = async () => {
    try {
      await apiFetch(`/reports/remove-post/${selectedReportId}`, {
        method: 'POST',
      });
      router.push('/reports');
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const ignoreReport = async () => {
    try {
      await apiFetch(`/reports/ignore/${selectedReportId}`, {
        method: 'POST',
      });
      router.push('/reports');
    } catch (error) {
      console.error('Failed to ignore report:', error);
    }
  };

  const openImage = () => {
    router.push('/imageViewer');
  };

  // if (loading) {
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <ActivityIndicator size="large" color="#000" />
  //     </View>
  //   );
  // }

  if (!report) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Report not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopNavigation />

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.postContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => openProfile(report.post.author.id)}>
              <FastImage
                source={
                  profileImageError || !report.post.author.profile_picture
                    ? require('../assets/images/default.jpg')
                    : {
                        uri: getUserProfileImageUrl(report.post.author.profile_picture),
                        headers: token ? { Authorization: `Bearer ${token}` } : {},
                        priority: FastImage.priority.normal,
                      }
                }
                style={styles.avatar}
                onError={() => setProfileImageError(true)}
              />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openProfile(report.post.author.id)}>
            <View>
              <Text style={styles.name}>{report.post.author.username}</Text>
              <Text style={styles.subtext}>{report.post.title}</Text>
            </View>
          </TouchableOpacity>
          </View>

          {token && (

              <FastImage
                source={{
                  uri: getImageUrl(report.post.thumbnail),
                  headers: { Authorization: `Bearer ${token}` },
                  priority: FastImage.priority.normal,
                }}
                style={styles.postImage}
                resizeMode={FastImage.resizeMode.cover}
              />

          )}



          <Text style={styles.caption}>{report.post.caption}</Text>
        </View>

        <View>
          <Text style={styles.label}>
            Report category: <Text style={styles.value}>{report.report_type}</Text>
          </Text>

          <Text style={styles.label}>Report description</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            editable={false}
            value={report.description}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={deletePost}>
              <Text style={styles.buttonText}>Delete Post</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={ignoreReport}>
              <Text style={styles.buttonText}>Ignore Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <BottomNavigation />
    </View>
  );
};

const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postContainer: {
    marginBottom: 10,
    paddingBottom: 10,
    marginTop: 10,
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
    marginLeft: '48%',
    color: 'gray',
  },
  postImage: {
    width: '100%',
    height: 300,

    marginVertical: 10,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
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
    marginHorizontal: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
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
});

const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postContainer: {
    marginBottom: 10,
    paddingBottom: 10,
    marginTop: 10,
    borderColor: '#333',
    borderBottomWidth: 1,
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
    color: '#eee',
  },
  subtext: {
    fontSize: 12,
    color: '#999',
  },
  menuIcon: {
    marginLeft: '48%',
    color: '#999',
  },
  postImage: {
    width: '100%',
    height: 300,
    marginVertical: 10,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  caption: {
    marginTop: 8,
    fontSize: 16,
    marginLeft: 10,
    color: '#eee',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
    marginLeft: 20,
    color: '#eee',
  },
  value: {
    fontWeight: 'normal',
    color: '#7B61FF',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 4,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#333',
    color: '#eee',
    marginBottom: 20,
    marginHorizontal: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  button: {
    backgroundColor: '#7B61FF',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 6,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default ReportScreen;
