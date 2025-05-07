import FeaturedCourses from './FeaturedCourses';
import HeroSection from './HeroSection';
import Navbar from './Navbar';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow"> 
        <HeroSection />
        <FeaturedCourses />
      </main>
    </div>
  );
};

export default HomePage; 