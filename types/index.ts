// types/index.ts
export type CheckStatus = 'process' | 'success' | 'failure';
export type TaskStatus = 'ожидает генерации' | 'генерируется' | 'готов к подписанию' | 'подписываются все документы' | 'документы подписаны';

export interface Document {
  id: string;
  type: string;
  number: string;
  date: string;
  status: string;
  printFormId: string;
}

export interface Proxy {
  id: string;
  startDate: string;
  endDate: string;
  authorities: string[];
}

export interface Certificate {
  id: string;
  commonName: string;
  serialNumber: string;
}

export interface SigningParameter {
  code: string;
  value: string;
}

export interface ICryptoPlugin {
  checkTokenAvailability: () => boolean;
  getCertificates: () => Certificate[];
  signDocument: (buffer: string) => string;
  login: (pinType: string, pinCode: string) => Promise<boolean>;
}
