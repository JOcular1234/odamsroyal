'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import PropertyCard from '../components/PropertyCard';

type Property = {
  _id?: string;
  title: string;
  description?: string;
  images?: string[];
  image?: string;
  // Add more fields as needed based on your API response
};
import Hero from '../components/Hero';
 

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/properties`);
        setProperties(res.data.slice(0, 3)); // Limit to 3 properties for preview
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    }
    fetchProperties();
  }, []);

  const filteredProperties = properties.filter((property: Property) =>
    property.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main>
      {/* Hero Section */}
      <Hero />

      {/* About Section */}
      <section id="about" className="py-16 bg-gray-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
          About Us
        </h2>
        <p className="text-sm md:text-base text-gray-600 text-center max-w-2xl mx-auto mb-6">
          Odamz Royal Consultz Nig Ltd is a full-service real estate firm based in Nigeria, specializing in property management, site construction, and legal advisory. Our commitment to excellence sets us apart.
        </p>
        <div className="text-center">
          <Link href="/about">
            <button className="bg-[#f97316] text-white px-6 py-2.5 rounded-md font-medium text-sm hover:bg-[#e86a15] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-1">
              Learn More
            </button>
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
            Our Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 text-center transform hover:-translate-y-1 transition-transform duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Property Management</h3>
              <p className="text-sm text-gray-600">
                We handle tenant relations, rent collection, inspections, and maintenance for residential and commercial properties.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center transform hover:-translate-y-1 transition-transform duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Construction Projects</h3>
              <p className="text-sm text-gray-600">
                From architectural designs to construction supervision, we deliver quality results that meet client expectations.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center transform hover:-translate-y-1 transition-transform duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Legal Advisory</h3>
              <p className="text-sm text-gray-600">
                We offer legal support for property acquisition, land documentation, disputes, and due diligence services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Preview */}
      <section id="properties" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
          Featured Properties
        </h2>
        <input
          type="text"
          placeholder="Search properties by keyword..."
          className="w-full max-w-md mx-auto p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f97316] focus:border-[#f97316] transition-colors duration-200 text-sm mb-8"
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property: Property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/properties">
            <button className="bg-[#f97316] text-white px-6 py-2.5 rounded-md font-medium text-sm hover:bg-[#e86a15] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-1">
              View All Properties
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}