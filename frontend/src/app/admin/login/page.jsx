// frontend/src/app/admin/login/page.jsx
'use client';
import { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from './toast-setup';

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();


  // API URL with fallback
const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) throw new Error('NEXT_PUBLIC_API_URL environment variable is not set!');
  // Redirect if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/dashboard`, {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin_token') || ''}`,
          },
        });
        if (res.ok) {
          router.replace('/admin/appointments');
        }
      } catch (error) {
        console.log('Auth check failed:', error);
      }
    };
    checkAuth();
  }, [router, API_URL]);

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
      console.log('Attempting login to:', `${API_URL}/api/admin/login`);
      
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
        credentials: 'include',
      });

      console.log('Login response status:', res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log('Login successful, response:', data);
        
        // Store token if provided in response
        if (data.token) {
          localStorage.setItem('admin_token', data.token);
          console.log('Token stored in localStorage');
        }
        if (data.role) {
          localStorage.setItem('admin_role', data.role);
          console.log('Role stored in localStorage:', data.role);
        }
        if (data.username) {
          localStorage.setItem('admin_username', data.username);
          console.log('Username stored in localStorage:', data.username);
        }
        toast.success('Login successful! Redirecting...');
        // Set token as cookie for backend compatibility
        if (data.token) {
          document.cookie = `admin_token=${data.token}; path=/; SameSite=Strict; Secure`;
        }
        // Small delay for toast to show
        // setTimeout(() => {
          window.location.reload();
          router.replace('/admin/appointments'); // or your desired admin page

        // }, 500);
      } else {
        const data = await res.json();
        const errorMessage = data.message || 'Invalid credentials';
        console.error('Login failed:', errorMessage);
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = 'Error logging in. Please check your connection and try again.';
      setError(errorMessage);
      toast.error(errorMessage);
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
          
          {/* Debug info in development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs">
              <p>API URL: {API_URL}</p>
            </div>
          )}
          
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
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your password"
                className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316] transition-colors duration-200 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                value={form.password}
                onChange={handleChange}
                required
                aria-label="Password"
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  // Eye Open SVG
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  // Eye Slash SVG
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95M6.634 6.634A9.956 9.956 0 0112 5c4.477 0 8.267 2.943 9.542 7a9.96 9.96 0 01-4.293 5.01M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                  </svg>
                )}
              </button>
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
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}