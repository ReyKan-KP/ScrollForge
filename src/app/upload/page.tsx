'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    message: string;
    token?: string;
    total_pages?: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();
  
  // API URL - change this to match your backend (FastAPI)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Check for existing token on mount
  useEffect(() => {
    // If there's already a PDF token in localStorage, redirect to the reader
    const existingToken = localStorage.getItem('pdf_access_token');
    if (existingToken) {
      router.push('/page/1');
    }
  }, [router]);

  useEffect(() => {
    // Simulate upload progress
    if (isUploading) {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return prev;
          }
          return prev + Math.random() * 10;
        });
      }, 300);

      return () => clearInterval(interval);
    } else {
      setUploadProgress(0);
    }
  }, [isUploading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
    } else {
      setFile(null);
      setError('Please select a valid PDF file');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setError(null);
    } else {
      setFile(null);
      setError('Please drop a valid PDF file');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const response = await fetch(`${API_URL}/api/pdftohtml`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to process PDF');
      }

      // Set upload progress to 100% when complete
      setUploadProgress(100);
      
      // Save the token to localStorage
      if (result.token) {
        localStorage.setItem('pdf_access_token', result.token);
        // Also save total pages for convenience
        if (result.total_pages) {
          localStorage.setItem('pdf_total_pages', result.total_pages.toString());
        }
      }

      setUploadResult(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred during upload');
    } finally {
      setIsUploading(false);
    }
  };

  const handleViewPages = () => {
    router.push('/page/1');
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#131f33] to-[#1e293b] text-[#e0e0e0] p-4 md:p-8 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-[#1e293b]/70 backdrop-blur-md border border-[#334155] rounded-lg shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#1e3a8a]/80 to-[#3b82f6]/80 px-6 py-5 flex items-center justify-between">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 mr-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
              </svg>
              <div>
                <h1 className="text-2xl font-bold text-white">ScrollForge</h1>
                <p className="text-sm text-gray-300 mt-1">Upload and convert your PDF documents</p>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/load-previous" 
                className="flex items-center text-blue-400 hover:text-blue-300 transition-colors text-sm bg-[#0f172a]/50 px-4 py-2 rounded-md border border-[#334155]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                Load Previous
              </Link>
            </motion.div>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <motion.label 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  htmlFor="pdf-upload" 
                  className="block mb-3 text-lg font-medium flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                  Upload PDF Document
                </motion.label>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-center w-full"
                >
                  <label 
                    htmlFor="pdf-upload" 
                    className={`flex flex-col items-center justify-center w-full h-64 border-2 ${isDragging ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-[#334155]'} border-dashed rounded-lg cursor-pointer bg-[#0f172a] hover:bg-[#162032] transition-all duration-300 relative overflow-hidden`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {/* Drag overlay animation */}
                    <AnimatePresence>
                      {isDragging && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-blue-500/10 border-4 border-blue-500 rounded-lg z-10 flex items-center justify-center"
                        >
                          <p className="text-xl font-bold text-blue-400 animate-pulse">Drop PDF Here</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 z-20 relative">
                      {file ? (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          className="text-center"
                        >
                          <svg 
                            className="w-16 h-16 mb-3 text-green-400" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24" 
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                            />
                          </svg>
                          <p className="mt-2 text-xl text-green-400 font-bold">
                            PDF Selected
                          </p>
                          <p className="mt-1 text-[#4dabf7] font-medium">
                            {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                          </p>
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button" 
                            className="mt-3 text-red-400 hover:text-red-300 text-sm flex items-center mx-auto"
                            onClick={() => setFile(null)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Remove file
                          </motion.button>
                        </motion.div>
                      ) : (
                        <>
                          <svg 
                            className="w-12 h-12 mb-3 text-[#4dabf7]" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24" 
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                            />
                          </svg>
                          <p className="mb-2 text-lg text-center">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-sm text-gray-400">
                            PDF files only
                          </p>
                        </>
                      )}
                    </div>
                    <input 
                      id="pdf-upload" 
                      type="file" 
                      className="hidden" 
                      accept="application/pdf" 
                      onChange={handleFileChange} 
                    />
                  </label>
                </motion.div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-5 p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-300 flex items-start"
                  >
                    <svg className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button 
                type="submit" 
                disabled={!file || isUploading}
                className={`w-full px-5 py-3 rounded-md font-medium text-white transition-all ${
                  !file || isUploading 
                    ? 'bg-blue-700/50 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 active:from-blue-700 active:to-blue-800 hover:shadow-lg hover:shadow-blue-700/20'
                }`}
                whileHover={file && !isUploading ? { scale: 1.01 } : {}}
                whileTap={file && !isUploading ? { scale: 0.98 } : {}}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center mb-1">
                      <svg 
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" 
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
                      Processing PDF...
                    </div>
                    <div className="w-full bg-[#0f172a] rounded-full h-2.5 mt-1">
                      <motion.div 
                        className="bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 h-2.5 rounded-full" 
                        style={{ width: `${Math.floor(uploadProgress)}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.floor(uploadProgress)}%` }}
                        transition={{ duration: 0.2 }}
                      ></motion.div>
                    </div>
                  </div>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Convert to Web Pages
                  </span>
                )}
              </motion.button>
            </form>

            <AnimatePresence>
              {uploadResult && (
                <motion.div 
                  className="mt-8 p-5 bg-[#0f172a]/70 border border-[#334155] rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", damping: 12, stiffness: 80 }}
                >
                  <div className="flex items-center mb-4">
                    <div className="relative mr-3">
                      <svg className="h-8 w-8 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0, 1, 0.8]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                        className="absolute -inset-1 rounded-full bg-green-400/20"
                      ></motion.div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Processing Complete</h3>
                      <p className="text-gray-300 text-sm">{uploadResult.message}</p>
                    </div>
                  </div>
                  
                  <motion.div 
                    className="mt-5 p-4 bg-[#0f172a] border border-[#334155] rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="mb-2 font-medium flex items-center">
                      <svg className="h-4 w-4 text-yellow-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v-1l1-1 1-1 .243-.243A6 6 0 1118 8zm-6-4a1 1 0 100 2h2a1 1 0 100-2h-2z" clipRule="evenodd" />
                      </svg>
                      Your Access Token:
                    </p>
                    <div className="relative">
                      <code className="block p-3 bg-[#131f33] text-[#e0e0e0] rounded overflow-x-auto text-sm whitespace-nowrap font-mono border border-[#334155]">
                        {uploadResult.token}
                      </code>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          navigator.clipboard.writeText(uploadResult.token || '');
                          alert('Token copied to clipboard!');
                        }}
                        className="absolute right-2 top-2 text-blue-400 hover:text-blue-300 bg-[#1a1a2e]/70 p-1.5 rounded-full"
                        title="Copy to clipboard"
                      >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                          <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                        </svg>
                      </motion.button>
                    </div>
                    <p className="mt-3 text-sm text-gray-400">
                      Keep this token to access your document later. It has been saved in your browser.
                    </p>
                  </motion.div>
                  
                  <motion.div 
                    className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3"
                    variants={container}
                    initial="hidden"
                    animate="show"
                  >
                    <motion.div variants={item}>
                      <motion.button 
                        onClick={handleViewPages}
                        className="w-full px-5 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-medium rounded-md transition-all flex items-center justify-center shadow-lg hover:shadow-green-600/20"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        View Pages
                      </motion.button>
                    </motion.div>
                    
                    <motion.div variants={item}>
                      <motion.button 
                        onClick={() => {
                          setFile(null);
                          setUploadResult(null);
                        }}
                        className="w-full px-5 py-3 bg-[#1e293b] hover:bg-[#263a52] transition-all text-white rounded-md flex items-center justify-center shadow-md"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        Upload Another PDF
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <motion.div 
          className="text-center mt-5 text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <p>ScrollForge • Convert and view your PDF documents in HTML format</p>
        </motion.div>
      </motion.div>
      
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
