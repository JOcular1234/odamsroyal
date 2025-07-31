export const metadata = {
    title: 'Frequently Asked Questions | Odamz Royal Consultz Nig Ltd',
    description: 'Find answers to common questions about property management, construction, and legal advisory services from Odamz Royal Consultz Nig Ltd in Nigeria.',
    keywords: 'FAQ, real estate Nigeria, property management, site construction, legal advisory, Odamz Royal, questions',
    openGraph: {
      title: 'Frequently Asked Questions | Odamz Royal Consultz Nig Ltd',
      description: 'Find answers to common questions about our real estate services in Nigeria.',
      url: 'https://odamsroyal.vercel.app/faq',
      type: 'website',
      images: ['https://res.cloudinary.com/drkli5pwj/image/upload/v1753977845/faq_pzssa7.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Frequently Asked Questions | Odamz Royal Consultz Nig Ltd',
      description: 'Find answers to common questions about our real estate services in Nigeria.',
      images: ['https://res.cloudinary.com/drkli5pwj/image/upload/v1753977845/faq_pzssa7.png'],
    },
  };
  
  export default function FAQLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  }