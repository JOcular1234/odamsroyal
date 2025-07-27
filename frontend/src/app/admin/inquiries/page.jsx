// frontend/src/app/admin/inquiries/page.jsx
"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { TrashIcon, EnvelopeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [currentPage, setCurrentPage] = useState(1);
  const [showRespondModal, setShowRespondModal] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(null); // For single delete
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false); // For bulk delete
  const [showMessageModal, setShowMessageModal] = useState(null); // For viewing message
  const [selectedInquiries, setSelectedInquiries] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const inquiriesPerPage = 10;

  useEffect(() => {
    fetchInquiries();
  }, []);

  async function fetchInquiries() {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`/api/inquiries`, {
        withCredentials: true,
      });
      setInquiries(res.data);
    } catch (err) {
      setError('Failed to fetch inquiries');
    }
    setLoading(false);
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/inquiries/${id}`, {
        withCredentials: true,
      });
      setInquiries(inquiries.filter((inq) => inq._id !== id));
      setShowDeleteModal(null);
      setShowSuccessModal('Inquiry deleted successfully');
      setTimeout(() => setShowSuccessModal(''), 2000);
    } catch (err) {
      setError('Failed to delete inquiry');
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedInquiries.map((id) =>
          axios.delete(`/api/inquiries/${id}`, { withCredentials: true })
        )
      );
      setInquiries(inquiries.filter((inq) => !selectedInquiries.includes(inq._id)));
      setSelectedInquiries([]);
      setShowBulkDeleteModal(false);
      setShowSuccessModal('Selected inquiries deleted successfully');
      setTimeout(() => setShowSuccessModal(''), 2000);
    } catch (err) {
      setError('Failed to delete selected inquiries');
    }
  };

  const handleMarkRead = async (id, isRead) => {
    try {
      await axios.patch(
        `/api/inquiries/${id}`,
        { isRead },
        { withCredentials: true }
      );
      setInquiries(inquiries.map((inq) => (inq._id === id ? { ...inq, isRead } : inq)));
    } catch (err) {
      setError('Failed to update inquiry status');
    }
  };

  const handleBulkMarkRead = async (isRead) => {
    try {
      await Promise.all(
        selectedInquiries.map((id) =>
          axios.patch(`/api/inquiries/${id}`, { isRead }, { withCredentials: true })
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
      setError('Failed to update selected inquiries');
    }
  };

  const handleRespond = async (id, email) => {
    try {
      await axios.post(
        `/api/inquiries/${id}/respond`,
        { responseMessage: responseText },
        { withCredentials: true }
      );
      setInquiries(
        inquiries.map((inq) => (inq._id === id ? { ...inq, responded: true } : inq))
      );
      setShowRespondModal(null);
      setResponseText('');
      setShowSuccessModal('Response sent successfully');
      setTimeout(() => setShowSuccessModal(''), 2000);
    } catch (err) {
      setError('Failed to send response');
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.message?.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesDate = true;
    if (startDate) {
      matchesDate = matchesDate && new Date(inq.createdAt) >= new Date(startDate + 'T00:00:00');
    }
    if (endDate) {
      matchesDate = matchesDate && new Date(inq.createdAt) <= new Date(endDate + 'T23:59:59');
    }
    return matchesSearch && matchesDate;
  });

  const sortedInquiries = [...filteredInquiries].sort((a, b) => {
    if (sortBy === 'name') return a.name?.localeCompare(b.name || '');
    if (sortBy === 'email') return a.email?.localeCompare(b.email || '');
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const indexOfLastInquiry = currentPage * inquiriesPerPage;
  const indexOfFirstInquiry = indexOfLastInquiry - inquiriesPerPage;
  const currentInquiries = sortedInquiries.slice(indexOfFirstInquiry, indexOfLastInquiry);

  return (
    <>
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-40 absolute inset-0" aria-hidden="true"></div>
          <div className="relative bg-card rounded-xl shadow-card px-8 py-10 max-w-sm w-full flex flex-col items-center transform transition-all duration-300 scale-100">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mb-4" aria-hidden="true" />
            <h3 className="text-2xl font-bold text-primary mb-2 font-sans">Success!</h3>
            <p className="text-neutral text-center mb-6 font-sans">{showSuccessModal}</p>
            <button
              onClick={() => setShowSuccessModal('')}
              className="px-6 py-2 bg-button text-white rounded-xl font-semibold hover:bg-accent focus:outline-none focus:ring-2 focus:ring-button focus:ring-offset-2 transition-all duration-300 font-sans"
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
          <div className="relative bg-card rounded-xl shadow-card px-8 py-8 max-w-lg w-full">
            <button
              className="absolute top-4 right-4 text-neutral hover:text-primary text-xl focus:outline-none focus:ring-2 focus:ring-button focus:ring-offset-1 font-sans"
              onClick={() => setShowRespondModal(null)}
              aria-label="Close Respond Modal"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold text-primary mb-4 font-sans">
              Respond to {showRespondModal.name || 'Inquiry'}
            </h3>
            <p className="text-neutral mb-4 font-sans whitespace-normal">
              <strong>Inquiry:</strong> {showRespondModal.message || 'No message'}
            </p>
            <textarea
              className="w-full px-4 py-3 border border-border rounded-xl text-sm text-neutral focus:outline-none focus:ring-2 focus:ring-button transition-all duration-300 font-sans resize-none h-32"
              placeholder="Write your response..."
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
            ></textarea>
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-6 py-2 bg-neutral text-white rounded-xl font-semibold hover:bg-accent-dark transition-all duration-300 font-sans"
                onClick={() => setShowRespondModal(null)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 bg-button text-white rounded-xl font-semibold hover:bg-accent focus:outline-none focus:ring-2 focus:ring-button focus:ring-offset-2 transition-all duration-300 font-sans disabled:opacity-50"
                onClick={() => handleRespond(showRespondModal.id, showRespondModal.email)}
                disabled={!responseText}
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
          <div className="relative bg-card rounded-xl shadow-card px-8 py-8 max-w-sm w-full flex flex-col items-center">
            <TrashIcon className="w-16 h-16 text-error mb-4" aria-hidden="true" />
            <h3 className="text-2xl font-bold text-primary mb-2 font-sans">Delete Inquiry</h3>
            <p className="text-neutral text-center mb-6 font-sans">
              Are you sure you want to delete this inquiry from {showDeleteModal.name || 'Anonymous'}?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-6 py-2 bg-neutral text-white rounded-xl font-semibold hover:bg-accent-dark transition-all duration-300 font-sans"
                onClick={() => setShowDeleteModal(null)}
                aria-label="Cancel deletion"
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 bg-error text-white rounded-xl bg-red-500 hover:bg-red-400 font-semibold hover:bg-error/80 transition-all duration-300 font-sans"
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
          <div className="relative bg-card rounded-xl shadow-card px-8 py-8 max-w-sm w-full flex flex-col items-center">
            <TrashIcon className="w-16 h-16 text-error mb-4" aria-hidden="true" />
            <h3 className="text-2xl font-bold text-primary mb-2 font-sans">Delete Selected Inquiries</h3>
            <p className="text-neutral text-center mb-6 font-sans">
              Are you sure you want to delete {selectedInquiries.length} selected inquiries?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-6 py-2 bg-neutral text-white rounded-xl font-semibold hover:bg-accent-dark transition-all duration-300 font-sans"
                onClick={() => setShowBulkDeleteModal(false)}
                aria-label="Cancel bulk deletion"
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 bg-error text-white rounded-xl bg-red-500 hover:bg-red-400 font-semibold hover:bg-error/80 transition-all duration-300 font-sans"
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
          <div className="relative bg-card rounded-xl shadow-card px-8 py-8 max-w-lg w-full">
            <button
              className="absolute top-4 right-4 text-neutral hover:text-primary text-xl focus:outline-none focus:ring-2 focus:ring-button focus:ring-offset-1 font-sans"
              onClick={() => setShowMessageModal(null)}
              aria-label="Close Message Modal"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold text-primary mb-4 font-sans">
              Inquiry Message from {showMessageModal.name || 'Anonymous'}
            </h3>
            <p className="text-neutral font-sans whitespace-normal max-h-96 overflow-y-auto">
              {showMessageModal.message || 'No message'}
            </p>
            <div className="flex justify-end mt-6">
              <button
                className="px-6 py-2 bg-button text-white rounded-xl font-semibold hover:bg-accent focus:outline-none focus:ring-2 focus:ring-button focus:ring-offset-2 transition-all duration-300 font-sans"
                onClick={() => setShowMessageModal(null)}
                aria-label="Close message modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-primary text-center mb-10 tracking-tight font-sans">
            Manage Inquiries
          </h2>

          {/* Search and Sort */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-card rounded-xl shadow-card p-6">
            <input
              type="text"
              placeholder="Search by name, email, or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 border border-border rounded-xl text-sm text-neutral focus:outline-none focus:ring-2 focus:ring-button transition-all duration-300 bg-background font-sans"
              aria-label="Search inquiries"
            />
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="px-4 py-3 border border-border rounded-xl text-sm text-neutral focus:outline-none focus:ring-2 focus:ring-button transition-all duration-300 bg-background font-sans w-full sm:w-48"
              aria-label="Start date"
            />
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="px-4 py-3 border border-border rounded-xl text-sm text-neutral focus:outline-none focus:ring-2 focus:ring-button transition-all duration-300 bg-background font-sans w-full sm:w-48"
              aria-label="End date"
            />
            <select
              className="px-4 py-3 border border-border rounded-xl text-sm text-neutral focus:outline-none focus:ring-2 focus:ring-button transition-all duration-300 bg-background font-sans w-full sm:w-48"
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort inquiries"
            >
              <option value="name">Sort by Name</option>
              <option value="email">Sort by Email</option>
              <option value="createdAt">Sort by Date</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedInquiries.length > 0 && (
            <div className="flex flex-wrap gap-4 mb-8">
              <button
                className="px-6 py-2 bg-button text-white rounded-xl font-semibold hover:bg-accent transition-all duration-300 font-sans"
                onClick={() => handleBulkMarkRead(true)}
                aria-label="Mark selected inquiries as read"
              >
                Mark as Read
              </button>
              <button
                className="px-6 py-2 bg-button text-white rounded-xl font-semibold hover:bg-accent transition-all duration-300 font-sans"
                onClick={() => handleBulkMarkRead(false)}
                aria-label="Mark selected inquiries as unread"
              >
                Mark as Unread
              </button>
              <button
                className="px-6 py-2 bg-error text-white rounded-xl bg-red-500 hover:bg-red-400 font-semibold hover:bg-error/80 transition-all duration-300 font-sans"
                onClick={() => setShowBulkDeleteModal(true)}
                aria-label="Delete selected inquiries"
              >
                Delete Selected
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <svg
                className="animate-spin h-12 w-12 text-button"
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
              className="bg-error/10 border-l-4 border-error text-error p-6 rounded-xl text-center font-sans text-lg"
              aria-live="polite"
            >
              {error}
            </div>
          ) : inquiries.length === 0 ? (
            <p className="text-center text-neutral text-lg font-medium font-sans py-16">
              No inquiries found.
            </p>
          ) : (
            <>
              <div className="bg-card rounded-xl shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-primary text-white">
                        <th className="py-4 px-6 text-left text-sm font-semibold tracking-wide font-sans w-12">
                          <input
                            type="checkbox"
                            checked={selectedInquiries.length === currentInquiries.length}
                            onChange={(e) =>
                              setSelectedInquiries(
                                e.target.checked ? currentInquiries.map((inq) => inq._id) : []
                              )
                            }
                            aria-label="Select all inquiries"
                          />
                        </th>
                        <th className="py-4 px-6 text-left text-sm font-semibold tracking-wide font-sans w-32">
                          Name
                        </th>
                        <th className="py-4 px-6 text-left text-sm font-semibold tracking-wide font-sans w-48">
                          Email
                        </th>
                        <th className="py-4 px-6 text-left text-sm font-semibold tracking-wide font-sans w-32">
                          Message
                        </th>
                        <th className="py-4 px-6 text-left text-sm font-semibold tracking-wide font-sans w-40">
                          Date
                        </th>
                        <th className="py-4 px-6 text-left text-sm font-semibold tracking-wide font-sans w-40">
                          Property
                        </th>
                        <th className="py-4 px-6 text-left text-sm font-semibold tracking-wide font-sans w-28">
                          Status
                        </th>
                        <th className="py-4 px-6 text-left text-sm font-semibold tracking-wide font-sans w-28">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentInquiries.map((inq) => (
                        <tr
                          key={inq._id}
                          className={`border-b border-border last:border-none hover:bg-background transition-all duration-200 ${
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
                          <td className="py-4 px-6 font-semibold text-primary font-sans">
                            {inq.name || 'N/A'}
                          </td>
                          <td className="py-4 px-6 text-neutral font-sans">
                            {inq.email || 'N/A'}
                          </td>
                          <td className="py-4 px-6 text-neutral font-sans">
                            <button
                              className="px-3 py-1 bg-button text-white rounded-lg font-semibold hover:bg-accent transition-all duration-300 font-sans text-sm"
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
                          <td className="py-4 px-6 text-neutral font-sans">
                            {inq.createdAt
                              ? new Date(inq.createdAt).toLocaleString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : 'N/A'}
                          </td>
                          <td className="py-4 px-6 text-neutral font-sans">
                            {inq.cardUrl ? (
                              <a href={inq.cardUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-accent font-semibold">
                                View Property
                              </a>
                            ) : 'N/A'}
                          </td>
                          <td className="py-4 px-6 text-center">
  {inq.responded ? (
    <span
      title="Responded"
      style={{
        display: 'inline-block',
        background: 'red',
        color: 'white',
        borderRadius: '50%',
        width: '1.2em',
        height: '1.2em',
        lineHeight: '1.2em',
        fontWeight: 'bold',
        fontSize: '1em',
        boxShadow: '0 0 8px 2px #f87171',
        verticalAlign: 'middle',
      }}
    >
      ✓
    </span>
  ) : (
    <span
      title="Not responded"
      style={{
        display: 'inline-block',
        border: '2px solid #bbb',
        borderRadius: '50%',
        width: '1.2em',
        height: '1.2em',
        lineHeight: '1.2em',
        fontWeight: 'bold',
        fontSize: '1em',
        color: '#bbb',
        verticalAlign: 'middle',
      }}
    >
      &nbsp;
    </span>
  )}
</td>
                          <td className="py-4 px-6 flex gap-2">
                            <button
                              className="p-2 text-button hover:bg-button hover:text-white rounded-lg transition-all duration-200"
                              title="Respond to inquiry"
                              onClick={() =>
                                setShowRespondModal({
                                  id: inq._id,
                                  name: inq.name,
                                  email: inq.email,
                                  message: inq.message,
                                })
                              }
                            >
                              <EnvelopeIcon className="w-5 h-5" />
                            </button>
                            <button
                              className="p-2 text-error hover:bg-error  hover:text-red-600 hover:border-red-600 rounded-lg transition-all duration-200"
                              title="Delete inquiry"
                              onClick={() =>
                                setShowDeleteModal({
                                  id: inq._id,
                                  name: inq.name,
                                })
                              }
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-6 py-2 bg-button text-white rounded-xl font-semibold disabled:opacity-50 hover:bg-accent transition-all duration-300 font-sans"
                  aria-label="Previous page"
                >
                  Previous
                </button>
                <span className="flex items-center text-neutral font-sans">
                  Page {currentPage} of {Math.ceil(sortedInquiries.length / inquiriesPerPage)}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={indexOfLastInquiry >= sortedInquiries.length}
                  className="px-6 py-2 bg-button text-white rounded-xl font-semibold disabled:opacity-50 hover:bg-accent transition-all duration-300 font-sans"
                  aria-label="Next page"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

