import { useEffect } from 'react';
import heroImage from '../assets/doctor-stock.jpg';
import { HeartbeatIcon } from './icons';

type HeroSectionProps = {
  isCollapsed: boolean;
  onCollapseChange: (collapsed: boolean) => void;
};

export const HeroSection = ({ isCollapsed, onCollapseChange }: HeroSectionProps) => {
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Check if scrolling inside a scrollable container
      const target = e.target as HTMLElement;
      const scrollContainer = target.closest('[data-scroll-container]');
      if (scrollContainer) {
        return;
      }

      if (e.deltaY > 0) {
        // Scrolling down - collapse
        onCollapseChange(true);
      } else if (e.deltaY < 0 && window.scrollY === 0) {
        // Scrolling up at the top - expand
        onCollapseChange(false);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [onCollapseChange]);

  return (
    <section
      className={`relative overflow-hidden transition-all duration-1000 ease-out ${
        isCollapsed ? 'max-h-0' : 'max-h-80'
      }`}
    >
      <div className={`relative h-72 md:h-80 transition-transform duration-1000 ease-out ${
        isCollapsed ? '-translate-y-full' : 'translate-y-0'
      }`}
      >
        <img
          src={heroImage}
          alt="Medical professionals"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-transparent" />
        <div className="relative h-full max-w-7xl mx-auto px-6 flex items-center">
          <div className="relative glass-header rounded-2xl px-8 py-6 max-w-lg shadow-2xl">
            <div
              className="absolute -bottom-4 left-8 w-0 h-0"
              style={{
                borderLeft: '14px solid transparent',
                borderRight: '14px solid transparent',
                borderTop: '18px solid rgba(112, 131, 168, 0.35)',
              }}
            />
            <HeartbeatIcon
              className="absolute top-4 right-4 w-10 h-10 text-white/20"
              strokeWidth="1.5"
            />
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
              Welcome, Doctor
            </h1>
            <p className="text-white/80 text-base md:text-lg font-light">
              Manage your patients and registrations below
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
