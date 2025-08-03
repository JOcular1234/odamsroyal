// frontend/src/app/admin/staff/page.jsx
'use client';
import { useEffect, useState, useRef } from 'react';

import adminAuth from '../../../utils/adminAuth';
import {
  UserCircleIcon,
  MagnifyingGlassIcon,
  LockClosedIcon,
  TrashIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

export default function StaffManagement() {

  const [staff, setStaff] = useState([]);
  const [staffLoading, setStaffLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', role: 'staff' });
  const [formError, setFormError] = useState('');
  const [adding, setAdding] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [search, setSearch] = useState('');
  const deleteModalRef = useRef(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  // Focus management for delete modal
  useEffect(() => {
    if (showDeleteModal && deleteModalRef.current) {
      deleteModalRef.current.focus();
    }
  }, [showDeleteModal]);

  async function fetchStaff() {
    setStaffLoading(true);
    setError('');
    try {
      const res = await adminAuth.makeAuthenticatedRequest('/admin/list', { method: 'GET' });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        console.error('Failed to fetch staff:', res.status, res.statusText, text);
        throw new Error(`Failed to fetch staff: ${res.status} ${res.statusText} ${text}`);
      }
      const data = await res.json();
      setStaff(data.users.filter((u) => u.role === 'staff'));
    } catch (err) {
      console.error('Fetch staff error (catch):', err);
      setError(err.message || 'Failed to fetch staff');
    }
    setStaffLoading(false);
  }

  async function handleAddStaff(e) {
    e.preventDefault();
    setFormError('');
    setAdding(true);
    try {
      if (!form.username || !form.password) {
        setFormError('Username and password required');
        setAdding(false);
        return;
      }
      const res = await adminAuth.makeAuthenticatedRequest('/admin/create', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setFormError(data.message || 'Failed to add staff');
      } else {
        setShowAdd(false);
        setForm({ username: '', password: '', role: 'staff' });
        fetchStaff();
      }
    } catch (err) {
      setFormError(err.message || 'Failed to add staff');
    }
    setAdding(false);
  }

  async function handleDeleteStaff(id) {
    try {
      const res = await adminAuth.makeAuthenticatedRequest(`/admin/delete/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete staff');
      fetchStaff();
      setShowDeleteModal(false);
      setStaffToDelete(null);
    } catch (err) {
      alert(err.message || 'Failed to delete staff');
      setShowDeleteModal(false);
      setStaffToDelete(null);
    }
  }

  // Filter staff based on search
  const filteredStaff = staff.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="py-14 max-w-5xl mx-auto px-2 sm:px-6 font-sans">
      <div className="flex items-center gap-3 mb-8">
        <span className="inline-block w-2 h-8 bg-[#f97316] rounded-full"></span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#f97316] tracking-tight">
          Staff Management
        </h2>
        <button
          className="ml-auto px-4 py-2 rounded-lg bg-[#f97316] text-white font-semibold hover:bg-[#e56b15] transition focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2"
          onClick={() => setShowAdd((v) => !v)}
          aria-label={showAdd ? 'Cancel adding staff' : 'Add new staff'}
        >
          {showAdd ? 'Cancel' : 'Add Staff'}
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
        <div className="relative w-full md:w-72">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 shadow-sm w-full focus:ring-2 focus:ring-[#f97316] focus:outline-none"
            placeholder="Search by username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search staff by username"
          />
        </div>
      </div>

      {/* Add Staff Form */}
      {showAdd && (
        <form
          onSubmit={handleAddStaff}
          className="mb-8 bg-white p-6 rounded-2xl shadow-xl border border-[#f97316]/10 flex flex-col gap-4"
        >
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-semibold text-gray-900 mb-1"
            >
              Username
            </label>
            <div className="relative">
              <UserCircleIcon className="w-5 h-5 text-[#f97316] absolute left-3 top-2.5 pointer-events-none" />
              <input
                id="username"
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  formError.includes('Username') ? 'border-red-500' : 'border-gray-200'
                } shadow-sm focus:ring-2 focus:ring-[#f97316] focus:outline-none`}
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
                aria-label="Staff username"
                aria-describedby={formError.includes('Username') ? 'username-error' : undefined}
              />
            </div>
            {formError.includes('Username') && (
              <p id="username-error" className="text-red-500 text-xs mt-1" aria-live="polite">
                {formError}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-900 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <LockClosedIcon className="w-5 h-5 text-[#f97316] absolute left-3 top-2.5 pointer-events-none" />
              <input
                id="password"
                type="password"
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  formError.includes('password') ? 'border-red-500' : 'border-gray-200'
                } shadow-sm focus:ring-2 focus:ring-[#f97316] focus:outline-none`}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                aria-label="Staff password"
                aria-describedby={formError.includes('password') ? 'password-error' : undefined}
              />
            </div>
            {formError.includes('password') && (
              <p id="password-error" className="text-red-500 text-xs mt-1" aria-live="polite">
                {formError}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-[#f97316] text-white font-semibold hover:bg-[#e56b15] transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2"
            disabled={adding}
            aria-label="Add staff member"
          >
            {adding ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Adding...
              </span>
            ) : (
              'Add Staff'
            )}
          </button>
          {formError && (
            <div
              className="bg-red-100 border-l-4 border-red-500 text-red-500 p-4 rounded-lg"
              aria-live="polite"
            >
              {formError}
            </div>
          )}
        </form>
      )}

      {/* Staff Table */}
      {loading ? (
        <div className="flex justify-center py-16">
          <span className="text-gray-400 text-lg">Loading staff...</span>
        </div>
      ) : error ? (
        <div className="flex justify-center py-10">
          <span className="text-red-500 font-semibold">{error}</span>
        </div>
      ) : filteredStaff.length === 0 ? (
        <div className="flex justify-center py-12">
          <span className="text-gray-400 text-lg">No staff users found.</span>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl shadow-xl border border-[#f97316]/10 bg-white">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-[#f97316]">
              <tr>
                <th className="py-3 px-4 text-left text-white font-bold tracking-wide rounded-tl-2xl">
                  Username
                </th>
                <th className="py-3 px-4 text-left text-white font-bold tracking-wide">Role</th>
                <th className="py-3 px-4 text-left text-white font-bold tracking-wide rounded-tr-2xl">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((user) => (
                <tr
                  key={user._id}
                  className="border-b last:border-none hover:bg-[#f97316]/5 transition"
                >
                  <td className="py-2 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <UserCircleIcon className="w-5 h-5 text-[#f97316]" />
                      <span className="font-semibold text-gray-900">{user.username}</span>
                    </div>
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap">
                    <button
                      className="px-3 py-1 rounded bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition"
                      onClick={() => {
                        setShowDeleteModal(true);
                        setStaffToDelete(user);
                      }}
                      aria-label={`Delete staff member ${user.username}`}
                    >
                      <TrashIcon className="w-4 h-4 inline-block mr-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && staffToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div
            ref={deleteModalRef}
            className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full"
            tabIndex={-1}
            aria-modal="true"
            role="dialog"
            aria-labelledby="delete-modal-title"
          >
            <h3
              id="delete-modal-title"
              className="text-lg font-semibold mb-4 text-gray-900"
            >
              Delete Staff
            </h3>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete{' '}
              <span className="font-semibold">{staffToDelete.username}</span>? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                onClick={() => {
                  setShowDeleteModal(false);
                  setStaffToDelete(null);
                }}
                aria-label="Cancel deletion"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
                onClick={() => handleDeleteStaff(staffToDelete._id)}
                aria-label={`Confirm deletion of ${staffToDelete.username}`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}