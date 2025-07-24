import { BookOpen, Award, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-white py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              Find Your <span className="text-blue-600">Perfect Course</span> From Top Platforms
            </h1>
            <p className="text-xl text-gray-600">
              Discover thousands of courses from Coursera, Udemy, and edX all in one place.
              Compare options and find the best course for your learning goals.
            </p>
            
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2 text-gray-700">
                <BookOpen className="text-blue-600" size={20} />
                <span>50,000+ Courses</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Award className="text-blue-600" size={20} />
                <span>Verified Content</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="text-blue-600" size={20} />
                <span>Updated Daily</span>
              </div>
            </div>
            
            <div className="pt-4">
              <Link 
                to="/courses" 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
              >
                Browse Courses
              </Link>
            </div>
          </div>
          
          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-lg rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80" 
                alt="Online Learning"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection; 