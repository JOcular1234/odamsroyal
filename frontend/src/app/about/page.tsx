// // frontend/src/app/about/page.jsx
"use client";
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView, Variants } from 'framer-motion';
import { UserGroupIcon } from '@heroicons/react/24/outline';

export default function About() {
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
        aria-labelledby="about-heading"
      >
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-12 h-12 bg-[#f97316] rounded-full flex items-center justify-center mb-3 shadow-md transform hover:scale-105 transition-transform duration-300">
            <UserGroupIcon className="w-6 h-6 text-white" />
          </div>
          <h1
            id="about-heading"
            className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 font-sans"
          >
            About Odamz Royal Consultz
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl leading-relaxed font-sans">
            A premier real estate firm in Nigeria, dedicated to delivering excellence in property management, construction, and legal advisory with trust and transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-8 transform hover:-translate-y-1 transition-transform duration-300"
            variants={cardVariants}
            initial="hidden"
            animate={isSectionInView ? 'visible' : 'hidden'}
            custom={0}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 font-sans">Our Mission & Vision</h2>
            <p className="text-gray-600 text-base mb-4 leading-relaxed font-sans">
              At Odamz Royal Consultz Nig Ltd, our mission is to empower clients with the knowledge and resources needed to make informed real estate decisions. We specialize in personalized solutions for property acquisition, management, and legal processes.
            </p>
            <p className="text-gray-600 text-base mb-6 leading-relaxed font-sans">
              Our vision is to be Nigeria’s leading real estate consultancy, known for excellence, transparency, and client satisfaction in residential and commercial developments.
            </p>
            <div className="text-center">
              <Link
                href="/contact"
                className="inline-block bg-[#f97316] text-white px-6 py-3 rounded-full font-semibold text-base hover:bg-[#e86a15] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2 shadow-lg hover:shadow-xl"
              >
                Contact Us Today
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="relative rounded-2xl overflow-hidden shadow-lg"
            variants={cardVariants}
            initial="hidden"
            animate={isSectionInView ? 'visible' : 'hidden'}
            custom={1}
          >
            <Image
              src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
              alt="Odamz Royal Consultz Team"
              width={400}
              height={300}
              className="object-cover w-full h-48 md:h-64"
              priority
            />
            <div className="absolute inset-0 bg-[#f97316]/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-base font-medium text-center px-4 font-sans">
                Our team delivers exceptional real estate solutions.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8"
          variants={cardVariants}
          initial="hidden"
          animate={isSectionInView ? 'visible' : 'hidden'}
          custom={2}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center font-sans">Our Core Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {['Trust', 'Excellence', 'Transparency'].map((value, index) => (
              <motion.div
                key={value}
                className="text-center"
                variants={cardVariants}
                initial="hidden"
                animate={isSectionInView ? 'visible' : 'hidden'}
                custom={index + 3}
              >
                <h3 className="text-base font-medium text-gray-900 mb-1 font-sans">{value}</h3>
                <p className="text-gray-600 text-sm font-sans">
                  {value === 'Trust'
                    ? 'Building lasting relationships through integrity.'
                    : value === 'Excellence'
                    ? 'Delivering high-quality services that exceed expectations.'
                    : 'Ensuring clear communication in all transactions.'}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.section>
    </main>
  );
}