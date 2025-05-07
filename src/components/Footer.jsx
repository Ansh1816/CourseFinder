import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Github as GitHub, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">CourseFinder</h3>
            <p className="text-gray-400 mb-4">
              Finding the perfect course for your learning journey. Compare across platforms to make the best choice.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400">
                <GitHub size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-blue-400">Home</Link>
              </li>
              <li>
                <Link to="/courses" className="text-gray-400 hover:text-blue-400">Courses</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-blue-400">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-blue-400">Contact</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-blue-400">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Top Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/category/programming" className="text-gray-400 hover:text-blue-400">Programming</Link>
              </li>
              <li>
                <Link to="/category/data-science" className="text-gray-400 hover:text-blue-400">Data Science</Link>
              </li>
              <li>
                <Link to="/category/web-development" className="text-gray-400 hover:text-blue-400">Web Development</Link>
              </li>
              <li>
                <Link to="/category/business" className="text-gray-400 hover:text-blue-400">Business</Link>
              </li>
              <li>
                <Link to="/category/design" className="text-gray-400 hover:text-blue-400">Design</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">
                  123 Learning Street, Education City, 10001
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-gray-400 flex-shrink-0" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-gray-400 flex-shrink-0" />
                <span className="text-gray-400">info@coursefinder.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} CourseFinder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 