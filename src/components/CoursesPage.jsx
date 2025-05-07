import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, ChevronDown, Star, Users, BookOpen } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const CoursesPage = () => {
  const allCourses = [
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
      level: "Intermediate",
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
      level: "Beginner",
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
      level: "Advanced",
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
      level: "Beginner",
      duration: "19 hours"
    },
    {
      id: 5,
      title: "Python for Everybody Specialization",
      platform: "Coursera",
      instructor: "University of Michigan",
      rating: 4.8,
      students: "1.2M+",
      price: "$49",
      image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?q=80&w=1400&auto=format&fit=crop",
      category: "Programming",
      level: "Beginner",
      duration: "3 months"
    },
    {
      id: 6,
      title: "iOS App Development with Swift",
      platform: "Udemy",
      instructor: "Angela Yu",
      rating: 4.7,
      students: "85K+",
      price: "$19.99",
      image: "https://images.unsplash.com/photo-1511075675422-c8e008f749d7?q=80&w=1400&auto=format&fit=crop",
      category: "Mobile Development",
      level: "Intermediate",
      duration: "55 hours"
    },
    {
      id: 7,
      title: "Introduction to Computer Science",
      platform: "edX",
      instructor: "Harvard University",
      rating: 4.9,
      students: "2.4M+",
      price: "Free",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1400&auto=format&fit=crop",
      category: "Computer Science",
      level: "Beginner",
      duration: "12 weeks"
    },
    {
      id: 8,
      title: "React - The Complete Guide",
      platform: "Udemy",
      instructor: "Maximilian Schwarzmüller",
      rating: 4.6,
      students: "735K+",
      price: "$29.99",
      image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=1400&auto=format&fit=crop",
      category: "Web Development",
      level: "Intermediate",
      duration: "48 hours"
    },
    {
      id: 9,
      title: "AWS Certified Solutions Architect",
      platform: "Coursera",
      instructor: "Amazon Web Services",
      rating: 4.7,
      students: "195K+",
      price: "$79",
      image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=1400&auto=format&fit=crop",
      category: "Cloud Computing",
      level: "Advanced",
      duration: "6 months"
    },
    {
      id: 10,
      title: "Excel Skills for Business Specialization",
      platform: "Coursera",
      instructor: "Macquarie University",
      rating: 4.8,
      students: "650K+",
      price: "$49",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1400&auto=format&fit=crop",
      category: "Business",
      level: "Beginner",
      duration: "6 months"
    },
    {
      id: 11,
      title: "UX Design Professional Certificate",
      platform: "edX",
      instructor: "Google",
      rating: 4.5,
      students: "82K+",
      price: "$39",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1400&auto=format&fit=crop",
      category: "Design",
      level: "Intermediate",
      duration: "6 months"
    },
    {
      id: 12,
      title: "Financial Markets",
      platform: "Coursera",
      instructor: "Yale University",
      rating: 4.8,
      students: "725K+",
      price: "Free",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1400&auto=format&fit=crop",
      category: "Finance",
      level: "Intermediate",
      duration: "7 weeks"
    }
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    platform: [],
    level: [],
    category: [],
    price: []
  });
  const [sortBy, setSortBy] = useState("popularity");
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

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

  const filteredCourses = allCourses.filter(course => {
    if (searchTerm && !course.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    if (filters.platform.length > 0 && !filters.platform.includes(course.platform)) {
      return false;
    }
    
    if (filters.level.length > 0 && !filters.level.includes(course.level)) {
      return false;
    }
    
    if (filters.category.length > 0 && !filters.category.includes(course.category)) {
      return false;
    }
    
    if (filters.price.length > 0) {
      if (filters.price.includes("Free") && course.price !== "Free") {
        return false;
      }
      if (filters.price.includes("Paid") && course.price === "Free") {
        return false;
      }
    }
    
    return true;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === "popularity") {
      return parseInt(b.students) - parseInt(a.students);
    } else if (sortBy === "rating") {
      return b.rating - a.rating;
    } else if (sortBy === "newest") {
      return b.id - a.id;
    }
    return 0;
  });

  const handleFilterChange = (filterType, value) => {
    setFilters(prevFilters => {
      const updatedFilters = { ...prevFilters };
      if (updatedFilters[filterType].includes(value)) {
        updatedFilters[filterType] = updatedFilters[filterType].filter(item => item !== value);
      } else {
        updatedFilters[filterType] = [...updatedFilters[filterType], value];
      }
      return updatedFilters;
    });
  };

  const filterOptions = {
    platform: ["Coursera", "Udemy", "edX"],
    level: ["Beginner", "Intermediate", "Advanced"],
    category: ["Computer Science", "Web Development", "Data Science", "Business", "Design", "Programming", "Personal Development"],
    price: ["Free", "Paid"]
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              All <span className="text-blue-600">Courses</span>
            </h1>
            <p className="text-gray-600">
              Browse through our selection of top courses from leading platforms
            </p>
          </div>

          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="w-full md:w-2/3 relative">
                <input
                  type="text"
                  placeholder="Search for courses..."
                  className="w-full px-4 py-3 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
              <div className="w-full md:w-1/3">
                <div className="relative">
                  <select
                    className="w-full px-4 py-3 rounded-md border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="popularity">Sort by: Popularity</option>
                    <option value="rating">Sort by: Highest Rated</option>
                    <option value="newest">Sort by: Newest</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>
            </div>

            <button 
              className="md:hidden flex items-center gap-2 mb-4 text-gray-700 font-medium"
              onClick={toggleFilters}
            >
              <Filter size={18} />
              <span>Filters</span>
              <ChevronDown size={16} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <div className={`${showFilters ? 'block' : 'hidden'} md:block md:w-1/4 bg-white rounded-lg p-4 shadow-sm border border-gray-100 h-fit`}>
              <h2 className="text-lg font-bold text-gray-800 mb-4">Filters</h2>

              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Platform</h3>
                <div className="space-y-2">
                  {filterOptions.platform.map(platform => (
                    <label key={platform} className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                        checked={filters.platform.includes(platform)}
                        onChange={() => handleFilterChange('platform', platform)}
                      />
                      {platform}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Level</h3>
                <div className="space-y-2">
                  {filterOptions.level.map(level => (
                    <label key={level} className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                        checked={filters.level.includes(level)}
                        onChange={() => handleFilterChange('level', level)}
                      />
                      {level}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Category</h3>
                <div className="space-y-2">
                  {filterOptions.category.map(category => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                        checked={filters.category.includes(category)}
                        onChange={() => handleFilterChange('category', category)}
                      />
                      {category}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Price</h3>
                <div className="space-y-2">
                  {filterOptions.price.map(price => (
                    <label key={price} className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                        checked={filters.price.includes(price)}
                        onChange={() => handleFilterChange('price', price)}
                      />
                      {price}
                    </label>
                  ))}
                </div>
              </div>

              <button 
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-md"
                onClick={() => setFilters({ platform: [], level: [], category: [], price: [] })}
              >
                Clear All Filters
              </button>
            </div>

            <div className="md:w-3/4">
              <div className="mb-4">
                <p className="text-gray-600">Showing {sortedCourses.length} courses</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedCourses.map((course) => (
                  <div key={course.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                    <div className="h-40 overflow-hidden">
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
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 h-14">
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
                      <div className="flex justify-between items-center mt-auto">
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

              <div className="mt-10 flex justify-center">
                <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Previous</span>
                    &#8592;
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-600 text-sm font-medium text-white">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    2
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    3
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Next</span>
                    &#8594;
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CoursesPage; 