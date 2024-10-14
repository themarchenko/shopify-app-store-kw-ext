export interface CreateAnalysisPayload {
  appUrl: string;
  searchTerm: string;
  keywords: string[];
}

export interface CompetitorPayload {
  appUrl: string;
  keywords: string[];
}

export interface UpdateAnalysisPayload {
  competitor: CompetitorPayload;
}

export async function createAnalysis(payload: CreateAnalysisPayload) {
  console.log('TODO: [createAnalysis]', { payload });

  return 'uiiid-1212-2-1-21-212';
}

export async function updateAnalysis(
  id: string,
  payload: UpdateAnalysisPayload
) {
  console.log('TODO: [updateAnalysis]', { id, payload });

  return true;
}

export async function finishAnalysis(id: string) {
  console.log('TODO: [finishAnalysis]', { id });

  return true;
}
