// frontend/src/app/page.tsx
"use client";
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { motion, useInView, Variants } from 'framer-motion';
import PropertyCard from '../components/PropertyCard';
import Hero from '../components/Hero';

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

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [search, setSearch] = useState('');

  // Refs for scroll animations
  const aboutRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const propertiesRef = useRef<HTMLElement>(null);
  const isAboutInView = useInView(aboutRef, { once: true, margin: '-100px' });
  const isServicesInView = useInView(servicesRef, { once: true, margin: '-100px' });
  const isPropertiesInView = useInView(propertiesRef, { once: true, margin: '-100px' });

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

  // Animation variants with explicit type
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
    <main>
      {/* Hero Section */}
      <Hero />

      {/* About Section */}
      <motion.section
        id="about"
        ref={aboutRef}
        className="py-20 bg-gray-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={sectionVariants}
        initial="hidden"
        animate={isAboutInView ? 'visible' : 'hidden'}
      >
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-6 font-sans">
          About Odamz Royal Consultz
        </h2>
        <p className="text-base md:text-lg text-gray-600 text-center max-w-3xl mx-auto mb-8 font-sans">
          Odamz Royal Consultz Nig Ltd is a premier real estate firm in Nigeria, specializing in property management, site construction, and legal advisory. Our dedication to quality and client satisfaction sets us apart in delivering exceptional real estate solutions.
        </p>
        <div className="text-center">
          <Link href="/about">
            <button className="bg-[#f97316] text-white px-8 py-3 rounded-full font-semibold text-base hover:bg-[#e86a15] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2 shadow-lg hover:shadow-xl">
              Learn More
            </button>
          </Link>
        </div>
      </motion.section>

      {/* Services Section */}
      <motion.section
        id="services"
        ref={servicesRef}
        className="py-20 bg-white"
        variants={sectionVariants}
        initial="hidden"
        animate={isServicesInView ? 'visible' : 'hidden'}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-10 font-sans">
            Our Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Property Management',
                description:
                  'We manage tenant relations, rent collection, inspections, and maintenance for both residential and commercial properties with unmatched professionalism.',
                icon: '🏠',
              },
              {
                title: 'Construction Projects',
                description:
                  'From architectural design to project execution, we deliver high-quality construction solutions tailored to your vision.',
                icon: '🏗️',
              },
              {
                title: 'Legal Advisory',
                description:
                  'Our expert legal team provides support for property acquisition, documentation, dispute resolution, and due diligence.',
                icon: '⚖️',
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-2xl shadow-lg p-8 text-center transform hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
                variants={cardVariants}
                initial="hidden"
                animate={isServicesInView ? 'visible' : 'hidden'}
                custom={index}
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 font-sans">
                  {service.title}
                </h3>
                <p className="text-base text-gray-600 font-sans">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Properties Preview */}
      <motion.section
        id="properties"
        ref={propertiesRef}
        className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-50"
        variants={sectionVariants}
        initial="hidden"
        animate={isPropertiesInView ? 'visible' : 'hidden'}
      >
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-10 font-sans">
          Featured Properties
        </h2>
        <motion.div
          className="w-full max-w-md mx-auto mb-10"
          variants={cardVariants}
          initial="hidden"
          animate={isPropertiesInView ? 'visible' : 'hidden'}
        >
          <input
            type="text"
            placeholder="Search properties by keyword..."
            className="w-full p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#f97316] focus:border-[#f97316] transition-all duration-300 text-base font-sans shadow-sm"
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search properties"
          />
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property, index) => (
            <motion.div
              key={property._id}
              variants={cardVariants}
              initial="hidden"
              animate={isPropertiesInView ? 'visible' : 'hidden'}
              custom={index}
            >
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </div>
        <motion.div
          className="text-center mt-10"
          variants={cardVariants}
          initial="hidden"
          animate={isPropertiesInView ? 'visible' : 'hidden'}
          custom={filteredProperties.length}
        >
          <Link href="/properties">
            <button className="bg-[#f97316] text-white px-8 py-3 rounded-full font-semibold text-base hover:bg-[#e86a15] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2 shadow-lg hover:shadow-xl">
              View All Properties
            </button>
          </Link>
        </motion.div>
      </motion.section>
    </main>
  );
}