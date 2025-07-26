// frontend/src/app/properties/pages.jsx
'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Metadata } from 'next';
import PropertyCard from '../../components/PropertyCard';

export const Metadata = {
  title: 'Properties | Odamz Royal Consultz Nig Ltd',
  description: 'Explore our featured real estate properties in Nigeria, including residential and commercial listings in Abuja, Lekki, and more.',
  keywords: 'Odamz Royal, Real Estate Properties Nigeria, Property Listings Abuja, Land Sales Nigeria, Residential Properties',
  openGraph: {
    title: 'Properties | Odamz Royal Consultz Nig Ltd',
    description: 'Discover premium real estate listings for sale and rent across Nigeria.',
    url: 'https://yourdomain.com/properties',
    type: 'website',
    images: ['https://yourdomain.com/preview.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Properties | Odamz Royal Consultz Nig Ltd',
    description: 'Browse our exclusive property listings in Nigeria.',
  },
};

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/properties`);
        setProperties(res.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    }
    fetchProperties();
  }, []);

  const filteredProperties = properties.filter((property) =>
    property.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section id="properties" className="py-20 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">
            Featured Properties
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover our exclusive selection of residential and commercial properties across Nigeria, tailored to your needs.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-12 max-w-lg mx-auto">
          <input
            type="text"
            placeholder="Search properties by keyword..."
            className="w-full p-4 pr-12 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent text-gray-700 bg-white transition-all duration-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search properties"
          />
          <svg
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <div
                key={property._id}
                className="transform hover:-translate-y-2 transition-transform duration-300"
              >
                <PropertyCard property={property} />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-full text-lg">
              No properties found matching your search.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}