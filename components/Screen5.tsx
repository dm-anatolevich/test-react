import React from 'react';
import { observer } from 'mobx-react-lite';
import { Document } from '../types';

interface Screen5Props {
  documents: Document[];
  onSignAll: () => Promise<void>;
  onSignDocument: (documentId: string) => Promise<void>;
  onViewDocument: (printFormId: string) => void;
}

const Screen5: React.FC<Screen5Props> = observer(({ 
  documents, 
  onSignAll, 
  onSignDocument, 
  onViewDocument 
}) => {
  const canSignAll = documents.every(doc => doc.status === 'готов к подписанию');

  return (
    <div className="screen">
      <h1>Старт подписания документов</h1>
      
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
                  onClick={() => onSignDocument(document.id)}
                  disabled={document.status !== 'готов к подписанию'}
                >
                  Подписать
                </button>
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
        onClick={onSignAll} 
        disabled={!canSignAll}
        className="sign-all-btn"
      >
        Подписать все
      </button>
    </div>
  );
});

export default Screen5;
