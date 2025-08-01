// frontend/src/app/admin/inquiries/page.jsx
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import DOMPurify from 'dompurify';
import {
  UserCircleIcon,
  EnvelopeIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
  HomeModernIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A';

export default function AdminInquiries() {
  const router = useRouter();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showRespondModal, setShowRespondModal] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(null);
  const [selectedInquiries, setSelectedInquiries] = useState([]);
  const inquiriesPerPage = 10;

  useEffect(() => {
    fetchInquiries();
  }, []);

  async function fetchInquiries() {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setError('Please log in to access inquiries');
        router.push('/admin/login');
        return;
      }
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || ''}/api/inquiries`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setInquiries(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Failed to fetch inquiries'
      );
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setError('Please log in to perform this action');
        router.push('/admin/login');
        return;
      }
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL || ''}/api/inquiries/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setInquiries(inquiries.filter((inq) => inq._id !== id));
      setShowDeleteModal(null);
      setShowSuccessModal('Inquiry deleted successfully');
      setTimeout(() => setShowSuccessModal(''), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Failed to delete inquiry'
      );
    }
  }

  async function handleBulkDelete() {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setError('Please log in to perform this action');
        router.push('/admin/login');
        return;
      }
      await Promise.all(
        selectedInquiries.map((id) =>
          axios.delete(
            `${process.env.NEXT_PUBLIC_API_URL || ''}/api/inquiries/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          )
        )
      );
      setInquiries(inquiries.filter((inq) => !selectedInquiries.includes(inq._id)));
      setSelectedInquiries([]);
      setShowBulkDeleteModal(false);
      setShowSuccessModal('Selected inquiries deleted successfully');
      setTimeout(() => setShowSuccessModal(''), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to delete selected inquiries'
      );
    }
  }

  async function handleMarkRead(id, isRead) {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setError('Please log in to perform this action');
        router.push('/admin/login');
        return;
      }
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL || ''}/api/inquiries/${id}`,
        { isRead },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setInquiries(inquiries.map((inq) => (inq._id === id ? { ...inq, isRead } : inq)));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to update inquiry status'
      );
    }
  }

  async function handleBulkMarkRead(isRead) {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setError('Please log in to perform this action');
        router.push('/admin/login');
        return;
      }
      await Promise.all(
        selectedInquiries.map((id) =>
          axios.patch(
            `${process.env.NEXT_PUBLIC_API_URL || ''}/api/inquiries/${id}`,
            { isRead },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          )
        )
      );
      setInquiries(
        inquiries.map((inq) =>
          selectedInquiries.includes(inq._id) ? { ...inq, isRead } : inq
        )
      );
      setSelectedInquiries([]);
      setShowSuccessModal(`Selected inquiries marked as ${isRead ? 'read' : 'unread'}`);
      setTimeout(() => setShowSuccessModal(''), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to update selected inquiries'
      );
    }
  }

  async function handleRespond(id, email) {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setError('Please log in to perform this action');
        router.push('/admin/login');
        return;
      }
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || ''}/api/inquiries/${id}/respond`,
        { responseMessage: responseText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setInquiries(
        inquiries.map((inq) => (inq._id === id ? { ...inq, responded: true } : inq))
      );
      setShowRespondModal(null);
      setResponseText('');
      setShowSuccessModal('Response sent successfully');
      setTimeout(() => setShowSuccessModal(''), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Failed to send response'
      );
    }
  }

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      (inq.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (inq.email?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (inq.message?.toLowerCase() || '').includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'responded'
        ? inq.responded
        : !inq.responded;
    return matchesSearch && matchesStatus;
  });

  const sortedInquiries = [...filteredInquiries].sort((a, b) => {
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  const indexOfLastInquiry = currentPage * inquiriesPerPage;
  const indexOfFirstInquiry = indexOfLastInquiry - inquiriesPerPage;
  const currentInquiries = sortedInquiries.slice(
    indexOfFirstInquiry,
    indexOfLastInquiry
  );

  return (
    <>
      <section className="py-14 max-w-5xl mx-auto px-2 sm:px-6 font-sans">
        <div className="flex items-center gap-3 mb-8">
          <span className="inline-block w-2 h-8 bg-[#f97316] rounded-full"></span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#f97316] tracking-tight">
            Manage Inquiries
          </h2>
        </div>
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
          <div className="relative w-full md:w-72">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 shadow-sm w-full focus:ring-2 focus:ring-[#f97316] focus:outline-none"
              placeholder="Search by name, email, or message..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search inquiries"
            />
          </div>
          <select
            className="rounded-lg border border-gray-200 px-4 py-2 shadow-sm focus:ring-2 focus:ring-[#f97316] focus:outline-none w-full md:w-48"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value="responded">Responded</option>
            <option value="unresponded">Unresponded</option>
          </select>
        </div>
        {/* Bulk Actions */}
        {selectedInquiries.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              className="px-6 py-2 bg-[#f97316] text-white rounded-xl font-semibold hover:bg-[#e86a15] transition-all duration-300 font-sans"
              onClick={() => handleBulkMarkRead(true)}
              aria-label="Mark selected inquiries as read"
            >
              Mark as Read
            </button>
            <button
              className="px-6 py-2 bg-[#f97316] text-white rounded-xl font-semibold hover:bg-[#e86a15] transition-all duration-300 font-sans"
              onClick={() => handleBulkMarkRead(false)}
              aria-label="Mark selected inquiries as unread"
            >
              Mark as Unread
            </button>
            <button
              className="px-6 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all duration-300 font-sans"
              onClick={() => setShowBulkDeleteModal(true)}
              aria-label="Delete selected inquiries"
            >
              Delete Selected
            </button>
          </div>
        )}
        {loading ? (
          <div className="flex justify-center py-16">
            <svg
              className="animate-spin h-12 w-12 text-[#f97316]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-label="Loading"
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
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
          </div>
        ) : error ? (
          <div
            className="flex justify-center py-10"
            aria-live="polite"
          >
            <span className="text-red-500 font-semibold">{error}</span>
          </div>
        ) : sortedInquiries.length === 0 ? (
          <div className="flex justify-center py-12">
            <span className="text-gray-400 text-lg">No inquiries found.</span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-2xl shadow-xl border border-[#f97316]/10 bg-white">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-[#f97316]">
                  <tr>
                    <th className="py-3 px-4 text-left text-white font-bold tracking-wide rounded-tl-2xl">
                      Select
                    </th>
                    <th className="py-3 px-4 text-left text-white font-bold tracking-wide">
                      Name
                    </th>
                    <th className="py-3 px-4 text-left text-white font-bold tracking-wide">
                      Email
                    </th>
                    <th className="py-3 px-4 text-left text-white font-bold tracking-wide">
                      Message
                    </th>
                    <th className="py-3 px-4 text-left text-white font-bold tracking-wide">
                      Date
                    </th>
                    <th className="py-3 px-4 text-left text-white font-bold tracking-wide">
                      Property
                    </th>
                    <th className="py-3 px-4 text-left text-white font-bold tracking-wide">
                      Status
                    </th>
                    <th className="py-3 px-4 text-left text-white font-bold tracking-wide rounded-tr-2xl">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentInquiries.map((inq) => {
                    const initials = (inq.name || 'NA')
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2);
                    let statusProps = {
                      color: 'bg-yellow-100 text-yellow-800',
                      icon: <ExclamationCircleIcon className="w-4 h-4 mr-1" />,
                      label: 'Unresponded',
                    };
                    if (inq.responded) {
                      statusProps = {
                        color: 'bg-green-100 text-green-800',
                        icon: <CheckCircleIcon className="w-4 h-4 mr-1" />,
                        label: 'Responded',
                      };
                    }
                    return (
                      <tr
                        key={inq._id}
                        className={`border-b border-gray-100 last:border-none hover:bg-[#f97316]/5 transition ${
                          inq.isRead ? 'opacity-80' : ''
                        }`}
                      >
                        <td className="py-4 px-6">
                          <input
                            type="checkbox"
                            checked={selectedInquiries.includes(inq._id)}
                            onChange={(e) =>
                              setSelectedInquiries(
                                e.target.checked
                                  ? [...selectedInquiries, inq._id]
                                  : selectedInquiries.filter((id) => id !== inq._id)
                              )
                            }
                            aria-label={`Select inquiry from ${inq.name || 'Anonymous'}`}
                          />
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="w-9 h-9 rounded-full bg-[#f97316]/90 text-white font-bold flex items-center justify-center text-base shadow-md">
                              {initials}
                            </span>
                            <span
                              className="font-semibold text-gray-900"
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(inq.name || 'N/A'),
                              }}
                            />
                          </div>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <EnvelopeIcon className="w-4 h-4 text-[#f97316]" />
                            {inq.email || 'N/A'}
                          </div>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <button
                            className="px-3 py-1 bg-[#f97316] text-white rounded-lg font-semibold hover:bg-[#e86a15] transition-all duration-300 font-sans text-sm"
                            onClick={() =>
                              setShowMessageModal({
                                name: inq.name,
                                message: inq.message,
                              })
                            }
                            aria-label={`View message from ${inq.name || 'Anonymous'}`}
                          >
                            View Message
                          </button>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <CalendarDaysIcon className="w-4 h-4 text-[#f97316]" />
                            {formatDate(inq.createdAt)}
                          </div>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          {inq.cardUrl ? (
                            <a
                              href={inq.cardUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-[#f97316] underline hover:text-[#e86a15] font-semibold"
                            >
                              <HomeModernIcon className="w-4 h-4" />
                              View Property
                            </a>
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${statusProps.color} gap-1`}
                          >
                            {statusProps.icon}
                            {statusProps.label}
                          </span>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button
                              className="p-2 text-[#f97316] hover:bg-[#f97316]/10 hover:text-[#e86a15] rounded-lg transition-all duration-200"
                              title="Respond to inquiry"
                              onClick={() =>
                                setShowRespondModal({
                                  id: inq._id,
                                  name: inq.name,
                                  email: inq.email,
                                  message: inq.message,
                                })
                              }
                              aria-label={`Respond to inquiry from ${inq.name || 'Anonymous'}`}
                            >
                              <EnvelopeIcon className="w-5 h-5" />
                            </button>
                            <button
                              className="p-2 text-red-500 hover:bg-red-500/10 hover:text-red-600 rounded-lg transition-all duration-200"
                              title="Delete inquiry"
                              onClick={() =>
                                setShowDeleteModal({
                                  id: inq._id,
                                  name: inq.name,
                                })
                              }
                              aria-label={`Delete inquiry from ${inq.name || 'Anonymous'}`}
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-6 py-2 bg-[#f97316] text-white rounded-xl font-semibold disabled:opacity-50 hover:bg-[#e86a15] transition-all duration-300 font-sans"
                aria-label="Previous page"
              >
                Previous
              </button>
              <span className="flex items-center text-gray-400 font-sans">
                Page {currentPage} of {Math.ceil(sortedInquiries.length / inquiriesPerPage)}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={indexOfLastInquiry >= sortedInquiries.length}
                className="px-6 py-2 bg-[#f97316] text-white rounded-xl font-semibold disabled:opacity-50 hover:bg-[#e86a15] transition-all duration-300 font-sans"
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          </>
        )}
      </section>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-40 absolute inset-0" aria-hidden="true"></div>
          <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-sm w-full flex flex-col items-center">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mb-4" aria-hidden="true" />
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Success!</h3>
            <p className="text-gray-700 text-center mb-6 font-sans">{showSuccessModal}</p>
            <button
              onClick={() => setShowSuccessModal('')}
              className="px-4 py-2 rounded bg-[#f97316] text-white hover:bg-[#e86a15] font-sans"
              aria-label="Close success modal"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Respond Modal */}
      {showRespondModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-40 absolute inset-0" aria-hidden="true"></div>
          <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-[#f97316] text-xl font-sans"
              onClick={() => setShowRespondModal(null)}
              aria-label="Close Respond Modal"
            >
              ×
            </button>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Respond to {showRespondModal.name || 'Inquiry'}
            </h3>
            <p
              className="text-gray-700 mb-4 font-sans whitespace-normal"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(showRespondModal.message || 'No message'),
              }}
            >
            </p>
            <textarea
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#f97316] transition-all duration-300 font-sans resize-none h-32"
              placeholder="Write your response..."
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              aria-label="Response text"
            ></textarea>
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 font-sans"
                onClick={() => setShowRespondModal(null)}
                aria-label="Cancel response"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-[#f97316] text-white hover:bg-[#e86a15] font-sans disabled:opacity-50"
                onClick={() => handleRespond(showRespondModal.id, showRespondModal.email)}
                disabled={!responseText}
                aria-label="Send response"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (Single) */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-40 absolute inset-0" aria-hidden="true"></div>
          <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-sm w-full flex flex-col items-center">
            <TrashIcon className="w-16 h-16 text-red-500 mb-4" aria-hidden="true" />
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Delete Inquiry</h3>
            <p className="text-gray-700 text-center mb-6 font-sans">
              Are you sure you want to delete this inquiry from{' '}
              {DOMPurify.sanitize(showDeleteModal.name || 'Anonymous')}?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 font-sans"
                onClick={() => setShowDeleteModal(null)}
                aria-label="Cancel deletion"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 font-sans"
                onClick={() => handleDelete(showDeleteModal.id)}
                aria-label="Confirm deletion"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-40 absolute inset-0" aria-hidden="true"></div>
          <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-sm w-full flex flex-col items-center">
            <TrashIcon className="w-16 h-16 text-red-500 mb-4" aria-hidden="true" />
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Delete Selected Inquiries
            </h3>
            <p className="text-gray-700 text-center mb-6 font-sans">
              Are you sure you want to delete {selectedInquiries.length} selected inquiries?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 font-sans"
                onClick={() => setShowBulkDeleteModal(false)}
                aria-label="Cancel bulk deletion"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 font-sans"
                onClick={handleBulkDelete}
                aria-label="Confirm bulk deletion"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-40 absolute inset-0" aria-hidden="true"></div>
          <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-[#f97316] text-xl font-sans"
              onClick={() => setShowMessageModal(null)}
              aria-label="Close Message Modal"
            >
              ×
            </button>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Inquiry Message from {DOMPurify.sanitize(showMessageModal.name || 'Anonymous')}
            </h3>
            <p
              className="text-gray-700 font-sans whitespace-normal max-h-96 overflow-y-auto"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(showMessageModal.message || 'No message'),
              }}
            />
            <div className="flex justify-end mt-6">
              <button
                className="px-4 py-2 rounded bg-[#f97316] text-white hover:bg-[#e86a15] font-sans"
                onClick={() => setShowMessageModal(null)}
                aria-label="Close message modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}