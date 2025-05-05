import {SheetDefinition, registerSheet} from 'react-native-actions-sheet';
import PostActionsSheet from './components/postActionSheet';
 
registerSheet('post-actions', PostActionsSheet);
 

declare module 'react-native-actions-sheet' {
  interface Sheets {
    'post-actions': SheetDefinition<{
      payload: {
        source: string;
        position: number;
        isOwner: boolean;
      };
    }>;
  }
}
 
export {};