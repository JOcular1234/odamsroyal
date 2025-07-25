// This file was renamed to avoid conflict with page.jsx. The main admin inquiries logic is now in inquiries/page.jsx.
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInquiries();
  }, []);

  async function fetchInquiries() {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/inquiries`);
      setInquiries(res.data);
    } catch (err) {
      setError('Failed to fetch inquiries');
    }
    setLoading(false);
  }

  return (
    <section className="py-16 max-w-4xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-center text-primary mb-8">Manage Inquiriesss</h2>
      {loading ? (
        <p className="text-center text-neutral">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : inquiries.length === 0 ? (
        <p className="text-center text-neutral">No inquiries found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-lg">
            <thead>
              <tr className="bg-primary text-white">
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Message</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Responded</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq) => (
                <tr key={inq._id} className="border-b last:border-none">
                  <td className="py-2 px-4">{inq.name}</td>
                  <td className="py-2 px-4">{inq.email}</td>
                  <td className="py-2 px-4">{inq.message}</td>
                  <td className="py-2 px-4">{new Date(inq.createdAt).toLocaleString()}</td>
                  <td className="py-2 px-4 text-center">
                    {inq.responded ? (
                      <span title="Responded" style={{ color: 'red', fontSize: '1.5em' }}>&#10003;</span>
                    ) : (
                      <span title="Not responded" style={{ color: '#bbb', fontSize: '1.5em' }}>&#9633;</span>
                    )}
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