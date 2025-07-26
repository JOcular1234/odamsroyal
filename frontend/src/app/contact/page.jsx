// frontend/src/app/contact/page.jsx
'use client';
import { useState } from 'react';
import axios from 'axios';
import ContactInfo from '../../components/ContactInfo';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const validateForm = () => {
    const newErrors = { name: '', email: '', message: '' };
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
    console.log('Validation result:', { isValid, newErrors });
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
    console.log('Form data updated:', { ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
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
      console.error('Submission error:', error.response?.data, error.message);
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

  const isFormValid = () => {
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
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-40 absolute inset-0" aria-hidden="true"></div>
          <div className="relative bg-card rounded-xl shadow-card px-8 py-10 max-w-sm w-full flex flex-col items-center transform transition-all duration-300 scale-100">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mb-4" aria-hidden="true" />
            <h3 className="text-2xl font-bold text-primary mb-2 font-sans">Success!</h3>
            <p className="text-neutral text-center mb-6 font-sans">{status}</p>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-accent text-white rounded-xl font-semibold hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all duration-300 font-sans"
              aria-label="Send another message"
            >
              Send Another Message
            </button>
          </div>
        </div>
      )}

      <section id="contact" className="py-16 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-primary text-center mb-10 tracking-tight font-sans">
            Contact Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ContactInfo />
            <div className="bg-card rounded-xl shadow-card p-6 transform hover:-translate-y-1 transition-transform duration-300">
              <h3 className="text-xl font-semibold text-primary mb-4 font-sans">Send Us a Message</h3>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-neutral mb-1 font-sans"
                  >
                    Your Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className={`w-full px-4 py-3 border ${
                      errors.name ? 'border-error' : 'border-border'
                    } rounded-xl text-sm text-neutral focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300 font-sans`}
                    value={formData.name}
                    onChange={handleChange}
                    required
                    aria-label="Your Name"
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="text-error text-xs mt-1 font-sans" aria-live="polite">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-neutral mb-1 font-sans"
                  >
                    Your Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={`w-full px-4 py-3 border ${
                      errors.email ? 'border-error' : 'border-border'
                    } rounded-xl text-sm text-neutral focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300 font-sans`}
                    value={formData.email}
                    onChange={handleChange}
                    required
                    aria-label="Your Email"
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-error text-xs mt-1 font-sans" aria-live="polite">
                      {errors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-neutral mb-1 font-sans"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    className={`w-full px-4 py-3 border ${
                      errors.message ? 'border-error' : 'border-border'
                    } rounded-xl text-sm text-neutral focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300 font-sans resize-none h-32`}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    aria-label="Your Message"
                    aria-describedby={errors.message ? 'message-error' : undefined}
                  ></textarea>
                  <p className="text-xs text-neutral mt-1 font-sans">
                    {formData.message.length}/500 characters
                  </p>
                  {errors.message && (
                    <p id="message-error" className="text-error text-xs mt-1 font-sans" aria-live="polite">
                      {errors.message}
                    </p>
                  )}
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    className="px-6 py-2 bg-neutral text-white rounded-xl font-semibold hover:bg-accent-dark transition-all duration-300 font-sans"
                    onClick={handleReset}
                    aria-label="Reset form"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-accent text-white rounded-xl font-semibold hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all duration-300 font-sans disabled:opacity-50"
                    disabled={submitting || !isFormValid()}
                    aria-label="Send message"
                  >
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
                {status.includes('Error') && (
                  <p
                    className="text-center text-sm mt-2 text-error font-sans"
                    aria-live="polite"
                  >
                    {status}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}