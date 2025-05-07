import FeaturedCourses from './FeaturedCourses';
import Footer from './Footer';
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
            <Footer />
        </div>
    );
};

export default HomePage; 