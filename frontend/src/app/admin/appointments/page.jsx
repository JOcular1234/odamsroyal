// frontend/src/app/admin/appointments/page.jsx
"use client";
// moved from appointments.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState('');
  const [modal, setModal] = useState({ open: false, action: '', id: null });

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`/api/appointments`, { withCredentials: true });
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
      await axios.patch(`/api/appointments/${id}`, { status }, { withCredentials: true });
      fetchAppointments();
    } catch (err) {
      alert('Failed to update status');
    }
    setUpdating('');
    setModal({ open: false, action: '', id: null });
  }

  return (
    <section className="py-16 max-w-4xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-center text-primary mb-8">Manage Appointments</h2>
      {loading ? (
        <p className="text-center text-neutral">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : appointments.length === 0 ? (
        <p className="text-center text-neutral">No appointments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-lg">
            <thead>
              <tr className="bg-primary text-white">
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-left">Service</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a._id} className="border-b last:border-none">
                  <td className="py-2 px-4">{a.name}</td>
                  <td className="py-2 px-4">{a.email}</td>
                  <td className="py-2 px-4">{a.phone}</td>
                  <td className="py-2 px-4">{a.service}</td>
                  <td className="py-2 px-4">{new Date(a.date).toLocaleString()}</td>
                  <td className="py-2 px-4 capitalize font-semibold text-sm">
                    <span className={
                      a.status === 'approved' ? 'text-green-600' :
                      a.status === 'rejected' ? 'text-red-600' :
                      'text-yellow-600'
                    }>{a.status}</span>
                  </td>
                  <td className="py-2 px-4 flex gap-2">
                    <button
                      className="px-3 py-1 rounded bg-green-500 text-white text-xs font-bold hover:bg-green-600 disabled:opacity-50"
                      disabled={a.status === 'approved' || updating}
                      onClick={() => setModal({ open: true, action: 'approved', id: a._id })}
                    >
                      {updating === a._id + 'approved' ? '...' : 'Approve'}
                    </button>
                    <button
                      className="px-3 py-1 rounded bg-red-500 text-white text-xs font-bold hover:bg-red-600 disabled:opacity-50"
                      disabled={a.status === 'rejected' || updating}
                      onClick={() => setModal({ open: true, action: 'rejected', id: a._id })}
                    >
                      {updating === a._id + 'rejected' ? '...' : 'Reject'}
                    </button>
                  </td>
                </tr>
              ))}
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
  </section>
  );
} 