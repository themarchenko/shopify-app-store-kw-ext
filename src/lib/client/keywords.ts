import { API_URL } from '../config';

// Define payload structures
export interface CreateAnalysisPayload {
  appUrl: string;
  searchPhrase: string;
  keywords: string[];
}

export interface CompetitorPayload {
  competitorUrl: string;
  keywords: string[];
}

export interface UpdateAnalysisPayload {
  competitors: CompetitorPayload[];
}

// Utility function for handling API requests
async function fetchWithHandling(url: string, options: RequestInit) {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.json();
      console.error(`API Error: ${response.status} - ${error.message}`);
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  } catch (error) {
    console.error(`Request failed: ${(error as any).message}`);
    throw error;
  }
}

// Create a new analysis
export async function createAnalysis(payload: CreateAnalysisPayload) {
  try {
    const response = await fetchWithHandling(`${API_URL}/keyword-analysis`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      method: 'POST',
      body: JSON.stringify(payload),
    });

    console.log('Analysis created successfully:', response);
    return response.id;
  } catch (error) {
    console.error('Failed to create analysis:', error);
    throw error;
  }
}

// Update an existing analysis with competitor data
export async function updateAnalysis(
  id: string,
  payload: UpdateAnalysisPayload
) {
  try {
    const response = await fetchWithHandling(
      `${API_URL}/keyword-analysis/${id}`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        method: 'PATCH',
        body: JSON.stringify(payload),
      }
    );

    console.log('Analysis updated successfully:', response);
    return true;
  } catch (error) {
    console.error('Failed to update analysis:', error);
    throw error;
  }
}
