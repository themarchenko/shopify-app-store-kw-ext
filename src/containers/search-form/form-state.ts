import type { StartKeyWordsAnalysis } from '../../actions/types';

export const initialState: StartKeyWordsAnalysis = {
  appUrl: '',
  searchTerm: '',
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
