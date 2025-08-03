// frontend/src/hooks/useAdminAuth.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Universal admin authentication hook for all admin pages.
 * Redirects to /admin/login if not authenticated or token is invalid.
 * Usage: const { isChecking } = useAdminAuth();
 */
export default function useAdminAuth(options = {}) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Allow custom redirect target after successful auth (optional)
  const {
    redirectIfAuthed = null, // e.g. '/admin/inquiries' (for /admin/page.jsx)
    verifyWithBackend = true, // set false for pages that only need token presence
  } = options;

  // API URL fallback
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  if (!API_URL) throw new Error('NEXT_PUBLIC_API_URL environment variable is not set!');
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        if (!token) {
          router.replace('/admin/login');
          return;
        }
        if (verifyWithBackend) {
          const res = await fetch(`${API_URL}/api/admin/dashboard`, {
            credentials: 'include',
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (!res.ok) {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_role');
            localStorage.removeItem('admin_username');
            router.replace('/admin/login');
            return;
          }
        }
        setIsAuthenticated(true);
        if (redirectIfAuthed) {
          router.replace(redirectIfAuthed);
        }
      } catch (error) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_role');
        localStorage.removeItem('admin_username');
        router.replace('/admin/login');
      } finally {
        setIsChecking(false);
      }
    };
    checkAuth();
  }, [router, API_URL, redirectIfAuthed, verifyWithBackend]);

  return { isChecking, isAuthenticated };
}
