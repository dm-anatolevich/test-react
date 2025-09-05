// components/Screen3.tsx
import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import TaskStatusStore from '../stores/TaskStatusStore';
import { apiService } from '../services/api';

interface Props {
  taskStatusStore: TaskStatusStore;
}

const Screen3: React.FC<Props> = observer(({ taskStatusStore }) => {
  const [selectedProxy, setSelectedProxy] = useState<string>('');
  const [selectedCertificate, setSelectedCertificate] = useState<string>('');

  const handleGenerateDocuments = async () => {
    if (!selectedProxy || !selectedCertificate) return;
    
    try {
      const result = await apiService.generateDocuments(
        taskStatusStore.taskId || '',
        selectedProxy,
        selectedCertificate
      );
      taskStatusStore.setTaskData(result);
    } catch (error) {
      console.error('Failed to generate documents:', error);
    }
  };

  return (
    <div>
      <h1>Выбор доверенности и сертификата</h1>
      
      <h2>Доверенности</h2>
      <table>
        <thead>
          <tr>
            <th>Выбор</th>
            <th>Идентификатор</th>
            <th>Срок действия</th>
            <th>Полномочия</th>
          </tr>
        </thead>
        <tbody>
          {taskStatusStore.proxies.map(proxy => (
            <tr key={proxy.id}>
              <td>
                <input
                  type="radio"
                  name="proxy"
                  value={proxy.id}
                  checked={selectedProxy === proxy.id}
                  onChange={(e) => setSelectedProxy(e.target.value)}
                />
              </td>
              <td>{proxy.id}</td>
              <td>{proxy.startDate} - {proxy.endDate}</td>
              <td>{proxy.authorities.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Сертификаты</h2>
      <table>
        <thead>
          <tr>
            <th>Выбор</th>
            <th>Идентификатор</th>
            <th>Общее имя</th>
          </tr>
        </thead>
        <tbody>
          {taskStatusStore.certificates.map(cert => (
            <tr key={cert.id}>
              <td>
                <input
                  type="radio"
                  name="certificate"
                  value={cert.id}
                  checked={selectedCertificate === cert.id}
                  onChange={(e) => setSelectedCertificate(e.target.value)}
                />
              </td>
              <td>{cert.id}</td>
              <td>{cert.commonName}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button 
        onClick={handleGenerateDocuments}
        disabled={!selectedProxy || !selectedCertificate}
      >
        Перейти к подписанию
      </button>
    </div>
  );
});

export default Screen3;
