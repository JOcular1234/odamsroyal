import Link from 'next/link';

export const metadata = {
  title: 'Our Services | Odamz Royal Consultz Nig Ltd',
  description: 'Explore the range of real estate services offered by Odamz Royal Consultz Nig Ltd in Nigeria, including property management, construction, and legal advisory.',
  keywords: 'Odamz Royal, Real Estate Services Nigeria, Property Management, Construction, Legal Advisory',
  openGraph: {
    title: 'Our Services | Odamz Royal Consultz Nig Ltd',
    description: 'Comprehensive real estate services for clients in Nigeria.',
    url: 'https://yourdomain.com/services',
    type: 'website',
    images: ['https://yourdomain.com/preview.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Services | Odamz Royal Consultz Nig Ltd',
    description: 'Professional real estate services in Nigeria.',
  },
};

const services = [
  {
    title: 'Property Management',
    icon: (
      <svg className="w-10 h-10 mx-auto mb-4 text-accent" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 10l9-7 9 7v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8z"/><path d="M9 22V12h6v10"/></svg>
    ),
    desc: 'Comprehensive property management for residential and commercial properties, including tenant relations, rent collection, inspections, and maintenance.'
  },
  {
    title: 'Construction Projects',
    icon: (
      <svg className="w-10 h-10 mx-auto mb-4 text-accent" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 17v-6a2 2 0 012-2h2V7a2 2 0 012-2h2a2 2 0 012 2v2h2a2 2 0 012 2v6"/><path d="M16 21v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4"/></svg>
    ),
    desc: 'From architectural design to project supervision, we deliver quality construction services that meet client expectations.'
  },
  {
    title: 'Legal Advisory',
    icon: (
      <svg className="w-10 h-10 mx-auto mb-4 text-accent" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 17l4 4 4-4m-4-5v9"/><circle cx="12" cy="7" r="4"/></svg>
    ),
    desc: 'Expert legal support for property acquisition, land documentation, dispute resolution, and due diligence.'
  },
];

export default function ServicesPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-[#f97316]">Our Services</h1>
      <ul className="space-y-4">
        {services.map((service) => (
          <li key={service.title} className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{service.title}</h2>
            <p className="text-gray-600">{service.desc}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}