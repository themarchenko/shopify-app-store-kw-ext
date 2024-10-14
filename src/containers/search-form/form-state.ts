import type { StartKeyWordsAnalysis } from '../../actions/types';

export const initialState: StartKeyWordsAnalysis = {
  appUrl: 'https://apps.shopify.com/sesami',
  searchTerm: 'booking',
};

export type FieldKey = keyof typeof initialState;

export interface Field {
  key: FieldKey;
  placeholder: string;
}

export const fields: Field[] = [
  {
    key: 'appUrl',
    placeholder: 'Enter your app URL',
  },
  {
    key: 'searchTerm',
    placeholder: 'Enter the search term',
  },
];
