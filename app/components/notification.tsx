import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';

type Props = {
  visible: boolean;
  title: string;
  message?: string;
  onAllowAlways: () => void;
  onAllowOnce: () => void;
  onDeny: () => void;
};

const NotificationPopup = ({
  visible,
  title,
  message,
  onAllowAlways,
  onAllowOnce,
  onDeny,
}: Props) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          {!!message && <Text style={styles.message}>{message}</Text>}

          <TouchableOpacity style={styles.option} onPress={onAllowAlways}>
            <Text style={styles.optionText}>Allow While Using App</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={onAllowOnce}>
            <Text style={styles.optionText}>Allow Once</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={onDeny}>
            <Text style={[styles.optionText, styles.denyText]}>Don’t Allow</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.35)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      backgroundColor: '#fff',
      borderRadius: 16,
      width: '85%',
      paddingVertical: 20,
      paddingHorizontal: 16,
      elevation: 5,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 8,
    },
    message: {
      fontSize: 14,
      color: '#555',
      textAlign: 'center',
      marginBottom: 12,
    },
    option: {
      paddingVertical: 12,
      borderTopWidth: 1,
      borderColor: '#ddd',
    },
    optionText: {
      fontSize: 16,
      textAlign: 'center',
      color: '#007aff',
    },
    denyText: {
      color: '#ff3b30', 
    },
  });
  

export default NotificationPopup;
