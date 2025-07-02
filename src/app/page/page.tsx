"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [documentInfo, setDocumentInfo] = useState<{
    pdf_name: string;
    total_pages: number;
  } | null>(null);
  const [hasToken, setHasToken] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageGroups, setPageGroups] = useState<
    { start: number; end: number }[]
  >([]);

  // API URL - change this to match your backend (FastAPI)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Function to create page groups for navigation
  const calculatePageGroups = (totalPages: number) => {
    const groupSize = 20;
    const totalGroups = Math.ceil(totalPages / groupSize);
    
    return Array.from({ length: totalGroups }, (_, i) => {
      const start = i * groupSize + 1;
      const end = Math.min((i + 1) * groupSize, totalPages);
      return { start, end };
    });
  };

  useEffect(() => {
    const checkToken = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem("pdf_access_token");

        // If no token, show landing page
        if (!token) {
          setLoading(false);
          return;
        }

        setHasToken(true);

        // Fetch document info using token
        const response = await fetch(`${API_URL}/api/pages/${token}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          signal: AbortSignal.timeout(10000) // 10 second timeout
        });

        if (!response.ok) {
          if (response.status === 404) {
            // Token invalid or expired
            localStorage.removeItem("pdf_access_token");
            localStorage.removeItem("pdf_total_pages");
            localStorage.removeItem("pdf_name");
            setHasToken(false);
            setLoading(false);
            setError("Token invalid or expired. Please upload a new document or enter a valid token.");
            return;
          }
          throw new Error("Failed to fetch document information");
        }

        const data = await response.json();
        setDocumentInfo({
          pdf_name: data.pdf_name,
          total_pages: data.total_pages,
        });

        // Calculate and set page groups
        setPageGroups(calculatePageGroups(data.total_pages));
        
      } catch (err: any) {
        if (err.name === "AbortError") {
          setError("Request timed out. Please check your connection and try again.");
        } else {
          setError("Error loading document. Please try uploading again.");
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, [API_URL]);

  const handleClearToken = () => {
    localStorage.removeItem("pdf_access_token");
    localStorage.removeItem("pdf_total_pages");
    localStorage.removeItem("pdf_name");
    setHasToken(false);
    setDocumentInfo(null);
    router.push('/');
  };

  if (!hasToken) {
    return (
      <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto pt-8 md:pt-16"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center mb-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary mr-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
              </svg>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">ScrollForge</h1>
            </motion.div>
            <h2 className="text-2xl font-bold text-foreground mb-2">No Active Document</h2>
            <p className="text-muted-foreground">Please upload a new PDF document or load a previous one</p>
          </div>
          
          <motion.div 
            className="bg-card backdrop-blur-md shadow-xl rounded-lg overflow-hidden border border-border p-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {error && (
              <div className="mb-6 bg-destructive/20 border border-destructive/50 p-3 rounded-md">
                <p className="text-destructive text-sm flex items-start">
                  <svg className="h-5 w-5 text-destructive mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              </div>
            )}
            
            <div className="flex flex-col space-y-4">
              <Link 
                href="/upload"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-primary-foreground bg-primary hover:bg-primary/90 transform transition-transform hover:scale-[1.02] hover:shadow-primary/30"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                Upload New PDF
              </Link>
              
              <Link 
                href="/load-previous"
                className="w-full flex justify-center py-3 px-4 border border-border rounded-md shadow-lg text-foreground bg-card hover:bg-muted transform transition-transform hover:scale-[1.02]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                Load Previous Document
              </Link>
              
              <Link 
                href="/"
                className="w-full flex justify-center py-3 px-4 border border-border rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transform transition-transform hover:scale-[1.02]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Back to Home
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex justify-center items-center">
        <div className="text-center p-8 bg-card backdrop-blur-md border border-border rounded-xl shadow-2xl max-w-sm w-full">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-primary/30 animate-pulse"></div>
            <svg
              className="animate-spin w-full h-full text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
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
          <p className="text-sm text-muted-foreground mt-2">
            Preparing your digital reading experience
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        <header className="mb-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-card backdrop-blur-md p-6 rounded-lg shadow-lg border border-border"
          >
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-primary mr-3"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
              </svg>
              <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                  ScrollForge
                </h1>
                <p className="text-muted-foreground mt-1">
                  View and navigate your converted PDF documents
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors text-sm flex items-center gap-2 shadow-lg"
              >
                <Link
                  href="/load-previous"
                  className="text-primary-foreground"
                >
                  Load Previous
                </Link>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClearToken}
                className="px-4 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-md transition-colors text-sm flex items-center gap-2 shadow-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v9a1 1 0 11-2 0V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M4.293 7.293a1 1 0 011.414 0L10 11.586l4.293-4.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Upload New PDF
              </motion.button>
            </div>
          </motion.div>
        </header>

        {documentInfo && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-card backdrop-blur-md border border-border rounded-lg shadow-lg overflow-hidden mb-8 transform transition-transform hover:scale-[1.01] hover:shadow-primary/10"
          >
            <div className="bg-primary/70 px-6 py-5">
              <h2 className="text-xl font-semibold text-primary-foreground flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-primary-foreground/70"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                    clipRule="evenodd"
                  />
                </svg>
                {documentInfo.pdf_name}
              </h2>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <p className="text-muted-foreground mb-1">Document Information</p>
                  <p className="text-lg font-medium">
                    Total pages:{" "}
                    <span className="text-primary">
                      {documentInfo.total_pages}
                    </span>
                  </p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/page/1"
                    className="inline-flex items-center px-5 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-all shadow-lg hover:shadow-primary/30"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                      <path
                        fillRule="evenodd"
                        d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Start Reading
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {documentInfo && documentInfo.total_pages > 0 && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-card backdrop-blur-md border border-border rounded-lg shadow-lg overflow-hidden"
          >
            <div className="bg-primary/70 px-6 py-4">
              <h2 className="text-xl font-semibold text-primary-foreground flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-primary-foreground/70"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                Navigate Pages
              </h2>
            </div>

            {documentInfo.total_pages > 20 && (
              <div className="p-4 border-b border-border">
                <p className="text-sm text-muted-foreground mb-2">
                  Jump to page group:
                </p>
                <div className="flex flex-wrap gap-2">
                  {pageGroups.map((group, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href={`#group-${i}`}
                        className="px-3 py-1 bg-muted hover:bg-muted/80 border border-border rounded-md transition-colors text-sm shadow-md hover:shadow-primary/10"
                      >
                        {group.start}-{group.end}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-6">
              {pageGroups.map((group, i) => (
                <div key={i} id={`group-${i}`} className="mb-8 last:mb-0">
                  {documentInfo.total_pages > 20 && (
                    <h3 className="text-lg font-medium mb-3 text-muted-foreground">
                      Pages {group.start}-{group.end}
                    </h3>
                  )}
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-2">
                    {Array.from(
                      { length: group.end - group.start + 1 },
                      (_, j) => {
                        const pageNum = group.start + j;
                        return (
                          <motion.div
                            key={j}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Link
                              href={`/page/${pageNum}`}
                              className="flex items-center justify-center h-12 bg-muted hover:bg-muted/80 border border-border rounded-md transition-all hover:border-primary shadow-md hover:shadow-primary/20"
                            >
                              <span>{pageNum}</span>
                            </Link>
                          </motion.div>
                        );
                      }
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
