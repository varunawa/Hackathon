import React, { createContext, useContext, useEffect, useState } from 'react';
import { BeaconMessage, readAndParseBeaconMessages } from '../utils/parsing';

interface BeaconDataContextType {
  beaconMessages: BeaconMessage[];
  currentMessageIndex: number;
  error: string | null;
  isLoading: boolean;
  dataView: string;
  setDataView: (view: string) => void;
}

const BeaconDataContext = createContext<BeaconDataContextType | undefined>(undefined);

export const useBeaconData = () => {
  const context = useContext(BeaconDataContext);
  if (!context) {
    throw new Error('useBeaconData must be used within a BeaconDataProvider');
  }
  return context;
};

export const BeaconDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [beaconMessages, setBeaconMessages] = useState<BeaconMessage[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataView, setDataView] = useState<string>('position');

  useEffect(() => {
    setIsLoading(true);
    fetch('/updated_beacon_output.txt')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch beacon data');
        }
        return response.text();
      })
      .then(text => {
        const parsedMessages = readAndParseBeaconMessages(text);
        setBeaconMessages(parsedMessages);
        setIsLoading(false);
      })
      .catch(err => {
        setError('Error: ' + err.message);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (beaconMessages.length > 0) {
      const interval = setInterval(() => {
        setCurrentMessageIndex(prevIndex => 
          prevIndex < beaconMessages.length - 1 ? prevIndex + 1 : prevIndex
        );
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [beaconMessages]);

  const value = {
    beaconMessages,
    currentMessageIndex,
    error,
    isLoading,
    dataView,
    setDataView,
  };

  return (
    <BeaconDataContext.Provider value={value}>
      {children}
    </BeaconDataContext.Provider>
  );
};