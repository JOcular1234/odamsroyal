// // frontend/src/components/ContactInfo.jsx
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function ContactInfo() {
  const inputVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6, ease: 'easeOut' },
    }),
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-xl p-6 border border-[#f97316]/10 transform hover:-translate-y-1 transition-transform duration-300"
      variants={inputVariants}
      initial="hidden"
      animate="visible"
      custom={0}
    >
      <motion.h2
        className="text-xl md:text-2xl font-semibold text-[#f97316] mb-4 font-sans"
        variants={inputVariants}
        custom={1}
      >
        Get in Touch
      </motion.h2>
      <div className="space-y-4">
        <motion.p
          className="flex items-center text-gray-700 font-sans"
          variants={inputVariants}
          custom={2}
        >
          <MapPinIcon className="w-5 h-5 mr-2 text-[#f97316]" aria-hidden="true" />
          CBD, Abuja (Center Business District), Nigeria
        </motion.p>
        <motion.p
          className="flex items-center text-gray-700 font-sans"
          variants={inputVariants}
          custom={3}
        >
          <PhoneIcon className="w-5 h-5 mr-2 text-[#f97316]" aria-hidden="true" />
          <Link href="tel:+2347061198858" className="text-[#f97316] hover:underline">
            07061198858
          </Link>
          ,{' '}
          <Link href="tel:+2348123485718" className="text-[#f97316] hover:underline">
            08123485718
          </Link>
        </motion.p>
        <motion.p
          className="flex items-center text-gray-700 font-sans"
          variants={inputVariants}
          custom={4}
        >
          <EnvelopeIcon className="w-5 h-5 mr-2 text-[#f97316]" aria-hidden="true" />
          <Link
            href="mailto:info.odamzroyalty@gmail.com"
            className="text-[#f97316] hover:underline"
          >
            info.odamzroyalty@gmail.com
          </Link>
        </motion.p>
        <motion.div
          className="mt-6 rounded-2xl overflow-hidden shadow-md"
          variants={inputVariants}
          custom={5}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3939.6787003048037!2d7.491302314754296!3d9.076478893496138!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0b8c1c8c1c8d%3A0x1c8c1c8c1c8c1c8d!2sCentral%20Business%20District%2C%20Abuja%2C%20Nigeria!5e0!3m2!1sen!2sng!4v1698765432109!5m2!1sen!2sng"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Odamz Royal Consultz Location in CBD, Abuja"
            aria-label="Map showing Odamz Royal Consultz location in CBD, Abuja"
          ></iframe>
        </motion.div>
      </div>
    </motion.div>
  );
}