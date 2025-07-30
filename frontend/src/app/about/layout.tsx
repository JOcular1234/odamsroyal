export const metadata = {
  title: 'About Us | Odamz Royal Consultz Nig Ltd',
  description: 'Learn more about Odamz Royal Consultz Nig Ltd, our mission, vision, and values in the Nigerian real estate industry.',
  keywords: 'Odamz Royal, About Real Estate Nigeria, Company Profile Abuja, Property Management, Construction, Legal Advisory',
  openGraph: {
    title: 'About Us | Odamz Royal Consultz Nig Ltd',
    description: 'Discover our story, team, and commitment to excellence in real estate services.',
    url: 'https://odamsroyal.vercel.app/about', // Replace with your actual domain
    type: 'website',
    images: ['https://res.cloudinary.com/drkli5pwj/image/upload/v1753869926/about_rcku5z.png'], // Replace with your actual image
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Odamz Royal Consultz Nig Ltd',
    description: 'Get to know our company and team in Nigeria.',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}