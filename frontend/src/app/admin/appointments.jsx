// // frontend/src/app/admin/appointments.jsx
// import { useEffect, useState } from 'react';
// import axios from 'axios';

// export default function AdminAppointments() {
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [updating, setUpdating] = useState('');

//   useEffect(() => {
//     fetchAppointments();
//   }, []);

//   async function fetchAppointments() {
//     setLoading(true);
//     setError('');
//     try {
//       const res = await axios.get(`/api/appointments`, { withCredentials: true });
//       setAppointments(res.data);
//     } catch (err) {
//       setError('Failed to fetch appointments');
//     }
//     setLoading(false);
//   }

//   async function updateStatus(id, status) {
//     setUpdating(id + status);
//     try {
//       await axios.patch(`/api/appointments/${id}`, { status }, { withCredentials: true });
//       fetchAppointments();
//     } catch (err) {
//       alert('Failed to update status');
//     }
//     setUpdating('');
//   }

//   return (
//     <section className="py-16 max-w-4xl mx-auto px-4">
//       <h2 className="text-3xl font-bold text-center text-primary mb-8">Manage Appointments</h2>
//       {loading ? (
//         <p className="text-center text-neutral">Loading...</p>
//       ) : error ? (
//         <p className="text-center text-red-500">{error}</p>
//       ) : appointments.length === 0 ? (
//         <p className="text-center text-neutral">No appointments found.</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white rounded-xl shadow-lg">
//             <thead>
//               <tr className="bg-primary text-white">
//                 <th className="py-3 px-4 text-left">Name</th>
//                 <th className="py-3 px-4 text-left">Email</th>
//                 <th className="py-3 px-4 text-left">Phone</th>
//                 <th className="py-3 px-4 text-left">Service</th>
//                 <th className="py-3 px-4 text-left">Date</th>
//                 <th className="py-3 px-4 text-left">Status</th>
//                 <th className="py-3 px-4 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {appointments.map((a) => (
//                 <tr key={a._id} className="border-b last:border-none">
//                   <td className="py-2 px-4">{a.name}</td>
//                   <td className="py-2 px-4">{a.email}</td>
//                   <td className="py-2 px-4">{a.phone}</td>
//                   <td className="py-2 px-4">{a.service}</td>
//                   <td className="py-2 px-4">{new Date(a.date).toLocaleString()}</td>
//                   <td className="py-2 px-4 capitalize font-semibold text-sm">
//                     <span className={
//                       a.status === 'approved' ? 'text-green-600' :
//                       a.status === 'rejected' ? 'text-red-600' :
//                       'text-yellow-600'
//                     }>{a.status}</span>
//                   </td>
//                   <td className="py-2 px-4 flex gap-2">
//                     <button
//                       className="px-3 py-1 rounded bg-green-500 text-white text-xs font-bold hover:bg-green-600 disabled:opacity-50"
//                       disabled={a.status === 'approved' || updating}
//                       onClick={() => updateStatus(a._id, 'approved')}
//                     >
//                       {updating === a._id + 'approved' ? '...' : 'Approve'}
//                     </button>
//                     <button
//                       className="px-3 py-1 rounded bg-red-500 text-white text-xs font-bold hover:bg-red-600 disabled:opacity-50"
//                       disabled={a.status === 'rejected' || updating}
//                       onClick={() => updateStatus(a._id, 'rejected')}
//                     >
//                       {updating === a._id + 'rejected' ? '...' : 'Reject'}
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </section>
//   );
// } 

// frontend/src/app/admin/appointments.jsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminHeader from '../../components/AdminHeader';

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState('');
  const router = useRouter();

  // API URL with fallback
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://odamsroyal.onrender.com';

  // Check authentication and fetch appointments
  useEffect(() => {
    const checkAuthAndFetch = async () => {
      try {
        // Check if user is authenticated first
        const token = localStorage.getItem('admin_token');
        if (!token) {
          console.log('No token found, redirecting to login');
          router.push('/admin/login');
          return;
        }

        // Verify token is still valid by making a test request
        const authResponse = await fetch(`${API_URL}/api/admin/dashboard`, {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!authResponse.ok) {
          console.log('Token invalid, redirecting to login');
          localStorage.removeItem('admin_token');
          router.push('/admin/login');
          return;
        }

        // If authenticated, fetch appointments
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
          'Authorization': `Bearer ${token}`,
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
      console.log(`Updating appointment ${id} to status: ${status}`);

      const response = await fetch(`${API_URL}/api/appointments/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      console.log('Update response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('admin_token');
          router.push('/admin/login');
          return;
        }
        throw new Error(`Failed to update status: ${response.status}`);
      }

      // Refresh appointments list
      await fetchAppointments();
      console.log('Appointment updated successfully');
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status: ' + err.message);
    } finally {
      setUpdating('');
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
                        {new Date(appointment.date).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          appointment.status === 'approved' 
                            ? 'bg-green-100 text-green-800' 
                            : appointment.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            disabled={appointment.status === 'approved' || updating === appointment._id + 'approved'}
                            onClick={() => updateStatus(appointment._id, 'approved')}
                          >
                            {updating === appointment._id + 'approved' ? 'Updating...' : 'Approve'}
                          </button>
                          <button
                            className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            disabled={appointment.status === 'rejected' || updating === appointment._id + 'rejected'}
                            onClick={() => updateStatus(appointment._id, 'rejected')}
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
      </main>
    </div>
  );
}