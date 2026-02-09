import { useState } from 'react';
import { useDebug } from '../hooks/useDebug';
import { SettingsIcon, WifiOffIcon, ClockIcon } from './icons';

const THROTTLE_OPTIONS = [
  { label: 'Off', value: 0 },
  { label: '1s', value: 1000 },
  { label: '3s', value: 3000 },
  { label: '5s', value: 5000 },
];

export const DebugDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, setThrottle, setOffline } = useDebug();

  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-50 flex items-center">
      {/* Drawer Panel */}
      <div
        className={`
          glass-dark text-white rounded-r-xl overflow-hidden
          transition-all duration-300 ease-out
          ${isOpen ? 'w-48 opacity-100' : 'w-0 opacity-0'}
        `}
      >
        <div className="p-4 w-48">
          <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">
            Debug Tools
          </h3>

          {/* Throttle Control */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <ClockIcon className="w-4 h-4 text-white/60" />
              <span className="text-sm text-white/80">Throttle</span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {THROTTLE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setThrottle(option.value)}
                  className={`
                    px-2 py-1 text-xs rounded transition-colors
                    ${settings.throttleMs === option.value
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Offline Toggle */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <WifiOffIcon className="w-4 h-4 text-white/60" />
              <span className="text-sm text-white/80">Offline Mode</span>
            </div>
            <button
              type="button"
              onClick={() => setOffline(!settings.isOffline)}
              className={`
                w-full px-3 py-2 text-xs rounded transition-colors
                ${settings.isOffline
                  ? 'bg-red-500/80 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
                }
              `}
            >
              {settings.isOffline ? 'Backend Offline' : 'Backend Online'}
            </button>
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-center w-8 h-12
          glass-dark text-white/60 hover:text-white
          rounded-r-lg transition-all duration-200
          ${isOpen ? 'rounded-l-none' : ''}
          ${settings.isOffline || settings.throttleMs > 0 ? 'text-amber-400' : ''}
        `}
        aria-label="Toggle debug drawer"
      >
        <SettingsIcon className="w-4 h-4" />
      </button>
    </div>
  );
};
