'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [documentInfo, setDocumentInfo] = useState<{
    pdf_name: string;
    total_pages: number;
  } | null>(null);
  const [hasToken, setHasToken] = useState(false);
  const router = useRouter();
  
  // API URL - change this to match your backend (FastAPI)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const checkToken = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('pdf_access_token');
        
        // If no token, show landing page
        if (!token) {
          setLoading(false);
          return;
        }
        
        setHasToken(true);
        
        // Fetch document info using token
        const response = await fetch(`${API_URL}/api/pages/${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          signal: AbortSignal.timeout(10000)
        });
        
        if (!response.ok) {
          if (response.status === 404) {
            // Token invalid or expired
            localStorage.removeItem('pdf_access_token');
            localStorage.removeItem('pdf_total_pages');
            localStorage.removeItem('pdf_name');
            setHasToken(false);
            setLoading(false);
            return;
          }
          throw new Error('Failed to fetch document information');
        }
        
        const data = await response.json();
        setDocumentInfo({
          pdf_name: data.pdf_name,
          total_pages: data.total_pages
        });
      } catch (err: any) {
        if (err.name === 'AbortError') {
          setError('Request timed out. Please check your connection and try again.');
        } else {
          setError('Error loading document. Please try uploading again.');
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };
    
    checkToken();
  }, [API_URL]);

  const handleClearToken = () => {
    localStorage.removeItem('pdf_access_token');  
    localStorage.removeItem('pdf_total_pages');
    localStorage.removeItem('pdf_name');
    setHasToken(false);
    setDocumentInfo(null);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 260,
        damping: 20
      }
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#131f33] to-[#1e293b] text-[#e0e0e0] flex justify-center items-center">
        <div className="text-center p-8 bg-[#1e293b]/70 backdrop-blur-md border border-[#334155] rounded-xl shadow-2xl max-w-sm w-full">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-blue-500/30 animate-pulse"></div>
            <svg 
              className="animate-spin w-full h-full text-blue-500" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" cy="12" r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              ></circle>
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <p className="text-xl font-medium">Loading ScrollForge</p>
          <p className="text-sm text-gray-400 mt-2">Preparing your digital reading experience</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#131f33] to-[#1e293b] text-[#e0e0e0] flex justify-center items-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full p-8 bg-[#1e293b]/70 backdrop-blur-md border border-[#334155] rounded-xl shadow-2xl"
        >
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-5">
              <svg 
                className="w-full h-full text-red-500" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
              <div className="absolute -inset-1 rounded-full border-2 border-red-500/20 animate-pulse"></div>
            </div>
            <h2 className="text-2xl font-bold mb-3">Error Loading Document</h2>
            <p className="mb-6 text-gray-300">{error}</p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 justify-center">
              <button 
                onClick={() => router.push('/upload')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-md transition-colors transform hover:scale-105 duration-200 shadow-lg shadow-blue-700/20"
              >
                Upload New PDF
              </button>
              <button 
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  window.location.reload();
                }}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-md transition-colors transform hover:scale-105 duration-200 shadow-lg shadow-green-700/20"
              >
                Retry
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Landing Page (No Token)
  if (!hasToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#131f33] to-[#1e293b] text-white p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto pt-8 md:pt-16"
        >
          {/* Header Section */}
          <div className="text-center mb-12 md:mb-16">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2
              }}
              className="inline-block"
            >
              <div className="flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                </svg>
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-300">ScrollForge</h1>
              </div>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto"
            >
              Transform your PDF documents into interactive web pages. Read, share, and access your documents anywhere.
            </motion.p>
          </div>
          
          {/* Cards Section */}
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid md:grid-cols-2 gap-6 md:gap-10 max-w-4xl mx-auto"
          >
            {/* Upload Card */}
            <motion.div variants={item} className="group">
              <Link href="/upload" className="block relative overflow-hidden">
                <div className="bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] p-1 rounded-2xl shadow-xl group-hover:shadow-blue-500/20 transition-all duration-300 transform group-hover:scale-[1.02]">
                  <div className="bg-[#1e293b]/90 backdrop-blur-sm rounded-xl p-8 h-full flex flex-col justify-between border-t border-white/10">
                    <div>
                      <div className="w-16 h-16 bg-blue-600/20 rounded-lg p-3 mb-6 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-full h-full text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition-colors">Upload New PDF</h3>
                      <p className="text-gray-300 mb-6">Convert your PDF documents into web-friendly format. Quick and easy processing.</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-300">Start here</span>
                      <div className="w-10 h-10 rounded-full bg-blue-600/30 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                        <svg className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -inset-px bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
              </Link>
            </motion.div>
            
            {/* Load Previous Card */}
            <motion.div variants={item} className="group">
              <Link href="/load-previous" className="block relative overflow-hidden">
                <div className="bg-gradient-to-br from-[#4f46e5] to-[#8b5cf6] p-1 rounded-2xl shadow-xl group-hover:shadow-violet-500/20 transition-all duration-300 transform group-hover:scale-[1.02]">
                  <div className="bg-[#1e293b]/90 backdrop-blur-sm rounded-xl p-8 h-full flex flex-col justify-between border-t border-white/10">
                    <div>
                      <div className="w-16 h-16 bg-indigo-600/20 rounded-lg p-3 mb-6 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-full h-full text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold mb-2 group-hover:text-indigo-400 transition-colors">Access Previous Documents</h3>
                      <p className="text-gray-300 mb-6">Load your previously processed documents using your access token.</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-indigo-300">Access documents</span>
                      <div className="w-10 h-10 rounded-full bg-indigo-600/30 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                        <svg className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -inset-px bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Features Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-16 md:mt-24 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-10">Why Choose ScrollForge?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#1e293b]/70 backdrop-blur-md p-6 rounded-xl border border-[#334155] transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-blue-700/5">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg p-2 mx-auto mb-4">
                  <svg className="text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Fast Conversion</h3>
                <p className="text-gray-400">Convert PDFs to interactive web pages in seconds with optimized performance.</p>
              </div>
              
              <div className="bg-[#1e293b]/70 backdrop-blur-md p-6 rounded-xl border border-[#334155] transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-blue-700/5">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg p-2 mx-auto mb-4">
                  <svg className="text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Secure Access</h3>
                <p className="text-gray-400">Your documents are protected with unique access tokens for privacy.</p>
              </div>
              
              <div className="bg-[#1e293b]/70 backdrop-blur-md p-6 rounded-xl border border-[#334155] transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-blue-700/5">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg p-2 mx-auto mb-4">
                  <svg className="text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Access Anywhere</h3>
                <p className="text-gray-400">Read your PDF documents on any device with internet access.</p>
              </div>
            </div>
          </motion.div>
          
          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-center text-gray-400 text-sm mt-16 pb-6"
          >
            <p>© 2023 ScrollForge • Transform your reading experience</p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Create page groups for better navigation
  const getPageGroups = () => {
    if (!documentInfo) return [];
    
    const totalGroups = Math.ceil(documentInfo.total_pages / 20);
    return Array.from({ length: totalGroups }, (_, i) => {
      const start = i * 20 + 1;
      const end = Math.min((i + 1) * 20, documentInfo.total_pages);
      return { start, end };
    });
  };

  const pageGroups = getPageGroups();

  // Document Info Page (When Token Exists)
  return (
    // <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#131f33] to-[#1e293b] text-[#e0e0e0] p-4 md:p-8">
    //   <motion.div 
    //     initial={{ opacity: 0 }}
    //     animate={{ opacity: 1 }}
    //     transition={{ duration: 0.5 }}
    //     className="max-w-5xl mx-auto"
    //   >
    //     <header className="mb-8">
    //       <motion.div 
    //         initial={{ y: -20, opacity: 0 }}
    //         animate={{ y: 0, opacity: 1 }}
    //         transition={{ delay: 0.2, duration: 0.5 }}
    //         className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-[#1e293b]/70 backdrop-blur-md p-6 rounded-lg shadow-lg border border-[#334155]"
    //       >
    //         <div className="flex items-center">
    //           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 mr-3" viewBox="0 0 24 24" fill="currentColor">
    //             <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
    //           </svg>
    //           <div>
    //             <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">ScrollForge</h1>
    //             <p className="text-gray-400 mt-1">View and navigate your converted PDF documents</p>
    //           </div>
    //         </div> 
    //         <div className="flex items-center gap-2">
    //         <motion.button
    //           whileHover={{ scale: 1.05 }}
    //           whileTap={{ scale: 0.95 }}
    //           className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-md transition-colors text-sm flex items-center gap-2 shadow-lg shadow-blue-700/20"
    //         >
    //           <Link href="/load-previous" className="text-blue-400 hover:text-blue-300 transition-colors text-white">
    //             Load Previous
    //           </Link>
    //         </motion.button>
    //         <motion.button
    //           whileHover={{ scale: 1.05 }}
    //           whileTap={{ scale: 0.95 }}
    //           onClick={handleClearToken}
    //           className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-md transition-colors text-sm flex items-center gap-2 shadow-lg shadow-red-700/20"
    //         >
    //           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    //             <path fillRule="evenodd" d="M10 3a1 1 0 011 1v9a1 1 0 11-2 0V4a1 1 0 011-1z" clipRule="evenodd" />
    //             <path fillRule="evenodd" d="M4.293 7.293a1 1 0 011.414 0L10 11.586l4.293-4.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414z" clipRule="evenodd" />
    //           </svg>
    //           Upload New PDF
    //         </motion.button>
    //         </div>
    //       </motion.div>
    //     </header>

    //     {documentInfo && (
    //       <motion.div
    //         initial={{ y: 20, opacity: 0 }}
    //         animate={{ y: 0, opacity: 1 }}
    //         transition={{ delay: 0.4, duration: 0.5 }}
    //         className="bg-[#1e293b]/70 backdrop-blur-md border border-[#334155] rounded-lg shadow-lg overflow-hidden mb-8 transform transition-transform hover:scale-[1.01] hover:shadow-blue-700/10"
    //       >
    //         <div className="bg-gradient-to-r from-[#1e3a8a]/80 to-[#3b82f6]/80 px-6 py-5">
    //           <h2 className="text-xl font-semibold text-white flex items-center gap-2">
    //             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
    //               <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
    //             </svg>
    //             {documentInfo.pdf_name}
    //           </h2>
    //         </div>
    //         <div className="p-6">
    //           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    //             <div>
    //               <p className="text-gray-300 mb-1">Document Information</p>
    //               <p className="text-lg font-medium">Total pages: <span className="text-blue-400">{documentInfo.total_pages}</span></p>
    //             </div>
    //             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    //               <Link
    //                 href="/page/1"
    //                 className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-md transition-all shadow-lg hover:shadow-blue-500/30"
    //               >
    //                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
    //                   <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
    //                   <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
    //                 </svg>
    //                 Start Reading
    //               </Link>
    //             </motion.div>
    //           </div>
    //         </div>
    //       </motion.div>
    //     )}

    //     {documentInfo && documentInfo.total_pages > 0 && (
    //       <motion.div
    //         initial={{ y: 30, opacity: 0 }}
    //         animate={{ y: 0, opacity: 1 }}
    //         transition={{ delay: 0.6, duration: 0.5 }}
    //         className="bg-[#1e293b]/70 backdrop-blur-md border border-[#334155] rounded-lg shadow-lg overflow-hidden"
    //       >
    //         <div className="bg-gradient-to-r from-[#1e3a8a]/80 to-[#3b82f6]/80 px-6 py-4">
    //           <h2 className="text-xl font-semibold text-white flex items-center gap-2">
    //             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
    //               <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
    //             </svg>
    //             Navigate Pages
    //           </h2>
    //         </div>
            
    //         {documentInfo.total_pages > 20 && (
    //           <div className="p-4 border-b border-[#334155]">
    //             <p className="text-sm text-gray-400 mb-2">Jump to page group:</p>
    //             <div className="flex flex-wrap gap-2">
    //               {pageGroups.map((group, i) => (
    //                 <motion.div key={i} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    //                   <Link
    //                     href={`#group-${i}`}
    //                     className="px-3 py-1 bg-[#0f172a] hover:bg-[#1e293b] border border-[#334155] rounded-md transition-colors text-sm shadow-md hover:shadow-blue-700/10"
    //                   >
    //                     {group.start}-{group.end}
    //                   </Link>
    //                 </motion.div>
    //               ))}
    //             </div>
    //           </div>
    //         )}
            
    //         <div className="p-6">
    //           {pageGroups.map((group, i) => (
    //             <div key={i} id={`group-${i}`} className="mb-8 last:mb-0">
    //               {documentInfo.total_pages > 20 && (
    //                 <h3 className="text-lg font-medium mb-3 text-gray-300">Pages {group.start}-{group.end}</h3>
    //               )}
    //               <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-2">
    //                 {Array.from({ length: group.end - group.start + 1 }, (_, j) => {
    //                   const pageNum = group.start + j;
    //                   return (
    //                     <motion.div key={j} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
    //                       <Link
    //                         href={`/page/${pageNum}`}
    //                         className="flex items-center justify-center h-12 bg-[#0f172a] hover:bg-[#1e293b] border border-[#334155] rounded-md transition-all hover:border-blue-500 shadow-md hover:shadow-blue-500/20"
    //                       >
    //                         <span>{pageNum}</span>
    //                       </Link>
    //                     </motion.div>
    //                   );
    //                 })}
    //               </div>
    //             </div>
    //           ))}
    //         </div>
    //       </motion.div>
    //     )}
    //   </motion.div>
    // </div>
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#131f33] to-[#1e293b] text-white p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto pt-8 md:pt-16"
        >
          {/* Header Section */}
          <div className="text-center mb-12 md:mb-16">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2
              }}
              className="inline-block"
            >
              <div className="flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                </svg>
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-300">ScrollForge</h1>
              </div>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto"
            >
              Transform your PDF documents into interactive web pages. Read, share, and access your documents anywhere.
            </motion.p>
          </div>
          
          {/* Cards Section */}
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid md:grid-cols-2 gap-6 md:gap-10 max-w-4xl mx-auto"
          >
            {/* Upload Card */}
            <motion.div className="group">
              <Link href="/upload" className="block relative overflow-hidden">
                <div className="bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] p-1 rounded-2xl shadow-xl group-hover:shadow-blue-500/20 transition-all duration-300 transform group-hover:scale-[1.02]">
                  <div className="bg-[#1e293b]/90 backdrop-blur-sm rounded-xl p-8 h-full flex flex-col justify-between border-t border-white/10">
                    <div>
                      <div className="w-16 h-16 bg-blue-600/20 rounded-lg p-3 mb-6 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-full h-full text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition-colors">Upload New PDF</h3>
                      <p className="text-gray-300 mb-6">Convert your PDF documents into web-friendly format. Quick and easy processing.</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-300">Start here</span>
                      <div className="w-10 h-10 rounded-full bg-blue-600/30 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                        <svg className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -inset-px bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
              </Link>
            </motion.div>
            
            {/* Load Previous Card */}
            <motion.div className="group">
              <Link href="/load-previous" className="block relative overflow-hidden">
                <div className="bg-gradient-to-br from-[#4f46e5] to-[#8b5cf6] p-1 rounded-2xl shadow-xl group-hover:shadow-violet-500/20 transition-all duration-300 transform group-hover:scale-[1.02]">
                  <div className="bg-[#1e293b]/90 backdrop-blur-sm rounded-xl p-8 h-full flex flex-col justify-between border-t border-white/10">
                    <div>
                      <div className="w-16 h-16 bg-indigo-600/20 rounded-lg p-3 mb-6 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-full h-full text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold mb-2 group-hover:text-indigo-400 transition-colors">Access Previous Documents</h3>
                      <p className="text-gray-300 mb-6">Load your previously processed documents using your access token.</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-indigo-300">Access documents</span>
                      <div className="w-10 h-10 rounded-full bg-indigo-600/30 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                        <svg className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -inset-px bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Features Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-16 md:mt-24 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-10">Why Choose ScrollForge?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#1e293b]/70 backdrop-blur-md p-6 rounded-xl border border-[#334155] transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-blue-700/5">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg p-2 mx-auto mb-4">
                  <svg className="text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Fast Conversion</h3>
                <p className="text-gray-400">Convert PDFs to interactive web pages in seconds with optimized performance.</p>
              </div>
              
              <div className="bg-[#1e293b]/70 backdrop-blur-md p-6 rounded-xl border border-[#334155] transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-blue-700/5">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg p-2 mx-auto mb-4">
                  <svg className="text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Secure Access</h3>
                <p className="text-gray-400">Your documents are protected with unique access tokens for privacy.</p>
              </div>
              
              <div className="bg-[#1e293b]/70 backdrop-blur-md p-6 rounded-xl border border-[#334155] transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-blue-700/5">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg p-2 mx-auto mb-4">
                  <svg className="text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Access Anywhere</h3>
                <p className="text-gray-400">Read your PDF documents on any device with internet access.</p>
              </div>
            </div>
          </motion.div>
          
          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-center text-gray-400 text-sm mt-16 pb-6"
          >
            <p>© 2023 ScrollForge • Transform your reading experience</p>
          </motion.div>
        </motion.div>
      </div>
  );
}