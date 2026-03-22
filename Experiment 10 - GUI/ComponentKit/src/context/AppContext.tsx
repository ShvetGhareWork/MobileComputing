import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAllSubmissions } from '../services/formService';

interface AppContextType {
  themePreference: 'Light' | 'Dark' | 'System';
  setThemePreference: (theme: 'Light' | 'Dark' | 'System') => void;
  submissionCount: number;
  updateSubmissionCount: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themePreference, setThemePreference] = useState<'Light' | 'Dark' | 'System'>('System');
  const [submissionCount, setSubmissionCount] = useState(0);

  const updateSubmissionCount = async () => {
    try {
      const submissions = await getAllSubmissions();
      setSubmissionCount(submissions.length);
    } catch (e) {
      console.error('Error fetching submission count', e);
    }
  };

  useEffect(() => {
    updateSubmissionCount();
  }, []);

  return (
    <AppContext.Provider value={{ themePreference, setThemePreference, submissionCount, updateSubmissionCount }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
