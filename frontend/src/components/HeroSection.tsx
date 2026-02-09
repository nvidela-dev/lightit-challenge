import { useEffect } from 'react';
import heroImage from '../assets/doctor-stock.jpg';

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
            <div className="absolute -bottom-3 left-8 w-6 h-6 glass-header rotate-45" />
            <svg
              className="absolute top-4 right-4 w-10 h-10 text-white/20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
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
