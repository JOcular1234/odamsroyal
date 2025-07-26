export default function AdminFooter() {
  return (
    <footer className="w-full bg-gray-900 text-white text-center py-4 mt-8 border-t border-gray-800">
      <div className="flex flex-col items-center gap-1">
        <span className="font-bold text-lg tracking-tight">Odamz Admin Panel</span>
        <span className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Odamz Royal Consultz Nig Ltd. Admin Portal</span>
        <span className="text-xs text-gray-500">For authorized personnel only | All rights reserved</span>
      </div>
    </footer>
  );
}
