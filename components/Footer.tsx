import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MessageCircle, Instagram, ArrowRight, BookOpen, Users, FileText, Shield } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6 group">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                EDUSPHERE
              </span>
            </Link>
            <p className="text-gray-300 leading-relaxed mb-6">
              Empowering students with quality education and expert guidance to achieve their EAMCET dreams.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://wa.me/919390095383"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-green-600/20 hover:bg-green-600/30 border border-green-600/30 rounded-lg flex items-center justify-center transition-all duration-300 group"
                title="WhatsApp"
              >
                <MessageCircle className="w-5 h-5 text-green-400 group-hover:text-green-300" />
              </a>
              <a
                href="https://www.instagram.com/edusphere_2026?igsh=MTFncTA0cm1jdW43aw=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-pink-600/20 hover:bg-pink-600/30 border border-pink-600/30 rounded-lg flex items-center justify-center transition-all duration-300 group"
                title="Instagram"
              >
                <Instagram className="w-5 h-5 text-pink-400 group-hover:text-pink-300" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white flex items-center">
              <BookOpen className="w-4 h-4 mr-2" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-left w-full flex items-center group"
                >
                  Home
                  <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('what-we-cover')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-left w-full flex items-center group"
                >
                  About Us
                  <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-left w-full flex items-center group"
                >
                  Courses
                  <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                >
                  Student Login
                  <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/terms-conditions"
                  className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                >
                  Terms & Conditions
                  <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                >
                  Privacy Policy
                  <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  to="/refund-policy"
                  className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                >
                  Refund Policy
                  <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Get in Touch
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-600/20 border border-indigo-600/30 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <a href="tel:+919390095383" className="text-gray-300 hover:text-white transition-colors duration-200">
                    +91 93900 95383
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-600/20 border border-indigo-600/30 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <a href="mailto:srirajperugu11@gmail.com" className="text-gray-300 hover:text-white transition-colors duration-200">
                    srirajperugu11@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} EduSphere. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-gray-400 text-sm">
              <span className="flex items-center">
                Made with <span className="text-red-500 mx-1">❤️</span> for EAMCET aspirants
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
