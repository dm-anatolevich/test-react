import React from 'react';
import { observer } from 'mobx-react-lite';
import { Document } from '../types';

interface Screen7Props {
  documents: Document[];
  onSendDocuments: () => Promise<void>;
  onViewDocument: (printFormId: string) => void;
}

const Screen7: React.FC<Screen7Props> = observer(({ 
  documents, 
  onSendDocuments, 
  onViewDocument 
}) => {
  const canSend = documents.every(doc => doc.status === 'подписан');

  return (
    <div className="screen">
      <h1>Отправка документов</h1>
      
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
      
      <button 
        onClick={onSendDocuments} 
        disabled={!canSend}
        className="send-all-btn"
      >
        Отправить документы
      </button>
    </div>
  );
});

export default Screen7;
