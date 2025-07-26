// frontend/src/app/admin/appointments.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/properties`);
      setProperties(res.data);
    } catch (err) {
      setError('Failed to fetch properties');
    }
    setLoading(false);
  }

  return (
    <section className="py-16 max-w-4xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-center text-primary mb-8">Manage Properties</h2>
      {loading ? (
        <p className="text-center text-neutral">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : properties.length === 0 ? (
        <p className="text-center text-neutral">No properties found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-lg">
            <thead>
              <tr className="bg-primary text-white">
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Description</th>
                <th className="py-3 px-4 text-left">Image</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p._id} className="border-b last:border-none">
                  <td className="py-2 px-4 font-semibold text-primary">{p.title}</td>
                  <td className="py-2 px-4 text-neutral">{p.description}</td>
                  <td className="py-2 px-4">
                    <img src={p.image} alt={p.title} className="w-24 h-16 object-cover rounded shadow" />
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