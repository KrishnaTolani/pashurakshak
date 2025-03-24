'use client';

import React, { useEffect, useState, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';

interface NGO {
  _id: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
  codeNo: string;
  state: string;
  district: string;
  organizationType: string;
  focusAreas: string[];
}

export default function AdminDashboard() {
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedNgoId, setSelectedNgoId] = useState<string | null>(null);
  const router = useRouter();

  const fetchNGOs = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('${process.env.NEXT_PUBLIC_API_URL}/api/ngo/pending', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNgos(response.data);
    } catch (error) {
      const axiosError = error as AxiosError<{message?: string}>;
      setError(axiosError.response?.data?.message || 'Error fetching NGOs');
      if (axiosError.response?.status === 401) {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchNGOs();
  }, [fetchNGOs, router]);

  const handleApprove = async (id: string) => {
    try {
      setActionInProgress(id);
      const token = localStorage.getItem('adminToken');
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/ngo/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNgos(ngos.filter(ngo => ngo._id !== id));
    } catch (error) {
      const axiosError = error as AxiosError<{message?: string}>;
      setError(axiosError.response?.data?.message || 'Error approving NGO');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleReject = async () => {
    if (!selectedNgoId || !rejectionReason) return;

    try {
      setActionInProgress(selectedNgoId);
      const token = localStorage.getItem('adminToken');
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/ngo/${selectedNgoId}/reject`,
        { reason: rejectionReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNgos(ngos.filter(ngo => ngo._id !== selectedNgoId));
      setShowRejectionModal(false);
      setRejectionReason('');
      setSelectedNgoId(null);
    } catch (error) {
      const axiosError = error as AxiosError<{message?: string}>;
      setError(axiosError.response?.data?.message || 'Error rejecting NGO');
    } finally {
      setActionInProgress(null);
    }
  };

  const openRejectionModal = (id: string) => {
    setSelectedNgoId(id);
    setShowRejectionModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          NGO Details
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type & Focus
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {ngos.map((ngo) => (
                        <tr key={ngo._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {ngo.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {ngo.email}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Code: {ngo.codeNo}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{ngo.state}</div>
                            <div className="text-sm text-gray-500">{ngo.district}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{ngo.organizationType}</div>
                            <div className="text-sm text-gray-500">
                              {ngo.focusAreas.join(', ')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              {ngo.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleApprove(ngo._id)}
                              disabled={actionInProgress === ngo._id}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              {actionInProgress === ngo._id ? 'Processing...' : 'Approve'}
                            </button>
                            <button
                              onClick={() => openRejectionModal(ngo._id)}
                              disabled={actionInProgress === ngo._id}
                              className="text-red-600 hover:text-red-900"
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Rejection Reason
                    </h3>
                    <div className="mt-2">
                      <textarea
                        rows={4}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                        placeholder="Enter reason for rejection"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={!rejectionReason}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowRejectionModal(false);
                    setRejectionReason('');
                    setSelectedNgoId(null);
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 