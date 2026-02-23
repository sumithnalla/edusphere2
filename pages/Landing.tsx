
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Batch } from '../types/database';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BookOpen, BarChart3, Zap, MessageCircle, Check, Star, Users, TrendingUp, Award, ChevronDown, Phone, Mail } from 'lucide-react';

const Landing: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(0);
  const navigate = useNavigate();

  // Helper function to calculate MRP and discount percentage
  const getMrpAndDiscount = (cost: number) => {
    const mrpMap: Record<number, number> = {
      3999: 7999,
      1999: 4999,
      999: 2999
    };
    const mrp = mrpMap[cost] || cost;
    const discountPercent = Math.round(((mrp - cost) / mrp) * 100);
    return { mrp, discountPercent };
  };

  useEffect(() => {
    const fetchBatches = async () => {
      const { data, error } = await supabase
        .from('batches')
        .select('*')
        .eq('is_active', true);
      
      if (data) setBatches(data.sort((a, b) => b.cost - a.cost));
      setLoading(false);
    };
    fetchBatches();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 rounded-full animate-spin border-t-indigo-600"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent rounded-full animate-spin border-b-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700"></div>
        <div className="absolute inset-0 bg-black opacity-10"></div>
        
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span className="text-white text-sm font-medium">🎯 EAMCET 2026 Preparation</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              <span className="block mb-2">Master EAMCET</span>
              <span className="block bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                with Edusphere
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Transform your EAMCET preparation with expert-led live classes, 
              comprehensive test series, and personalized doubt clearing sessions.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="https://docs.google.com/forms/d/e/1FAIpQLScEvucpKPBBGBbxT5QcqTPmRe8VFnKxMDmig2vDP6KS2aflIQ/viewform?pli=1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                Contact Form
              </a>
              <a 
                href="#courses" 
                className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-xl font-bold hover:bg-white hover:text-indigo-600 transition-all duration-300 transform hover:scale-105"
              >
                View Batches
              </a>
            </div>


          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-white/50" />
        </div>
      </section>

      {/* Choose Your Path Section */}
      <section id="courses" className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-50 rounded-full mb-6">
              <span className="text-indigo-600 text-sm font-semibold">🎯 Choose Your Path</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Select Your 
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Preparation Batch</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Choose the batch that matches your preparation level and timeline. 
              All batches include comprehensive study materials and expert guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {batches.map((batch, index) => {
              const { mrp, discountPercent } = getMrpAndDiscount(batch.cost);
              
              return (
              <div key={batch.batch_id} className="group relative">
                {/* Popular Badge for First Batch */}
                {index === 0 && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="px-4 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold rounded-full shadow-lg">
                       Most Popular
                    </div>
                  </div>
                )}
                
                <div className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 flex flex-col h-full">
                  {/* Gradient Border Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                  
                  <div className="relative bg-white rounded-3xl m-1 flex flex-col h-full">
                    {/* Header */}
                    <div className="relative p-8 pb-6">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center space-x-3">
                          <div className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold uppercase rounded-full tracking-wider">
                            {batch.duration_months} Days
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex flex-col items-end gap-1">
                            <div className="text-sm text-gray-500 line-through">
                              ₹{mrp}
                            </div>
                            <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text">
                              ₹{batch.cost}
                            </div>
                          </div>
                          <div className="text-sm text-green-600 font-semibold">
                            {discountPercent}% OFF
                          </div>
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 capitalize">
                        {batch.batch_name} Batch
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Perfect for students looking for {batch.duration_months === 6 ? 'comprehensive' : batch.duration_months === 3 ? 'intensive' : 'quick'} preparation
                      </p>
                    </div>

                    {/* Features */}
                    <div className="px-8 pb-6 flex-grow">
                      <ul className="space-y-3">
                        {batch.features.split(',').map((feature, idx) => (
                          <li key={idx} className="flex items-start text-gray-700">
                            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                              <Check className="w-3 h-3 text-green-600" />
                            </div>
                            <span className="text-sm">{feature.trim()}</span>
                          </li>
                        ))}
                        {batch.has_doubts_access && (
                          <li className="flex items-start text-gray-700">
                            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                              <Check className="w-3 h-3 text-green-600" />
                            </div>
                            <span className="text-sm font-semibold text-green-600">Exclusive Doubt Support</span>
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* CTA */}
                    <div className="p-8 pt-0">
                      <button 
                        onClick={() => navigate(`/payment?batch_id=${batch.batch_id}`)}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        Enroll Now
                      </button>
                      <p className="text-center text-xs text-gray-500 mt-3">
                        Instant access after payment
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Confidence Quote Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-8">
            <span className="text-white text-sm font-semibold">💡 Our Philosophy</span>
          </div>
          <p className="text-3xl md:text-4xl font-bold text-white leading-relaxed">
            "Even a late start can lead to a top rank — 
            <span className="block text-yellow-300 mt-2">if the effort is relentless."</span>
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-100"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-200"></div>
          </div>
        </div>
      </section>

      {/* What We Cover Section */}
      <section id="what-we-cover" className="py-24 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-50 rounded-full mb-6">
              <span className="text-indigo-600 text-sm font-semibold">📚 Comprehensive Coverage</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What We Cover for 
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> EAMCET Success</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our programs are designed to match the exact pattern, pressure, and expectations of the EAMCET examination.
            </p>
          </div>
        
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Complete Syllabus Coverage */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
              <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Complete Syllabus</h3>
                  <ul className="space-y-3 text-gray-600 text-sm w-full text-left">
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Mathematics: Algebra, Calculus & more</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Physics: Mechanics, Electricity & Modern</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Chemistry: Physical, Organic & Inorganic</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Updated as per latest EAMCET syllabus</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Smart Test Series & Mock Exams */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
              <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Smart Test Series</h3>
                  <ul className="space-y-3 text-gray-600 text-sm w-full text-left">
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Chapter-wise tests</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Weekly performance evaluations</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Full-length mock exams</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Time-based exam simulation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Smart Rank Strategy System */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
              <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Rank Strategy</h3>
                  <ul className="space-y-3 text-gray-600 text-sm w-full text-left">
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>PYQ focused training</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Shortcut methods & techniques</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>High-weightage topics</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Exam-day time management</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Doubt Support & Mentorship */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
              <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <MessageCircle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Doubt Support</h3>
                  <ul className="space-y-3 text-gray-600 text-sm w-full text-left">
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Regular live doubt sessions</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Structured study planning</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Strategy guidance</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Priority support</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ + Contact Section */}
      <section  id="contact" className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-50 rounded-full mb-6">
              <span className="text-indigo-600 text-sm font-semibold">💬 Get in Touch</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Have 
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Questions?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're here to help you choose the perfect batch for your EAMCET preparation journey.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Need Help Choosing?</h3>
              </div>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Choosing the right batch depends on your preparation level and goals. Our expert team is here to guide you every step of the way.
              </p>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-center space-x-4 p-4 bg-indigo-50 rounded-xl">
                  <div className="w-10 h-10 bg-indigo-600/20 border border-indigo-600/30 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <a href="tel:+919390095383" className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
                      +91 93900 95383
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-indigo-50 rounded-xl">
                  <div className="w-10 h-10 bg-indigo-600/20 border border-indigo-600/30 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <a href="mailto:srirajperugu11@gmail.com" className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
                      srirajperugu11@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <a 
                href="https://wa.me/919390095383" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-center block"
              >
                Contact Our Team
              </a>
            </div>

            {/* FAQ Accordion */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-4">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h3>
              </div>
              
              <div className="space-y-4">
                {/* FAQ Item 1 */}
                <div className="border-b border-gray-200">
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === 0 ? null : 0)}
                    className="w-full py-4 flex justify-between items-center hover:bg-gray-50 px-2 transition group"
                  >
                    <span className="font-semibold text-gray-800">When will the batches start?</span>
                    <ChevronDown className={`w-5 h-5 text-indigo-600 transition-all duration-300 ${expandedFAQ === 0 ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedFAQ === 0 && (
                    <div className="px-2 pb-4 text-gray-600 text-sm leading-relaxed">
                      The batches are scheduled to begin right after the Second Year Intermediate exams conclude (around 25th March). This timing is planned strategically so students can shift their complete focus to EAMCET preparation at the most crucial phase.
                    </div>
                  )}
                </div>

                {/* FAQ Item 2 */}
                <div className="border-b border-gray-200">
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === 1 ? null : 1)}
                    className="w-full py-4 flex justify-between items-center hover:bg-gray-50 px-2 transition group"
                  >
                    <span className="font-semibold text-gray-800">Can I upgrade my batch later?</span>
                    <ChevronDown className={`w-5 h-5 text-indigo-600 transition-all duration-300 ${expandedFAQ === 1 ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedFAQ === 1 && (
                    <div className="px-2 pb-4 text-gray-600 text-sm leading-relaxed">
                      Yes. You can upgrade to a higher batch by paying the difference amount. Contact our support team and we will assist you with the upgrade process.
                    </div>
                  )}
                </div>

                {/* FAQ Item 3 */}
                <div className="border-b border-gray-200">
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === 2 ? null : 2)}
                    className="w-full py-4 flex justify-between items-center hover:bg-gray-50 px-2 transition group"
                  >
                    <span className="font-semibold text-gray-800">Will I get access to recordings if I miss a live class?</span>
                    <ChevronDown className={`w-5 h-5 text-indigo-600 transition-all duration-300 ${expandedFAQ === 2 ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedFAQ === 2 && (
                    <div className="px-2 pb-4 text-gray-600 text-sm leading-relaxed">
                      Yes. All batches include access to class recordings, so you can revise anytime at your convenience. Never miss out on important concepts!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
