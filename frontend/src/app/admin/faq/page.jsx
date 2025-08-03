
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';
import useAdminAuth from '@/hooks/useAdminAuth';

export default function AdminFAQPage() {
  const [faqs, setFaqs] = useState([]);
  const [editing, setEditing] = useState(null); // id or null
  const [form, setForm] = useState({ question: "", answer: "" });
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  const { isChecking } = useAdminAuth();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) throw new Error('NEXT_PUBLIC_API_URL environment variable is not set!');

  // Set role and token from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRole(localStorage.getItem('admin_role') || '');
      setToken(localStorage.getItem("admin_token") || "");
    }
  }, []);

  // Fetch FAQs after auth and role check
  useEffect(() => {
    if (isChecking || !token || !['admin', 'staff'].includes(role)) return;
    fetchFaqs();
  }, [isChecking, token, role]);

  // Early returns after all hooks
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

  if (role && !['admin', 'staff'].includes(role)) {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-8 bg-white rounded-xl shadow text-center">
        <h2 className="text-2xl font-bold text-[#f97316] mb-4">Access Restricted</h2>
        <p className="text-gray-700">You do not have permission to manage FAQs.</p>
      </div>
    );
  }

  async function fetchFaqs() {
    try {
      const res = await axios.get(`${API_URL}/api/faq`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFaqs(res.data);
      setError("");
    } catch (err) {
      console.error('Failed to fetch FAQs:', err.response?.status, err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Failed to fetch FAQs");
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setError("");
    try {
      if (editing) {
        await axios.put(
          `${API_URL}/api/faq/${editing}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${API_URL}/api/faq`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setForm({ question: "", answer: "" });
      setEditing(null);
      fetchFaqs();
    } catch (err) {
      console.error('Failed to save FAQ:', err.response?.status, err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Failed to save FAQ");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this FAQ?")) return;
    setError("");
    try {
      await axios.delete(`${API_URL}/api/faq/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFaqs();
    } catch (err) {
      console.error('Failed to delete FAQ:', err.response?.status, err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Failed to delete FAQ");
    }
  }

  function startEdit(faq) {
    setEditing(faq._id);
    setForm({ question: faq.question, answer: faq.answer });
  }

  function cancelEdit() {
    setEditing(null);
    setForm({ question: "", answer: "" });
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Manage FAQs</h1>
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-500 p-4 rounded-lg mb-6" aria-live="polite">
          {error}
        </div>
      )}
      <form onSubmit={handleSave} className="bg-white shadow rounded p-6 mb-8 space-y-4">
        <div>
          <label className="block font-semibold mb-1">Question</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Answer</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={form.answer}
            onChange={(e) => setForm({ ...form, answer: e.target.value })}
            required
          />
        </div>
        <div className="flex gap-3">
          <button type="submit" className="bg-[#f97316] text-white px-6 py-2 rounded font-semibold">
            {editing ? "Update FAQ" : "Add FAQ"}
          </button>
          {editing && (
            <button type="button" className="bg-gray-200 px-6 py-2 rounded" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>
      <div className="space-y-4">
        {faqs.length === 0 && !error && (
          <div className="text-center text-gray-500">No FAQs found.</div>
        )}
        {faqs.map((faq) => (
          <div
            key={faq._id}
            className="bg-white shadow rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
          >
            <div>
              <div className="font-semibold">{faq.question}</div>
              <div className="text-gray-700 text-sm">{faq.answer}</div>
            </div>
            <div className="flex gap-2">
              <button className="text-blue-600" onClick={() => startEdit(faq)}>
                Edit
              </button>
              <button className="text-red-600" onClick={() => handleDelete(faq._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}