"use client";
// frontend/src/app/admin/appointments.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminProperties() {
  // ...existing state

  // Update property handler (example: toggles a dummy 'featured' field)
  async function handleUpdateProperty(id) {
    let token = null;
    if (typeof window !== "undefined") {
      token = localStorage.getItem('admin_token');
    }
    try {
      await axios.patch(`/api/admin/properties/${id}`, { featured: true }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchProperties();
    } catch (err) {
      alert('Failed to update property');
    }
  }

  // Delete property handler
  async function handleDeleteProperty(id) {
    let token = null;
    if (typeof window !== "undefined") {
      token = localStorage.getItem('admin_token');
    }
    try {
      await axios.delete(`/api/admin/properties/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchProperties();
    } catch (err) {
      alert('Failed to delete property');
    }
  }
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
      let token = null;
      if (typeof window !== "undefined") {
        token = localStorage.getItem('admin_token');
      }
      const res = await axios.get('/api/admin/properties', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
            <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p._id} className="border-b last:border-none">
                  <td className="py-2 px-4 font-semibold text-primary">{p.title}</td>
                  <td className="py-2 px-4 text-neutral">{p.description}</td>
                  <td className="py-2 px-4">
                    <Image src={p.image} alt={p.title} width={96} height={64} className="w-24 h-16 object-cover rounded shadow" />
                  </td>
                  <td className="py-2 px-4">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                      onClick={() => handleUpdateProperty(p._id)}
                    >Update</button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => handleDeleteProperty(p._id)}
                    >Delete</button>
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