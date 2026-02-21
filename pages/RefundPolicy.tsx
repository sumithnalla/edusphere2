import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const RefundPolicy: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 pt-24 pb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Refund Policy</h1>
        <p className="text-gray-600 mb-12">For purchases on www.edusphere.in</p>

        <div className="bg-white rounded-lg shadow-md p-8 space-y-8 mb-12">
          <p className="text-gray-700 leading-relaxed text-lg">
            Please read this Refund Policy carefully before making any purchase on www.edusphere.in.
          </p>

          {/* Section 1 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Digital Courses / Online Batches</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
              <li>All online batch purchases are non-refundable.</li>
              <li>Once access is granted, no refund will be provided.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Wrong Batch Purchase</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              If you purchase a batch by mistake:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
              <li>You may request a transfer to another batch of the same value.</li>
              <li>Request must be made within 10 days of purchase.</li>
              <li>Transfer is subject to approval.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Study Materials / Books</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              If books are damaged or lost by courier partner, replacement will be provided.
            </p>
            <p className="text-gray-700 mb-2">No refund will be provided for:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
              <li>Incorrect address given by student</li>
              <li>Refusal to accept delivery</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Payment Errors</h2>
            <p className="text-gray-700 mb-2 leading-relaxed">
              If duplicate payment occurs due to technical issues:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
              <li>You must report within 48 hours.</li>
              <li>Verified duplicate payments will be refunded.</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Contact for Refund Queries</h2>
            <p className="text-gray-700 mb-4">For refund or batch transfer requests, contact:</p>
            <div className="bg-gray-100 rounded-lg p-6 space-y-3">
              <div>
                <p className="text-gray-900 font-semibold">Email</p>
                <a
                  href="mailto:support@edusphere.in"
                  className="text-indigo-600 hover:text-indigo-700 transition duration-200"
                >
                  support@edusphere.in
                </a>
              </div>
              <div>
                <p className="text-gray-900 font-semibold">Phone</p>
                <a
                  href="tel:+919390095383"
                  className="text-indigo-600 hover:text-indigo-700 transition duration-200"
                >
                  +91 9390095383
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RefundPolicy;
