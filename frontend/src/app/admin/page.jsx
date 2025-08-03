// 'use client';
// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// export default function AdminRedirect() {
//   const router = useRouter();
//   useEffect(() => {
//     router.replace('/admin/inquiries');
//   }, [router]);
//   return null;
// }


// // frontend/src/app/admin/page.jsx
// 'use client';
// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// export default function AdminRedirect() {
//   const router = useRouter();

//   useEffect(() => {
//     const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
//     if (!token) {
//       router.replace('/admin/login');
//     } else {
//       router.replace('/admin/inquiries');
//     }
//   }, [router]);

//   return null;
// }

// frontend/src/app/admin/page.jsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRedirect() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  // API URL with fallback
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  if (!API_URL) throw new Error('NEXT_PUBLIC_API_URL environment variable is not set!');
  
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        
        if (!token) {
          router.replace('/admin/login');
          return;
        }

        // Verify token with backend
        const res = await fetch(`${API_URL}/api/admin/dashboard`, {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (res.ok) {
          // Token is valid, redirect to dashboard
          router.replace('/admin/inquiries');
        } else {
          // Token is invalid, clear it and redirect to login
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_role');
          localStorage.removeItem('admin_username');
          router.replace('/admin/login');
        }
      } catch (error) {
        console.log('Auth check failed:', error);
        // On error, assume invalid auth and redirect to login
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_role');
        localStorage.removeItem('admin_username');
        router.replace('/admin/login');
      } finally {
        setIsChecking(false);
      }
    };

    checkAuthAndRedirect();
  }, [router, API_URL]);

  // Show loading state while checking authentication
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

  return null;
}