import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TermsConditions: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 pt-24 pb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms & Conditions</h1>
        <p className="text-gray-600 mb-12">Effective Date: [Insert Date]</p>

        <div className="bg-white rounded-lg shadow-md p-8 space-y-8 mb-12">
          <p className="text-gray-700 leading-relaxed">
            Welcome to EduSphere (www.edusphere.in) ("Platform", "We", "Us", "Our").
            <br />
            <br />
            By accessing or using our Platform, you agree to comply with and be bound by the following Terms and Conditions. If you do not agree, please do not use the Platform.
          </p>

          {/* Section 1 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Use of the Platform</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              EduSphere provides online educational courses, live classes, recorded lectures, test series, and study materials.
            </p>
            <p className="text-gray-700 mb-2 font-semibold">By registering:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
              <li>You confirm that the information provided is accurate.</li>
              <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
              <li>You agree not to misuse the Platform.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Eligibility</h2>
            <p className="text-gray-700 leading-relaxed">
              Users under 18 years ("Minors") must use the Platform only with parental or legal guardian consent.
              <br />
              Parents/guardians are responsible for monitoring minor's usage.
            </p>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Account Responsibility</h2>
            <p className="text-gray-700 mb-2">You are responsible for:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
              <li>All activities under your account.</li>
              <li>Maintaining password security.</li>
              <li>Informing us immediately in case of unauthorized access.</li>
            </ul>
            <p className="text-gray-700 mt-4 leading-relaxed">
              We reserve the right to suspend or terminate accounts for violations.
            </p>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Intellectual Property Rights</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              All content including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2 mb-4">
              <li>Videos</li>
              <li>Notes</li>
              <li>Test papers</li>
              <li>Logos</li>
              <li>Website design</li>
            </ul>
            <p className="text-gray-700 mb-4 leading-relaxed">
              are the exclusive property of EduSphere.
            </p>
            <p className="text-gray-700 mb-2 font-semibold">Users may not:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2 mb-4">
              <li>Copy, distribute, record, screen-record, download illegally</li>
              <li>Share course access</li>
              <li>Sell or redistribute any content</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              Violation may result in legal action.
            </p>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Payments</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
              <li>Access to paid batches is granted only after successful payment.</li>
              <li>Prices are subject to change without prior notice.</li>
              <li>EduSphere is not responsible for payment gateway failures beyond our control.</li>
            </ul>
          </div>

          {/* Section 6 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Limitation of Liability</h2>
            <p className="text-gray-700 mb-2">EduSphere is not liable for:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
              <li>Technical interruptions</li>
              <li>Internet connectivity issues</li>
              <li>Indirect or incidental damages</li>
              <li>Academic performance outcomes</li>
            </ul>
          </div>

          {/* Section 7 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Termination</h2>
            <p className="text-gray-700 mb-2">We may suspend or terminate accounts if:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
              <li>Terms are violated</li>
              <li>Fraudulent activity is detected</li>
              <li>Misuse of content occurs</li>
            </ul>
          </div>

          {/* Section 8 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts.
            </p>
          </div>

          {/* Section 9 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Updates</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update these Terms from time to time. Continued use implies acceptance of updated terms.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsConditions;
