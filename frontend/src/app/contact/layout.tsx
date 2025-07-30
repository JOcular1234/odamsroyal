export const metadata = {
  title: 'Contact Us | Odamz Royal Consultz Nig Ltd',
  description: 'Get in touch with Odamz Royal Consultz Nig Ltd for property management, construction, or legal advisory services in Nigeria.',
  keywords: 'Odamz Royal, Contact Real Estate Nigeria, Property Management Abuja, Legal Advisory',
  openGraph: {
    title: 'Contact Us | Odamz Royal Consultz Nig Ltd',
    description: 'Reach out to our team for expert real estate services in Nigeria.',
    url: 'https://odamzroyal.vercel.app/contact', // Your domain
    type: 'website',
    images: ['https://res.cloudinary.com/drkli5pwj/image/upload/v1753869926/about_rcku5z.png'], // Your image
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | Odamz Royal Consultz Nig Ltd',
    description: 'Reach out to our team for expert real estate services in Nigeria.',
    images: ['https://res.cloudinary.com/drkli5pwj/image/upload/v1753869926/about_rcku5z.png'],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}