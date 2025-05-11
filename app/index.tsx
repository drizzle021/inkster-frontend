import { View } from "react-native";
import { Link } from "expo-router"
import { useTheme } from './contexts/ThemeContext';
import messaging from '@react-native-firebase/messaging';

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

messaging()
  .getInitialNotification()
  .then(remoteMessage => {
    if (remoteMessage) {
      console.log('Notification opened from quit state:', remoteMessage);
    }
  });

// This will handle taps when app is in background
messaging().onNotificationOpenedApp(remoteMessage => {
  if (remoteMessage) {
    console.log('Notification opened from background state:', remoteMessage);
  }
});

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    > 
    {/* left here for debugging */}
      <Link href="/home"> start</Link> 

    </View>
  );
}
