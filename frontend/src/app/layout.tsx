// // frontend/src/app/layout.tsx
// import './globals.css';
// import Header from '../components/Header';
// import Footer from '../components/Footer';

// export const metadata = {
//   title: 'Odamz Royal Consultz Nig Ltd | Real Estate Nigeria',
//   description: 'Professional real estate services in Nigeria, including property management, construction, and legal advisory.',
//   keywords: 'Odamz Royal, Real Estate Nigeria, Property Management Abuja, Land Sales Nigeria, Legal Advice Property, Construction Services Abuja',
//   openGraph: {
//     title: 'Odamz Royal` Consultz Nig Ltd',
//     description: 'Trusted real estate company in Nigeria providing property management, legal consulting, and site development.',
//     url: 'https://yourdomain.com',
//     type: 'website',
//     images: ['https://yourdomain.com/preview.jpg'],
//   },
//   twitter: {
//     card: 'summary_large_image',
//     title: 'Odamz Royal Consultz Nig Ltd',
//     description: 'Top-rated Nigerian real estate agency for legal advice, site construction, and land acquisition.',
//   },
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body>
//         <Header />
//         {children}
//         <Footer />
//       </body>
//     </html>
//   );
// }

import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Odamz Royal Consultz Nig Ltd | Real Estate Nigeria',
  description:
    'Professional real estate services in Nigeria, including property management, construction, and legal advisory.',
  keywords:
    'Odamz Royal, Real Estate Nigeria, Property Management Abuja, Land Sales Nigeria, Legal Advice Property, Construction Services Abuja',
  openGraph: {
    title: 'Odamz Royal Consultz Nig Ltd',
    description:
      'Trusted real estate company in Nigeria providing property management, legal consulting, and site development.',
    url: 'https://yourdomain.com',
    type: 'website',
    images: ['https://yourdomain.com/preview.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Odamz Royal Consultz Nig Ltd',
    description:
      'Top-rated Nigerian real estate agency for legal advice, site construction, and land acquisition.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans bg-background text-neutral">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
