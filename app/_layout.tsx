import { Stack } from 'expo-router';
import { SheetProvider } from 'react-native-actions-sheet';
// import 'react-native-actions-sheet/src/components/action-sheet-style';
import PostActionsSheet from './components/postActionSheet';
import AddPostSheet from './components/addPostSheet';
import OpenCommentsSheet from './components/openCommentsSheet';
import { SelectedPostProvider } from './contexts/selectedPostContext';
import { SelectedUserProvider } from './contexts/selectedUserContext';
import { SelectedReportProvider } from './contexts/selectedReportContext';

export default function RootLayout() {
  return (
    <SheetProvider>
      <SelectedReportProvider>
      <SelectedUserProvider>
      <SelectedPostProvider>
        <PostActionsSheet />
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
      </SelectedPostProvider>
      </SelectedUserProvider>
      </SelectedReportProvider>
    </SheetProvider>
  );
}
