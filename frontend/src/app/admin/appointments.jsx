// // frontend/src/app/admin/appointments.jsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminHeader from '../../components/AdminHeader';
import axios from 'axios';

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState('');
  const [modal, setModal] = useState({ open: false, action: '', id: null });
  const router = useRouter();

  // API URL with fallback
  const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://odamsroyal.onrender.com/api';

  // Check authentication and fetch appointments
  useEffect(() => {
    const checkAuthAndFetch = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        if (!token) {
          console.log('No token found, redirecting to login');
          router.push('/admin/login');
          return;
        }

        const authResponse = await fetch(`${API_URL}/api/admin/dashboard`, {
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!authResponse.ok) {
          console.log('Token invalid, redirecting to login');
          localStorage.removeItem('admin_token');
          router.push('/admin/login');
          return;
        }

        await fetchAppointments();
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/admin/login');
      }
    };

    checkAuthAndFetch();
  }, [router, API_URL]);

  async function fetchAppointments() {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('admin_token');
      console.log('Fetching appointments with token:', token ? 'Present' : 'Missing');

      const response = await fetch(`${API_URL}/api/appointments`, {
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Fetch appointments response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          console.log('Unauthorized, clearing token and redirecting');
          localStorage.removeItem('admin_token');
          router.push('/admin/login');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Appointments fetched successfully:', data.length);
      setAppointments(data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, status) {
    setUpdating(id + status);
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        console.log('No token, redirecting to login');
        localStorage.removeItem('admin_token');
        router.push('/admin/login');
        return;
      }

      const response = await axios.patch(`${API_URL}/api/appointments/${id}`, { status }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Check if email sending failed (requires backend to return emailSent)
      if (status === 'approved' && response.data.emailSent === false) {
        alert('Appointment approved, but email sending failed.');
      }

      console.log('Appointment updated successfully:', response.data);
      await fetchAppointments();
    } catch (err) {
      console.error('Error updating status:', err);
      if (err.response?.status === 401) {
        console.log('Unauthorized, clearing token and redirecting');
        localStorage.removeItem('admin_token');
        router.push('/admin/login');
        return;
      }
      alert(`Failed to update status: ${err.message}`);
    } finally {
      setUpdating('');
      setModal({ open: false, action: '', id: null });
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Appointments</h1>
            <div className="text-red-600 bg-red-50 border border-red-200 rounded p-4">
              <h3 className="font-semibold">Error Loading Appointments</h3>
              <p className="mb-3">{error}</p>
              <button
                onClick={fetchAppointments}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Appointments</h1>
          
          {appointments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No appointments found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.map((appointment) => (
                    <tr key={appointment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.service}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(appointment.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            appointment.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : appointment.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            disabled={appointment.status === 'approved' || updating === appointment._id + 'approved'}
                            onClick={() => setModal({ open: true, action: 'approved', id: appointment._id })}
                          >
                            {updating === appointment._id + 'approved' ? 'Updating...' : 'Approve'}
                          </button>
                          <button
                            className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            disabled={appointment.status === 'rejected' || updating === appointment._id + 'rejected'}
                            onClick={() => setModal({ open: true, action: 'rejected', id: appointment._id })}
                          >
                            {updating === appointment._id + 'rejected' ? 'Updating...' : 'Reject'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
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
                  className={
                    modal.action === 'approved'
                      ? 'px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700'
                      : 'px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700'
                  }
                  onClick={() => updateStatus(modal.id, modal.action)}
                  disabled={updating}
                >
                  {updating ? 'Processing...' : modal.action === 'approved' ? 'Approve' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}