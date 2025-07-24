import Navbar from './Navbar';
import HeroSection from './HeroSection';
import FeaturedCourses from './FeaturedCourses';
import PlatformSection from './PlatformSection';
import Footer from './Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturedCourses />
        <PlatformSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage; 