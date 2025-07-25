// frontend/src/app/appointment/page.jsx
import AppointmentForm from '../../components/AppointmentForm';
import Link from 'next/link';

export const metadata = {
  title: 'Book an Appointment | Odamz Royal Consultz Nig Ltd',
  description: 'Schedule a consultation with Odamz Royal Consultz Nig Ltd for property management, construction, or legal advisory services in Nigeria.',
  keywords: 'Odamz Royal, Book Appointment Nigeria, Real Estate Consultation Abuja, Property Management, Legal Advisory',
  openGraph: {
    title: 'Book an Appointment | Odamz Royal Consultz Nig Ltd',
    description: 'Schedule a one-on-one session with our expert advisors for real estate services.',
    url: 'https://www.odamzroyal.com/appointment', // Update with your actual domain
    type: 'website',
    images: ['https://www.odamzroyal.com/images/appointment-preview.jpg'], // Update with actual image URL
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book an Appointment | Odamz Royal Consultz Nig Ltd',
    description: 'Book a consultation for professional real estate services in Nigeria.',
  },
};

export default function Appointment() {
  return (
    <section id="appointment" className="py-20 min-h-screen bg-[#f9fafb] flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl mx-auto bg-white/95 rounded-2xl shadow-2xl border border-[#f97316]/10 px-6 py-12 md:px-12 md:py-14 flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#f97316] text-center mb-4 tracking-tight font-sans drop-shadow-sm">
          Book an Appointment
        </h2>
        <p className="text-base md:text-lg text-gray-700 text-center max-w-xl mx-auto mb-8 font-sans">
          Schedule a one-on-one session with our legal or property advisors to discuss your real estate needs.
        </p>
        <div className="w-full max-w-md mx-auto">
          <AppointmentForm />
        </div>
      </div>
    </section>
  );
}