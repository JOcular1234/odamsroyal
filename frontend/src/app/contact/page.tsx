// // frontend/src/app/contact/page.jsx
/// <reference types="framer-motion" />
"use client";
import { useState, useRef } from 'react';
import axios from 'axios';
import { motion, useInView, Variants } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import ContactInfo from '../../components/ContactInfo'; // Correct import (resolves to .tsx)

type FormData = {
  name: string;
  email: string;
  message: string;
  [key: string]: string;
};

type Errors = {
  name: string;
  email: string;
  message: string;
  [key: string]: string;
};

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Errors>({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const isSectionInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const inputVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6, ease: 'easeOut' },
    }),
  };

  const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = { name: '', email: '', message: '' };
    let isValid = true;

    if (!formData.name) {
      newErrors.name = 'Name is required';
      isValid = false;
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = 'Name can only contain letters and spaces';
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.message) {
      newErrors.message = 'Message is required';
      isValid = false;
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
      isValid = false;
    } else if (formData.message.length > 500) {
      newErrors.message = 'Message cannot exceed 500 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    setStatus('');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/inquiries`, formData);
      setStatus('Thank you for your message! We will get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
      setErrors({ name: '', email: '', message: '' });
      setShowSuccessModal(true);
    } catch (error) {
      setStatus('Error sending inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', message: '' });
    setErrors({ name: '', email: '', message: '' });
    setStatus('');
    setSubmitting(false);
    setShowSuccessModal(false);
  };

  const isFormValid = (): boolean => {
    return (
      formData.name.length >= 2 &&
      /^[a-zA-Z\s]+$/.test(formData.name) &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      formData.message.length >= 10 &&
      formData.message.length <= 500
    );
  };

  return (
    <>
      {showSuccessModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-opacity duration-300"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="relative bg-white rounded-2xl shadow-xl px-8 py-10 max-w-sm w-full flex flex-col items-center border border-[#f97316]/20">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-[#f97316] focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2"
              onClick={handleReset}
              aria-label="Close modal"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <motion.div variants={inputVariants} custom={0}>
              <CheckCircleIcon className="w-16 h-16 text-green-500 mb-4" />
            </motion.div>
            <motion.h2
              className="text-2xl font-extrabold text-green-700 mb-2 font-sans"
              variants={inputVariants}
              custom={1}
            >
              Success!
            </motion.h2>
            <motion.p
              className="text-gray-700 text-center text-base mb-6 font-sans"
              variants={inputVariants}
              custom={2}
            >
              {status}
            </motion.p>
            <motion.button
              onClick={handleReset}
              className="px-6 py-3 bg-[#f97316] text-white rounded-full font-semibold text-base hover:bg-[#e86a15] focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2 transition-all duration-300 font-sans"
              variants={inputVariants}
              custom={3}
              aria-label="Send another message"
            >
              Send Another Message
            </motion.button>
          </div>
        </motion.div>
      )}

      <main className="py-20 bg-gray-50 min-h-screen">
        <motion.section
          ref={sectionRef}
          variants={sectionVariants}
          initial="hidden"
          animate={isSectionInView ? 'visible' : 'hidden'}
          aria-labelledby="contact-heading"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.h1
            id="contact-heading"
            className="text-3xl md:text-4xl font-extrabold text-[#f97316] text-center mb-10 tracking-tight font-sans"
            variants={inputVariants}
            custom={0}
          >
            Contact Us
          </motion.h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div variants={inputVariants} custom={1}>
              <ContactInfo />
            </motion.div>
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-6 transform hover:-translate-y-1 transition-transform duration-300 border border-[#f97316]/10"
              variants={inputVariants}
              custom={2}
            >
              <h2 className="text-xl md:text-2xl font-semibold text-[#f97316] mb-4 font-sans">
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                {[
                  { id: 'name', label: 'Your Name', type: 'text', placeholder: 'Enter your name' },
                  { id: 'email', label: 'Your Email', type: 'email', placeholder: 'Enter your email' },
                  { id: 'message', label: 'Your Message', type: 'textarea', placeholder: 'Enter your message' },
                ].map((field, index) => (
                  <motion.div key={field.id} variants={inputVariants} custom={index + 3}>
                    <label
                      htmlFor={field.id}
                      className="block text-sm font-medium text-gray-700 mb-1 font-sans"
                    >
                      {field.label}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        id={field.id}
                        name={field.id}
                        className={`w-full px-4 py-3 border ${
                          errors[field.id] ? 'border-red-500' : 'border-gray-300'
                        } rounded-2xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#f97316] transition-all duration-300 font-sans resize-none h-32`}
                        value={formData[field.id]}
                        onChange={handleChange}
                        required
                        aria-label={field.label}
                        aria-describedby={errors[field.id] ? `${field.id}-error` : undefined}
                      />
                    ) : (
                      <input
                        id={field.id}
                        name={field.id}
                        type={field.type}
                        placeholder={field.placeholder}
                        className={`w-full px-4 py-3 border ${
                          errors[field.id] ? 'border-red-500' : 'border-gray-300'
                        } rounded-full text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#f97316] transition-all duration-300 font-sans`}
                        value={formData[field.id]}
                        onChange={handleChange}
                        required
                        aria-label={field.label}
                        aria-describedby={errors[field.id] ? `${field.id}-error` : undefined}
                      />
                    )}
                    {field.id === 'message' && (
                      <p className="text-xs text-gray-600 mt-1 font-sans">
                        {formData.message.length}/500 characters
                      </p>
                    )}
                    {errors[field.id] && (
                      <p
                        id={`${field.id}-error`}
                        className="text-red-500 text-xs mt-1 font-sans"
                        aria-live="polite"
                      >
                        {errors[field.id]}
                      </p>
                    )}
                  </motion.div>
                ))}
                <motion.div
                  className="flex justify-end gap-3 mt-4"
                  variants={inputVariants}
                  custom={6}
                >
                  <button
                    type="button"
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-full font-semibold text-sm shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2 transition-all duration-200 font-sans"
                    onClick={handleReset}
                    aria-label="Reset form"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#f97316] text-white rounded-full font-semibold text-sm shadow-md hover:bg-[#e86a15] focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 font-sans"
                    disabled={submitting || !isFormValid()}
                    aria-label="Send message"
                  >
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </motion.div>
                {status.includes('Error') && (
                  <motion.p
                    className="text-center text-sm mt-4 text-red-600 font-sans"
                    variants={inputVariants}
                    custom={7}
                    aria-live="polite"
                  >
                    {status}
                  </motion.p>
                )}
              </form>
            </motion.div>
          </div>
        </motion.section>
      </main>
    </>
  );
}