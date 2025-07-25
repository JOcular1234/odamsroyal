import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-center gap-8">
      <Link href="/services" className="text-gray-700 font-semibold hover:text-[#f97316] transition-colors">
        Services
      </Link>
      <Link href="/about" className="text-gray-700 font-semibold hover:text-[#f97316] transition-colors">
        About Us
      </Link>
      <Link href="/contact" className="text-gray-700 font-semibold hover:text-[#f97316] transition-colors">
        Contact
      </Link>
    </nav>
  );
}
