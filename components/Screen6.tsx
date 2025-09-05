import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Document } from '../types';

interface Screen6Props {
  documents: Document[];
  taskId: string | null;
  onSignDocument: (documentId: string, content: string) => Promise<void>;
  onGetDocumentContent: (documentId: string) => Promise<string>;
  onViewDocument: (printFormId: string) => void;
}

const Screen6: React.FC<Screen6Props> = observer(({ 
  documents, 
  taskId, 
  onSignDocument, 
  onGetDocumentContent, 
  onViewDocument 
}) => {
  useEffect(() => {
    const signAllDocuments = async () => {
      for (const document of documents) {
        if (document.status === 'готов к подписанию') {
          try {
            // Получаем содержимое документа
            const content = await onGetDocumentContent(document.id);
            
            // Подписываем документ
            await onSignDocument(document.id, content);
          } catch (error) {
            console.error(`Error signing document ${document.id}:`, error);
          }
        }
      }
    };

    if (taskId) {
      signAllDocuments();
    }
  }, [documents, taskId, onSignDocument, onGetDocumentContent]);

  const allSigned = documents.every(doc => 
    doc.status === 'подписан' || doc.status === 'отправлен'
  );

  return (
    <div className="screen">
      <h1>Процесс подписания документов</h1>
      
      {allSigned ? (
        <div>Все документы подписаны</div>
      ) : (
        <div>Идет процесс подписания документов...</div>
      )}
      
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
    </div>
  );
});

export default Screen6;
