import {SheetDefinition, registerSheet} from 'react-native-actions-sheet';
import PostActionsSheet from './components/postActionSheet';
import ExhibitionDetailsSheet from './components/exhibitionDetailsSheet';

registerSheet('post-actions', PostActionsSheet);
registerSheet('exhibition-details', ExhibitionDetailsSheet);


declare module 'react-native-actions-sheet' {
  interface Sheets {
    'post-actions': SheetDefinition<{
      payload: {
        source: string;
        position: number;
        isOwner: boolean;
      };
    }>;
    'exhibition-details': SheetDefinition<{
      payload: {
        id: string;
        name: string;
        address: string;
        latitude: number;
        longitude: number;
        rating: number | string;
        website: string | undefined;
        gmaps: string;
        directions_link: string;
        summary: {
          text?: string;
          languageCode?: string;
        };
      };
    }>;
  }
}
 
export {};