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
import './sheets.tsx';

export default function RootLayout() {
  return (
    <ThemeProvider>
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
    </ThemeProvider>
  );
}
