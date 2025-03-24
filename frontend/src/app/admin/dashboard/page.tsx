'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiEye, FiCheckCircle, FiXCircle, FiFileText } from 'react-icons/fi';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import DocumentViewer from '@/components/admin/DocumentViewer';

interface NGORegistration {
  _id: string;
  name: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  organizationType: string;
  address: {
    state: string;
  };
}

interface NGODetailData {
  _id: string;
  name: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  contactPerson: {
    name: string;
    phone: string;
    email: string;
  };
  organizationType: string;
  registrationNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  focusAreas: string[];
  website: string;
  documents: {
    registrationCertificate: string;
    taxExemptionCertificate?: string;
  };
  createdAt: string;
}

export default function AdminDashboard() {
  const [registrations, setRegistrations] = useState<NGORegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNGO, setSelectedNGO] = useState<NGODetailData | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [viewingDocument, setViewingDocument] = useState<{ url: string; title: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchRegistrations();
  }, [router]);

  const fetchRegistrations = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/registrations`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRegistrations(response.data.registrations);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      toast.error('Failed to load registrations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      setIsUpdating(true);
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/registrations/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      toast.success(`Registration ${status} successfully`);
      
      // If we have the detail modal open, we should close it since the status changed
      if (showDetailModal && selectedNGO && selectedNGO._id === id) {
        setShowDetailModal(false);
        setSelectedNGO(null);
      }
      
      fetchRegistrations(); // Refresh the list
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const fetchNGODetails = async (id: string) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('adminToken');
      
      // Use the correct admin/ngo/:id endpoint as per API_COMPLETED.md
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/ngo/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setSelectedNGO(response.data.data);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error fetching NGO details:', error);
      toast.error('Failed to load NGO details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const handleViewDocument = (url: string, title: string) => {
    // Make sure URL isn't empty
    if (!url) {
      toast.error('Document URL is missing or invalid');
      return;
    }
    
    // Log the URL for debugging
    console.log(`Opening document: ${url}`);
    
    // Set the document to view
    setViewingDocument({ url, title });
  };

  if (isLoading && !showDetailModal) {
    return (
      <ProtectedRoute type="admin">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-theme-nature"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute type="admin">
      <div className="min-h-screen bg-gray-50 dark:bg-background-dark">
        {/* Document Viewer Modal */}
        {viewingDocument && (
          <DocumentViewer
            url={viewingDocument.url}
            title={viewingDocument.title}
            onClose={() => setViewingDocument(null)}
          />
        )}

        {/* NGO Detail Modal */}
        {showDetailModal && selectedNGO && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white dark:bg-card-dark rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  NGO Details
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                >
                  &times;
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Organization Information</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">NGO Name</p>
                        <p className="text-base text-gray-900 dark:text-white">{selectedNGO.name}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                        <p className="text-base text-gray-900 dark:text-white">{selectedNGO.email}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Organization Type</p>
                        <p className="text-base text-gray-900 dark:text-white">{selectedNGO.organizationType}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Registration Number</p>
                        <p className="text-base text-gray-900 dark:text-white">{selectedNGO.registrationNumber}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Website</p>
                        <p className="text-base text-gray-900 dark:text-white">
                          {selectedNGO.website ? (
                            <a href={selectedNGO.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {selectedNGO.website}
                            </a>
                          ) : (
                            "Not provided"
                          )}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Focus Areas</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedNGO.focusAreas.map((area, index) => (
                            <span key={index} className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Contact Information</h4>
                    
                    <div className="space-y-3 mb-6">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Person</p>
                        <p className="text-base text-gray-900 dark:text-white">{selectedNGO.contactPerson.name}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Email</p>
                        <p className="text-base text-gray-900 dark:text-white">{selectedNGO.contactPerson.email}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Phone</p>
                        <p className="text-base text-gray-900 dark:text-white">{selectedNGO.contactPerson.phone}</p>
                      </div>
                    </div>
                    
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Address</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Street</p>
                        <p className="text-base text-gray-900 dark:text-white">{selectedNGO.address.street}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">City</p>
                        <p className="text-base text-gray-900 dark:text-white">{selectedNGO.address.city}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">State</p>
                        <p className="text-base text-gray-900 dark:text-white">{selectedNGO.address.state}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">PIN Code</p>
                        <p className="text-base text-gray-900 dark:text-white">{selectedNGO.address.pincode}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Documents</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Registration Certificate</p>
                      {selectedNGO.documents.registrationCertificate ? (
                        <div className="mt-2">
                          <div className="mb-3 p-2 border rounded-md bg-gray-50 dark:bg-gray-800">
                            <div 
                              className="h-32 w-full rounded-md cursor-pointer mb-2 flex items-center justify-center bg-gray-100 dark:bg-gray-700 overflow-hidden"
                              onClick={() => handleViewDocument(selectedNGO.documents.registrationCertificate, 'Registration Certificate')}
                            >
                              <div 
                                className="h-full w-full bg-contain bg-center bg-no-repeat"
                                style={{ backgroundImage: `url(${selectedNGO.documents.registrationCertificate})` }}
                              />
                            </div>
                            <button
                              onClick={() => handleViewDocument(selectedNGO.documents.registrationCertificate, 'Registration Certificate')}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all w-full justify-center"
                            >
                              <FiFileText className="w-4 h-4 mr-2" />
                              View Certificate
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">Not provided</p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Tax Exemption Certificate</p>
                      {selectedNGO.documents.taxExemptionCertificate ? (
                        <div className="mt-2">
                          <div className="mb-3 p-2 border rounded-md bg-gray-50 dark:bg-gray-800">
                            <div 
                              className="h-32 w-full rounded-md cursor-pointer mb-2 flex items-center justify-center bg-gray-100 dark:bg-gray-700 overflow-hidden"
                              onClick={() => handleViewDocument(selectedNGO.documents.taxExemptionCertificate || '', 'Tax Exemption Certificate')}
                            >
                              <div 
                                className="h-full w-full bg-contain bg-center bg-no-repeat"
                                style={{ backgroundImage: `url(${selectedNGO.documents.taxExemptionCertificate})` }}
                              />
                            </div>
                            <button
                              onClick={() => handleViewDocument(selectedNGO.documents.taxExemptionCertificate || '', 'Tax Exemption Certificate')}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all w-full justify-center"
                            >
                              <FiFileText className="w-4 h-4 mr-2" />
                              View Certificate
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">Not provided</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-4 justify-end">
                {selectedNGO.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(selectedNGO._id, 'rejected')}
                      disabled={isUpdating}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                    >
                      <FiXCircle className="mr-2" />
                      {isUpdating ? 'Rejecting...' : 'Reject NGO'}
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedNGO._id, 'approved')}
                      disabled={isUpdating}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    >
                      <FiCheckCircle className="mr-2" />
                      {isUpdating ? 'Approving...' : 'Approve NGO'}
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-card-dark hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <nav className="bg-white dark:bg-card-dark shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white dark:bg-card-dark shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">NGO Registrations</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-background-dark">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">State</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-card-dark divide-y divide-gray-200 dark:divide-gray-700">
                      {registrations.map((registration) => (
                        <tr key={registration._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {registration.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {registration.organizationType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {registration.address?.state || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${registration.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                                registration.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
                                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                              {registration.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(registration.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => fetchNGODetails(registration._id)}
                                className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                              >
                                <FiEye className="w-5 h-5" />
                              </button>
                              {registration.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleStatusUpdate(registration._id, 'approved')}
                                    disabled={isUpdating}
                                    className="text-green-600 hover:text-green-900 dark:hover:text-green-400"
                                  >
                                    <FiCheckCircle className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={() => handleStatusUpdate(registration._id, 'rejected')}
                                    disabled={isUpdating}
                                    className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                                  >
                                    <FiXCircle className="w-5 h-5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 