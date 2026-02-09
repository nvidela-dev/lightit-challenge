import { HeartbeatIcon } from './icons';

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <HeartbeatIcon className="w-8 h-8 text-[#6B8FC8]" />
          <span className="text-xl font-bold text-slate-900">MedReg</span>
        </div>
        <nav className="text-sm text-slate-600">
          Patient Registration System
        </nav>
      </div>
    </header>
  );
};
