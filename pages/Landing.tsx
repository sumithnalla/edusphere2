
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Batch } from '../types/database';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Landing: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBatches = async () => {
      const { data, error } = await supabase
        .from('batches')
        .select('*')
        .eq('is_active', true);
      
      if (data) setBatches(data);
      setLoading(false);
    };
    fetchBatches();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section id="hero" className="py-20 px-4 bg-indigo-600 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Master EAMCET with Eduspace</h1>
          <p className="text-xl opacity-90 mb-10">High-quality live classes, comprehensive tests, and personalized doubt clearing sessions.</p>
          <a href="#what-we-cover" className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition">View Batches</a>
        </div>
      </section>

      {/* What We Cover Section */}
      <section id="what-we-cover" className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">What We Cover for EAMCET Success</h2>
        <p className="text-center text-gray-600 mb-16 max-w-3xl mx-auto">Our programs are designed to match the exact pattern, pressure, and expectations of the EAMCET examination.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Complete Syllabus Coverage */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C6.5 6.253 1 10.8 1 16.5S6.5 26 12 26s11-4.547 11-10.25S17.5 6.253 12 6.253z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Complete Syllabus Coverage</h3>
            </div>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>• Mathematics: Algebra, Calculus, Coordinate Geometry & more</li>
              <li>• Physics: Mechanics, Electricity, Modern Physics</li>
              <li>• Chemistry: Physical, Organic & Inorganic</li>
              <li>• Updated strictly as per latest EAMCET syllabus</li>
              <li>• We ensure nothing important is left out</li>
            </ul>
          </div>

          {/* Smart Test Series & Mock Exams */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Smart Test Series & Mock Exams</h3>
            </div>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>• Chapter-wise tests</li>
              <li>• Weekly performance evaluations</li>
              <li>• Full-length EAMCET pattern mock exams</li>
              <li>• Time-based exam simulation practice</li>
              <li>• Students don't just learn — they practice like the real exam</li>
            </ul>
          </div>

          {/* Smart Rank Strategy System */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Smart Rank Strategy System</h3>
            </div>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>• PYQ (Previous Year Questions) focused training</li>
              <li>• Shortcut methods & time-saving techniques</li>
              <li>• High-weightage topic prioritization</li>
              <li>• Exam-day time management strategy</li>
              <li>• We train you to think like a ranker</li>
            </ul>
          </div>

          {/* Doubt Support & Mentorship */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.172l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Doubt Support & Mentorship</h3>
            </div>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>• Regular live doubt sessions</li>
              <li>• Structured study planning</li>
              <li>• Strategy guidance for different preparation levels</li>
              <li>• Priority support in higher batches</li>
              <li>• Preparation becomes clear, focused, and stress-free</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Confidence Quote Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-indigo-50 to-indigo-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-2xl md:text-3xl font-bold text-indigo-900 italic">
            "Even a late start can lead to a top rank — if the effort is relentless."
          </p>
        </div>
      </section>

      {/* Choose Your Path Section */}
      <section id="courses" className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Choose Your Path</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {batches.map((batch) => (
            <div key={batch.batch_id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition hover:shadow-xl flex flex-col">
              <div className="p-8 flex-grow">
                <div className="flex justify-between items-center mb-4">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-600 text-xs font-bold uppercase rounded-full tracking-wider">
                    {batch.duration_months} Months
                  </span>
                  <span className="text-2xl font-bold">₹{batch.cost}</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 capitalize">{batch.batch_name} Batch</h3>
                <ul className="space-y-3">
                  {batch.features.split(',').map((feature, idx) => (
                    <li key={idx} className="flex items-start text-gray-600">
                      <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature.trim()}
                    </li>
                  ))}
                  {batch.has_doubts_access && (
                    <li className="flex items-start text-gray-600">
                      <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Exclusive Doubt Support
                    </li>
                  )}
                </ul>
              </div>
              <div className="p-8 bg-gray-50 border-t">
                <button 
                  onClick={() => navigate(`/payment?batch_id=${batch.batch_id}`)}
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ + Contact Section */}
      <section  id="contact" className="py-20 px-4 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h3 className="text-2xl font-bold mb-6">Need Help Choosing a Batch?</h3>
              <p className="text-gray-600 mb-8">Choosing the right batch depends on your preparation level and goals. Our team is here to guide you.</p>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-center">
                  <svg className="h-6 w-6 text-indigo-600 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:+919390095383" className="text-indigo-600 font-semibold hover:underline">+91 93900 95383</a>
                </div>
                <div className="flex items-center">
                  <svg className="h-6 w-6 text-indigo-600 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:srirajperugu11@gmail.com" className="text-indigo-600 font-semibold hover:underline">srirajperugu11@gmail.com</a>
                </div>
              </div>

              <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition">
                Contact Us
              </button>
            </div>

            {/* FAQ Accordion */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h3 className="text-2xl font-bold mb-8">Frequently Asked Questions</h3>
              
              <div className="space-y-4">
                {/* FAQ Item 1 */}
                <div className="border-b border-gray-300">
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === 0 ? null : 0)}
                    className="w-full py-4 flex justify-between items-center hover:bg-gray-50 px-2 transition"
                  >
                    <span className="font-semibold text-gray-800">When will the batches start?</span>
                    <svg className={`h-5 w-5 text-indigo-600 transition transform ${expandedFAQ === 0 ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </button>
                  {expandedFAQ === 0 && (
                    <div className="px-2 pb-4 text-gray-600 text-sm">
                      The batches are scheduled to begin right after the Second Year Intermediate exams conclude (around 25th March). This timing is planned strategically so students can shift their complete focus to EAMCET preparation at the most crucial phase.
                    </div>
                  )}
                </div>

                {/* FAQ Item 2 */}
                <div className="border-b border-gray-300">
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === 1 ? null : 1)}
                    className="w-full py-4 flex justify-between items-center hover:bg-gray-50 px-2 transition"
                  >
                    <span className="font-semibold text-gray-800">Can I upgrade my batch later?</span>
                    <svg className={`h-5 w-5 text-indigo-600 transition transform ${expandedFAQ === 1 ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </button>
                  {expandedFAQ === 1 && (
                    <div className="px-2 pb-4 text-gray-600 text-sm">
                      Yes. You can upgrade to a higher batch by paying the difference amount. Contact support and we will assist you.
                    </div>
                  )}
                </div>

                {/* FAQ Item 3 */}
                <div className="border-b border-gray-300">
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === 2 ? null : 2)}
                    className="w-full py-4 flex justify-between items-center hover:bg-gray-50 px-2 transition"
                  >
                    <span className="font-semibold text-gray-800">Will I get access to recordings if I miss a live class?</span>
                    <svg className={`h-5 w-5 text-indigo-600 transition transform ${expandedFAQ === 2 ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </button>
                  {expandedFAQ === 2 && (
                    <div className="px-2 pb-4 text-gray-600 text-sm">
                      Yes. All batches include access to class recordings, so you can revise anytime at your convenience.
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
