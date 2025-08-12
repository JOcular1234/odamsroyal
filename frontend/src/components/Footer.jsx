// frontend/src/components/Footer.jsx
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#0d3b66] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Info */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center font-bold text-white text-xl shadow-md">
                <Image src="https://res.cloudinary.com/drkli5pwj/image/upload/v1753880711/odamzlogo_cqgm0c.jpg" alt="logo" title='logo' width={48} height={48} className='rounded-full' />
              </div>
              <span className="text-xl font-extrabold tracking-tight">Odamz Royal Consultz</span>
            </div>
            <p className="text-gray-200 text-sm leading-relaxed text-center md:text-left">
              Your trusted partner in real estate, delivering excellence in property management, construction, and legal advisory across Nigeria.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start hidden md:block">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-200 text-sm">
              <li>
                <Link
                  href="/#about"
                  className="hover:text-accent transition-colors"
                  aria-label="About Us"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/#services"
                  className="hover:text-accent transition-colors"
                  aria-label="Our Services"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/#properties"
                  className="hover:text-accent transition-colors"
                  aria-label="Properties"
                >
                  Properties
                </Link>
              </li>
              <li>
                <Link
                  href="/#appointment"
                  className="hover:text-accent transition-colors"
                  aria-label="Book an Appointment"
                >
                  Appointments
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-accent transition-colors"
                  aria-label="Frequently Asked Questions"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-accent transition-colors"
                  aria-label="Contact Us"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-gray-200 text-sm mb-2">
              📍 CBD, Abuja (Center Business District ), Nigeria
            </p>
            <p className="text-gray-200 text-sm mb-2">
              📞{' '}
              <Link
                href="tel:+2347061198858"
                className="hover:text-accent transition-colors"
                aria-label="Phone number 07061198858"
              >
                07061198858
              </Link>
              ,{' '}
              <Link
                href="tel:+2348123485718"
                className="hover:text-accent transition-colors"
                aria-label="Phone number 08123485718"
              >
                08123485718
              </Link>
            </p>
            <p className="text-gray-200 text-sm">
              📧{' '}
              <Link
                href="mailto:info.odamzroyalty@gmail.com"
                className="hover:text-accent transition-colors"
                aria-label="Email info.odamzroyalty@gmail.com"
              >
                info.odamzroyalty@gmail.com
              </Link>
            </p>
          </div>
        </div>

        {/* Social Media and Copyright */}
        <div className="border-t border-gray-700 pt-6 flex flex-col items-center gap-4">
          <div className="flex gap-6">

            {/* Facebook */}
            <a
              href="https://www.facebook.com/share/15s2FADKKk/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-200 hover:text-accent transition-colors"
              aria-label="Facebook"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22.675 0h-21.35C.597 0 0 .597 0 
                  1.333v21.333C0 23.403.597 24 1.325 
                  24h11.495v-9.294H9.692V11.41h3.128V8.692c0-3.1 
                  1.894-4.788 4.659-4.788 1.325 0 2.463.097 
                  2.794.141v3.24l-1.918.001c-1.504 0-1.796.715-1.796 
                  1.763v2.312h3.587l-.467 3.296h-3.12V24h6.116C23.403 
                  24 24 23.403 24 22.667V1.333C24 
                  .597 23.403 0 22.675 0z" />
              </svg>
            </a>
            {/* YouTube */}
            <a
              href="https://youtube.com/@odamzroyalty?si=FYNmazx_7xK_VZLI"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-200 hover:text-accent transition-colors"
              aria-label="YouTube"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a2.997 2.997 0 0 0-2.112-2.12C19.323 3.5 12 3.5 12 3.5s-7.323 0-9.386.566a2.997 2.997 0 0 0-2.112 2.12C0 8.262 0 12 0 12s0 3.738.502 5.814a2.997 2.997 0 0 0 2.112 2.12C4.677 20.5 12 20.5 12 20.5s7.323 0 9.386-.566a2.997 2.997 0 0 0 2.112-2.12C24 15.738 24 12 24 12s0-3.738-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@odamzroyalty_nig"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-200 hover:text-accent transition-colors"
              aria-label="TikTok"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.75 2h3.5a.75.75 0 0 1 .75.75v1.28a5.25 5.25 0 0 0 5.25 5.25h.75a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-.75.75h-1.5v3.75a7.75 7.75 0 1 1-7.75-7.75.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-.75.75 2.25 2.25 0 1 0 2.25 2.25V2.75A.75.75 0 0 1 12.75 2z" />
              </svg>
            </a>
          </div>
          <p className="text-gray-300 text-sm">
            {new Date().getFullYear()} Odamz Royal Consultz Nig Ltd. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  );
}