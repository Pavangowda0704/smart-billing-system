
import React, { createContext, useState, useContext, useCallback } from 'react';
import { ToastType } from '../components/Toast';

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  message: string;
  type: ToastType;
  isVisible: boolean;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('info');
  const [isVisible, setIsVisible] = useState(false);

  const showToast = useCallback((msg: string, toastType: ToastType = 'info') => {
    setMessage(msg);
    setType(toastType);
    setIsVisible(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, message, type, isVisible }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
