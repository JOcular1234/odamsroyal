// frontend/src/app/admin/profile/page.jsx
'use client';
import { useEffect, useState, useRef } from 'react';
import adminAuth from '../../../utils/adminAuth';
import {
  UserCircleIcon,
  ShieldCheckIcon,
  PencilIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import useAdminAuth from '@/hooks/useAdminAuth';
import { useRouter } from 'next/navigation';

export default function AdminProfile() {
  const [profile, setProfile] = useState({
    username: '',
    role: '',
    createdAt: '',
    lastLogin: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ username: '', password: '' });
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const editModalRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  // Focus management for edit modal
  useEffect(() => {
    if (isEditing && editModalRef.current) {
      editModalRef.current.focus();
    }
  }, [isEditing]);

  // Fetch profile data
  async function fetchProfile() {
    setLoading(true);
    setError('');
    try {
      // Try localStorage first
      const username = localStorage.getItem('admin_username') || '';
      const role = localStorage.getItem('admin_role') || '';
      setProfile((p) => ({ ...p, username: username || 'Unknown', role: role || 'Unknown' }));

      // Attempt to fetch from API
      const res = await adminAuth.makeAuthenticatedRequest('/admin/profile', {
        method: 'GET',
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Failed to fetch profile: ${res.status} ${res.statusText} ${text}`);
      }
      const data = await res.json();
      setProfile({
        username: data.username || 'Unknown',
        role: data.role || 'Unknown',
        createdAt: data.createdAt ? new Date(data.createdAt).toLocaleDateString() : '',
        lastLogin: data.lastLogin ? new Date(data.lastLogin).toLocaleString() : '',
      });
      // Update localStorage to ensure consistency
      localStorage.setItem('admin_username', data.username || '');
      localStorage.setItem('admin_role', data.role || '');
    } catch (err) {
      console.error('Fetch profile error:', err);
      if (err.message === 'Authentication failed') {
        router.push('/admin/login');
      } else {
        setError(err.message || 'Failed to fetch profile');
      }
    } finally {
      setLoading(false);
    }
  }

  // Handle edit form submission
  async function handleEditProfile(e) {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');
    try {
      if (!editForm.username) {
        setFormError('Username is required');
        return;
      }
      const res = await adminAuth.makeAuthenticatedRequest('/admin/profile', {
        method: 'PUT',
        body: JSON.stringify({
          username: editForm.username,
          password: editForm.password || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to update profile');
      }
      setIsEditing(false);
      setEditForm({ username: '', password: '' });
      localStorage.setItem('admin_username', editForm.username);
      await fetchProfile();
      setSuccessMessage('Profile updated successfully');
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (err) {
      if (err.message === 'Authentication failed') {
        router.push('/admin/login');
      } else {
        setFormError(err.message || 'Failed to update profile');
      }
    }
  }

  // Initialize edit form with current profile data
  const startEditing = () => {
    setEditForm({ username: profile.username, password: '' });
    setIsEditing(true);
  };

  // Edit Profile Modal
  const renderEditModal = () => (
    isEditing && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div
          ref={editModalRef}
          className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full"
          tabIndex={-1}
          aria-modal="true"
          role="dialog"
          aria-labelledby="edit-profile-modal-title"
        >
          <h3
            id="edit-profile-modal-title"
            className="text-lg font-semibold mb-4 text-gray-900"
          >
            Edit Profile
          </h3>
          <form onSubmit={handleEditProfile} className="space-y-4">
            <div>
              <label
                htmlFor="edit-username"
                className="block text-sm font-semibold text-gray-900 mb-1"
              >
                Username
              </label>
              <div className="relative">
                <UserCircleIcon className="w-5 h-5 text-[#f97316] absolute left-3 top-2.5 pointer-events-none" />
                <input
                  id="edit-username"
                  type="text"
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    formError.includes('Username') ? 'border-red-500' : 'border-gray-200'
                  } shadow-sm focus:ring-2 focus:ring-[#f97316] focus:outline-none`}
                  value={editForm.username}
                  onChange={(e) =>
                    setEditForm({ ...editForm, username: e.target.value })
                  }
                  required
                  aria-label="Edit username"
                  aria-describedby={
                    formError.includes('Username') ? 'edit-username-error' : undefined
                  }
                />
              </div>
              {formError.includes('Username') && (
                <p
                  id="edit-username-error"
                  className="text-red-500 text-xs mt-1"
                  aria-live="polite"
                >
                  {formError}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="edit-password"
                className="block text-sm font-semibold text-gray-900 mb-1"
              >
                New Password (optional)
              </label>
              <div className="relative">
                <ShieldCheckIcon className="w-5 h-5 text-[#f97316] absolute left-3 top-2.5 pointer-events-none" />
                <input
                  id="edit-password"
                  type="password"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-[#f97316] focus:outline-none"
                  value={editForm.password}
                  onChange={(e) =>
                    setEditForm({ ...editForm, password: e.target.value })
                  }
                  aria-label="New password"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                onClick={() => setIsEditing(false)}
                aria-label="Cancel editing profile"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-[#f97316] text-white hover:bg-[#e56b15] font-semibold transition"
                aria-label="Save profile changes"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );

  // Success Modal
  const renderSuccessModal = () => (
    successMessage && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div
          className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full flex flex-col items-center"
          tabIndex={-1}
          aria-modal="true"
          role="dialog"
          aria-labelledby="success-modal-title"
        >
          <CheckCircleIcon className="w-16 h-16 text-green-500 mb-4" aria-hidden="true" />
          <h3
            id="success-modal-title"
            className="text-lg font-semibold mb-4 text-gray-900"
          >
            Success!
          </h3>
          <p className="text-gray-700 text-center mb-6">{successMessage}</p>
          <button
            onClick={() => setSuccessMessage('')}
            className="px-4 py-2 rounded bg-[#f97316] text-white hover:bg-[#e56b15] font-semibold"
            aria-label="Close success modal"
          >
            Close
          </button>
        </div>
      </div>
    )
  );

  return (
    <section className="py-14 max-w-5xl mx-auto px-2 sm:px-6 font-sans">
      {renderEditModal()}
      {renderSuccessModal()}
      <div className="flex items-center gap-3 mb-8">
        <span className="inline-block w-2 h-8 bg-[#f97316] rounded-full"></span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#f97316] tracking-tight">
          Admin Profile
        </h2>
        <button
          onClick={startEditing}
          className="ml-auto px-4 py-2 rounded-lg bg-[#f97316] text-white font-semibold hover:bg-[#e56b15] transition focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2"
          aria-label="Edit profile"
        >
          <PencilIcon className="w-5 h-5 inline-block mr-2" />
          Edit Profile
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <span className="text-gray-400 text-lg">Loading profile...</span>
        </div>
      ) : error ? (
        <div className="flex justify-center py-10">
          <span className="text-red-500 font-semibold">{error}</span>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl border border-[#f97316]/10 p-8">
          <div className="flex flex-col items-center mb-6">
            <UserCircleIcon className="w-24 h-24 text-[#f97316] mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {profile.username}
            </h2>
            <span className="text-sm font-medium text-gray-500 mb-2 capitalize">
              {profile.role}
            </span>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCircleIcon className="w-5 h-5 text-[#f97316]" />
                <span className="text-gray-600 font-medium">Username:</span>
              </div>
              <span className="font-semibold text-gray-900">{profile.username}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5 text-[#f97316]" />
                <span className="text-gray-600 font-medium">Role:</span>
              </div>
              <span className="font-semibold text-gray-900 capitalize">
                {profile.role}
              </span>
            </div>
            {profile.createdAt && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XMarkIcon className="w-5 h-5 text-[#f97316]" />
                  <span className="text-gray-600 font-medium">Created:</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {profile.createdAt}
                </span>
              </div>
            )}
            {profile.lastLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XMarkIcon className="w-5 h-5 text-[#f97316]" />
                  <span className="text-gray-600 font-medium">Last Login:</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {profile.lastLogin}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}