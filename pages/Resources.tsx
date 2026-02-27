import React, { useEffect, useState } from 'react';
// import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Download } from 'lucide-react';
import { STATIC_PDFS, type QuestionPDF } from '../src/data/pdfs';

const Resources: React.FC = () => {
  const [pdfs, setPdfs] = useState<QuestionPDF[]>([]);
  const [loading, setLoading] = useState(false);
  // const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.scrollTo(0, 0);
    } catch (e) {
      console.log('Scroll error:', e);
    }
  }, []);

  useEffect(() => {
    setPdfs(STATIC_PDFS);
    setLoading(false);
    setError(null);
  }, []);

  /*
  useEffect(() => {
    const fetchPDFs = async () => {
      try {
        setLoading(true);
        console.log('Starting to fetch PDFs...');
        
        // Test Supabase connection
        const { data: testData, error: testError } = await supabase
          .from('question_pdfs')
          .select('*');
        
        console.log('Test query - Data:', testData, 'Error:', testError);
        
        if (testError) {
          console.error('Supabase connection error:', testError);
          setError(`Connection error: ${testError.message}`);
          setLoading(false);
          return;
        }

        // Actual query
        const { data, error: fetchError } = await supabase
          .from('question_pdfs')
          .select('*')
          .eq('is_active', true)
          .order('uploaded_at', { ascending: false });

        console.log('Main query completed - Data count:', data?.length, 'Error:', fetchError);

        if (fetchError) {
          console.error('Supabase Error:', fetchError);
          setError(`Failed to load: ${fetchError.message}`);
        } else {
          setPdfs(data || []);
        }
      } catch (err) {
        console.error('Try-catch error:', err);
        setError(`Exception: ${err instanceof Error ? err.message : 'Unknown'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPDFs();
  }, []);
  */

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Resources & Study Materials
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Download quality question papers and study materials for comprehensive exam preparation.
          </p>
        </div>

        {/* Debug Info */}
        {/* <div className="mb-8 p-4 bg-blue-100 border border-blue-400 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Debug Info:</strong> Loading: {loading ? 'Yes' : 'No'} | PDFs Found: {pdfs.length}
          </p>
        </div> */}

        {/* Error Display */}
        {error && (
          <div className="mb-12 bg-red-100 border-2 border-red-500 rounded-lg p-6 text-red-700">
            <p className="font-bold text-lg">Error:</p>
            <p className="mt-2">{error}</p>
          </div>
        )}

        {/* Filter Buttons */}
        {/* {!error && (
          <div className="flex flex-wrap gap-3 mb-12">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                selectedFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedFilter('maths')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                selectedFilter === 'maths'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              Maths
            </button>
            <button
              onClick={() => setSelectedFilter('physics')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                selectedFilter === 'physics'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              Physics
            </button>
            <button
              onClick={() => setSelectedFilter('chemistry')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                selectedFilter === 'chemistry'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              Chemistry
            </button>
            <button
              onClick={() => setSelectedFilter('general')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                selectedFilter === 'general'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              General
            </button>
          </div>
        )} */}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin border-t-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading resources...</p>
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && pdfs.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600">No study materials available at the moment.</p>
          </div>
        )}

        {/* PDF Grid */}
        {!loading && !error && pdfs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pdfs.map(pdf => (
              <div key={pdf.pdf_id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{pdf.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{pdf.subject.toUpperCase()}</p>
                <p className="text-gray-700 mb-4">{pdf.description}</p>
                <a
                  href={pdf.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Resources;
