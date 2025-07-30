"use client";
import { JSX, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView, Variants } from 'framer-motion';
import { HomeIcon, BuildingOfficeIcon, ScaleIcon } from '@heroicons/react/24/outline';

type Service = {
  title: string;
  icon: JSX.Element;
  desc: string;
};

const services: Service[] = [
  {
    title: 'Property Management',
    icon: <HomeIcon className="w-10 h-10 mx-auto mb-4 text-[#f97316]" />,
    desc: 'Comprehensive property management for residential and commercial properties, including tenant relations, rent collection, inspections, and maintenance.',
  },
  {
    title: 'Construction Projects',
    icon: <BuildingOfficeIcon className="w-10 h-10 mx-auto mb-4 text-[#f97316]" />,
    desc: 'From architectural design to project supervision, we deliver quality construction services that meet client expectations.',
  },
  {
    title: 'Legal Advisory',
    icon: <ScaleIcon className="w-10 h-10 mx-auto mb-4 text-[#f97316]" />,
    desc: 'Expert legal support for property acquisition, land documentation, dispute resolution, and due diligence.',
  },
];

export default function ServicesPage() {
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
        aria-labelledby="services-heading"
      >
        <h1
          id="services-heading"
          className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-4 font-sans"
        >
          Our Services
        </h1>
        <p className="text-base md:text-lg text-gray-600 text-center max-w-2xl mx-auto mb-10 font-sans">
          Discover our comprehensive real estate services tailored to meet your needs in property management, construction, and legal advisory.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className="bg-white rounded-2xl shadow-lg p-8 text-center transform hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
              variants={cardVariants}
              initial="hidden"
              animate={isSectionInView ? 'visible' : 'hidden'}
              custom={index}
            >
              {service.icon}
              <h2 className="text-xl font-semibold text-gray-900 mb-3 font-sans">{service.title}</h2>
              <p className="text-base text-gray-600 font-sans">{service.desc}</p>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="text-center mt-10"
          variants={cardVariants}
          initial="hidden"
          animate={isSectionInView ? 'visible' : 'hidden'}
          custom={services.length}
        >
          <Link
            href="/contact"
            className="bg-[#f97316] text-white px-8 py-3 rounded-full font-semibold text-base hover:bg-[#e86a15] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2 shadow-lg hover:shadow-xl"
          >
            Contact Us
          </Link>
        </motion.div>
      </motion.section>
    </main>
  );
}