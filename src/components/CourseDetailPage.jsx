import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Users, Clock, BookOpen, CheckCircle, Award, Globe, AlertCircle, BookMarked, Play } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useAuth } from "./AuthContext";
import { fetchCourseDetails } from "../services/api";

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrolled, setEnrolled] = useState(false);
  const [pursuing, setPursuing] = useState(false);
  const [actionStatus, setActionStatus] = useState({ success: false, message: "" });
  const { currentUser } = useAuth();

  const getPlatformColors = (platform) => {
    switch (platform) {
      case "edX":
        return {
          badge: "bg-blue-100 text-blue-800",
          accent: "text-blue-600",
          button: "bg-blue-600 hover:bg-blue-700",
        };
      case "Coursera":
        return {
          badge: "bg-green-100 text-green-800",
          accent: "text-green-600",
          button: "bg-green-600 hover:bg-green-700",
        };
      case "Udemy":
        return {
          badge: "bg-purple-100 text-purple-800",
          accent: "text-purple-600",
          button: "bg-purple-600 hover:bg-purple-700",
        };
      default:
        return {
          badge: "bg-gray-100 text-gray-800",
          accent: "text-gray-600",
          button: "bg-gray-600 hover:bg-gray-700",
        };
    }
  };

  useEffect(() => {
    const getCourseDetails = async () => {
      setLoading(true);
      setError("");

      try {
        const courseData = await fetchCourseDetails(courseId);

        if (courseData) {
          // Use the platform from the course data directly
          const platform = courseData.platform || 
                         (courseId.startsWith("edx_") ? "edX" :
                         courseId.startsWith("coursera_") ? "Coursera" :
                         courseId.startsWith("udemy_") ? "Udemy" : "Unknown");

          const processedCourse = {
            id: courseId,
            title: courseData.title || courseData.name || "Course Title",
            platform: platform,
            instructor: courseData.instructor || courseData.instructorName || "Unknown Instructor",
            instructorTitle: courseData.instructorTitle || "Instructor",
            instructorImage: courseData.instructorImage || "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=300&auto=format&fit=crop",
            rating: courseData.rating || 4.5,
            students: courseData.students || courseData.enrollmentCount || "N/A",
            price: courseData.price || "Free",
            image: courseData.image || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1400&auto=format&fit=crop",
            category: courseData.category || "General",
            level: courseData.level || "All Levels",
            duration: courseData.duration || "Self-paced",
            lastUpdated: courseData.lastUpdated || "Recently",
            language: courseData.language || "English",
            description: courseData.description || "No description available.",
            whatYouWillLearn: courseData.whatYouWillLearn || [],
            curriculum: courseData.curriculum || [],
            requirements: courseData.requirements || [],
            reviews: courseData.reviews || [],
            courseUrl: courseData.courseUrl || `https://www.example.com/course/${courseId}`
          };

          setCourse(processedCourse);

          const userEnrollments = JSON.parse(localStorage.getItem(`enrollments_${currentUser.email}`) || "[]");
          const userPursuing = JSON.parse(localStorage.getItem(`pursuing_${currentUser.email}`) || "[]");

          setEnrolled(userEnrollments.includes(courseId));
          setPursuing(userPursuing.includes(courseId));
        } else {
          setError("Course not found");
        }
      } catch (err) {
        console.error("Error fetching course details:", err);
        setError("Failed to load course details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      getCourseDetails();
    }
  }, [courseId, currentUser]);

  const handleEnroll = () => {
    setActionStatus({
      success: true,
      message: "Click the 'Go to Course' button to access the full course content on the provider's site."
    });
  };

  const handlePursue = () => {
    try {
      const userPursuing = JSON.parse(localStorage.getItem(`pursuing_${currentUser.email}`) || "[]");

      if (!userPursuing.includes(courseId)) {
        userPursuing.push(courseId);
        localStorage.setItem(`pursuing_${currentUser.email}`, JSON.stringify(userPursuing));
        setPursuing(true);
        setActionStatus({
          success: true,
          message: "Course added to My Courses! You can track this course on your My Courses page."
        });
      } else {
        setActionStatus({
          success: false,
          message: "This course is already in your My Courses list."
        });
      }
    } catch (err) {
      setActionStatus({
        success: false,
        message: "Failed to add course to My Courses. Please try again later."
      });
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className="h-5 w-5 text-gray-300 fill-gray-300" />
            <div className="absolute top-0 left-0 overflow-hidden w-1/2">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="h-5 w-5 text-gray-300 fill-gray-300" />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center p-8">
            <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin mb-4"></div>
            <p className="text-lg text-gray-600">Loading course details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center p-8">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Error Loading Course</h2>
            <p className="text-lg text-gray-600 mb-6">{error || "Course not found"}</p>
            <Link
              to="/courses"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const platformColors = getPlatformColors(course.platform);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-gray-50 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-64 md:h-80 object-cover rounded-lg shadow-md mb-6"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1400&auto=format&fit=crop";
                }}
              />
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${platformColors.badge}`}>
                  {course.platform}
                </span>
                <span className="text-sm font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-800">
                  {course.category}
                </span>
                <span className="text-sm font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-800">
                  {course.level}
                </span>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold mb-4">{course.title}</h1>
              
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <img
                    src={course.instructorImage}
                    alt={course.instructor}
                    className="w-10 h-10 rounded-full mr-3"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=300&auto=format&fit=crop";
                    }}
                  />
                  <div>
                    <p className="font-medium">{course.instructor}</p>
                    <p className="text-sm text-gray-500">{course.instructorTitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center">
                    {renderStars(course.rating)}
                    <span className="ml-1 text-sm font-medium">({course.rating})</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-500 mr-1" />
                    <span className="text-sm">{course.students} students</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-500 mr-1" />
                    <span className="text-sm">{course.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 text-gray-500 mr-1" />
                    <span className="text-sm">{course.language}</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-3">Description</h2>
                <p className="text-gray-700">{course.description}</p>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-3">What You'll Learn</h2>
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {course.whatYouWillLearn.map((item, index) => (
                      <li key={index} className="flex">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-3">Course Content</h2>
                <div className="bg-white rounded-lg shadow-sm divide-y">
                  {course.curriculum.map((section, index) => (
                    <div key={index} className="p-4">
                      <h3 className="font-bold text-lg mb-2">{section.title}</h3>
                      <ul className="space-y-2">
                        {section.lessons.map((lesson, lessonIndex) => (
                          <li key={lessonIndex} className="flex items-center">
                            <Play className="h-4 w-4 text-gray-500 mr-2" />
                            <span>{lesson}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-3">Requirements</h2>
                <ul className="list-disc pl-5 space-y-1">
                  {course.requirements.map((requirement, index) => (
                    <li key={index}>{requirement}</li>
                  ))}
                </ul>
              </div>
              
              {course.reviews && course.reviews.length > 0 && course.platform === "Udemy" && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-3">Reviews</h2>
                  <div className="space-y-4">
                    {course.reviews.map((review, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{review.name}</h4>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <div className="flex items-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} 
                            />
                          ))}
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="md:w-1/3">
              <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
                <div className="mb-4 text-center">
                  <span className="text-2xl font-bold">{course.price}</span>
                </div>
                
                <div className="space-y-3">
                  {!pursuing ? (
                    <>
                      <a
                        href={course.courseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`block w-full py-2 px-4 text-center text-white rounded-md ${platformColors.button} transition-colors`}
                      >
                        Go to Course
                      </a>
                      <button
                        onClick={handlePursue}
                        className={`block w-full py-2 px-4 text-center border border-gray-300 rounded-md hover:bg-gray-50 transition-colors`}
                      >
                        Add to My Courses
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/my-courses"
                      className="block w-full py-2 px-4 text-center text-white rounded-md bg-green-600 hover:bg-green-700 transition-colors"
                    >
                      View in My Courses
                    </Link>
                  )}
                </div>
                
                {actionStatus.message && (
                  <div className={`mt-4 p-3 rounded-md ${actionStatus.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    {actionStatus.message}
                  </div>
                )}
                
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Course Features:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Award className="h-4 w-4 text-gray-500 mr-2" />
                      <span>Certificate of completion</span>
                    </li>
                    <li className="flex items-center">
                      <BookOpen className="h-4 w-4 text-gray-500 mr-2" />
                      <span>Full lifetime access</span>
                    </li>
                    <li className="flex items-center">
                      <BookMarked className="h-4 w-4 text-gray-500 mr-2" />
                      <span>Last updated: {course.lastUpdated}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CourseDetailPage; 