import HeroSection from './HeroSection';
import Navbar from './Navbar';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow"> 
        <HeroSection />
      </main>
    </div>
  );
};

export default HomePage; 