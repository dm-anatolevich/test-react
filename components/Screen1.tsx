// components/Screen1.tsx
import React from 'react';
import { observer } from 'mobx-react-lite';
import EnvironmentStore from '../stores/EnvironmentStore';

interface Props {
  environmentStore: EnvironmentStore;
}

const Screen1: React.FC<Props> = observer(({ environmentStore }) => {
  const getStatusText = (status: string, successText: string, failureText: string) => {
    switch (status) {
      case 'process': return 'Проверка...';
      case 'success': return successText;
      case 'failure': return failureText;
      default: return '';
    }
  };

  return (
    <div>
      <h1>Проверка рабочего места</h1>
      <ul>
        <li>
          {getStatusText(
            environmentStore.tokenCheckStatus,
            'Токен доступен',
            'Токен недоступен'
          )}
        </li>
        <li>
          {getStatusText(
            environmentStore.proxyCheckStatus,
            'Доверенность найдена',
            'Доверенность не найдена'
          )}
        </li>
        <li>
          {getStatusText(
            environmentStore.signingParamsCheckStatus,
            'Параметры подписания настроены',
            'Параметры подписания не настроены'
          )}
        </li>
      </ul>
    </div>
  );
});

export default Screen1;
