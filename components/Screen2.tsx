import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';

interface Screen2Props {
  onLogin: (pinType: string, pinCode: string) => Promise<void>;
}

const Screen2: React.FC<Screen2Props> = observer(({ onLogin }) => {
  const [selectedPinType, setSelectedPinType] = useState('PIN#1');
  const [pinCode, setPinCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await onLogin(selectedPinType, pinCode);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="screen">
      <h1>Ввод пользовательских данных</h1>
      
      <div className="pin-type-selector">
        <h3>Выберите тип PIN:</h3>
        {[1, 2, 3, 4, 5].map(num => (
          <label key={num}>
            <input
              type="radio"
              value={`PIN#${num}`}
              checked={selectedPinType === `PIN#${num}`}
              onChange={(e) => setSelectedPinType(e.target.value)}
            />
            {`PIN#${num}`}
          </label>
        ))}
      </div>
      
      <div className="pin-input">
        <label>
          Пин-код:
          <input
            type="password"
            value={pinCode}
            onChange={(e) => setPinCode(e.target.value)}
            placeholder="Введите пин-код"
          />
        </label>
      </div>
      
      <button 
        onClick={handleLogin} 
        disabled={isLoading || !pinCode}
      >
        {isLoading ? 'Вход...' : 'Войти'}
      </button>
    </div>
  );
});

export default Screen2;
