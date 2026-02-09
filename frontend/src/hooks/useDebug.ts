import { useContext } from 'react';
import { DebugContext } from '../contexts/DebugContext';

export const useDebug = () => {
  const context = useContext(DebugContext);
  if (!context) {
    throw new Error('useDebug must be used within a DebugProvider');
  }
  return context;
};
