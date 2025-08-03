// frontend/src/app/admin/faq/page.jsx
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';

export default function AdminFAQPage() {
  const [faqs, setFaqs] = useState([]);
  const [editing, setEditing] = useState(null); // id or null
  const [form, setForm] = useState({ question: "", answer: "" });
  const [token, setToken] = useState("");

  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const t = localStorage.getItem("admin_token") || "";
      if (!t) {
        router.replace('/admin/login');
        return;
      }
      // Optionally verify token with backend
      try {
        const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'https://odamroyal.onrender.com') + '/api/admin/dashboard', {
          credentials: 'include',
          headers: { 'Authorization': `Bearer ${t}` },
        });
        if (!res.ok) {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_role');
          localStorage.removeItem('admin_username');
          router.replace('/admin/login');
          return;
        }
      } catch {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_role');
        localStorage.removeItem('admin_username');
        router.replace('/admin/login');
        return;
      }
      setToken(t);
      fetchFaqs();
      setIsChecking(false);
    };
    checkAuthAndFetch();
  }, [router]);

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

  async function fetchFaqs() {
    try {
      const res = await axios.get("/api/faq");
      setFaqs(res.data);
    } catch (err) {
      alert("Failed to fetch FAQs");
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(
          `/api/faq/${editing}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          "/api/faq",
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setForm({ question: "", answer: "" });
      setEditing(null);
      fetchFaqs();
    } catch (err) {
      alert("Failed to save FAQ");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this FAQ?")) return;
    try {
      await axios.delete(`/api/faq/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchFaqs();
    } catch (err) {
      alert("Failed to delete FAQ");
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
      <form onSubmit={handleSave} className="bg-white shadow rounded p-6 mb-8 space-y-4">
        <div>
          <label className="block font-semibold mb-1">Question</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={form.question}
            onChange={e => setForm({ ...form, question: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Answer</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={form.answer}
            onChange={e => setForm({ ...form, answer: e.target.value })}
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
        {faqs.map(faq => (
          <div key={faq._id} className="bg-white shadow rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
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
