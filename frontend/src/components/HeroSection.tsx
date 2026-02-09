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
          <div className="relative rounded-2xl px-8 py-6 max-w-lg overflow-hidden bg-gradient-to-br from-white/20 via-white/10 to-primary/20 backdrop-blur-xl border border-white/30 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-white/10 pointer-events-none" />
            <h1 className="relative text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-lg">
                Patient Registration
              </span>
            </h1>
            <p className="relative text-white/90 text-base md:text-lg font-light tracking-wide">
              Streamlined intake and document management for modern healthcare
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
