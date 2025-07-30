// // frontend/src/app/properties/pages.jsx
"use client";
import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion, useInView, Variants } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import PropertyCard from '../../components/PropertyCard';

type Property = {
  _id?: string;
  title: string;
  description?: string;
  images?: string[];
  image?: string;
  price?: string;
  location?: string;
  bedrooms?: string;
  bathrooms?: string;
  area?: string;
};

export default function PropertiesPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch properties with React Query
  const { data: properties = [], isLoading, error } = useQuery<Property[]>({
    queryKey: ['properties'],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/properties`);
      return res.data;
    },
  });

  const filteredProperties = properties.filter((property) =>
    property.title.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  // Refs for scroll animations
  const sectionRef = useRef<HTMLElement>(null);
  const isSectionInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Animation variants
  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6, ease: 'easeOut' },
    }),
  };

  return (
    <main className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <motion.section
        ref={sectionRef}
        variants={sectionVariants}
        initial="hidden"
        animate={isSectionInView ? 'visible' : 'hidden'}
      >
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-4 font-sans">
          Discover Our Properties
        </h2>
        <p className="text-base md:text-lg text-gray-600 text-center max-w-2xl mx-auto mb-10 font-sans">
          Browse our curated selection of properties, from luxurious homes to modern apartments, tailored to your needs.
        </p>
        <motion.div
          className="relative w-full max-w-md mx-auto mb-12"
          variants={cardVariants}
          initial="hidden"
          animate={isSectionInView ? 'visible' : 'hidden'}
        >
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search properties by keyword..."
            className="w-full p-3 pl-10 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#f97316] focus:border-[#f97316] transition-all duration-300 text-base font-sans shadow-sm placeholder-gray-400"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            aria-label="Search properties by keyword"
          />
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <svg
              className="animate-spin h-12 w-12 text-[#f97316]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-label="Loading properties"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>
        ) : error ? (
          <div
            className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-xl text-center font-sans text-lg"
            aria-live="polite"
          >
            Failed to load properties. Please try again later.
          </div>
        ) : filteredProperties.length === 0 ? (
          <p className="text-center text-gray-600 text-lg font-medium font-sans py-16">
            No properties found matching your search.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property, index) => (
              <motion.div
                key={property._id}
                variants={cardVariants}
                initial="hidden"
                animate={isSectionInView ? 'visible' : 'hidden'}
                custom={index}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>
    </main>
  );
}