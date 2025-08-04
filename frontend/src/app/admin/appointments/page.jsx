// frontend/src/app/admin/appointments/page.jsx
"use client";
// moved from appointments.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarDaysIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon
} from './AdminAppointmentsIcons';
import useAdminAuth from '@/hooks/useAdminAuth';

export default function AdminAppointments() {
  const [role, setRole] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRole(localStorage.getItem('admin_role') || '');
    }
  }, []);
  const [showNoteModal, setShowNoteModal] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState('');
  const [modal, setModal] = useState({ open: false, action: '', id: null });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { isChecking } = useAdminAuth();

  useEffect(() => {
    if (isChecking) return;
    fetchAppointments();
  }, [isChecking]);

  async function fetchAppointments() {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('admin_token');
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'https://odamsroyal.onrender.com/api';
      const res = await axios.get(`${API_URL}/appointments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setAppointments(res.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('You must be logged in as admin to view appointments.');
      } else {
        setError('Failed to fetch appointments');
      }
    }
    setLoading(false);
  }

  async function updateStatus(id, status) {
    setUpdating(id + status);
    try {
      const token = localStorage.getItem('admin_token');
      await axios.patch(`/api/admin/appointments/${id}`, { status }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      fetchAppointments();
    } catch (err) {
      alert('Failed to update status');
    }
    setUpdating('');
    setModal({ open: false, action: '', id: null });
  }

  // Filter and search logic
  const filteredAppointments = appointments.filter(a => {
    const matchesSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.phone.toLowerCase().includes(search.toLowerCase()) ||
      a.service.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-14 max-w-5xl mx-auto px-2 sm:px-6 font-sans">
      <div className="flex items-center gap-3 mb-8">
        <span className="inline-block w-2 h-8 bg-[#f97316] rounded-full"></span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#f97316] tracking-tight">Manage Appointments</h2>
      </div>
      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
        <div className="relative w-full md:w-72">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 shadow-sm w-full focus:ring-2 focus:ring-[#f97316] focus:outline-none"
            placeholder="Search by name, email, phone, service..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="rounded-lg border border-gray-200 px-4 py-2 shadow-sm focus:ring-2 focus:ring-[#f97316] focus:outline-none w-full md:w-48"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      {loading ? (
        <div className="flex justify-center py-16"><span className="text-gray-400 text-lg">Loading...</span></div>
      ) : error ? (
        <div className="flex justify-center py-10"><span className="text-red-500 font-semibold">{error}</span></div>
      ) : filteredAppointments.length === 0 ? (
        <div className="flex justify-center py-12"><span className="text-gray-400 text-lg">No appointments found.</span></div>
      ) : (
        <div className="overflow-x-auto rounded-2xl shadow-xl border border-[#f97316]/10 bg-white">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-[#f97316]">
              <tr>
                <th className="py-3 px-4 text-left text-white font-bold tracking-wide rounded-tl-2xl">Name</th>
                <th className="py-3 px-4 text-left text-white font-bold tracking-wide">Email</th>
                <th className="py-3 px-4 text-left text-white font-bold tracking-wide">Phone</th>
                <th className="py-3 px-4 text-left text-white font-bold tracking-wide">Service</th>
                <th className="py-3 px-4 text-left text-white font-bold tracking-wide">Appoint. Date</th>
                <th className="py-3 px-4 text-left text-white font-bold tracking-wide">Time</th>
                <th className="py-3 px-4 text-left text-white font-bold tracking-wide">Note</th>
                <th className="py-3 px-4 text-left text-white font-bold tracking-wide">Booked At</th>
                <th className="py-3 px-4 text-left text-white font-bold tracking-wide">Status</th>
                <th className="py-3 px-4 text-left text-white font-bold tracking-wide rounded-tr-2xl">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((a) => {
                // Avatar initials
                const initials = a.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2);
                // Status badge
                let statusProps = {
                  color: 'bg-yellow-100 text-yellow-800',
                  icon: <ExclamationCircleIcon className="w-4 h-4 mr-1" />,
                  label: 'Pending'
                };
                if (a.status === 'approved') {
                  statusProps = {
                    color: 'bg-green-100 text-green-800',
                    icon: <CheckCircleIcon className="w-4 h-4 mr-1" />,
                    label: 'Approved'
                  };
                } else if (a.status === 'rejected') {
                  statusProps = {
                    color: 'bg-red-100 text-red-800',
                    icon: <XCircleIcon className="w-4 h-4 mr-1" />,
                    label: 'Rejected'
                  };
                }
                return (
                  <tr key={a._id} className="border-b last:border-none hover:bg-[#f97316]/5 transition">
                    {/* Avatar + Name */}
                    <td className="py-2 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="w-9 h-9 rounded-full bg-[#f97316]/90 text-white font-bold flex items-center justify-center text-base shadow-md">
                          {initials}
                        </span>
                        <span className="font-semibold text-gray-900">{a.name}</span>
                      </div>
                    </td>
                    <td className="py-2 px-4 whitespace-nowrap"><div className="flex items-center gap-1"><EnvelopeIcon className="w-4 h-4 text-[#f97316]" />{a.email}</div></td>
                    <td className="py-2 px-4 whitespace-nowrap"><div className="flex items-center gap-1"><PhoneIcon className="w-4 h-4 text-[#f97316]" />{a.phone}</div></td>
                    <td className="py-2 px-4 whitespace-nowrap">{a.service}</td>
                    <td className="py-2 px-4 whitespace-nowrap"><div className="flex items-center gap-1"><CalendarDaysIcon className="w-4 h-4 text-[#f97316]" />{new Date(a.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div></td>
                    <td className="py-2 px-4 whitespace-nowrap"><div className="flex items-center gap-1"><ClockIcon className="w-4 h-4 text-[#f97316]" />{a.time}</div></td>
                    <td className="py-2 px-4 whitespace-nowrap">
  {a.note ? (
    <button
      className="px-3 py-1 bg-[#f97316] text-white rounded-lg font-semibold hover:bg-[#e86a15] transition-all duration-300 font-sans text-sm"
      onClick={() => setShowNoteModal({ name: a.name, note: a.note })}
      aria-label={`View note from ${a.name || 'Anonymous'}`}
    >
      View Note
    </button>
  ) : (
    <span className="text-gray-400">-</span>
  )}
</td>
                    <td className="py-2 px-4 whitespace-nowrap"><div className="flex items-center gap-1"><CalendarDaysIcon className="w-4 h-4 text-gray-400" />{a.createdAt ? new Date(a.createdAt).toLocaleString() : '-'}</div></td>
                    <td className="py-2 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${statusProps.color} gap-1`}>
                        {statusProps.icon}{statusProps.label}
                      </span>
                    </td>
                    <td className="py-2 px-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1 rounded bg-green-500 text-white text-xs font-bold hover:bg-green-600 disabled:opacity-50 transition"
                          disabled={a.status === 'approved' || updating}
                          onClick={() => setModal({ open: true, action: 'approved', id: a._id })}
                        >
                          {updating === a._id + 'approved' ? '...' : 'Approve'}
                        </button>
                        <button
                          className="px-3 py-1 rounded bg-red-500 text-white text-xs font-bold hover:bg-red-600 disabled:opacity-50 transition"
                          disabled={a.status === 'rejected' || updating}
                          onClick={() => setModal({ open: true, action: 'rejected', id: a._id })}
                        >
                          {updating === a._id + 'rejected' ? '...' : 'Reject'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    {/* Confirmation Modal */}
    {modal.open && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            {modal.action === 'approved' ? 'Approve Appointment' : 'Reject Appointment'}
          </h3>
          <p className="mb-6 text-gray-700">
            {modal.action === 'approved'
              ? 'Are you sure you want to approve this appointment? The user will receive a confirmation email.'
              : 'Are you sure you want to reject this appointment? The user will NOT be notified.'}
          </p>
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
              onClick={() => setModal({ open: false, action: '', id: null })}
            >
              Cancel
            </button>
            <button
              className={modal.action === 'approved' ? 'px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700' : 'px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700'}
              onClick={() => updateStatus(modal.id, modal.action)}
              disabled={updating}
            >
              {updating ? 'Processing...' : modal.action === 'approved' ? 'Approve' : 'Reject'}
            </button>
          </div>
        </div>
      </div>
    )}
    {/* Note Modal */}
    {showNoteModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Appointment Note</h3>
          <div className="mb-4">
            <div className="text-gray-700 font-semibold mb-1">From:</div>
            <div className="text-gray-900 mb-2">{showNoteModal.name || 'Anonymous'}</div>
            <div className="text-gray-700 font-semibold mb-1">Note:</div>
            <div className="text-gray-800 whitespace-pre-line">{showNoteModal.note}</div>
          </div>
          <div className="flex justify-end">
            <button
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
              onClick={() => setShowNoteModal(null)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}
    </section>
  );
}