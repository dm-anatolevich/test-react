// stores/TaskStatusStore.ts
import { makeAutoObservable } from 'mobx';
import { TaskStatus, Document, Proxy, Certificate, SigningParameter } from '../types';

class TaskStatusStore {
  taskId: string | null = null;
  proxyId: string | null = null;
  certificateId: string | null = null;
  taskStatus: TaskStatus | null = null;
  documents: Document[] = [];
  proxies: Proxy[] = [];
  certificates: Certificate[] = [];
  signingParameters: SigningParameter[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setTaskData = (data: {
    taskStatus: TaskStatus;
    documents: Document[];
    proxyId?: string;
    certificateId?: string;
  }) => {
    this.taskStatus = data.taskStatus;
    this.documents = data.documents;
    if (data.proxyId) this.proxyId = data.proxyId;
    if (data.certificateId) this.certificateId = data.certificateId;
  };

  setProxies = (proxies: Proxy[]) => {
    this.proxies = proxies;
  };

  setCertificates = (certificates: Certificate[]) => {
    this.certificates = certificates;
  };

  setSigningParameters = (params: SigningParameter[]) => {
    this.signingParameters = params;
  };

  updateDocumentStatus = (documentId: string, status: string) => {
    const document = this.documents.find(doc => doc.id === documentId);
    if (document) {
      document.status = status;
    }
  };
}

export default TaskStatusStore;
