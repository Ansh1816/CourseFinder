import FeaturedCourses from './FeaturedCourses';
import HeroSection from './HeroSection';
import Navbar from './Navbar';
import PlatformSection from './PlatformSection';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow"> 
        <HeroSection />
        <FeaturedCourses />
        <PlatformSection />
      </main>
    </div>
  );
};

export default HomePage; 