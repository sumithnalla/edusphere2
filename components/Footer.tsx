import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          {/* Left side - Policy links */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold mb-2">Policies</h3>
            <Link
              to="/terms-conditions"
              className="text-gray-300 hover:text-white transition duration-200"
            >
              Terms & Conditions
            </Link>
            <Link
              to="/privacy-policy"
              className="text-gray-300 hover:text-white transition duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              to="/refund-policy"
              className="text-gray-300 hover:text-white transition duration-200"
            >
              Refund Policy
            </Link>
          </div>

          {/* Center - Brand or Company Info */}
          <div className="flex flex-col items-center text-center">
            <Link to="/" className="text-2xl font-bold text-indigo-400 mb-2">
              EDUSPACE
            </Link>
            <p className="text-gray-400 text-sm">
              Empowering students with quality education
            </p>
          </div>

          {/* Right side - Social icons */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
            <div className="flex space-x-6">
              {/* WhatsApp Icon */}
              <a
                href="https://wa.me/919390095383"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-green-400 transition duration-200"
                title="WhatsApp"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.946 1.266l-.356.214-3.71-.973.992 3.63-.235.374a9.861 9.861 0 001.516 4.923A9.85 9.85 0 0012.12 21c2.487 0 4.817-.96 6.578-2.54a9.86 9.86 0 003.32-6.583c.008-.55.003-1.1-.01-1.648a6.992 6.992 0 001.933-4.97c-.079-.063-.159-.125-.238-.187l-.023-.015C19.35 5.34 15.89 2.818 12 2.818c-3.889 0-7.349 2.523-8.523 6.16z" />
                </svg>
              </a>

              {/* Instagram Icon */}
              <a
                href="https://www.instagram.com/edusphere_2026?igsh=MTFncTA0cm1jdW43aw=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-pink-400 transition duration-200"
                title="Instagram"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom border and copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <p className="text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} EduSphere. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
