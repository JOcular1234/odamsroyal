// frontend/src/components/PropertyCard.jsx
"use client";
import { useState, useRef } from 'react';
import axios from 'axios';
import { FiShare2 } from 'react-icons/fi';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function PropertyCard({ property }) {
  const images = Array.isArray(property.images) && property.images.length > 0
    ? property.images.slice(0, 5)
    : ['https://via.placeholder.com/400x300?text=No+Image'];

  const [mainIdx, setMainIdx] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const touchStartX = useRef(null);
  const maxMessageLength = 100; // Character limit for message

  // Swipe handlers for mobile carousel
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 50) {
      if (deltaX < 0 && mainIdx < images.length - 1) setMainIdx(mainIdx + 1);
      if (deltaX > 0 && mainIdx > 0) setMainIdx(mainIdx - 1);
    }
    touchStartX.current = null;
  };

  // Share logic
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/properties/${property._id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: property.description,
          url: shareUrl,
        });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {}
    }
  };

  // Inquiry form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.message.length > maxMessageLength) {
      setError(`Message must be ${maxMessageLength} characters or less.`);
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/inquiries`, {
        ...formData,
        propertyId: property._id,
        cardUrl: `${window.location.origin}/properties/${property._id}`,
      });
      setFormData({ name: '', email: '', message: '' });
      setModalOpen(false);
      setSuccessModalOpen(true);
      setTimeout(() => setSuccessModalOpen(false), 2000);
    } catch {
      setError('Failed to send inquiry.');
    }
    setSubmitting(false);
  };

  return (
    <>
      {/* Success Modal */}
      {successModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-30 absolute inset-0" aria-hidden="true"></div>
          <div className="relative bg-card rounded-xl shadow-card px-8 py-8 max-w-sm w-full flex flex-col items-center transform transition-all duration-300 scale-100">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mb-4" aria-hidden="true" />
            <h3 className="text-2xl font-bold text-primary mb-2 font-sans">Success!</h3>
            <p className="text-neutral text-center mb-4 font-sans">
              Your inquiry has been sent successfully. We will get back to you soon!
            </p>
            <button
              onClick={() => setSuccessModalOpen(false)}
              className="px-6 py-2 bg-button text-white rounded-xl font-semibold hover:bg-accent focus:outline-none focus:ring-2 focus:ring-button focus:ring-offset-2 transition-all duration-300 font-sans"
              aria-label="Close success modal"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Property Card */}
      <div className="bg-card rounded-xl shadow-card p-4 max-w-sm w-full h-[480px] flex flex-col mx-auto transition-all duration-300 hover:shadow-xl">
        {/* Image Carousel */}
        <div
          className="relative w-full flex flex-col items-center"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={images[mainIdx]}
            alt={property.title}
            className="rounded-xl object-cover w-full h-60 mb-3 transition-all duration-300"
          />
          <div className="flex gap-1.5 overflow-x-auto">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className={`rounded-md cursor-pointer border-2 ${
                  mainIdx === idx ? 'border-accent ring-1 ring-accent' : 'border-border'
                } object-cover w-16 h-10 transition-all duration-200 hover:opacity-90`}
                onClick={() => setMainIdx(idx)}
              />
            ))}
          </div>
        </div>

        {/* Title & Description */}
        <div className="mt-4">
          <h4 className="text-lg font-bold text-primary truncate font-sans">{property.title}</h4>
          <p className="text-neutral text-sm mt-1 line-clamp-2 font-sans">{property.description}</p>
        </div>

        {/* Actions Row */}
        <div className="flex items-center justify-between mt-4">
          <button
            className="bg-button text-white px-4 py-2 rounded-xl font-semibold hover:bg-accent focus:outline-none focus:ring-2 focus:ring-button focus:ring-offset-1 transition-all duration-300 font-sans text-sm"
            onClick={() => setModalOpen(true)}
            aria-label="Send Inquiry"
          >
            Send Inquiry
          </button>
          <button
            className="relative text-neutral hover:text-accent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1"
            onClick={handleShare}
            aria-label="Share Property"
          >
            <FiShare2 className="h-5 w-5" />
            {copied && (
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-primary text-white text-xs rounded-md px-2 py-1 shadow-sm font-sans">
                Link Copied!
              </span>
            )}
          </button>
        </div>

        {/* Inquiry Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
            <div className="bg-card rounded-xl shadow-card p-6 w-full max-w-md mx-4 transform transition-all duration-300 scale-100">
              <button
                className="absolute top-3 right-3 text-neutral hover:text-primary text-xl focus:outline-none focus:ring-2 focus:ring-button focus:ring-offset-1 font-sans"
                onClick={() => setModalOpen(false)}
                aria-label="Close Inquiry Modal"
              >
                ×
              </button>
              <h3 className="text-xl font-bold text-primary mb-4 font-sans">
                Inquire About {property.title}
              </h3>
              {error && (
                <div
                  className="bg-error/10 border-l-4 border-error text-error p-4 rounded-xl mb-4 font-sans"
                  aria-live="polite"
                >
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-primary mb-1 font-sans"
                  >
                    Your Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    className="w-full p-3 border border-border rounded-xl text-sm text-neutral focus:outline-none focus:ring-2 focus:ring-button focus:border-button transition-all duration-200 font-sans"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-primary mb-1 font-sans"
                  >
                    Your Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="w-full p-3 border border-border rounded-xl text-sm text-neutral focus:outline-none focus:ring-2 focus:ring-button focus:border-button transition-all duration-200 font-sans"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-primary mb-1 font-sans"
                  >
                    Your Inquiry
                  </label>
                  <textarea
                    id="message"
                    placeholder="Type your inquiry here..."
                    className="w-full p-3 border border-border rounded-xl text-sm text-neutral focus:outline-none focus:ring-2 focus:ring-button focus:border-button transition-all duration-200 resize-none h-24 font-sans"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value.slice(0, maxMessageLength) })
                    }
                    required
                  ></textarea>
                  <p className="text-sm text-neutral mt-1 font-sans">
                    {formData.message.length}/{maxMessageLength} characters
                  </p>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    className="px-4 py-2 bg-neutral text-white rounded-xl font-semibold hover:bg-accent-dark transition-all duration-300 font-sans text-sm"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-button text-white rounded-xl font-semibold hover:bg-accent focus:outline-none focus:ring-2 focus:ring-button focus:ring-offset-1 transition-all duration-300 font-sans text-sm disabled:opacity-50"
                    disabled={submitting}
                  >
                    {submitting ? 'Sending...' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}