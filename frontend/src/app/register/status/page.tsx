'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import axios, { AxiosError } from 'axios';
import Link from 'next/link';
import { FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';

interface NGOStatus {
  name: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface ErrorResponse {
  message?: string;
  error?: string;
}

export default function StatusPage() {
  const searchParams = useSearchParams();
  const [ngoId, setNgoId] = useState<string>('');
  const [ngoStatus, setNgoStatus] = useState<NGOStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  useEffect(() => {
    // Check if we have an id in the URL
    const id = searchParams ? searchParams.get('id') : null;
    if (id) {
      setNgoId(id);
      checkStatus(id);
    } else {
      // Check if we have an id in localStorage
      const storedId = localStorage.getItem('ngoRegistrationId');
      if (storedId) {
        setNgoId(storedId);
        checkStatus(storedId);
      }
    }
  }, [searchParams]);

  const checkStatus = async (id: string) => {
    try {
      setIsLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.get(`${apiUrl}/api/ngo/status/${id}`);
      
      if (response.data.success) {
        setNgoStatus(response.data.data);
      } else {
        toast.error(response.data.message || 'Error checking NGO status');
      }
    } catch (error: unknown) {
      console.error('Error checking status:', error);
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(axiosError.response?.data?.message || 'Failed to check NGO status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ngoId.trim()) {
      toast.error('Please enter an NGO ID');
      return;
    }
    
    setIsCheckingStatus(true);
    await checkStatus(ngoId);
    setIsCheckingStatus(false);
  };

  const renderStatusCard = () => {
    if (!ngoStatus) return null;
    
    return (
      <div className="bg-white dark:bg-card-dark shadow-lg rounded-lg p-6 mt-8">
        <div className="flex flex-col items-center">
          {ngoStatus.status === 'approved' ? (
            <div className="bg-green-100 dark:bg-green-900/40 rounded-full p-3 mb-4">
              <FiCheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          ) : ngoStatus.status === 'rejected' ? (
            <div className="bg-red-100 dark:bg-red-900/40 rounded-full p-3 mb-4">
              <FiXCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
          ) : (
            <div className="bg-yellow-100 dark:bg-yellow-900/40 rounded-full p-3 mb-4">
              <FiClock className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
            </div>
          )}
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {ngoStatus.name}
          </h2>
          
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium 
              ${ngoStatus.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                ngoStatus.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
              {ngoStatus.status.charAt(0).toUpperCase() + ngoStatus.status.slice(1)}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Submitted on {new Date(ngoStatus.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          <div className="text-center mb-6">
            {ngoStatus.status === 'approved' ? (
              <p className="text-gray-700 dark:text-gray-300">
                Congratulations! Your NGO registration has been approved. You can now login to your account.
              </p>
            ) : ngoStatus.status === 'rejected' ? (
              <p className="text-gray-700 dark:text-gray-300">
                We&apos;re sorry, but your NGO registration has been rejected. Please contact support for more information.
              </p>
            ) : (
              <p className="text-gray-700 dark:text-gray-300">
                Your NGO registration is currently under review. Please check back later for updates.
              </p>
            )}
          </div>
          
          <div className="flex gap-4">
            {ngoStatus.status === 'approved' && (
              <Link
                href="/login"
                className="px-4 py-2 bg-theme-nature text-white rounded-md hover:bg-theme-nature/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-nature transition-colors"
              >
                Login Now
              </Link>
            )}
            
            <Link
              href="/"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-nature transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-theme-nature/5 dark:from-background-dark dark:via-background-dark dark:to-theme-heart/5 p-4">
      <div className="max-w-md w-full bg-white dark:bg-card-dark rounded-2xl shadow-lg border-2 border-secondary-200 dark:border-border-dark relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-theme-nature/20 to-transparent rounded-full blur-3xl dark:from-theme-heart/10" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-theme-paw/20 to-transparent rounded-full blur-3xl dark:from-theme-nature/10" />
        
        <div className="relative p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-theme-nature via-primary-500 to-theme-heart bg-clip-text text-transparent dark:from-theme-paw dark:via-theme-sky dark:to-theme-heart">
              Registration Status
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Check the status of your NGO registration
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-theme-nature"></div>
            </div>
          ) : ngoStatus ? (
            renderStatusCard()
          ) : (
            <form onSubmit={handleCheckStatus} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="ngo-id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  NGO Registration ID
                </label>
                <input
                  id="ngo-id"
                  type="text"
                  value={ngoId}
                  onChange={(e) => setNgoId(e.target.value)}
                  required
                  className="block w-full rounded-md border-secondary-300 dark:border-border-dark bg-white dark:bg-card-dark shadow-sm focus:border-theme-nature focus:ring-theme-nature dark:focus:border-theme-heart dark:focus:ring-theme-heart transition-all"
                  placeholder="Enter your registration ID"
                />
              </div>
              
              <button
                type="submit"
                disabled={isCheckingStatus}
                className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-theme-nature to-primary-500 hover:from-theme-nature/90 hover:to-primary-600 dark:from-theme-heart dark:to-theme-paw dark:hover:from-theme-heart/90 dark:hover:to-theme-paw/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-nature dark:focus:ring-theme-heart transition-all duration-200 disabled:opacity-50"
              >
                {isCheckingStatus ? 'Checking...' : 'Check Status'}
              </button>
              
              <div className="text-center mt-4">
                <Link
                  href="/login"
                  className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-theme-heart dark:hover:text-theme-heart/90"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 