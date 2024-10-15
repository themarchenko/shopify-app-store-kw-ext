import useSWR from 'swr';

import { API_URL } from '../../../config';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export interface KeyWordAnalysisReport {
  id: string;
  searchPhrase: string;
  appUrl: string;
  keywords: string[];
  createdAt: string;
  competitors: Competitor[];
  potentialKeywords: PotentialKeyword[];
}

export interface Competitor {
  id: string;
  keywords: string[];
  competitorUrl: string;
  analysisId: string;
}

export interface PotentialKeyword {
  keyword: string;
  score: number;
}

export function useReport(id: string) {
  return useSWR<KeyWordAnalysisReport>(
    `${API_URL}/keyword-analysis/${id}`,
    fetcher
  );
}
