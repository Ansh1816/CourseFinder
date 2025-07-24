import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Clock, Star, AlertCircle, Play, BookMarked, Loader, Check } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useAuth } from "./AuthContext";
import { fetchAllCourses } from "../services/api";

const MyCoursesPage = () => {
  const { currentUser } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [pursuingCourses, setPursuingCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");

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
    const fetchUserCourses = async () => {
      setLoading(true);
      setError("");

      try {
        const userEnrollments = JSON.parse(localStorage.getItem(`enrollments_${currentUser.email}`) || "[]");
        const userPursuing = JSON.parse(localStorage.getItem(`pursuing_${currentUser.email}`) || "[]");
        const completedCourses = JSON.parse(localStorage.getItem(`completed_${currentUser.email}`) || "[]");

        if (userEnrollments.length === 0 && userPursuing.length === 0) {
          setLoading(false);
          return;
        }

        const allCourses = await fetchAllCourses({ limit: 50 });

        console.log("Fetched courses for My Courses page:", allCourses.length);
        console.log("User enrollments:", userEnrollments.length);
        console.log("User pursuing:", userPursuing.length);
        console.log("Completed courses:", completedCourses.length);

        const userEnrolledCourses = allCourses.filter(course =>
          userEnrollments.includes(course.id) && !userPursuing.includes(course.id)
        ).map(course => ({
          ...course,
          enrolledDate: getEnrollmentDate(course.id)
        }));

        const userPursuingCourses = allCourses.filter(course =>
          userPursuing.includes(course.id)
        ).map(course => ({
          ...course,
          enrolledDate: getEnrollmentDate(course.id),
          completed: completedCourses.includes(course.id)
        }));

        console.log("Enrolled courses found:", userEnrolledCourses.length);
        console.log("Pursuing courses found:", userPursuingCourses.length);

        setEnrolledCourses(userEnrolledCourses);
        setPursuingCourses(userPursuingCourses);
      } catch (err) {
        console.error("Failed to load courses:", err);
        setError("Failed to load your courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserCourses();
  }, [currentUser]);

  const getEnrollmentDate = (courseId) => {
    const timestamp = parseInt(courseId.split('_').pop()) || Date.now();
    const randomOffset = (parseInt(courseId.replace(/\D/g, '')) || 0) % 30;
    const date = new Date(timestamp);
    date.setDate(date.getDate() - randomOffset);
    return date.toISOString().split('T')[0];
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
        <span className="text-sm font-medium ml-1">{rating}</span>
      </div>
    );
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handlePursueCourse = (courseId) => {
    try {
      const userPursuing = JSON.parse(localStorage.getItem(`pursuing_${currentUser.email}`) || "[]");
      
      if (!userPursuing.includes(courseId)) {
        userPursuing.push(courseId);
        localStorage.setItem(`pursuing_${currentUser.email}`, JSON.stringify(userPursuing));
        
        setEnrolledCourses(prev => prev.filter(course => course.id !== courseId));
        setPursuingCourses(prev => [
          ...prev, 
          {
            ...enrolledCourses.find(course => course.id === courseId),
            completed: false
          }
        ]);
      }
    } catch (err) {
      setError("Failed to update course status. Please try again later.");
    }
  };

  const handleFinishCourse = (courseId) => {
    try {
      const completedCourses = JSON.parse(localStorage.getItem(`completed_${currentUser.email}`) || "[]");

      if (!completedCourses.includes(courseId)) {
        completedCourses.push(courseId);
        localStorage.setItem(`completed_${currentUser.email}`, JSON.stringify(completedCourses));

        setPursuingCourses(prev =>
          prev.map(course =>
            course.id === courseId
              ? { ...course, completed: true }
              : course
          )
        );
      }
    } catch (err) {
      setError("Failed to update course status. Please try again later.");
    }
  };

  const getDisplayedCourses = () => {
    switch (activeTab) {
      case "enrolled":
        return enrolledCourses;
      case "pursuing":
        return pursuingCourses;
      case "completed":
        return pursuingCourses.filter(course => course.completed);
      case "inprogress":
        return pursuingCourses.filter(course => !course.completed);
      case "all":
      default:
        return [...enrolledCourses, ...pursuingCourses];
    }
  };

  const groupCoursesByPlatform = (courses) => {
    const grouped = courses.reduce((acc, course) => {
      if (!acc[course.platform]) {
        acc[course.platform] = [];
      }
      acc[course.platform].push(course);
      return acc;
    }, {});

    const preferredOrder = ["edX", "Coursera", "Udemy"];
    return Object.entries(grouped).sort((a, b) => 
      preferredOrder.indexOf(a[0]) - preferredOrder.indexOf(b[0])
    );
  };
  
  const displayedCourses = getDisplayedCourses();
  const groupedCourses = groupCoursesByPlatform(displayedCourses);
  const hasMultiplePlatforms = Object.keys(groupCoursesByPlatform(displayedCourses)).length > 1;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-12">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Loading your courses...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            My Courses
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          <div className="border-b border-gray-200 mb-6">
            <ul className="flex flex-wrap -mb-px">
              <li className="mr-2">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`inline-block p-4 border-b-2 font-medium text-sm ${
                    activeTab === "all"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  All Courses
                </button>
              </li>
              <li className="mr-2">
                <button
                  onClick={() => setActiveTab("pursuing")}
                  className={`inline-block p-4 border-b-2 font-medium text-sm ${
                    activeTab === "pursuing"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  My Courses
                </button>
              </li>
              <li className="mr-2">
                <button
                  onClick={() => setActiveTab("enrolled")}
                  className={`inline-block p-4 border-b-2 font-medium text-sm ${
                    activeTab === "enrolled"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Enrolled
                </button>
              </li>
              <li className="mr-2">
                <button
                  onClick={() => setActiveTab("inprogress")}
                  className={`inline-block p-4 border-b-2 font-medium text-sm ${
                    activeTab === "inprogress"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  In Progress
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("completed")}
                  className={`inline-block p-4 border-b-2 font-medium text-sm ${
                    activeTab === "completed"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Completed
                </button>
              </li>
            </ul>
          </div>

          {hasMultiplePlatforms && (
            <div className="flex flex-wrap gap-2 mb-6">
              {groupedCourses.map(([platform, _]) => {
                const colors = getPlatformColors(platform);
                const circleColor = platform === "edX" ? "bg-blue-600" : 
                                    platform === "Coursera" ? "bg-green-600" :
                                    platform === "Udemy" ? "bg-purple-600" : "bg-gray-600";
                
                return (
                  <div key={platform} className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${circleColor} mr-1`}></div>
                    <span className="text-sm font-medium">{platform}</span>
                  </div>
                );
              })}
            </div>
          )}

          {displayedCourses.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No courses found
              </h3>
              <p className="text-gray-600 mb-4">
                You haven't added any courses yet. Browse courses to get started.
              </p>
              <Link
                to="/courses"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Browse Courses
              </Link>
            </div>
          ) : (
            groupedCourses.map(([platform, courses]) => (
              <div key={platform} className="mb-10">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-2 ${
                    platform === "edX" ? "bg-blue-600" : 
                    platform === "Coursera" ? "bg-green-600" :
                    platform === "Udemy" ? "bg-purple-600" : "bg-gray-600"
                  }`}></div>
                  {platform} Courses ({courses.length})
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {courses.map((course) => {
                    const isCompleted = course.completed;
                    const platformColors = getPlatformColors(course.platform);
                    
                    return (
                      <div
                        key={course.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
                      >
                        <div className="relative h-40">
                          <img
                            src={course.image}
                            alt={course.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1400&auto=format&fit=crop";
                            }}
                          />
                          <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-start">
                            <span className={`${platformColors.badge} text-xs px-2 py-1 rounded-full`}>
                              {course.platform}
                            </span>
                            {course.completed ? (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                                <Check className="h-3 w-3 mr-1" /> Completed
                              </span>
                            ) : (
                              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                In Progress
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <Link to={`/course/${course.id}`}>
                            <h3 className="font-bold text-lg mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                              {course.title}
                            </h3>
                          </Link>
                          
                          <div className="flex justify-between items-center mb-3">
                            <p className="text-sm text-gray-600">
                              {course.instructor}
                            </p>
                            {renderStars(course.rating)}
                          </div>
                          
                          <div className="text-xs text-gray-500 mb-3">
                            Added on {formatDate(course.enrolledDate)}
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            {course.completed ? (
                              <div className="flex items-center text-green-700 font-medium">
                                <Check className="h-4 w-4 mr-1" /> Course Completed
                              </div>
                            ) : activeTab === "enrolled" ? (
                              <button
                                onClick={() => handlePursueCourse(course.id)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                Add to My Courses
                              </button>
                            ) : !course.completed ? (
                              <button
                                onClick={() => handleFinishCourse(course.id)}
                                className="text-green-600 hover:text-green-800 text-sm font-medium"
                              >
                                Mark as Finished
                              </button>
                            ) : null}
                            
                            <Link
                              to={`/course/${course.id}`}
                              className={`${platformColors.accent} hover:underline text-sm font-medium`}
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyCoursesPage; 