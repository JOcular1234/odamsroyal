// frontend/src/app/faq/page.tsx
"use client";
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, useInView, Variants } from 'framer-motion';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

type Faq = { _id?: string; question: string; answer: string };

export default function FAQPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const isSectionInView = useInView(sectionRef, { once: true, margin: '-100px' });

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/faq/public`)
      .then((res) => setFaqs(res.data))
      .catch((_error) => setFaqs([])); // Use _error to suppress unused variable warning
  }, []);

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6, ease: 'easeOut' },
    }),
  };

  const answerVariants: Variants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.3, ease: 'easeOut' } },
  };

  return (
    <main className="py-20 bg-gray-50 min-h-screen">
      <motion.section
        ref={sectionRef}
        variants={sectionVariants}
        initial="hidden"
        animate={isSectionInView ? 'visible' : 'hidden'}
        aria-labelledby="faq-heading"
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.h1
          id="faq-heading"
          className="text-3xl md:text-4xl font-extrabold text-[#f97316] text-center mb-10 tracking-tight font-sans"
          variants={itemVariants}
          custom={0}
        >
          Frequently Asked Questions
        </motion.h1>
        <div className="space-y-4">
          {faqs.length === 0 && (
            <motion.div
              className="text-center text-gray-500 font-sans"
              variants={itemVariants}
              custom={1}
            >
              No FAQs found.
            </motion.div>
          )}
          {faqs.map((faq: Faq, idx: number) => (
            <motion.div
              key={faq._id || idx}
              className="bg-white rounded-2xl shadow-xl p-6 border border-[#f97316]/10 transform hover:-translate-y-1 transition-transform duration-300"
              variants={itemVariants}
              custom={idx + 1}
            >
              <button
                className="flex justify-between items-center w-full text-left focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2 rounded-full"
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                aria-expanded={openIdx === idx}
                aria-controls={`faq-answer-${idx}`}
              >
                <span className="text-lg font-semibold text-gray-900 font-sans">
                  {/* {faq.question} */}
                  <span className="mr-2 text-[#f97316] font-bold">{idx + 1}.</span>{faq.question}
                </span>
                <span className="ml-4 p-2 bg-[#f97316]/10 rounded-full">
                  {openIdx === idx ? (
                    <MinusIcon className="w-5 h-5 text-[#f97316]" aria-hidden="true" />
                  ) : (
                    <PlusIcon className="w-5 h-5 text-[#f97316]" aria-hidden="true" />
                  )}
                </span>
              </button>
              {openIdx === idx && (
                <motion.div
                  id={`faq-answer-${idx}`}
                  className="mt-4 text-gray-700 text-base font-sans"
                  variants={answerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {faq.answer}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.section>
    </main>
  );
}