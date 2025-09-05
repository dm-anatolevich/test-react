// stores/EnvironmentStore.ts
import { makeAutoObservable } from 'mobx';
import { CheckStatus } from '../types';

class EnvironmentStore {
  tokenCheckStatus: CheckStatus = 'process';
  proxyCheckStatus: CheckStatus = 'process';
  signingParamsCheckStatus: CheckStatus = 'process';

  constructor() {
    makeAutoObservable(this);
  }

  setTokenCheckStatus = (status: CheckStatus) => {
    this.tokenCheckStatus = status;
  };

  setProxyCheckStatus = (status: CheckStatus) => {
    this.proxyCheckStatus = status;
  };

  setSigningParamsCheckStatus = (status: CheckStatus) => {
    this.signingParamsCheckStatus = status;
  };
}

export default EnvironmentStore;
