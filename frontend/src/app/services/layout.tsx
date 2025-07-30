export const metadata = {
  title: 'Our Services | Odamz Royal Consultz Nig Ltd',
  description: 'Explore the range of real estate services offered by Odamz Royal Consultz Nig Ltd in Nigeria, including property management, construction, and legal advisory.',
  keywords: 'Odamz Royal, Real Estate Services Nigeria, Property Management, Construction, Legal Advisory',
  openGraph: {
    title: 'Our Services | Odamz Royal Consultz Nig Ltd',
    description: 'Comprehensive real estate services for clients in Nigeria.',
    url: 'https://odamzroyal.vercel.app/services', // Replace with your actual domain
    type: 'website',
    images: ['https://res.cloudinary.com/drkli5pwj/image/upload/v1753870038/services_wzople.png'], // Replace with your actual image
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Services | Odamz Royal Consultz Nig Ltd',
    description: 'Professional real estate services in Nigeria.',
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}