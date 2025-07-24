import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, Users } from "lucide-react";
import { fetchAllCourses } from "../services/api";

const FeaturedCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const allCourses = await fetchAllCourses({ limit: 50 });
        
        if (!allCourses || allCourses.length === 0) {
          throw new Error("No courses found");
        }
        
        const edxCourses = allCourses.filter(course => course.platform === "edX").slice(0, 2);
        const courseraCourses = allCourses.filter(course => course.platform === "Coursera").slice(0, 2);
        const udemyCourses = allCourses.filter(course => course.platform === "Udemy").slice(0, 2);
        
        let featuredCourses = [...edxCourses, ...courseraCourses, ...udemyCourses];
        
        if (featuredCourses.length < 6) {
          const sampleCourses = [
            {
              id: "sample1",
              title: "Introduction to Computer Science",
              platform: "edX",
              instructor: "Harvard University",
              rating: 4.9,
              students: "2.4M+",
              price: "Free",
              image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1400&auto=format&fit=crop",
              category: "Computer Science",
              level: "Beginner"
            },
            {
              id: "sample2",
              title: "Machine Learning Specialization",
              platform: "Coursera",
              instructor: "Andrew Ng",
              rating: 4.8,
              students: "240K+",
              price: "$49",
              image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1400&auto=format&fit=crop",
              category: "Data Science",
              level: "Intermediate"
            },
            {
              id: "sample3",
              title: "The Complete Web Developer Bootcamp",
              platform: "Udemy",
              instructor: "Dr. Angela Yu",
              rating: 4.8,
              students: "700K+",
              price: "$29.99",
              image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1400&auto=format&fit=crop",
              category: "Web Development",
              level: "All Levels"
            },
            {
              id: "sample4",
              title: "Data Science Professional Certificate",
              platform: "edX",
              instructor: "IBM",
              rating: 4.6,
              students: "125K+",
              price: "$99",
              image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1400&auto=format&fit=crop",
              category: "Data Science",
              level: "Advanced"
            },
            {
              id: "sample5",
              title: "Python for Everybody",
              platform: "Coursera",
              instructor: "University of Michigan",
              rating: 4.8,
              students: "1.2M+",
              price: "$49",
              image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?q=80&w=1400&auto=format&fit=crop",
              category: "Programming",
              level: "Beginner"
            },
            {
              id: "sample6",
              title: "React - The Complete Guide",
              platform: "Udemy",
              instructor: "Maximilian Schwarzmüller",
              rating: 4.8,
              students: "830K+",
              price: "$24.99",
              image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=1400&auto=format&fit=crop",
              category: "Web Development",
              level: "Intermediate"
            }
          ];
          
          featuredCourses = sampleCourses;
        }
        
        setCourses(featuredCourses.slice(0, 6));
      } catch (err) {
        console.error("Error fetching featured courses:", err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);
  
  const getPlatformBadgeColor = (platform) => {
    switch (platform) {
      case "edX":
        return "bg-blue-100 text-blue-800";
      case "Coursera":
        return "bg-green-100 text-green-800";
      case "Udemy":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Featured Courses</h2>
            <p className="text-gray-600">Loading courses...</p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </section>
    );
  }
  
  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Featured Courses</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Featured Courses</h2>
          <p className="text-gray-600">Explore top courses from edX, Coursera, and Udemy</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <Link to={`/course/${course.id}`}>
                <img
                  src={course.image}
                  alt={course.title}
                  className="h-48 w-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1400&auto=format&fit=crop";
                  }}
                />
              </Link>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getPlatformBadgeColor(course.platform)}`}>
                    {course.platform}
                  </span>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                    {course.level}
                  </span>
                </div>
                
                <Link to={`/course/${course.id}`}>
                  <h3 className="font-bold text-xl mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                </Link>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-1">
                  {course.instructor}
                </p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium ml-1">{course.rating}</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 ml-1">{course.students}</span>
                  </div>
                  <span className="font-bold text-base">
                    {course.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link
            to="/courses"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition-colors"
          >
            Explore All Courses
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses; 