import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ReaderModeContextType {
  readerEnabled: boolean;
  toggleReader: () => void;
}

const ReaderModeContext = createContext<ReaderModeContextType | undefined>(undefined);

export const ReaderModeProvider = ({ children }: { children: ReactNode }) => {
  const [readerEnabled, setReaderEnabled] = useState(false);

  const toggleReader = () => {
    setReaderEnabled(prev => !prev);
  };

  return (
    <ReaderModeContext.Provider value={{ readerEnabled, toggleReader }}>
      {children}
    </ReaderModeContext.Provider>
  );
};

export const useReaderMode = () => {
  const context = useContext(ReaderModeContext);
  if (!context) {
    throw new Error('useReaderMode must be used within a ReaderModeProvider');
  }
  return context;
};
