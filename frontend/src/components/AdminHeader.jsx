// frontend/src/components/AdminHeader.jsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

import {
  BuildingOffice2Icon,
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import authManager from '../utils/adminAuth';

export default function AdminHeader() {
  const [role, setRole] = useState('');

  // Fetch role from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedRole = localStorage.getItem('admin_role') || '';
      setRole(storedRole);
      console.log('AdminHeader: Detected role from localStorage:', storedRole);
    }
  }, []);
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  // Fetch role from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedRole = localStorage.getItem('admin_role') || '';
      setRole(storedRole);
      console.log('AdminHeader: Detected role from localStorage:', storedRole);
    }
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      await authManager.logout();
    } catch (error) {
      console.error('Logout error:', error);
      authManager.clearToken();
      document.cookie = 'admin_token=; Max-Age=0; path=/;';
      router.push('/admin/login');
    }
    setMenuOpen(false);
    setAvatarOpen(false);
  };

  // Close avatar dropdown on outside click
  useEffect(() => {
    if (!avatarOpen) return;
    const handleClick = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setAvatarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [avatarOpen]);

  // Conditional rendering for login page
  if (pathname === '/admin/login') {
    return (
      <header className="w-full bg-gray-900 text-white shadow-lg flex items-center justify-between px-2 sm:px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden shadow-md">
            <img
              src="https://res.cloudinary.com/drkli5pwj/image/upload/v1753880711/odamzlogo_cqgm0c.jpg"
              alt="Odamz Logo"
              title="Odamz Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xl font-extrabold tracking-tight">Odamz</span>
        </div>
        <button
          onClick={() => router.push('/admin/login')}
          className="px-4 py-2 rounded-lg bg-[#f97316] text-white font-semibold hover:bg-[#e56b15] transition-colors focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2"
          aria-label="Admin Login"
        >
          Login
        </button>
      </header>
    );
  }

  // Role-based navigation links
  const navLinks = [
    ...(role === 'admin'
      ? [
          {
            href: '/admin/properties',
            label: 'Manage Properties',
            icon: <BuildingOffice2Icon className="w-5 h-5" />,
          },
        ]
      : []),
    {
      href: '/admin/inquiries',
      label: 'Manage Inquiries',
      icon: <ClipboardDocumentListIcon className="w-5 h-5" />,
    },
    {
      href: '/admin/appointments',
      label: 'Manage Appointments',
      icon: <CalendarDaysIcon className="w-5 h-5" />,
    },
    {
      href: '/admin/faq',
      label: 'FAQ',
      icon: <ClipboardDocumentListIcon className="w-5 h-5" />,
    },
    ...(role === 'admin'
      ? [
          {
            href: '/admin/staff',
            label: 'Staff Management',
            icon: <ClipboardDocumentListIcon className="w-5 h-5" />,
          },
        ]
      : []),
  ];

  return (
    <header className="w-full bg-gray-900 text-white shadow-lg flex items-center justify-between px-2 sm:px-6 py-4 font-sans">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden shadow-md transition-transform hover:scale-105">
          <img
            src="https://res.cloudinary.com/drkli5pwj/image/upload/v1753880711/odamzlogo_cqgm0c.jpg"
            alt="Odamz Logo"
            title="Odamz Logo"
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-xl font-extrabold tracking-tight">Odamz</span>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-4">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm transition-colors ${
              pathname === link.href
                ? 'bg-[#f97316] text-white shadow-sm'
                : 'text-gray-200 hover:text-[#f97316] hover:bg-[#f97316]/10'
            }`}
            aria-current={pathname === link.href ? 'page' : undefined}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
        <div className="relative" ref={avatarRef}>
          <button
            className="w-9 h-9 rounded-full bg-[#f97316] flex items-center justify-center font-semibold text-lg text-white border-2 border-white focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2 transition-transform hover:scale-105"
            onClick={() => setAvatarOpen((v) => !v)}
            aria-haspopup="true"
            aria-expanded={avatarOpen}
            aria-label="User menu"
          >
            <span>{role === 'admin' ? 'AD' : role === 'staff' ? 'SF' : 'OD'}</span>
          </button>
          {avatarOpen && (
            <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-xl text-gray-900 z-50 overflow-hidden animate-fade-in">
              <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-200">
                Role: {role || 'Unknown'}
              </div>
              <Link
                href="/admin/profile"
                className="block px-4 py-2 text-sm hover:bg-[#f97316]/10 hover:text-[#f97316] transition-colors"
                onClick={() => setAvatarOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm hover:bg-[#f97316]/10 hover:text-[#f97316] transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Hamburger */}
      <button
        className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? (
          <XMarkIcon className="w-6 h-6 text-white" />
        ) : (
          <Bars3Icon className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        >
          <div
            className="fixed top-0 left-0 w-80 h-full bg-gray-900 shadow-2xl flex flex-col p-6 gap-6 transform transition-transform duration-300 ease-in-out translate-x-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden shadow-md">
                  <img
                    src="https://res.cloudinary.com/drkli5pwj/image/upload/v1753880711/odamzlogo_cqgm0c.jpg"
                    alt="Odamz Logo"
                    title="Odamz Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xl font-extrabold tracking-tight text-white">
                  Odamz Admin
                </span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2 rounded-lg"
              >
                <XMarkIcon className="w-6 h-6 text-white" />
              </button>
            </div>
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                    pathname === link.href
                      ? 'bg-[#f97316] text-white shadow-sm'
                      : 'text-gray-200 hover:text-[#f97316] hover:bg-[#f97316]/10'
                  }`}
                  onClick={() => setMenuOpen(false)}
                  aria-current={pathname === link.href ? 'page' : undefined}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto border-t border-gray-700 pt-4">
              <div className="flex items-center gap-3 mb-4">
                <UserCircleIcon className="w-8 h-8 text-[#f97316]" />
                <span className="text-sm text-gray-200">
                  Role: {role || 'Unknown'}
                </span>
              </div>
              <Link
                href="/admin/profile"
                className="block px-4 py-2 text-sm text-gray-200 hover:text-[#f97316] hover:bg-[#f97316]/10 rounded-lg transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-[#f97316] text-white font-semibold hover:bg-[#e56b15] transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}