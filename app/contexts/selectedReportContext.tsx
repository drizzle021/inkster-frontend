import React, { createContext, useContext, useState, ReactNode } from 'react';

type SelectedReportContextType = {
  selectedReportId: number | null;
  setSelectedReportId: (id: number | null) => void;
};

const SelectedReportContext = createContext<SelectedReportContextType | undefined>(undefined);

export const SelectedReportProvider = ({ children }: { children: ReactNode }) => {
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);

  return (
    <SelectedReportContext.Provider value={{ selectedReportId, setSelectedReportId }}>
      {children}
    </SelectedReportContext.Provider>
  );
};

export const useSelectedReport = () => {
  const context = useContext(SelectedReportContext);
  if (!context) {
    throw new Error('useSelectedReport must be used within a SelectedReportProvider');
  }
  return context;
};
