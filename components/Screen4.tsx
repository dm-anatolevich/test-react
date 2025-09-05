import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Document } from '../types';

interface Screen4Props {
  documents: Document[];
  taskId: string | null;
  onCheckStatus: () => Promise<void>;
  onViewDocument: (printFormId: string) => void;
}

const Screen4: React.FC<Screen4Props> = observer(({ 
  documents, 
  taskId, 
  onCheckStatus, 
  onViewDocument 
}) => {
  const [isPolling, setIsPolling] = useState(true);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const startPolling = () => {
      if (isPolling && taskId) {
        intervalId = setInterval(async () => {
          await onCheckStatus();
        }, 5000);
      }
    };

    startPolling();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPolling, taskId, onCheckStatus]);

  // Останавливаем опрос, если все документы сгенерированы
  useEffect(() => {
    const allGenerated = documents.every(doc => 
      doc.status === 'готов к подписанию' || doc.status === 'подписан'
    );
    
    if (allGenerated) {
      setIsPolling(false);
    }
  }, [documents]);

  return (
    <div className="screen">
      <h1>Генерация документов</h1>
      
      <table className="documents-table">
        <thead>
          <tr>
            <th>Тип</th>
            <th>Номер</th>
            <th>Дата</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((document) => (
            <tr key={document.id}>
              <td>{document.type}</td>
              <td>{document.number}</td>
              <td>{document.date}</td>
              <td>{document.status}</td>
              <td>
                <button 
                  onClick={() => onViewDocument(document.printFormId)}
                  disabled={!document.printFormId}
                >
                  Просмотреть
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {isPolling && <div>Идет генерация документов...</div>}
    </div>
  );
});

export default Screen4;
