import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-600 mb-12">For EduSphere - www.edusphere.in</p>

        <div className="bg-white rounded-lg shadow-md p-8 space-y-8 mb-12">
          <div>
            <p className="text-gray-700 leading-relaxed mb-4">
              Please read this Privacy Policy carefully before accessing or using www.edusphere.in ("Platform").
            </p>
            <p className="text-gray-700 leading-relaxed">
              This Privacy Policy explains how we collect, use, store, protect, and disclose your personal information. By using the Platform, you agree to this policy.
            </p>
          </div>

          {/* Section 1 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Consent</h2>

            <div className="ml-4 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">1.1 User Consent</h3>
                <p className="text-gray-700 leading-relaxed">
                  By using EduSphere and/or providing your information, you freely and explicitly consent to the collection, storage, processing, and disclosure of your personal information as described in this Privacy Policy.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">1.2 Minor Users</h3>
                <p className="text-gray-700 mb-2">If you are under 18 years:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
                  <li>Your parent/legal guardian must agree to this policy.</li>
                  <li>Verifiable parental consent may be required.</li>
                  <li>We may request age verification at any time.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">1.3 Related Policies</h3>
                <p className="text-gray-700 mb-2">This Privacy Policy must be read along with our:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
                  <li>Terms & Conditions</li>
                  <li>Refund Policy</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
            <p className="text-gray-700 mb-4">We may collect:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2 mb-4">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Age</li>
              <li>Educational details</li>
              <li>Payment-related details</li>
              <li>Course preferences</li>
              <li>Usage data</li>
            </ul>
            <p className="text-gray-700 mb-2">We may also collect information when:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
              <li>You ask doubts</li>
              <li>Participate in discussions</li>
              <li>Take tests</li>
              <li>Contact support</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4 font-semibold">We use your information to:</p>

            <div className="ml-4 space-y-5">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">To Provide and Manage Services</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
                  <li>Create and maintain your account</li>
                  <li>Grant course access based on batch selection</li>
                  <li>Send payment confirmations</li>
                  <li>Send batch expiry reminders</li>
                  <li>Notify about live classes and schedule changes</li>
                  <li>Provide test reminders</li>
                  <li>Respond to support queries</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Marketing & Updates</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
                  <li>Inform about new courses and features</li>
                  <li>Send promotional offers (with opt-out option)</li>
                </ul>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-4">
                <p className="text-gray-700">
                  <span className="font-semibold">NOTE:</span> We respect your privacy and do not sell, rent, or trade your personal information to third parties for marketing purposes.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Cookies</h2>
            <p className="text-gray-700 mb-2">We use cookies to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2 mb-4">
              <li>Improve user experience</li>
              <li>Track preferences</li>
              <li>Analyze usage trends</li>
            </ul>
            <p className="text-gray-700">You can disable cookies via browser settings.</p>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Sharing of Information</h2>
            <p className="text-gray-700 mb-2">We may share data with:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2 mb-4">
              <li>Payment processors</li>
              <li>IT service providers</li>
              <li>Hosting providers</li>
              <li>Legal authorities (if required by law)</li>
            </ul>
            <p className="text-gray-700">Service providers are bound to maintain confidentiality.</p>
          </div>

          {/* Section 6 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Security</h2>
            <p className="text-gray-700 mb-2">We use:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2 mb-4">
              <li>Secure servers</li>
              <li>Restricted access controls</li>
              <li>Industry-standard security practices</li>
            </ul>
            <p className="text-gray-700">However, no system is 100% secure.</p>
          </div>

          {/* Section 7 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Public Forums</h2>
            <p className="text-gray-700 mb-2">If you post in discussion forums:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
              <li>Information may become publicly visible.</li>
              <li>Sharing is at your own risk.</li>
            </ul>
          </div>

          {/* Section 8 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Data Retention</h2>
            <p className="text-gray-700">We retain your information as long as:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
              <li>Your account remains active</li>
              <li>Required by law</li>
            </ul>
          </div>

          {/* Section 9 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Updates to Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this policy periodically. Continued use indicates acceptance.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
