// frontend/src/app/admin/appointments.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/appointments`, { withCredentials: true });
      setAppointments(res.data);
    } catch (err) {
      setError('Failed to fetch appointments');
    }
    setLoading(false);
  }

  async function updateStatus(id, status) {
    setUpdating(id + status);
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/appointments/${id}`, { status }, { withCredentials: true });
      fetchAppointments();
    } catch (err) {
      alert('Failed to update status');
    }
    setUpdating('');
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
                      onClick={() => updateStatus(a._id, 'approved')}
                    >
                      {updating === a._id + 'approved' ? '...' : 'Approve'}
                    </button>
                    <button
                      className="px-3 py-1 rounded bg-red-500 text-white text-xs font-bold hover:bg-red-600 disabled:opacity-50"
                      disabled={a.status === 'rejected' || updating}
                      onClick={() => updateStatus(a._id, 'rejected')}
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
    </section>
  );
} 