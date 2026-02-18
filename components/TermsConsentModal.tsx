import React, { useState } from 'react';

interface TermsConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

const TermsConsentModal: React.FC<TermsConsentModalProps> = ({
  isOpen,
  onClose,
  onContinue,
}) => {
  const [agreed, setAgreed] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-in fade-in">
        {/* Header with Close Button */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Consent & Agreement</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition duration-200 text-3xl font-light leading-none"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed font-medium">
              By clicking "Continue to Payment", You:
            </p>

            {/* Checkmark List */}
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-green-500 font-bold mr-3 flex-shrink-0">✓</span>
                <span className="text-gray-700 leading-relaxed">
                  Confirm that You have carefully read and accepted the{' '}
                  <a
                    href="/#/terms-conditions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-700 underline font-medium"
                  >
                    Terms & Conditions
                  </a>
                  , <a
                    href="/#/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-700 underline font-medium"
                  >
                    Privacy Policy
                  </a>
                  , and{' '}
                  <a
                    href="/#/refund-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-700 underline font-medium"
                  >
                    Refund Policy
                  </a>
                  .
                </span>
              </li>

              <li className="flex items-start">
                <span className="text-green-500 font-bold mr-3 flex-shrink-0">✓</span>
                <span className="text-gray-700 leading-relaxed">
                  Provide informed and explicit consent to the collection and processing of Your information.
                </span>
              </li>

              <li className="flex items-start">
                <span className="text-green-500 font-bold mr-3 flex-shrink-0">✓</span>
                <span className="text-gray-700 leading-relaxed">
                  Represent that You are 18 years or older, or have obtained parental/guardian consent.
                </span>
              </li>

              <li className="flex items-start">
                <span className="text-green-500 font-bold mr-3 flex-shrink-0">✓</span>
                <span className="text-gray-700 leading-relaxed">
                  Agree that the payment is voluntary and subject to applicable refund terms.
                </span>
              </li>

              <li className="flex items-start">
                <span className="text-green-500 font-bold mr-3 flex-shrink-0">✓</span>
                <span className="text-gray-700 leading-relaxed">
                  Understand that violation of platform rules may result in suspension without refund.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Agreement Checkbox */}
        <div className="px-6 py-4 border-t border-b border-gray-200 bg-gray-50">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer mt-0.5 flex-shrink-0"
            />
            <span className="text-gray-700 text-sm leading-relaxed">
              I have read and agree to the{' '}
              <a
                href="/#/terms-conditions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-700 underline font-medium"
              >
                Terms & Conditions
              </a>
              , <a
                href="/#/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-700 underline font-medium"
              >
                Privacy Policy
              </a>
              , and{' '}
              <a
                href="/#/refund-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-700 underline font-medium"
              >
                Refund Policy
              </a>
              .
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 p-6">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setAgreed(false);
              onContinue();
            }}
            disabled={!agreed}
            className={`px-6 py-2.5 rounded-lg font-semibold transition duration-200 ${
              agreed
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsConsentModal;
