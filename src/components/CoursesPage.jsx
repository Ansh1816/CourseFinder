import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Filter, ChevronDown, Star, Users, BookOpen, Loader } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { fetchAllCourses } from "../services/api";

const CoursesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [filters, setFilters] = useState({
    platform: [],
    level: [],
    category: [],
    price: []
  });
  const [sortBy, setSortBy] = useState("popularity");
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Update searchTerm when URL search param changes
  useEffect(() => {
    const searchFromUrl = searchParams.get("search");
    if (searchFromUrl !== null && searchFromUrl !== searchTerm) {
      setSearchTerm(searchFromUrl);
    }
  }, [searchParams]);

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      setInitialLoading(true);
      setLoading(true);
      setPage(1); // Reset to page 1 when search term changes
      setCourses([]); // Clear courses when search term changes
      setHasMore(true); // Reset hasMore when search term changes
      
      try {
        // Initial fetch with first page
        const fetchedCourses = await fetchAllCourses({ 
          limit: 20,
          page: 1,
          search: searchTerm 
        });
        
        setCourses(fetchedCourses);
        setHasMore(fetchedCourses.length >= 20); // If we got a full page, assume there's more
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };

    // Using a timer to avoid excessive API calls while typing
    const timer = setTimeout(fetchCourses, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  // Function to load more courses - use useCallback to avoid stale state issues
  const loadMoreCourses = useCallback(async () => {
    if (loadingMore || !hasMore || loading) return;
    
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      
      const moreCourses = await fetchAllCourses({
        limit: 20,
        page: nextPage,
        search: searchTerm
      });
      
      if (moreCourses.length > 0) {
        // Add a small delay to make loading visible
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setCourses(prevCourses => [...prevCourses, ...moreCourses]);
        setPage(nextPage);
        setHasMore(moreCourses.length >= 20);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to load more courses:", err);
      // Don't show error for pagination, just stop loading more
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, loading, page, searchTerm]);
  
  // Handle scroll event for infinite scrolling
  useEffect(() => {
    const handleScroll = () => {
      // Check if user has scrolled to near bottom
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 500) {
        if (!loadingMore && hasMore && !loading) {
          loadMoreCourses();
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore, loading, loadMoreCourses]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Update URL with search param
    if (e.target.value) {
      setSearchParams({ search: e.target.value });
    } else {
      // Remove search param if empty
      searchParams.delete("search");
      setSearchParams(searchParams);
    }
  };

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

  // Function to determine badge color based on platform
  const getPlatformBadgeColor = (platform) => {
    switch (platform) {
      case "edX":
        return "bg-blue-600 text-white";
      case "Coursera":
        return "bg-indigo-600 text-white";
      case "Udemy":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const filteredCourses = courses.filter(course => {
    // Platform filter
    if (filters.platform.length > 0 && !filters.platform.includes(course.platform)) {
      return false;
    }
    
    // Level filter
    if (filters.level.length > 0 && !filters.level.includes(course.level)) {
      return false;
    }
    
    // Category filter
    if (filters.category.length > 0 && !filters.category.includes(course.category)) {
      return false;
    }
    
    // Price filter
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
      // Assuming students count is stored as a string like "240K+"
      const aStudents = a.students?.replace(/[^0-9.]/g, '') || "0";
      const bStudents = b.students?.replace(/[^0-9.]/g, '') || "0";
      return parseFloat(bStudents) - parseFloat(aStudents);
    } else if (sortBy === "rating") {
      return (b.rating || 0) - (a.rating || 0);
    } else if (sortBy === "newest") {
      return new Date(b.lastUpdated || Date.now()) - new Date(a.lastUpdated || Date.now());
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

  // Get unique values for filter options
  const getFilterOptions = (key) => {
    const values = courses
      .map(course => course[key])
      .filter(Boolean)
      .reduce((acc, val) => {
        if (!acc.includes(val)) acc.push(val);
        return acc;
      }, []);
    
    return values;
  };

  // Prepare filter options
  const filterOptions = {
    platform: getFilterOptions("platform"),
    level: getFilterOptions("level"),
    category: getFilterOptions("category"),
    price: ["Free", "Paid"]
  };

  // Get platform counts
  const getPlatformCounts = () => {
    const counts = {};
    filterOptions.platform.forEach(platform => {
      counts[platform] = courses.filter(c => c.platform === platform).length;
    });
    return counts;
  };
  
  const platformCounts = getPlatformCounts();

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
              Browse through courses from edX, Coursera, and Udemy
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
                  onChange={handleSearchChange}
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

              {filterOptions.platform.length > 0 && (
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
                        <span className="flex items-center">
                          <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                            platform === 'edX' ? 'bg-blue-600' : 
                            platform === 'Coursera' ? 'bg-indigo-600' : 
                            platform === 'Udemy' ? 'bg-red-600' : 'bg-gray-600'
                          }`}></span>
                          {platform}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {filterOptions.level.length > 0 && (
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
              )}

              {filterOptions.category.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-2">Category</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
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
              )}

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
              {initialLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="flex flex-col items-center">
                    <Loader className="animate-spin h-8 w-8 text-blue-600 mb-2" />
                    <p className="text-gray-600">Loading courses...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-6">
                  <p>{error}</p>
                </div>
              ) : (
                <>
                  <div className="mb-4 flex justify-between items-center">
                    <p className="text-gray-600">Showing {sortedCourses.length} courses</p>
                    <div className="text-sm text-gray-500">
                      {filterOptions.platform.map(platform => (
                        <span key={platform} className="mr-3">
                          <span className={`inline-block w-3 h-3 rounded-full mr-1 ${
                            platform === 'edX' ? 'bg-blue-600' : 
                            platform === 'Coursera' ? 'bg-indigo-600' : 
                            platform === 'Udemy' ? 'bg-red-600' : 'bg-gray-600'
                          }`}></span>
                          {platform}: {platformCounts[platform]}
                        </span>
                      ))}
                    </div>
                  </div>

                  {sortedCourses.length === 0 ? (
                    <div className="bg-gray-50 border border-gray-200 rounded p-8 text-center">
                      <h3 className="text-xl font-medium text-gray-700 mb-2">No courses found</h3>
                      <p className="text-gray-500">
                        Try adjusting your search or filter criteria to find courses
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedCourses.map((course) => (
                          <Link 
                            key={course.id} 
                            to={`/course/${course.id}`}
                            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100"
                          >
                            <div className="h-40 overflow-hidden relative">
                              <div className={`absolute top-0 right-0 ${getPlatformBadgeColor(course.platform)} text-xs px-2 py-1 m-2 rounded`}>
                                {course.platform}
                              </div>
                              <img 
                                src={course.image} 
                                alt={course.title} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1400&auto=format&fit=crop";
                                }}
                              />
                            </div>
                            <div className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                  {course.category || 'General'}
                                </span>
                                {renderStars(course.rating)}
                              </div>
                              <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 h-14">
                                {course.title}
                              </h3>
                              <p className="text-gray-600 text-sm mb-2 line-clamp-1">
                                By {course.instructor}
                              </p>
                              <div className="flex flex-wrap gap-2 mb-3 text-xs text-gray-500">
                                <div className="flex items-center">
                                  <Users size={14} className="mr-1" />
                                  {course.students || "N/A"}
                                </div>
                                <div className="flex items-center">
                                  <BookOpen size={14} className="mr-1" />
                                  {course.duration || "N/A"}
                                </div>
                              </div>
                              <div className="flex justify-between items-center mt-auto">
                                <span className="font-bold text-blue-600">{course.price || "Free"}</span>
                                <span className="text-sm font-medium text-blue-600 hover:text-blue-800">
                                  View Details
                                </span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      
                      {loadingMore && (
                        <div className="flex justify-center items-center py-8">
                          <Loader className="animate-spin h-6 w-6 text-blue-600 mr-2" />
                          <p className="text-gray-600">Loading more courses...</p>
                        </div>
                      )}
                      
                      {hasMore && !loadingMore && (
                        <div className="flex justify-center mt-8">
                          <button 
                            onClick={loadMoreCourses}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
                          >
                            Load More Courses
                          </button>
                        </div>
                      )}
                      
                      {!hasMore && !loadingMore && courses.length > 0 && (
                        <div className="text-center text-gray-500 py-8">
                          You've reached the end of the results
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CoursesPage; 