import { useState, useEffect } from "react";
import { Search, User, LogOut, Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (location.pathname === "/courses") {
      const searchFromUrl = searchParams.get("search");
      if (searchFromUrl) {
        setSearchTerm(searchFromUrl);
      }
    }
  }, [location.pathname, searchParams]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchTerm.trim())}`);
      if (location.pathname !== "/courses") {
        setIsMenuOpen(false);
      }
    }
  };

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold text-blue-600 mr-4">
            CourseFinder
          </Link>
          
          <button
            className="md:hidden text-gray-700"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className="hidden md:block max-w-xl w-full">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search for courses..."
              className="w-full px-4 py-2 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600">
              <Search size={20} />
            </button>
          </form>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-gray-700 font-medium hover:text-blue-600"
          >
            Home
          </Link>
          <Link
            to="/courses"
            className="text-gray-700 font-medium hover:text-blue-600"
          >
            Courses
          </Link>
          
          {currentUser ? (
            <div className="relative">
              <button
                onClick={toggleProfile}
                className="flex items-center gap-2 text-gray-700 font-medium hover:text-blue-600"
              >
                <User size={18} />
                <span>{currentUser.name}</span>
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/my-courses"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Courses
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      <LogOut size={16} />
                      <span>Logout</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 font-medium hover:text-blue-600"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden px-4 pt-4 pb-2">
          <div className="mb-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search for courses..."
                className="w-full px-4 py-2 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button 
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600">
                <Search size={20} />
              </button>
            </form>
          </div>
          
          <div className="flex flex-col space-y-3">
            <Link
              to="/"
              className="text-gray-700 font-medium hover:text-blue-600 py-2"
            >
              Home
            </Link>
            <Link
              to="/courses"
              className="text-gray-700 font-medium hover:text-blue-600 py-2"
            >
              Courses
            </Link>
            
            {currentUser ? (
              <>
                <Link
                  to="/profile"
                  className="text-gray-700 font-medium hover:text-blue-600 py-2"
                >
                  My Profile
                </Link>
                <Link
                  to="/my-courses"
                  className="text-gray-700 font-medium hover:text-blue-600 py-2"
                >
                  My Courses
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left text-red-600 font-medium hover:text-red-700 py-2 flex items-center gap-2"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 font-medium hover:text-blue-600 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 inline-block w-fit"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
