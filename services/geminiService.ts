
import { api } from './api';
import { MockBarConfig, ContractConfig } from "../types";

// Helper to poll for background job completion
// This matches the "Background Worker System" requirement
const pollJob = async (jobId: string, endpoint: string): Promise<string> => {
  const maxAttempts = 30; // 30 attempts * 2s = 60s timeout
  const interval = 2000;

  for (let i = 0; i < maxAttempts; i++) {
    const { data } = await api.get(`${endpoint}/status/${jobId}`);
    
    if (data.status === 'completed') {
      return data.result;
    }
    if (data.status === 'failed') {
      throw new Error(data.error || 'Job failed');
    }
    
    // Wait before next poll
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  throw new Error('Timeout waiting for AI generation');
};

// All functions now call the backend API which handles Queue/Workers

export const generateCaseDigest = async (caseText: string): Promise<string> => {
  try {
    const { data } = await api.post('/case-digest/generate', { caseText });
    return await pollJob(data.jobId, '/case-digest');
  } catch (error: any) {
    if (error.response?.status === 402) throw new Error(error.response.data.message);
    throw error;
  }
};

export const generateMockBarQuestion = async (config: MockBarConfig): Promise<string> => {
  try {
    const { data } = await api.post('/mock-bar/generate', config);
    return await pollJob(data.jobId, '/mock-bar');
  } catch (error: any) {
    if (error.response?.status === 402) throw new Error(error.response.data.message);
    throw error;
  }
};

export const generateCaseBuild = async (query: string): Promise<string> => {
  try {
    const { data } = await api.post('/case-build/query', { query });
    return await pollJob(data.jobId, '/case-build');
  } catch (error: any) {
    if (error.response?.status === 402) throw new Error(error.response.data.message);
    throw error;
  }
};

export const generateLawReviewer = async (topic: string): Promise<string> => {
  try {
    const { data } = await api.post('/reviewer/build', { topic });
    return await pollJob(data.jobId, '/reviewer');
  } catch (error: any) {
    if (error.response?.status === 402) throw new Error(error.response.data.message);
    throw error;
  }
};

export const generateContract = async (config: ContractConfig): Promise<string> => {
  try {
    const { data } = await api.post('/contracts/generate', config);
    return await pollJob(data.jobId, '/contracts');
  } catch (error: any) {
    if (error.response?.status === 402) throw new Error(error.response.data.message);
    throw error;
  }
};
