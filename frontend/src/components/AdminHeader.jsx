// frontend/src/components/AdminHeader.jsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { BuildingOffice2Icon, ClipboardDocumentListIcon, CalendarDaysIcon, ArrowRightOnRectangleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function AdminHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef(null);
  const router = useRouter();

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS!
  
  // Logout handler (defined as a function so it can be used in both conditions)
  // const handleLogout = async () => {
  //   await fetch('/api/admin/logout', {
  //     method: 'POST',
  //     credentials: 'include',
  //   });
  //   // Remove cookie on frontend (for extra safety)
  //   document.cookie = 'admin_token=; Max-Age=0; path=/;';
  //   router.push('/admin/login');
  // };
  // frontend/src/components/AdminHeader.jsx
const handleLogout = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    if (res.ok) {
      // Clear cookie on frontend
      document.cookie = 'admin_token=; Max-Age=0; path=/;';
      router.push('/admin/login');
    } else {
      console.error('Logout failed:', res.status, await res.text());
    }
  } catch (error) {
    console.error('Logout error:', error.message);
    router.push('/admin/login');
  }
};

  // Close avatar dropdown on outside click
  useEffect(() => {
    if (!avatarOpen) return;
    function handleClick(e) {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setAvatarOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [avatarOpen]);

  // NOW do conditional rendering after all hooks
  if (pathname === '/admin/login') {
    return (
      <header className="w-full bg-gray-900 text-white shadow flex items-center justify-between px-4 sm:px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#f97316] rounded-full flex items-center justify-center font-bold text-white text-2xl shadow-md">
            O
          </div>
          <span className="text-xl font-bold tracking-tight">Odamz Admin</span>
        </div>
        <button
          onClick={() => router.push('/admin/login')}
          className="bg-[#f97316] text-white px-4 py-2 rounded font-semibold hover:bg-[#e86a15] transition-colors ml-4"
        >
          Login
        </button>
      </header>
    );
  }

  const navLinks = [
    {
      href: '/admin/properties',
      label: 'Manage Properties',
      icon: <BuildingOffice2Icon className="w-5 h-5 mr-1 inline-block" />,
    },
    {
      href: '/admin/inquiries',
      label: 'Manage Inquiries',
      icon: <ClipboardDocumentListIcon className="w-5 h-5 mr-1 inline-block" />,
    },
    {
      href: '/admin/appointments',
      label: 'Manage Appointments',
      icon: <CalendarDaysIcon className="w-5 h-5 mr-1 inline-block" />,
    },
  ];

  return (
    <header className="w-full bg-gray-900 text-white shadow flex items-center justify-between px-4 sm:px-8 py-4">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#f97316] rounded-full flex items-center justify-center font-bold text-white text-2xl shadow-md">
          O
        </div>
        <span className="text-xl font-bold tracking-tight">Odamz Admin</span>
      </div>

      {/* Desktop nav */}
      <nav className="hidden md:flex gap-6 items-center">
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-1 px-3 py-2 rounded font-medium transition-colors ${pathname === link.href ? 'bg-[#f97316] text-white shadow' : 'hover:text-[#f97316]'}`}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 bg-[#f97316] text-white px-4 py-2 rounded font-semibold hover:bg-[#e86a15] transition-colors ml-4"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-1 inline-block" />
          Logout
        </button>
        {/* User avatar with dropdown */}
        <div className="ml-6 flex items-center relative">
          <button
            className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center font-semibold text-lg border-2 border-[#f97316] focus:outline-none focus:ring-2 focus:ring-[#f97316]"
            onClick={() => setAvatarOpen(v => !v)}
            aria-haspopup="true"
            aria-expanded={avatarOpen ? 'true' : 'false'}
          >
            <span>OD</span>
          </button>
          {avatarOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-gray-900 rounded shadow-lg z-50 animate-fade-in flex flex-col overflow-hidden">
              <Link href="/admin/profile" className="px-4 py-2 hover:bg-gray-100 transition-colors">Profile</Link>
              <form method="POST" action="/api/admin/logout">
                <button type="submit" className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors">Logout</button>
              </form>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Hamburger */}
      <button
        className="md:hidden flex items-center justify-center w-10 h-10 rounded focus:outline-none focus:ring-2 focus:ring-[#f97316]"
        aria-label="Open menu"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
      </button>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden" onClick={() => setMenuOpen(false)}>
          <div
            className="absolute top-0 left-0 w-64 h-full bg-gray-900 shadow-lg flex flex-col p-6 gap-6 transform transition-transform duration-300 ease-in-out translate-x-0"
            onClick={e => e.stopPropagation()}
            style={{ animation: 'slideInLeft 0.3s cubic-bezier(0.4,0,0.2,1)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-xl font-bold tracking-tight">Odamz Admin</span>
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <XMarkIcon className="w-7 h-7 text-white" />
              </button>
            </div>
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 rounded font-medium transition-colors ${pathname === link.href ? 'bg-[#f97316] text-white shadow' : 'hover:text-[#f97316]'}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full bg-[#f97316] text-white px-4 py-2 rounded font-semibold hover:bg-[#e86a15] transition-colors mt-4"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 mr-1 inline-block" />
              Logout
            </button>
            <div className="flex items-center mt-8 relative" ref={avatarRef}>
              <button
                className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center font-semibold text-lg border-2 border-[#f97316] focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                onClick={() => setAvatarOpen(v => !v)}
                aria-haspopup="true"
                aria-expanded={avatarOpen ? 'true' : 'false'}
              >
                <span>A</span>
              </button>
              {avatarOpen && (
                <div className="absolute left-0 mt-2 w-40 bg-white text-gray-900 rounded shadow-lg z-50 animate-fade-in flex flex-col overflow-hidden">
                  <Link href="/admin/profile" className="px-4 py-2 hover:bg-gray-100 transition-colors">Profile</Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}