import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import BottomNavigation from './components/navigation';
import TopNavigation from './components/top_navigation';
import Icon from 'react-native-vector-icons/Feather';
import { useRouter } from 'expo-router';
import { apiFetch, getImageUrl, getUserProfileImageUrl } from './api';
import { useSelectedReport } from './contexts/selectedReportContext';

const ReportScreen = () => {
  const router = useRouter();
  const { selectedReportId } = useSelectedReport();
  const [report, setReport] = useState<any>(null);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      console.log(selectedReportId)
      if (!selectedReportId) return;

      try {
        const data = await apiFetch(`/reports/${selectedReportId}`);
        setReport(data.data);
        console.log(selectedReportId)
        console.log(data.data)
      } catch (error) {
        console.error('Failed to load report:', error);
      } finally {
        // setLoading(false);
      }
    };

    fetchReport();
  }, [selectedReportId]);

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
            <Image
              source={report.post.author.profile_picture
                ? { uri: getUserProfileImageUrl(report.post.author.id) }
                : require('../assets/images/penguin.png')}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.name}>{report.post.author.username}</Text>
              <Text style={styles.subtext}>{report.post.title}</Text>
            </View>
            <Image
              source={report.post.thumbnail
                ? { uri: getUserProfileImageUrl(report.post.author.id) }
                : require('../assets/images/penguin.png')}
              style={styles.avatar}
            />
          </View>

          <TouchableOpacity onPress={openImage}>
            <Image
              source={{ uri: getImageUrl(report.post_id) }}
              style={styles.postImage}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <View style={styles.actions}>
            <Icon name="more-horizontal" size={25} style={styles.menuIcon} />
          </View>

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

const styles = StyleSheet.create({
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
    borderRadius: 10,
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

export default ReportScreen;
