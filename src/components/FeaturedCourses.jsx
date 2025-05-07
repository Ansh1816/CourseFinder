import { Star, Users, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturedCourses = () => {
  const courses = [
    {
      id: 1,
      title: "Machine Learning Specialization",
      platform: "Coursera",
      instructor: "Andrew Ng",
      rating: 4.8,
      students: "240K+",
      price: "$49",
      image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1400&auto=format&fit=crop",
      category: "Computer Science",
      duration: "3 months"
    },
    {
      id: 2,
      title: "Complete Web Development Bootcamp",
      platform: "Udemy",
      instructor: "Dr. Angela Yu",
      rating: 4.7,
      students: "150K+",
      price: "$24.99",
      image: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1400&auto=format&fit=crop",
      category: "Web Development",
      duration: "65 hours"
    },
    {
      id: 3,
      title: "Data Science Professional Certificate",
      platform: "edX",
      instructor: "IBM",
      rating: 4.6,
      students: "125K+",
      price: "$99",
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1400&auto=format&fit=crop",
      category: "Data Science",
      duration: "10 weeks"
    },
    {
      id: 4,
      title: "The Science of Well-Being",
      platform: "Coursera",
      instructor: "Yale University",
      rating: 4.9,
      students: "3.9M+",
      price: "Free",
      image: "https://images.unsplash.com/photo-1495465798138-718f86d1a4bc?q=80&w=1400&auto=format&fit=crop",
      category: "Personal Development",
      duration: "19 hours"
    }
  ];

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        <span className="text-yellow-500 mr-1">
          <Star size={16} fill="#FBBF24" />
        </span>
        <span className="text-sm font-medium text-gray-700">{rating}</span>
      </div>
    );
  };

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">
            Featured <span className="text-blue-600">Courses</span>
          </h2>
          <p className="text-gray-600 mt-2">
            Explore the most popular and trending courses from top platforms
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="h-48 overflow-hidden">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {course.platform}
                  </span>
                  {renderStars(course.rating)}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  By {course.instructor}
                </p>
                <div className="flex flex-wrap gap-2 mb-3 text-xs text-gray-500">
                  <div className="flex items-center">
                    <Users size={14} className="mr-1" />
                    {course.students}
                  </div>
                  <div className="flex items-center">
                    <BookOpen size={14} className="mr-1" />
                    {course.duration}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-blue-600">{course.price}</span>
                  <Link 
                    to={`/course/${course.id}`} 
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link 
            to="/courses" 
            className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg font-medium inline-block"
          >
            View All Courses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCourses; 