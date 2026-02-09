import { createContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { debugSettings as globalDebugSettings } from '../utils/debug';

export type DebugSettings = {
  throttleMs: number;
  isOffline: boolean;
};

type DebugContextValue = {
  settings: DebugSettings;
  setThrottle: (ms: number) => void;
  setOffline: (offline: boolean) => void;
};

export const DebugContext = createContext<DebugContextValue | null>(null);

type DebugProviderProps = {
  children: ReactNode;
};

export const DebugProvider = ({ children }: DebugProviderProps) => {
  const [settings, setSettings] = useState<DebugSettings>({
    throttleMs: 0,
    isOffline: false,
  });

  const setThrottle = useCallback((ms: number) => {
    globalDebugSettings.throttleMs = ms;
    setSettings((prev) => ({ ...prev, throttleMs: ms }));
  }, []);

  const setOffline = useCallback((offline: boolean) => {
    globalDebugSettings.isOffline = offline;
    setSettings((prev) => ({ ...prev, isOffline: offline }));
  }, []);

  const value = useMemo(
    () => ({ settings, setThrottle, setOffline }),
    [settings, setThrottle, setOffline]
  );

  return (
    <DebugContext.Provider value={value}>
      {children}
    </DebugContext.Provider>
  );
};
