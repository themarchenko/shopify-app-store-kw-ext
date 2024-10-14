export interface StartKeyWordsAnalysis {
  appUrl: string;
  searchTerm: string;
  tabId?: number | null;
}

export interface ScrapedKeyWordsResult {
  appUrl: string;
  tabId: number;
  keywords: string[];
}

export interface SearchForCompetitorsParams {
  searchTerm: string;
  tabId?: number | null;
}

export interface SearchForCompetitorsResult {
  links: string[];
}
