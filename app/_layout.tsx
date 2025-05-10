import { Stack } from 'expo-router';
import { SheetProvider } from 'react-native-actions-sheet';
// import 'react-native-actions-sheet/src/components/action-sheet-style';
import PostActionsSheet from './components/postActionSheet';
import AddPostSheet from './components/addPostSheet';
import OpenCommentsSheet from './components/openCommentsSheet';
import { SelectedPostProvider } from './contexts/selectedPostContext';
import { SelectedUserProvider } from './contexts/selectedUserContext';
import { SelectedReportProvider } from './contexts/selectedReportContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ReaderModeProvider } from './contexts/ReaderModeContext';
import { SocketProvider } from './contexts/SocketContext';
import Toast from 'react-native-toast-message';
import './sheets.tsx';
import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';

export default function RootLayout() {
  useEffect(() => {
    // Handle foreground messages
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Foreground message:', remoteMessage);
      Alert.alert(remoteMessage.notification?.title ?? 'Notification', remoteMessage.notification?.body ?? '');
    });

    // Handle background tap
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification opened from background state:', remoteMessage);
    });

    // Handle quit tap
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Notification opened from quit state:', remoteMessage);
        }
      });

    return unsubscribe;
  }, []);

  // Handle background messages
  useEffect(() => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });
  }, []);

  return (
    <ThemeProvider>
    <SocketProvider>

    <SelectedPostProvider>
    <ReaderModeProvider>
    <SheetProvider>
      <SelectedReportProvider>
      <SelectedUserProvider>
      
        {/* <PostActionsSheet sheetId='post-actions'/> */}
        <AddPostSheet />
        <OpenCommentsSheet />
        <Stack
          screenOptions={{
            headerShown: false,
            headerStyle: {
              backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="details" />
        </Stack>

      </SelectedUserProvider>
      </SelectedReportProvider>
    </SheetProvider>
    </ReaderModeProvider>
    </SelectedPostProvider>

    </SocketProvider>
    </ThemeProvider>
  );
}
