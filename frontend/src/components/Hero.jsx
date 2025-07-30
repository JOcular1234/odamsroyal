// // frontend/src/components/Hero.jsx
"use client";
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function Hero() {
  const ref = useRef(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 50]); // Subtle parallax effect

  return (
    <section
      ref={ref}
      className="relative h-[80vh] flex items-center justify-center text-center text-white overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 w-full h-full z-0"
      >
        <Image
          src="https://images.unsplash.com/photo-1568605114967-8130f3a36994"
          alt="Odamz Royal Consultz Real Estate Hero"
          fill
          quality={90}
          priority
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30 z-10"></div>

      {/* Content */}
      <motion.div
        className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <motion.h2
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight font-sans"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
        >
          Find Your Dream Property with Odamz
        </motion.h2>
        <motion.p
          className="text-base md:text-lg text-gray-200 max-w-2xl mx-auto mb-8 font-sans"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
        >
          Property Management | Construction | Legal Advisory
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
        >
          <Link href="/#properties">
            <button
              className="bg-[#f97316] text-white px-8 py-3 rounded-full font-semibold text-base hover:bg-[#e86a15] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2 shadow-lg hover:shadow-xl"
              aria-label="Explore Properties"
            >
              Explore Properties
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}