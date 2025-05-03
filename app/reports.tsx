import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import BottomNavigation from './components/navigation';
import TopNavigation from './components/top_navigation';
import Icon from 'react-native-vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import { apiFetch } from './api';
import { useSelectedReport } from './contexts/selectedReportContext';

type Report = {
  id: number;
  post_id: number;
  report_type: string;
  status: string;
};

const ReportsScreen = () => {
  const router = useRouter();
  const { setSelectedReportId } = useSelectedReport();

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await apiFetch<Report[]>('/reports');
        setReports(data.data);
      } catch (error) {
        console.error('Failed to load reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const openReport = (reportId: number) => {
    setSelectedReportId(reportId); 
    router.push('/openedReport');
  };

  return (
    <View style={styles.container}>
      <TopNavigation />
        <Text style={styles.header}>Reports</Text>
      <ScrollView style={styles.scrollContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
        ) : (
          reports.map((report) => (
            <TouchableOpacity
              key={report.id}
              style={styles.optionButton}
              onPress={() => openReport(report.id)}
            >
              <View>
                <Text style={styles.optionText}># {report.id}</Text>
                <Text style={styles.subText}>
                  {report.report_type.replace('_', ' ')} • {report.status}
                </Text>
              </View>
              <Icon name="right" size={16} color="#000" />
            </TouchableOpacity>
          ))
        )}
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
    textAlign: 'center', 
    fontWeight: 'bold',  
    fontSize: 24,
    marginTop: 20,      
    marginBottom: 10,     
    color: '#333',          
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  optionButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});

export default ReportsScreen;
