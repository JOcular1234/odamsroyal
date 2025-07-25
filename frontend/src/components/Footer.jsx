// export default function Footer() {
//   return (
//     <footer className="bg-white border-t border-border py-8 text-center shadow-inner">
//       <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-2">
//         <p className="text-neutral text-sm">© 2025 Odamz Royal Consultz Nig Ltd. All rights reserved.</p>
//         <p className="text-neutral text-sm flex flex-col sm:flex-row items-center gap-1">
//           <span>📞 07061198858</span>
//           <span className="hidden sm:inline">|</span>
//           <span>📧 <a href="mailto:info.odamzroyalty@gmail.com" className="text-accent underline hover:text-primary transition-colors">info.odamzroyalty@gmail.com</a></span>
//         </p>
//         <div className="flex gap-4 mt-2">
//           {/* Social icons placeholder */}
//           <a href="https://wa.me/2347061198858" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-primary transition-colors" aria-label="WhatsApp">
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16.72 13.06c-.29-.14-1.7-.84-1.96-.94-.26-.1-.45-.14-.64.14-.19.28-.74.94-.91 1.13-.17.19-.34.21-.63.07-.29-.14-1.22-.45-2.33-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.59.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.64-1.54-.88-2.11-.23-.56-.47-.48-.64-.49-.17-.01-.36-.01-.56-.01-.19 0-.5.07-.76.36-.26.29-1 1.01-1 2.46 0 1.45 1.03 2.85 1.18 3.05.14.19 2.03 3.1 4.92 4.23.69.3 1.23.48 1.65.61.69.22 1.32.19 1.81.12.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.25.17-1.36-.07-.11-.26-.18-.55-.32z"/></svg>
//           </a>
//           {/* Add more social icons as needed */}
//         </div>
//       </div>
//     </footer>
//   );
// }

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0d3b66] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Info */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center font-bold text-white text-xl shadow-md">
                O
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
                  href="/#contact"
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
              📍 Suite 12, Real Estate Plaza, Abuja, Nigeria
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
            <a
              href="https://wa.me/2347061198858"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-200 hover:text-accent transition-colors"
              aria-label="WhatsApp"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.33.27 2.59.74 3.75L1.38 21.75l6.22-1.63c1.11.62 2.37.98 3.66.98 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.18c-1.15 0-2.27-.27-3.27-.8l-.23-.13-3.69.97.98-3.58-.15-.24c-.55-1.06-.84-2.26-.84-3.49 0-4.57 3.73-8.3 8.3-8.3s8.3 3.73 8.3 8.3-3.73 8.27-8.3 8.27zm4.94-6.12c-.28-.14-1.66-.82-1.92-.92-.26-.1-.45-.14-.64.14-.19.28-.74.92-.91 1.11-.17.19-.34.21-.63.07-.29-.14-1.22-.45-2.33-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.59.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.64-1.54-.88-2.11-.23-.56-.47-.48-.64-.49-.17-.01-.36-.01-.56-.01-.19 0-.5.07-.76.36-.26.29-1 1.01-1 2.46 0 1.45 1.03 2.85 1.18 3.05.14.19 2.03 3.1 4.92 4.23.69.3 1.23.48 1.65.61.69.22 1.32.19 1.81.12.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.25.17-1.36-.07-.11-.26-.18-.55-.32z" />
              </svg>
            </a>
            <a
              href="https://twitter.com/odamzroyal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-200 hover:text-accent transition-colors"
              aria-label="Twitter"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com/company/odamzroyal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-200 hover:text-accent transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.327-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
          <p className="text-gray-300 text-sm">
            © {new Date().getFullYear()} Odamz Royal Consultz Nig Ltd. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  );
}