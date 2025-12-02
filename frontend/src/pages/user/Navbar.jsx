import { FaBars, FaTimes, FaHome, FaComment, FaFileAlt, FaListAlt, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  return (
    <nav className="bg-gradient-to-r from-white to-purple-50 shadow-lg sticky top-0 z-50 border-b border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/home" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">NS</span>
              </div>
              <div>
                <span className="text-xl font-bold text-gray-800">NagarSaathi</span>
                <p className="text-xs text-gray-500 -mt-1">Community Portal</p>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
            >
              <FaHome />
              <span>Home</span>
            </Link>
            <Link
              to="/complaint"
              className="flex items-center gap-2 text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
            >
              <FaFileAlt />
              <span>File Complaint</span>
            </Link>
            <Link
              to="/mycomplaints"
              className="flex items-center gap-2 text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
            >
              <FaListAlt />
              <span>My Complaints</span>
            </Link>
            <Link
              to="/forum"
              className="flex items-center gap-2 text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
            >
              <FaUsers />
              <span>Discussion Forum</span>
            </Link>
            <Link
              to="/feedback"
              className="flex items-center gap-2 text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
            >
              <FaComment />
              <span>Feedback</span>
            </Link>
            
            {/* User Info */}
            {user && (
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-purple-200">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-400 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white text-sm font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">Ward: {user.ward}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-600 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                  title="Logout"
                >
                  <FaSignOutAlt />
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-700 hover:text-purple-600 hover:bg-purple-50 focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FaTimes className="block h-6 w-6" />
              ) : (
                <FaBars className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-purple-100">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {/* User Info Mobile */}
            {user && (
              <div className="flex items-center gap-3 p-4 mb-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl mx-2">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-400 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white text-lg font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-600">Ward: {user.ward}</p>
                </div>
              </div>
            )}
            
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-600 transition-all"
              onClick={toggleMenu}
            >
              <FaHome />
              <span>Home</span>
            </Link>
            <Link
              to="/complaint"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-600 transition-all"
              onClick={toggleMenu}
            >
              <FaFileAlt />
              <span>File Complaint</span>
            </Link>
            <Link
              to="/mycomplaints"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-600 transition-all"
              onClick={toggleMenu}
            >
              <FaListAlt />
              <span>My Complaints</span>
            </Link>
            <Link
              to="/forum"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-600 transition-all"
              onClick={toggleMenu}
            >
              <FaUsers />
              <span>Discussion Forum</span>
            </Link>
            <Link
              to="/feedback"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-600 transition-all"
              onClick={toggleMenu}
            >
              <FaComment />
              <span>Feedback</span>
            </Link>
            
            {/* Logout Button Mobile */}
            {user && (
              <div className="border-t border-purple-100 pt-3 mt-2">
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition-all"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;