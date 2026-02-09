import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { Footer } from './components/Footer';
import { PatientPage } from './modules/patients/PatientPage';

const App = () => {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Header />
      <main className="pt-16 flex-1">
        <HeroSection />
        <div className="max-w-7xl mx-auto px-6">
          <PatientPage />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
