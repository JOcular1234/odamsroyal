// frontend/src/components/ContactInfo.jsx
import Link from 'next/link';
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function ContactInfo() {
  return (
    <div className="bg-card rounded-xl shadow-card p-6">
      <h3 className="text-xl font-semibold text-primary mb-4 font-sans">Get in Touch</h3>
      <div className="space-y-3">
        <p className="flex items-center text-neutral font-sans">
          <MapPinIcon className="w-5 h-5 mr-2 text-accent" aria-hidden="true" />
          CBD, Abuja (Center Business District ), Nigeria
        </p>
        <p className="flex items-center text-neutral font-sans">
          <PhoneIcon className="w-5 h-5 mr-2 text-accent" aria-hidden="true" />
          <Link href="tel:+2347061198858" className="text-accent hover:underline">
            07061198858
          </Link>
          ,{' '}
          <Link href="tel:+2348123485718" className="text-accent hover:underline">
            08123485718
          </Link>
        </p>
        <p className="flex items-center text-neutral font-sans">
          <EnvelopeIcon className="w-5 h-5 mr-2 text-accent" aria-hidden="true" />
          <Link
            href="mailto:info.odamzroyalty@gmail.com"
            className="text-accent hover:underline"
          >
            info.odamzroyalty@gmail.com
          </Link>
        </p>
      </div>
    </div>
  );
}