// frontend/src/app/admin/page.jsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();

  // Check if admin_token exists
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard`, {
          credentials: 'include',
        });
        if (!res.ok) {
          router.push('/admin/login');
        }
      } catch {
        router.push('/admin/login');
      }
    };
    checkAuth();
  }, [router]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900">Admin Dashboard</h2>
            <p className="mt-2 text-lg text-gray-600">Manage properties, inquiries, and appointments</p>
          </div>
          <button
            onClick={async () => {
              await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/logout`, {
                method: 'POST',
                credentials: 'include',
              });
              // Remove cookie on frontend (for extra safety)
              document.cookie = 'admin_token=; Max-Age=0; path=/;';
              router.push('/admin/login');
            }}
            className="bg-[#f97316] text-white px-6 py-2.5 rounded-lg font-semibold shadow-md hover:bg-[#e86a15] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2"
          >
            Logout
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/properties"
            className="group bg-white rounded-xl shadow-lg p-8 text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2"
          >
            <div className="flex justify-center mb-4">
              <svg
                className="w-12 h-12 text-[#f97316] group-hover:text-[#e86a15] transition-colors duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-[#f97316] transition-colors duration-300">
              Manage Properties
            </h3>
            <p className="mt-2 text-sm text-gray-500">View and edit property listings</p>
          </Link>
          <Link
            href="/admin/inquiries"
            className="group bg-white rounded-xl shadow-lg p-8 text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2"
          >
            <div className="flex justify-center mb-4">
              <svg
                className="w-12 h-12 text-[#f97316] group-hover:text-[#e86a15] transition-colors duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-[#f97316] transition-colors duration-300">
              Manage Inquiries
            </h3>
            <p className="mt-2 text-sm text-gray-500">Respond to customer messages</p>
          </Link>
          <Link
            href="/admin/appointments"
            className="group bg-white rounded-xl shadow-lg p-8 text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2"
          >
            <div className="flex justify-center mb-4">
              <svg
                className="w-12 h-12 text-[#f97316] group-hover:text-[#e86a15] transition-colors duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-[#f97316] transition-colors duration-300">
              Manage Appointments
            </h3>
            <p className="mt-2 text-sm text-gray-500">Schedule and update appointments</p>
          </Link>
        </div>
      </div>
    </section>
  );
}