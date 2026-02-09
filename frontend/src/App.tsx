import { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { Footer } from './components/Footer';
import { PatientPage } from './modules/patients/PatientPage';

const App = () => {
  const [isHeroCollapsed, setIsHeroCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Header />
      <main className="pt-16 flex-1 flex flex-col">
        <HeroSection isCollapsed={isHeroCollapsed} onCollapseChange={setIsHeroCollapsed} />
        <div className="max-w-7xl mx-auto px-6 w-full flex-1 flex items-center transition-all duration-1000 ease-out py-8">
          <div className="w-full">
            <PatientPage isHeroCollapsed={isHeroCollapsed} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
