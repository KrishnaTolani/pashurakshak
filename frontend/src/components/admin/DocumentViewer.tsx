'use client';

import React, { useState, useEffect } from 'react';
import { FiZoomIn, FiZoomOut, FiDownload, FiX, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import Image from 'next/image';

interface DocumentViewerProps {
  url: string;
  title: string;
  onClose: () => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ url, title, onClose }) => {
  const [scale, setScale] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [useIframe, setUseIframe] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Check if it's a Cloudinary URL and transform it if needed
  const processCloudinaryUrl = (inputUrl: string): string => {
    try {
      console.log("Processing URL:", inputUrl);
      
      // Special handling for Cloudinary Media Explorer URLs
      if (inputUrl.includes('res-console.cloudinary.com') || 
          inputUrl.includes('media_explorer_thumbnails')) {
        
        // Try to extract parts from the URL
        const urlParts = inputUrl.split('/');
        // Find the cloud name part
        const cloudNamePart = urlParts.find(part => part.includes('.cloudinary.com'));
        const cloudName = cloudNamePart ? cloudNamePart.split('.')[0] : null;
        
        // Try to find a potential public ID
        // This is an approximation - the real public ID might be different
        let publicId = '';
        
        // Look for the part that might be a public ID (often a hash or identifier)
        for (let i = urlParts.length - 1; i >= 0; i--) {
          if (urlParts[i] && 
             (urlParts[i].length > 20 || 
              urlParts[i].includes('.') ||
              /[0-9a-f]{16,}/.test(urlParts[i]))) {
            publicId = urlParts[i];
            break;
          }
        }
        
        if (cloudName && publicId) {
          console.log(`Transformed console URL to: https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`);
          return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
        }
      }
      
      // Format 1: Direct API response format (already has the correct format)
      if (inputUrl.includes('res.cloudinary.com') && 
          inputUrl.includes('/image/upload/')) {
        console.log("URL already in correct format:", inputUrl);
        return inputUrl;
      }
      
      // If we couldn't process it, return as is
      return inputUrl;
    } catch (e) {
      console.warn("Error processing Cloudinary URL:", e);
      return inputUrl;
    }
  };
  
  // Process URL and add cache busting
  const processedUrl = processCloudinaryUrl(url);
  const imageUrl = `${processedUrl}${processedUrl.includes('?') ? '&' : '?'}cacheBust=${retryCount}`;
  
  // Setup iframe HTML with proxy approach
  const iframeHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f3f4f6;
        }
        body.dark {
          background-color: #1f2937;
        }
        img {
          max-width: 100%;
          max-height: 100vh;
          object-fit: contain;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border-radius: 0.375rem;
        }
        .loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #6b7280;
        }
        .loading svg {
          animation: spin 1s linear infinite;
          width: 40px;
          height: 40px;
          margin-bottom: 16px;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      </style>
    </head>
    <body class="${document.documentElement.classList.contains('dark') ? 'dark' : ''}">
      <div id="container">
        <div id="loading" class="loading">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="1"></path>
          </svg>
          <p>Loading document...</p>
        </div>
      </div>
      <script>
        function hideLoader() {
          document.getElementById('loading').style.display = 'none';
        }
        
        function showImage(url) {
          const img = new Image();
          img.onload = function() {
            hideLoader();
            document.getElementById('container').appendChild(img);
          };
          img.onerror = function() {
            hideLoader();
            document.getElementById('container').innerHTML = 
              '<div style="text-align:center;padding:20px;"><p style="color:#ef4444;font-size:18px;">Error loading image</p>' +
              '<a href="' + url + '" target="_blank" style="display:inline-block;margin-top:16px;padding:8px 16px;' +
              'background:#3b82f6;color:white;text-decoration:none;border-radius:4px;">Open in New Tab</a></div>';
          };
          img.src = "${processedUrl}";
        }
        
        // Try to load the image
        showImage("${processedUrl}");
      </script>
    </body>
    </html>
  `;
  
  useEffect(() => {
    // Reset error state when URL changes
    setHasError(false);
    setIsLoading(true);
    setUseIframe(false);
  }, [url]);
  
  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3));
  };
  
  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };
  
  const resetZoom = () => {
    setScale(1);
  };
  
  const handleDownload = () => {
    // For Cloudinary URLs, try to open in a new tab first (most reliable method)
    window.open(processedUrl, '_blank');
    
    // As a fallback, also try the traditional download approach
    try {
      const a = document.createElement('a');
      a.href = processedUrl;
      a.download = title || 'document';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.warn("Download fallback failed:", e);
    }
  };

  const handleImageLoad = () => {
    console.log("Image loaded successfully:", processedUrl);
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    console.error(`Direct image loading failed, trying iframe approach: ${processedUrl}`);
    // If direct loading fails, try iframe approach
    if (!useIframe) {
      setUseIframe(true);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      setHasError(true);
    }
  };
  
  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    setUseIframe(false);
    setRetryCount(prev => prev + 1);
  };
  
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80" onClick={onClose}>
      <div 
        className="bg-white dark:bg-card-dark rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
            {title}
          </h3>
          <div className="flex items-center space-x-4">
            <button
              onClick={zoomOut}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Zoom out"
              disabled={hasError || useIframe}
            >
              <FiZoomOut className={`w-5 h-5 ${useIframe ? 'opacity-50' : ''}`} />
            </button>
            <button
              onClick={resetZoom}
              className="text-sm px-2 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              disabled={hasError || useIframe}
            >
              {Math.round(scale * 100)}%
            </button>
            <button
              onClick={zoomIn}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Zoom in"
              disabled={hasError || useIframe}
            >
              <FiZoomIn className={`w-5 h-5 ${useIframe ? 'opacity-50' : ''}`} />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-blue-600 dark:text-blue-400"
              aria-label="Download"
            >
              <FiDownload className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center relative bg-gray-100 dark:bg-gray-800">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100/70 dark:bg-gray-800/70 z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 dark:border-blue-400"></div>
            </div>
          )}
          
          {hasError ? (
            <div className="flex flex-col items-center justify-center text-red-500 p-8 bg-white dark:bg-card-dark rounded-lg">
              <FiAlertCircle className="w-16 h-16 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Error Loading Image</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-center max-w-md">
                The image could not be displayed. This might be due to an invalid URL or unsupported format.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                  <FiRefreshCw className="mr-2" /> Retry
                </button>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 border border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center"
                >
                  <FiDownload className="mr-2" /> Open in New Tab
                </button>
              </div>
            </div>
          ) : useIframe ? (
            // Fallback to iframe if direct image loading fails
            <div className="w-full h-full flex items-center justify-center">
              <iframe 
                srcDoc={iframeHtml}
                className="w-full h-full border-0"
                title={title}
                sandbox="allow-scripts allow-same-origin"
                referrerPolicy="no-referrer"
                onLoad={() => setIsLoading(false)}
              />
            </div>
          ) : (
            <div 
              className="relative bg-transparent max-w-full max-h-full flex items-center justify-center" 
              style={{ 
                transform: `scale(${scale})`, 
                transformOrigin: 'center', 
                transition: 'transform 0.2s ease-in-out',
              }}
            >
              {/* Background transparency pattern for transparent images */}
              <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAEKADAAQAAAABAAAAEAAAAAAXnVPIAAAAFElEQVQ4EWP8z8AARBQM6oFRAwACvgABJ5wDCQAAAABJRU5ErkJggg==')] opacity-10" />
              
              <Image 
                src={imageUrl} 
                alt={title} 
                className="max-w-full max-h-[calc(90vh-120px)] object-contain shadow-lg rounded-md"
                style={{ maxHeight: 'calc(90vh - 130px)' }}
                onLoad={handleImageLoad}
                onError={handleImageError}
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                width={800}
                height={600}
                unoptimized
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer; 