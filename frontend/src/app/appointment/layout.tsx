export const metadata = {
  title: 'Book an Appointment | Odamz Royal Consultz Nig Ltd',
  description: 'Schedule a consultation with Odamz Royal Consultz Nig Ltd for property management, construction, or legal advisory services in Nigeria.',
  keywords: 'Odamz Royal, Book Appointment Nigeria, Real Estate Consultation Abuja, Property Management, Legal Advisory',
  openGraph: {
    title: 'Book an Appointment | Odamz Royal Consultz Nig Ltd',
    description: 'Schedule a one-on-one session with our expert advisors for real estate services.',
    url: 'https://odamzroyal.vercel.app/appointment', // Your provided domain
    type: 'website',
    images: ['https://res.cloudinary.com/drkli5pwj/image/upload/v1753869926/about_rcku5z.png'], // Your provided image
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book an Appointment | Odamz Royal Consultz Nig Ltd',
    description: 'Book a consultation for professional real estate services in Nigeria.',
    images: ['https://res.cloudinary.com/drkli5pwj/image/upload/v1753869926/about_rcku5z.png'], // Your provided image
  },
};

export default function AppointmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}