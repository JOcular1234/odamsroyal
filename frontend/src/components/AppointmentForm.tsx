// // frontend/src/components/AppointmentForm.jsx

"use client";
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion, useInView, Variants } from 'framer-motion';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

type FormData = {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  [key: string]: string; // Add index signature
};

type Errors = {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  [key: string]: string; // Add index signature
};

export default function AppointmentForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
  });
  const [errors, setErrors] = useState<Errors>({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
  });
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);
  const isFormInView = useInView(formRef, { once: true, margin: '-100px' });

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
    const newErrors: Errors = { name: '', email: '', phone: '', service: '', date: '' };
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

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^\+?\d{10,14}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number (10-14 digits)';
      isValid = false;
    }

    if (!formData.service) {
      newErrors.service = 'Please select a service';
      isValid = false;
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
      isValid = false;
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = 'Please select a future date';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/appointments`, {
        ...formData,
        date: new Date(formData.date),
      });
      setStatus(`Thank you for your appointment request! We will get back to you soon. Status: ${res.data.status || 'pending'}`);
      setFormData({ name: '', email: '', phone: '', service: '', date: '' });
      setErrors({ name: '', email: '', phone: '', service: '', date: '' });
      setModalOpen(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      setStatus('Error booking appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid = (): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (
      formData.name.length >= 2 &&
      /^[a-zA-Z\s]+$/.test(formData.name) &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      /^\+?\d{10,14}$/.test(formData.phone.replace(/\s/g, '')) &&
      formData.service !== '' &&
      formData.date !== '' &&
      new Date(formData.date) >= today // Fix: Compare with Date object
    );
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', phone: '', service: '', date: '' });
    setErrors({ name: '', email: '', phone: '', service: '', date: '' });
    setStatus('');
    setModalOpen(false);
  };

  return (
    <motion.div
      ref={formRef}
      className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto border border-[#f97316]/10 relative transition-transform duration-300 hover:-translate-y-1"
      variants={inputVariants}
      initial="hidden"
      animate={isFormInView ? 'visible' : 'hidden'}
      custom={0}
    >
      <motion.div
        className="flex items-center gap-2 mb-4"
        variants={inputVariants}
        custom={1}
      >
        <span className="inline-block w-2 h-8 bg-[#f97316] rounded-full"></span>
        <h2 className="text-xl md:text-2xl font-extrabold text-[#f97316] tracking-tight font-sans">
          Book an Appointment
        </h2>
      </motion.div>
      <motion.p
        className="text-base text-gray-600 mb-6 font-sans"
        variants={inputVariants}
        custom={2}
      >
        Appointments require admin approval. You will be notified once your appointment is approved.
      </motion.p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        {[
          { id: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your name' },
          { id: 'email', label: 'Email Address', type: 'email', placeholder: 'Enter your email' },
          { id: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'Enter your phone number' },
          { id: 'service', label: 'Select a Service', type: 'select' },
          { id: 'date', label: 'Appointment Date', type: 'date' },
        ].map((field, index) => (
          <motion.div
            key={field.id}
            variants={inputVariants}
            custom={index + 3}
          >
            <label
              htmlFor={field.id}
              className="block text-sm font-medium text-gray-700 mb-1 font-sans"
            >
              {field.label}
            </label>
            {field.type === 'select' ? (
              <select
                id={field.id}
                name={field.id}
                className={`w-full p-3 border ${errors[field.id] ? 'border-red-500' : 'border-gray-300'} rounded-full focus:ring-2 focus:ring-[#f97316] focus:border-[#f97316] transition-all duration-200 text-sm font-sans`}
                value={formData[field.id]}
                onChange={handleChange}
                required
                aria-label={field.label}
                aria-describedby={errors[field.id] ? `${field.id}-error` : undefined}
              >
                <option value="">Select a Service</option>
                <option value="property">Property Management</option>
                <option value="construction">Site Construction</option>
                <option value="legal">Legal Consultation</option>
              </select>
            ) : (
              <input
                id={field.id}
                name={field.id}
                type={field.type}
                placeholder={field.placeholder}
                className={`w-full p-3 border ${errors[field.id] ? 'border-red-500' : 'border-gray-300'} rounded-full focus:ring-2 focus:ring-[#f97316] focus:border-[#f97316] transition-all duration-200 text-sm font-sans`}
                value={formData[field.id]}
                onChange={handleChange}
                required
                aria-label={field.label}
                aria-describedby={errors[field.id] ? `${field.id}-error` : undefined}
              />
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
          custom={8}
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
            className="px-6 py-2 bg-[#f97316] text-white rounded-full font-semibold text-sm shadow-md hover:bg-[#e86a15] focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2 transition-all duration-300 disabled:opacity-60 font-sans"
            disabled={submitting || !isFormValid()}
            aria-label="Book appointment"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
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
                Booking...
              </span>
            ) : (
              'Book Appointment'
            )}
          </button>
        </motion.div>
        {status.includes('Error') && (
          <motion.p
            className="text-center text-sm mt-4 text-red-600 font-sans"
            variants={inputVariants}
            custom={9}
            aria-live="polite"
          >
            {status}
          </motion.p>
        )}
      </form>
      {modalOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-opacity duration-300"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm mx-4 border border-[#f97316]/20 relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-[#f97316] focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2"
              onClick={handleReset}
              aria-label="Close modal"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <motion.div
              className="flex flex-col items-center gap-3 mb-4"
              variants={inputVariants}
              custom={0}
            >
              <CheckCircleIcon className="w-12 h-12 text-green-500" />
              <h2 className="text-lg font-extrabold text-green-700 font-sans">Appointment Booked!</h2>
              <p className="text-gray-700 text-center text-base font-sans">{status}</p>
            </motion.div>
            <motion.button
              onClick={handleReset}
              className="w-full bg-[#f97316] text-white px-6 py-3 rounded-full font-semibold text-base hover:bg-[#e86a15] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2 font-sans"
              variants={inputVariants}
              custom={1}
              aria-label="Book another appointment"
            >
              Book Another Appointment
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}