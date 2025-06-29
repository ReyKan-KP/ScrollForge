'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Page() {
  const params = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [pdfName, setPdfName] = useState<string>("");
  const [zoom, setZoom] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const [showControls, setShowControls] = useState<boolean>(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  // API URL - change this to match your backend (FastAPI)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  const id = parseInt(params.id as string);

  // Get token from localStorage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('pdf_access_token');
    if (!storedToken) {
      setError("No access token found. Please upload a PDF or load a document with a valid token.");
      setLoading(false);
      return;
    }
    setToken(storedToken);

    // Add timer to hide controls
    const timer = setTimeout(() => {
      if (!isFullscreen) return;
      setShowControls(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isFullscreen]);

  // Show controls when mouse moves
  const handleMouseMove = () => {
    if (!isFullscreen) return;
    setShowControls(true);
    
    // Hide controls after 3 seconds of inactivity
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    return () => clearTimeout(timer);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        if (id < totalPages) {
          router.push(`/page/${id + 1}`);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        if (id > 1) {
          router.push(`/page/${id - 1}`);
        }
      } else if (e.key === 'Home') {
        router.push(`/page/1`);
      } else if (e.key === 'End') {
        router.push(`/page/${totalPages}`);
      } else if (e.key === 'f' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [id, totalPages, router]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setShowControls(true);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };

  const handleZoomReset = () => {
    setZoom(100);
  };

  useEffect(() => {
    async function fetchPage() {
      if (!token) return; // Don't fetch if token is not available
      
      setLoading(true);
      setError(null);
      
      try {
        // Check if we need to get the total pages
        let totalPagesNum = parseInt(localStorage.getItem('pdf_total_pages') || '0');
        
        if (!totalPagesNum) {
          // Get document info first
          const infoResponse = await fetch(`${API_URL}/api/pages/${token}`);
          if (infoResponse.ok) {
            const data = await infoResponse.json();
            totalPagesNum = data.total_pages;
            setPdfName(data.pdf_name);
            localStorage.setItem('pdf_total_pages', totalPagesNum.toString());
          } else {
            const errorData = await infoResponse.json();
            throw new Error(errorData.error || 'Failed to get document information');
          }
        }
        
        setTotalPages(totalPagesNum);
        
        // Now fetch the specific page
        const pageResponse = await fetch(`${API_URL}/api/page/${token}/${id}`);
        
        if (pageResponse.redirected) {
          // We got a redirect - follow it to get the HTML content
          const htmlResponse = await fetch(pageResponse.url);
          if (htmlResponse.ok) {
            const html = await htmlResponse.text();
            setHtmlContent(html);
          } else {
            throw new Error('Failed to fetch HTML content');
          }
        } else if (pageResponse.ok) {
          const html = await pageResponse.text();
          setHtmlContent(html);
        } else {
          const errorData = await pageResponse.json();
          throw new Error(errorData.error || 'Failed to fetch page');
        }
        
      } catch (err: any) {
        console.error('Error fetching page:', err);
        setError(err.message || 'Failed to load page');
      } finally {
        setLoading(false);
      }
    }
    
    fetchPage();
  }, [id, router, token, API_URL]);

  // Jump to specific page
  const jumpToPage = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const target = (e.target as HTMLFormElement).pageInput.value;
    let pageNum = parseInt(target);
    
    // Validate the input is a number and within range
    if (isNaN(pageNum)) {
      alert('Please enter a valid page number');
      return;
    }
    
    // Ensure page number is within bounds
    if (pageNum < 1) {
      pageNum = 1;
    } else if (pageNum > totalPages) {
      pageNum = totalPages;
    }
    
    router.push(`/page/${pageNum}`);
  }, [router, totalPages]);

  // Set loading timeout
  useEffect(() => {
    if (!loading) return;
    
    const timeoutId = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setError('Loading is taking longer than expected. Please try refreshing the page.');
      }
    }, 30000); // 30 second timeout
    
    return () => clearTimeout(timeoutId);
  }, [loading]);

  // Component to safely render the HTML content
  const HTMLRenderer = ({ content }: { content: string }) => {
    useEffect(() => {
      const container = document.getElementById('html-container');
      if (container) {
        container.innerHTML = content;
      }
    }, [content]);
    
    return (
      <div 
        id="html-container" 
        className="p-6" 
        style={{ 
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top center',
          transition: 'transform 0.2s ease-out'
        }}
      />
    );
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0f172a] via-[#131f33] to-[#1e293b]">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative w-20 h-20 mx-auto mb-6">
            <motion.div 
              className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-blue-500/30"
              animate={{ scale: [1, 1.2, 1] }} 
              transition={{ duration: 2, repeat: Infinity }}
            />
            <svg 
              className="animate-spin h-full w-full text-blue-500" 
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
          <p className="text-lg font-medium text-white">Loading page {id}...</p>
          <p className="text-sm text-gray-400 mt-2">Please wait while we prepare your content</p>
        </motion.div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0f172a] via-[#131f33] to-[#1e293b]">
        <motion.div 
          className="max-w-md w-full bg-[#1e293b]/70 backdrop-blur-md shadow-xl rounded-lg overflow-hidden border border-[#334155] p-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-5">
              <svg 
                className="h-full w-full text-red-500" 
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
              <motion.div 
                className="absolute -inset-1 rounded-full border-2 border-red-500/20"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-white">Error</h2>
            <p className="mb-5 text-gray-300">{error}</p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 justify-center">
              <motion.button 
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg shadow-blue-700/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Upload New PDF
              </motion.button>
              <motion.button 
                onClick={() => router.push('/load-previous')}
                className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Load Previous Document
              </motion.button>
              <motion.button 
                onClick={() => {
                  // Attempt to reload the current page
                  setError(null);
                  setLoading(true);
                  router.refresh();
                }}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Retry
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Create pagination links
  const generatePagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    // Always show the first page
    pages.push(1);

    // Calculate range of visible pages
    let startPage = Math.max(2, id - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
    
    // Adjust if we're near the beginning
    if (startPage === 2) {
      endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
    }

    // Adjust if we're near the end
    if (endPage === totalPages - 1) {
      startPage = Math.max(2, endPage - maxVisiblePages + 1);
    }

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pages.push('...');
    }

    // Add visible pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pages.push('...');
    }

    // Always show last page if more than 1 page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pagination = generatePagination();

  return (
    <div 
      className={`min-h-screen bg-gradient-to-br from-[#0f172a] via-[#131f33] to-[#1e293b] transition-all duration-300 ${isFullscreen ? 'p-0' : 'py-6 px-2 sm:px-6'}`}
      onMouseMove={handleMouseMove}
    >
      <div className={`mx-auto ${isFullscreen ? 'max-w-none' : 'max-w-6xl'}`}>
        <motion.div 
          className={`bg-[#1e293b]/70 backdrop-blur-md shadow-xl rounded-lg overflow-hidden border border-[#334155] ${isFullscreen ? 'rounded-none border-0' : ''}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <AnimatePresence>
            {(!isFullscreen || (isFullscreen && showControls)) && (
              <motion.div 
                initial={isFullscreen ? { opacity: 0, y: -20 } : { opacity: 1 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className={`border-b border-[#334155] bg-gradient-to-r from-[#1e3a8a]/80 to-[#3b82f6]/80 px-4 sm:px-6 py-3 flex flex-wrap gap-2 items-center justify-between ${isFullscreen ? 'absolute top-0 left-0 right-0 z-50' : ''}`}
              >
                <div className="flex items-center space-x-2">
                  <Link 
                    href="/" 
                    className="mr-2 text-gray-300 hover:text-white transition-colors"
                    title="Back to Home"
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                      <span className="ml-1 text-sm hidden sm:inline">ScrollForge</span>
                    </div>
                  </Link>
                  
                  <div className="h-4 w-px bg-gray-600 mx-2 hidden sm:block"></div>
                  
                  <h1 className="text-lg font-semibold text-white truncate max-w-[150px] sm:max-w-xs">
                    {pdfName || "PDF Document"}
                  </h1>

                  <span className="text-sm px-2 py-1 bg-[#0f172a]/70 rounded text-blue-400 font-medium">
                    Page {id} of {totalPages}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Page navigation */}
                  <div className="flex items-center space-x-1">
                    <motion.div whileTap={{ scale: 0.9 }}>
                      <Link 
                        href={id > 1 ? `/page/${id - 1}` : '#'}
                        className={`p-1.5 rounded-md ${id > 1 
                          ? 'text-white ' 
                          : 'text-gray-500  cursor-not-allowed'}`}
                        title="Previous Page"
                        aria-disabled={id <= 1}
                        onClick={(e) => {
                          if (id <= 1) e.preventDefault();
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </motion.div>
                    
                    <form onSubmit={jumpToPage} className="flex items-center">
                      <input 
                        type="number" 
                        name="pageInput"
                        min="1" 
                        max={totalPages} 
                        defaultValue={id}
                        className="w-12 h-8 text-center bg-[#0f172a]/70 border border-[#334155] rounded text-white text-sm" 
                      />
                    </form>
                    
                    <motion.div whileTap={{ scale: 0.9 }}>
                      <Link 
                        href={id < totalPages ? `/page/${id + 1}` : '#'}
                        className={`p-1.5 rounded-md ${id < totalPages 
                          ? 'text-white ' 
                          : 'text-gray-500 cursor-not-allowed'}`}
                        title="Next Page"
                        aria-disabled={id >= totalPages}
                        onClick={(e) => {
                          if (id >= totalPages) e.preventDefault();
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </motion.div>
                  </div>

                  {/* Zoom controls */}
                  <div className="hidden sm:flex items-center space-x-1 border-l border-[#334155] pl-2">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={handleZoomOut}
                      className="p-1.5 text-white bg-[#1a3766] hover:bg-[#284d8a] rounded-md"
                      title="Zoom Out"
                      disabled={zoom <= 50}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </motion.button>
                    
                    <button
                      onClick={handleZoomReset}
                      className="text-xs text-white bg-[#0f172a]/70 px-1.5 py-1 rounded"
                    >
                      {zoom}%
                    </button>
                    
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={handleZoomIn}
                      className="p-1.5 text-white bg-[#1a3766] hover:bg-[#284d8a] rounded-md"
                      title="Zoom In"
                      disabled={zoom >= 200}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    </motion.button>
                  </div>

                  {/* Fullscreen toggle */}
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleFullscreen}
                    className="p-1.5 text-white bg-[#1a3766] hover:bg-[#284d8a] rounded-md ml-2"
                    title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  >
                    {isFullscreen ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 4a1 1 0 00-1 1v4a1 1 0 01-1 1H2a1 1 0 010-2h.93a.5.5 0 00.5-.5V5a1 1 0 011-1h4a1 1 0 010 2H6a.5.5 0 00-.5.5V8a1 1 0 01-1 1H3a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1v-1a1 1 0 112 0v1a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 00-1-1h-1a1 1 0 110-2h1a1 1 0 001-1V5a1 1 0 00-1-1h-4a1 1 0 00-1 1v1a1 1 0 11-2 0V5a1 1 0 00-1-1H5z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile zoom controls */}
          <AnimatePresence>
            {(!isFullscreen || (isFullscreen && showControls)) && (
              <motion.div 
                className="sm:hidden flex items-center justify-between px-4 py-2 bg-[#0f172a]/70 border-b border-[#334155]"
                initial={isFullscreen ? { opacity: 0 } : { opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <span className="text-sm text-gray-400">Zoom:</span>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleZoomOut}
                    className="p-1.5 text-white bg-[#1a3766] hover:bg-[#284d8a] rounded-md"
                    disabled={zoom <= 50}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                  
                  <button
                    onClick={handleZoomReset}
                    className="text-xs text-white bg-[#0f172a] px-1.5 py-1 rounded"
                  >
                    {zoom}%
                  </button>
                  
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleZoomIn}
                    className="p-1.5 text-white bg-[#1a3766] hover:bg-[#284d8a] rounded-md"
                    disabled={zoom >= 200}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content - Using our custom HTML renderer */}
          <div 
            ref={contentRef}
            className={`w-full min-h-[50vh] overflow-auto ${isFullscreen ? 'max-h-screen' : 'max-h-[calc(100vh-240px)]'} `}
          >
            <div className="overflow-auto">
              {htmlContent && <HTMLRenderer content={htmlContent} />}
            </div>
          </div>

          {/* Navigation */}
          <AnimatePresence>
            {(!isFullscreen || (isFullscreen && showControls)) && (
              <motion.div 
                className={`px-4 sm:px-6 py-4 bg-[#1e293b]/90 backdrop-blur-md border-t border-[#334155] ${isFullscreen ? 'absolute bottom-0 left-0 right-0 z-50' : ''}`}
                initial={isFullscreen ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <div className="flex flex-wrap justify-center gap-y-3">
                  {/* Numbered pagination */}
                  <div className="flex flex-wrap justify-center items-center gap-1">
                    {pagination.map((page, index) => {
                      if (page === '...') {
                        return (
                          <span key={`ellipsis-${index}`} className="px-2 py-1 text-gray-400">
                            ...
                          </span>
                        );
                      }
                      
                      const pageNum = page as number;
                      
                      return (
                        <motion.div key={pageNum} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Link 
                            href={`/page/${pageNum}`} 
                            className={`px-3 py-1.5 rounded text-center min-w-[32px] text-sm ${
                              pageNum === id 
                                ? 'bg-blue-700 text-white font-medium shadow-lg shadow-blue-700/20' 
                                : 'bg-[#1a3766] text-white hover:bg-[#284d8a]'
                            }`}
                          >
                            {pageNum}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Bottom quick navigation */}
                <div className="flex justify-between items-center mt-4">
                  <motion.div whileHover={{ x: -3 }} whileTap={{ scale: 0.95 }}>
                    <Link 
                      href={id > 1 ? `/page/${id - 1}` : '#'}
                      className={`flex items-center px-3 py-2 rounded-md ${id > 1 
                        ? 'bg-[#1a3766] hover:bg-[#284d8a] text-white' 
                        : 'bg-[#0f172a]/70 text-gray-500 cursor-not-allowed'}`}
                      aria-disabled={id <= 1}
                      onClick={(e) => {
                        if (id <= 1) e.preventDefault();
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Previous
                    </Link>
                  </motion.div>

                  <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      href="/page"
                      className="px-3 py-2 bg-[#0f172a]/70 hover:bg-[#1e293b] text-white rounded-md flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      All Pages
                    </Link>
                  </motion.div>

                  <motion.div whileHover={{ x: 3 }} whileTap={{ scale: 0.95 }}>
                    <Link 
                      href={id < totalPages ? `/page/${id + 1}` : '#'}
                      className={`flex items-center px-3 py-2 rounded-md ${id < totalPages 
                        ? 'bg-[#1a3766] hover:bg-[#284d8a] text-white' 
                        : 'bg-[#0f172a]/70 text-gray-500 cursor-not-allowed'}`}
                      aria-disabled={id >= totalPages}
                      onClick={(e) => {
                        if (id >= totalPages) e.preventDefault();
                      }}
                    >
                      Next
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </motion.div>
                </div>
                
                <div className="text-center text-xs text-gray-400 mt-4">
                  <p>Keyboard shortcuts: Arrow keys to navigate pages, F to toggle fullscreen</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
