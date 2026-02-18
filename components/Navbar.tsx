
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              EDUSPACE
            </Link>
          </div>
          <div className="hidden md:flex space-x-8">
            <button onClick={() => scrollToSection('hero')} className="text-gray-600 hover:text-indigo-600 transition">
              Home
            </button>
            <button onClick={() => scrollToSection('what-we-cover')} className="text-gray-600 hover:text-indigo-600 transition cursor-pointer bg-transparent border-none">
              About
            </button>
            <button onClick={() => scrollToSection('courses')} className="text-gray-600 hover:text-indigo-600 transition cursor-pointer bg-transparent border-none">
              Courses
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-gray-600 hover:text-indigo-600 transition cursor-pointer bg-transparent border-none">
              Contact
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-gray-600 hover:text-indigo-600 font-medium"
            >
              Login
            </Link>
            <Link
              to="/admin/login"
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
