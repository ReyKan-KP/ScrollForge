'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LoadPrevious() {
  const [token, setToken] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // API URL - change this to match your backend (FastAPI)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token.trim()) {
      setError('Please enter a valid access token');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/pages/${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add a reasonable timeout
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Document not found. Please check your access token and try again.');
        } else if (response.status === 403) {
          throw new Error('Access denied. This token may have expired.');
        } else {
          throw new Error('Failed to load document. Server returned an error.');
        }
      }

      const data = await response.json();
      
      // Store document info in localStorage
      localStorage.setItem('pdf_access_token', token);
      localStorage.setItem('pdf_total_pages', data.total_pages.toString());
      if (data.pdf_name) {
        localStorage.setItem('pdf_name', data.pdf_name);
      }

      // Redirect to the pages overview
      router.push(`/page`);

    } catch (err: any) {
      // Handle network errors specifically
      if (err.name === 'AbortError') {
        setError('Request timed out. Please check your connection and try again.');
      } else {
        setError(err.message || 'Failed to load document. Please try again.');
      }
      setLoading(false);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#131f33] to-[#1e293b] py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-md mx-auto"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500 mr-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
            </svg>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">ScrollForge</h1>
          </motion.div>
          <motion.h2 
            className="text-2xl font-bold text-white mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Access Previous Document
          </motion.h2>
          <motion.p 
            className="text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Enter your access token to view a previously uploaded PDF
          </motion.p>
        </div>

        <motion.div 
          className="bg-[#1e293b]/70 backdrop-blur-md shadow-xl rounded-lg overflow-hidden border border-[#334155]"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="px-6 py-8">
            {error && (
              <motion.div 
                className="mb-6 bg-red-900/30 border border-red-800 p-3 rounded-md"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-red-300 text-sm flex items-start">
                  <svg className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="token" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Access Token
                </label>
                <div className="relative">
                  <input
                    id="token"
                    name="token"
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Enter your access token"
                    className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-md focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500 transition-colors pr-10"
                    required
                  />
                  {token && (
                    <button
                      type="button"
                      onClick={() => setToken('')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
                <p className="mt-1 text-xs text-blue-400">The token you received when you uploaded your PDF</p>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transform transition-transform hover:scale-[1.02] hover:shadow-blue-700/30"
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading Document...
                  </>
                ) : (
                  <>
                    <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    Load Document
                  </>
                )}
              </motion.button>
            </form>

            <motion.div 
              className="mt-6 flex flex-col items-center space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
              <Link 
                href="/" 
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center group transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 transform group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Home
              </Link>
              <Link 
                href="/upload" 
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center group transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 group-hover:animate-bounce" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                Upload a new PDF instead
              </Link>
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-gray-400 text-xs">
            ScrollForge • Secure PDF access with token authentication
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
