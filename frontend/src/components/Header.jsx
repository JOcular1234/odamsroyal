// frontend/src/components/Header.jsx
'use client';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0d3b66] backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo/Brand */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center font-bold text-white text-2xl shadow-md ">
            <Image src="https://res.cloudinary.com/drkli5pwj/image/upload/v1753880711/odamzlogo_cqgm0c.jpg" alt="logo" title='logo' width={48} height={48} className='rounded-full' />
          </div>
          <Link href="/" className="text-white font-extrabold text-xl tracking-tight sm:text-2xl hover:text-accent transition-colors">
            Odamz Royal
          </Link>
        </div>
        {/* Hamburger for mobile */}
        <button
          className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
        {/* Navigation */}
        <nav
          className={`${
            isOpen ? 'flex' : 'hidden'
          } md:flex flex-col md:flex-row md:items-center gap-4 md:gap-6 w-full md:w-auto absolute md:static top-20 left-0 md:top-0 bg-primary md:bg-transparent p-4 md:p-0 transition-all duration-300 ease-in-out`}
        >
          <Link
            href="/about"
            className="text-white font-semibold text-base md:text-lg px-3 py-2 rounded-md hover:bg-accent hover:text-white transition-colors"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link
            href="/services"
            className="text-white font-semibold text-base md:text-lg px-3 py-2 rounded-md hover:bg-accent hover:text-white transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Services
          </Link>
          <Link
            href="/properties"
            className="text-white font-semibold text-base md:text-lg px-3 py-2 rounded-md hover:bg-accent hover:text-white transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Properties
          </Link>
          <Link
            href="/appointment"
            className="text-white font-semibold text-base md:text-lg px-3 py-2 rounded-md hover:bg-accent hover:text-white transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Appointments
          </Link>
          <Link
            href="/faq"
            className="text-white font-semibold text-base md:text-lg px-3 py-2 rounded-md hover:bg-accent hover:text-white transition-colors"
            onClick={() => setIsOpen(false)}
          >
            FAQ
          </Link>
          <Link
            href="/contact"
            className="text-white font-semibold text-base md:text-lg px-4 py-2 rounded-md bg-accent hover:bg-opacity-90 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}