// // frontend/src/app/appointment/page.jsx
"use client";
import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView, Variants } from 'framer-motion';
import AppointmentForm from '../../components/AppointmentForm';

export default function Appointment() {
  const sectionRef = useRef<HTMLElement>(null);
  const isSectionInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const contentVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6, ease: 'easeOut' },
    }),
  };

  return (
    <main className="py-20 min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <motion.section
        ref={sectionRef}
        variants={sectionVariants}
        initial="hidden"
        animate={isSectionInView ? 'visible' : 'hidden'}
        aria-labelledby="appointment-heading"
        className="w-full max-w-2xl mx-auto bg-white/95 rounded-2xl shadow-2xl border border-[#f97316]/10 px-6 py-12 md:px-12 md:py-14 flex flex-col items-center"
      >
        <motion.h1
          id="appointment-heading"
          className="text-3xl md:text-4xl font-extrabold text-[#f97316] text-center mb-4 tracking-tight font-sans drop-shadow-sm"
          variants={contentVariants}
          custom={0}
        >
          Book an Appointment
        </motion.h1>
        <motion.p
          className="text-base md:text-lg text-gray-700 text-center max-w-xl mx-auto mb-8 font-sans"
          variants={contentVariants}
          custom={1}
        >
          Schedule a one-on-one session with our legal or property advisors to discuss your real estate needs.
        </motion.p>
        <motion.div
          className="w-full max-w-md mx-auto"
          variants={contentVariants}
          custom={2}
        >
          <AppointmentForm />
        </motion.div>
        <motion.div
          className="mt-6 text-center"
          variants={contentVariants}
          custom={3}
        >
          <Link
            href="/contact"
            className="inline-block bg-[#f97316] text-white px-6 py-3 rounded-full font-semibold text-base hover:bg-[#e86a15] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2 shadow-lg hover:shadow-xl font-sans"
            aria-label="Contact us for more information"
          >
            Contact Us
          </Link>
        </motion.div>
      </motion.section>
    </main>
  );
}