import Link from 'next/link';

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-6">
        <h2 className="text-xl font-bold mb-8">Admin Panel</h2>
        <nav className="flex flex-col gap-4">
          <Link href="/admin/appointments" className="hover:text-[#f97316]">Appointments</Link>
          <Link href="/admin/inquiries" className="hover:text-[#f97316]">Inquiries</Link>
          <Link href="/admin/properties" className="hover:text-[#f97316]">Properties</Link>
          <form method="POST" action="/api/admin/logout" className="mt-8">
            <button
              type="submit"
              className="w-full bg-[#f97316] text-white py-2 rounded hover:bg-[#e86a15] font-semibold"
            >
              Logout
            </button>
          </form>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-gray-50">{children}</main>
    </div>
  );
}
