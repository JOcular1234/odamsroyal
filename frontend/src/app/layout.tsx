'use client'
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './globals.css';
import ClientLayout from '../components/ClientLayout';

// Move metadata to a separate component or handle it differently since we're using 'use client'
export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Create QueryClient instance with useState to ensure it's stable across re-renders
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  }));

  return (
    <html lang="en">
      <head>
        <title>Odamz Royal Consultz Nig Ltd | Real Estate Nigeria</title>
        <meta name="description" content="Professional real estate services in Nigeria, including property management, construction, and legal advisory." />
        <meta name="keywords" content="Odamz Royal, Real Estate Nigeria, Property Management Abuja, Land Sales Nigeria, Legal Advice Property, Construction Services Abuja" />
        <meta property="og:title" content="Odamz Royal Consultz Nig Ltd" />
        <meta property="og:description" content="Trusted real estate company in Nigeria providing property management, legal consulting, and site development." />
        <meta property="og:url" content="https://yourdomain.com" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://yourdomain.com/preview.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Odamz Royal Consultz Nig Ltd" />
        <meta name="twitter:description" content="Top-rated Nigerian real estate agency for legal advice, site construction, and land acquisition." />
      </head>
      <body className="font-sans bg-background text-neutral">
        <QueryClientProvider client={queryClient}>
          <ClientLayout>{children}</ClientLayout>
        </QueryClientProvider>
      </body>
    </html>
  );
}