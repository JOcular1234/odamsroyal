/* Moved from login.jsx for Next.js App Router compatibility */
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard`, {
          credentials: 'include',
        });
        if (res.ok) {
          router.replace('/admin');
        }
      } catch {}
    };
    checkAuth();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: '' });
    setError('');
  };

  const validateForm = () => {
    const newErrors = { username: '', password: '' };
    let isValid = true;
    if (!form.username) {
      newErrors.username = 'Username is required';
      isValid = false;
    } else if (form.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
      isValid = false;
    }
    if (!form.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const isFormValid = () => form.username.length >= 3 && form.password.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include',
      });
      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.message || 'Invalid credentials');
      }
    } catch (error) {
      setError('Error logging in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Admin Login</h2>
            <p className="mt-2 text-sm text-gray-500">Sign in to manage your dashboard</p>
          </div>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md" aria-live="polite">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
            <div className="relative">
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="Enter your username"
                className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316] transition-colors duration-200 ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
                value={form.username}
                onChange={handleChange}
                required
                aria-label="Username"
                aria-describedby={errors.username ? 'username-error' : undefined}
              />
            </div>
            {errors.username && (
              <p id="username-error" className="text-red-500 text-xs mt-1.5" aria-live="polite">
                {errors.username}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316] transition-colors duration-200 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                value={form.password}
                onChange={handleChange}
                required
                aria-label="Password"
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
            </div>
            {errors.password && (
              <p id="password-error" className="text-red-500 text-xs mt-1.5" aria-live="polite">
                {errors.password}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-[#f97316] text-white py-3 rounded-lg font-semibold text-sm hover:bg-[#e86a15] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={submitting || !isFormValid()}
            aria-label="Login"
          >
            {submitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>

        </form>
      </div>
    </div>
  );
}
