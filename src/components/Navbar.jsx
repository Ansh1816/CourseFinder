import { Search } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold text-blue-600 mr-4">
            CourseFinder
          </Link>
        </div>

        <div className="max-w-xl w-full">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for courses..."
              className="w-full px-4 py-2 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600">
              <Search size={20} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6">
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
