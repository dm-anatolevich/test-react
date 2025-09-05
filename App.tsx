// App.tsx
import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import EnvironmentStore from './stores/EnvironmentStore';
import TaskStatusStore from './stores/TaskStatusStore';
import Screen1 from './components/Screen1';
import Screen2 from './components/Screen2';
import Screen3 from './components/Screen3';
import Screen4 from './components/Screen4';
import Screen5 from './components/Screen5';
import Screen6 from './components/Screen6';
import Screen7 from './components/Screen7';

const environmentStore = new EnvironmentStore();
const taskStatusStore = new TaskStatusStore();

const App: React.FC = observer(() => {
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    // Проверка доступности токена
    try {
      const isTokenAvailable = (window as any).cryptoPlugin.checkTokenAvailability();
      environmentStore.setTokenCheckStatus(isTokenAvailable ? 'success' : 'failure');
    } catch (error) {
      environmentStore.setTokenCheckStatus('failure');
    }

    // Проверка доверенностей
    try {
      const proxies = await apiService.getProxies(taskStatusStore.taskId || '');
      environmentStore.setProxyCheckStatus(proxies.length > 0 ? 'success' : 'failure');
      taskStatusStore.setProxies(proxies);
    } catch (error) {
      environmentStore.setProxyCheckStatus('failure');
    }

    // Проверка параметров подписания
    try {
      const params = await apiService.getSigningParameters(taskStatusStore.taskId || '');
      environmentStore.setSigningParamsCheckStatus(params.length > 0 ? 'success' : 'failure');
      taskStatusStore.setSigningParameters(params);
    } catch (error) {
      environmentStore.setSigningParamsCheckStatus('failure');
    }

    // Проверка статуса задачи
    try {
      const taskStatus = await apiService.checkTaskStatus(taskStatusStore.taskId || '');
      taskStatusStore.setTaskData(taskStatus);
    } catch (error) {
      console.error('Failed to check task status:', error);
    }
  };

  const renderScreen = () => {
    // Если проверки не завершены или есть ошибки - показываем экран 1
    if (environmentStore.tokenCheckStatus !== 'success' ||
        environmentStore.proxyCheckStatus !== 'success' ||
        environmentStore.signingParamsCheckStatus !== 'success') {
      return <Screen1 environmentStore={environmentStore} />;
    }

    // В зависимости от статуса задачи показываем соответствующий экран
    switch (taskStatusStore.taskStatus) {
      case 'ожидает генерации':
        return <Screen3 taskStatusStore={taskStatusStore} />;
      case 'генерируется':
        return <Screen4 taskStatusStore={taskStatusStore} />;
      case 'готов к подписанию':
        return <Screen5 taskStatusStore={taskStatusStore} />;
      case 'подписываются все документы':
        return <Screen6 taskStatusStore={taskStatusStore} />;
      case 'документы подписаны':
        return <Screen7 taskStatusStore={taskStatusStore} />;
      default:
        return <div>Неизвестный статус задачи</div>;
    }
  };

  return (
    <div className="app">
      {renderScreen()}
    </div>
  );
});

export default App;
