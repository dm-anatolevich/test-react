// services/api.ts
import axios from 'axios';
import { TaskStatus, Document, Proxy, Certificate, SigningParameter } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const apiService = {
  getProxies: (taskId: string): Promise<Proxy[]> =>
    api.get(`/proxies?taskId=${taskId}`).then(response => response.data),

  getSigningParameters: (taskId: string): Promise<SigningParameter[]> =>
    api.get(`/signing-parameters?taskId=${taskId}`).then(response => response.data),

  checkTaskStatus: (taskId: string): Promise<{
    taskStatus: TaskStatus;
    proxyId?: string;
    certificateId?: string;
    documents: Document[];
  }> => api.get(`/task-status?taskId=${taskId}`).then(response => response.data),

  generateDocuments: (taskId: string, proxyId: string, certificateId: string): Promise<{
    taskStatus: TaskStatus;
    documents: Document[];
  }> => api.post('/generate-documents', { taskId, proxyId, certificateId }).then(response => response.data),

  startSigning: (taskId: string): Promise<{
    taskStatus: TaskStatus;
    documents: Document[];
  }> => api.post('/start-signing', { taskId }).then(response => response.data),

  sendDocuments: (taskId: string): Promise<{
    taskStatus: TaskStatus;
    documents: Document[];
  }> => api.post('/send-documents', { taskId }).then(response => response.data),

  uploadSignature: (taskId: string, documentId: string, signature: string): Promise<{
    taskStatus: TaskStatus;
    documents: Document[];
  }> => api.post('/upload-signature', { taskId, documentId, signature }).then(response => response.data),

  getDocumentContent: (taskId: string, documentId: string): Promise<{
    documentId: string;
    content: string;
  }> => api.get(`/document-content?taskId=${taskId}&documentId=${documentId}`).then(response => response.data),
};
