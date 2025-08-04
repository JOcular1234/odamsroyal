export const metadata = {
    title: 'Property Details | Odamz Royal Consultz Nig Ltd',
    description: 'View detailed information about properties offered by Odamz Royal Consultz Nig Ltd in Nigeria.',
    openGraph: {
      title: 'Property Details | Odamz Royal Consultz Nig Ltd',
      description: 'Explore property details and inquire about real estate opportunities in Nigeria.',
      url: 'https://odamsroyal.vercel.app/properties/[id]',
      type: 'website',
      images: ['https://res.cloudinary.com/drkli5pwj/image/upload/v1753880711/odamzlogo_cqgm0c.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Property Details | Odamz Royal Consultz Nig Ltd',
      description: 'Explore property details and inquire about real estate opportunities in Nigeria.',
      images: ['https://res.cloudinary.com/drkli5pwj/image/upload/v1753880711/odamzlogo_cqgm0c.jpg'],
    },
  };
  
  export default function PropertyDetailLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  }