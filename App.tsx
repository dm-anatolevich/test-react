import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import EnvironmentStore from './stores/EnvironmentStore';
import TaskStatusStore from './stores/TaskStatusStore';
import { apiService } from './services/api';
import Screen1 from './components/Screen1';
import Screen2 from './components/Screen2';
import Screen3 from './components/Screen3';
import Screen4 from './components/Screen4';
import Screen5 from './components/Screen5';
import Screen6 from './components/Screen6';
import Screen7 from './components/Screen7';

// Инициализация хранилищ
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

  const handleLogin = async (pinType: string, pinCode: string) => {
    try {
      await (window as any).cryptoPlugin.login(pinType, pinCode);
      // После успешного логина получаем сертификаты
      const certificates = (window as any).cryptoPlugin.getCertificates();
      taskStatusStore.setCertificates(certificates);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const handleGenerateDocuments = async (proxyId: string, certificateId: string) => {
    try {
      const result = await apiService.generateDocuments(
        taskStatusStore.taskId || '',
        proxyId,
        certificateId
      );
      taskStatusStore.setTaskData(result);
    } catch (error) {
      console.error('Failed to generate documents:', error);
      throw error;
    }
  };

  const handleCheckStatus = async () => {
    try {
      const result = await apiService.checkTaskStatus(taskStatusStore.taskId || '');
      taskStatusStore.setTaskData(result);
    } catch (error) {
      console.error('Failed to check task status:', error);
      throw error;
    }
  };

  const handleStartSigning = async () => {
    try {
      const result = await apiService.startSigning(taskStatusStore.taskId || '');
      taskStatusStore.setTaskData(result);
    } catch (error) {
      console.error('Failed to start signing:', error);
      throw error;
    }
  };

  const handleSignDocument = async (documentId: string, content: string) => {
    try {
      // Подписываем документ через плагин
      const signature = (window as any).cryptoPlugin.signDocument(content);
      
      // Загружаем подпись на сервер
      const result = await apiService.uploadSignature(
        taskStatusStore.taskId || '',
        documentId,
        signature
      );
      taskStatusStore.setTaskData(result);
    } catch (error) {
      console.error('Failed to sign document:', error);
      throw error;
    }
  };

  const handleGetDocumentContent = async (documentId: string) => {
    try {
      const result = await apiService.getDocumentContent(
        taskStatusStore.taskId || '',
        documentId
      );
      return result.content;
    } catch (error) {
      console.error('Failed to get document content:', error);
      throw error;
    }
  };

  const handleSendDocuments = async () => {
    try {
      const result = await apiService.sendDocuments(taskStatusStore.taskId || '');
      taskStatusStore.setTaskData(result);
    } catch (error) {
      console.error('Failed to send documents:', error);
      throw error;
    }
  };

  const handleViewDocument = (printFormId: string) => {
    // Логика для просмотра документа
    window.open(`/api/documents/print-form/${printFormId}`, '_blank');
  };

  const renderScreen = () => {
    // Если проверки не завершены или есть ошибки - отображаем экран 1
    if (environmentStore.tokenCheckStatus !== 'success' ||
        environmentStore.proxyCheckStatus !== 'success' ||
        environmentStore.signingParamsCheckStatus !== 'success') {
      return <Screen1 environmentStore={environmentStore} />;
    }

    // Если пользователь еще не вошел - отображаем экран 2
    if (!taskStatusStore.certificates.length) {
      return <Screen2 onLogin={handleLogin} />;
    }

    // В зависимости от статуса задачи отображаем соответствующий экран
    switch (taskStatusStore.taskStatus) {
      case 'ожидает генерации':
        return (
          <Screen3 
            taskStatusStore={taskStatusStore} 
            onGenerateDocuments={handleGenerateDocuments}
          />
        );
      case 'генерируется':
        return (
          <Screen4 
            documents={taskStatusStore.documents}
            taskId={taskStatusStore.taskId}
            onCheckStatus={handleCheckStatus}
            onViewDocument={handleViewDocument}
          />
        );
      case 'готов к подписанию':
        return (
          <Screen5 
            documents={taskStatusStore.documents}
            onSignAll={handleStartSigning}
            onSignDocument={(documentId) => handleSignDocument(documentId, '')}
            onViewDocument={handleViewDocument}
          />
        );
      case 'подписываются все документы':
        return (
          <Screen6 
            documents={taskStatusStore.documents}
            taskId={taskStatusStore.taskId}
            onSignDocument={handleSignDocument}
            onGetDocumentContent={handleGetDocumentContent}
            onViewDocument={handleViewDocument}
          />
        );
      case 'документы подписаны':
        return (
          <Screen7 
            documents={taskStatusStore.documents}
            onSendDocuments={handleSendDocuments}
            onViewDocument={handleViewDocument}
          />
        );
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
