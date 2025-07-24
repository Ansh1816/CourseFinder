import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Filter, ChevronDown, Star, Users, BookOpen, Loader, ChevronLeft, ChevronRight, X } from "lucide-react";
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
  
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalPages, setTotalPages] = useState(5); // Initial estimate
  const MAX_COURSES = 200;
  const COURSES_PER_PAGE = 20;
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const searchDebounceTimer = useRef(null);
  const [totalMatchingCourses, setTotalMatchingCourses] = useState(0);
  
  // Handle URL search param changes
  useEffect(() => {
    const searchFromUrl = searchParams.get("search");
    const pageFromUrl = parseInt(searchParams.get("page") || "1");
    
    if (searchFromUrl !== null && searchFromUrl !== searchTerm) {
      setSearchTerm(searchFromUrl);
      setDebouncedSearchTerm(searchFromUrl);
    }
    
    if (pageFromUrl !== page) {
      setPage(pageFromUrl);
    }
  }, [searchParams]);

  // Handle debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm !== searchParams.get("search")) {
      const newParams = new URLSearchParams();
      if (debouncedSearchTerm) {
        newParams.set("search", debouncedSearchTerm);
      }
      newParams.set("page", "1"); // Reset to page 1 on new search
      setSearchParams(newParams);
      setPage(1);
    }
  }, [debouncedSearchTerm]);
  
  // Fetch courses when page or search term changes
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      
      try {
        // First, get the total count of courses matching the search and filters
        const allMatchingCourses = await fetchAllCourses({ 
          limit: MAX_COURSES, // Get all matching courses to count them
          page: 1,
          search: searchParams.get("search") || "",
          filters: filters // Pass the filters to the API
        });
        
        // Calculate total pages based on all matching courses
        const totalMatching = allMatchingCourses.length;
        setTotalMatchingCourses(totalMatching);
        setTotalPages(Math.max(1, Math.ceil(totalMatching / COURSES_PER_PAGE)));
        
        // Now get just the current page of courses
        const fetchedCourses = await fetchAllCourses({ 
          limit: COURSES_PER_PAGE,
          page: page,
          search: searchParams.get("search") || "",
          filters: filters // Pass the filters to the API
        });
        
        setCourses(fetchedCourses);
        
        // Calculate if there are more courses to load
        const startIndex = (page - 1) * COURSES_PER_PAGE;
        const nextPageStartIndex = page * COURSES_PER_PAGE;
        setHasMore(nextPageStartIndex < totalMatching);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };

    fetchCourses();
  }, [searchParams, page, filters]); // Add filters as a dependency

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    
    setPage(newPage);
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", newPage);
      if (searchTerm) {
        newParams.set("search", searchTerm);
      }
      return newParams;
    });
    
    // Scroll to top when changing pages
    window.scrollTo(0, 0);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Clear any existing timer
    if (searchDebounceTimer.current) {
      clearTimeout(searchDebounceTimer.current);
    }
    
    // Set a new timer to update the debounced search term
    searchDebounceTimer.current = setTimeout(() => {
      setDebouncedSearchTerm(value);
    }, 500); // 500ms debounce
  };
  
  const clearSearch = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setSearchParams(new URLSearchParams({ page: "1" }));
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

  const filterOptions = {
    platform: getFilterOptions("platform"),
    level: getFilterOptions("level"),
    category: getFilterOptions("category"),
    price: ["Free", "Paid"]
  };
  
  const getPlatformCounts = () => {
    const counts = {};
    filterOptions.platform.forEach(platform => {
      counts[platform] = courses.filter(c => c.platform === platform).length;
    });
    return counts;
  };
  
  const platformCounts = getPlatformCounts();
  
  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(1);
      
      // Calculate start and end of page range around current page
      let startPage = Math.max(2, page - 1);
      let endPage = Math.min(totalPages - 1, page + 1);
      
      // Adjust if at the beginning
      if (page <= 2) {
        endPage = 3;
      }
      
      // Adjust if at the end
      if (page >= totalPages - 1) {
        startPage = totalPages - 2;
      }
      
      // Add ellipsis if needed
      if (startPage > 2) {
        pageNumbers.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      // Always include last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
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
              Browse through courses from edX, Coursera, and Udemy
            </p>
          </div>

          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="w-full md:w-2/3 relative">
                <input
                  type="text"
                  placeholder="Search for courses..."
                  className="w-full px-4 py-3 pr-16 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchTerm ? (
                  <button
                    onClick={clearSearch}
                    className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Clear search"
                  >
                    <X size={18} />
                  </button>
                ) : null}
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
                    <div className="flex items-center">
                      <p className="text-gray-600">
                        Showing {sortedCourses.length} {sortedCourses.length === 1 ? 'course' : 'courses'}
                        {totalMatchingCourses > 0 && (
                          <span className="ml-1 text-sm text-gray-500">
                            (Page {page} of {totalPages}, {totalMatchingCourses} total)
                          </span>
                        )}
                      </p>
                    </div>
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
                        {searchTerm ? 
                          `No courses match your search for "${searchTerm}". Try different keywords or browse all courses.` : 
                          "Try adjusting your filter criteria to find courses."}
                      </p>
                      {searchTerm && (
                        <button 
                          onClick={clearSearch}
                          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                        >
                          Clear Search
                        </button>
                      )}
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
                      
                      {loading && (
                        <div className="flex justify-center items-center py-8">
                          <Loader className="animate-spin h-6 w-6 text-blue-600 mr-2" />
                          <p className="text-gray-600">Loading courses...</p>
                        </div>
                      )}
                      
                      {/* Pagination Controls */}
                      {totalPages > 1 && (
                        <div className="flex justify-center mt-8">
                          <nav className="flex items-center space-x-2">
                            <button
                              onClick={() => handlePageChange(page - 1)}
                              disabled={page === 1}
                              className={`p-2 rounded-md ${
                                page === 1 
                                  ? 'text-gray-400 cursor-not-allowed' 
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                              aria-label="Previous page"
                            >
                              <ChevronLeft size={20} />
                            </button>
                            
                            {generatePageNumbers().map((pageNum, index) => (
                              <button
                                key={index}
                                onClick={() => typeof pageNum === 'number' ? handlePageChange(pageNum) : null}
                                disabled={pageNum === '...'}
                                className={`px-4 py-2 rounded-md ${
                                  pageNum === page
                                    ? 'bg-blue-600 text-white'
                                    : pageNum === '...'
                                    ? 'text-gray-500 cursor-default'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                              >
                                {pageNum}
                              </button>
                            ))}
                            
                            <button
                              onClick={() => handlePageChange(page + 1)}
                              disabled={page === totalPages || totalPages === 0}
                              className={`p-2 rounded-md ${
                                page === totalPages || totalPages === 0
                                  ? 'text-gray-400 cursor-not-allowed' 
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                              aria-label="Next page"
                            >
                              <ChevronRight size={20} />
                            </button>
                          </nav>
                        </div>
                      )}
                      
                      <div className="text-center text-gray-500 py-4 text-sm">
                        {searchTerm ? 
                          `Found ${totalMatchingCourses} ${totalMatchingCourses === 1 ? 'course' : 'courses'} matching "${searchTerm}"` : 
                          "Showing courses from our catalog"}
                      </div>
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