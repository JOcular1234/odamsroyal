// // // // frontend/src/app/properties/[id]/page.jsx
// frontend/src/app/properties/[id]/page.jsx
"use client";
import { useEffect, useState, useRef, Component, ReactNode } from 'react';
import { useParams } from 'next/navigation';
import { motion, useInView, Variants } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import axios, { AxiosError } from 'axios'; // Added AxiosError import
import dynamic from 'next/dynamic';
const PropertyCard = dynamic(() => import('../../../components/PropertyCard'), { ssr: false });

// Error Boundary Component
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: string | null }> {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="py-10 px-4 max-w-5xl mx-auto bg-gray-50">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <h2 className="text-2xl font-bold text-red-600 font-sans">Something Went Wrong</h2>
            <p className="text-gray-700 mt-2 font-sans">{this.state.error}</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

type Property = {
  _id: string;
  title: string;
  price?: number;
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  status?: string;
  description?: string;
  images?: string[];
};

type FormData = {
  name: string;
  email: string;
  message: string;
};

export default function PropertyDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mainIdx, setMainIdx] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [otherProperties, setOtherProperties] = useState<Property[]>([]);
  const [otherLoading, setOtherLoading] = useState(true);
  const [otherError, setOtherError] = useState<string | null>(null);

  const sectionRef = useRef<HTMLDivElement>(null);
  const isSectionInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://odamsroyal.onrender.com/api';
  const maxMessageLength = 100;

  useEffect(() => {
    console.log('Params:', params);
    console.log('ID:', id);
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    async function fetchProperty() {
      fetchOtherProperties();
      if (!id) {
        console.log('No ID provided');
        setError('Invalid property ID');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get<Property>(`${API_URL}/properties/${id}`);
        console.log('API response:', res.data);
        setProperty(res.data);
      } catch (_error: unknown) {
        let errorMessage = 'Failed to fetch property details';
        if (_error instanceof Error) {
          console.error('Fetch error:', _error.message);
          errorMessage = _error.message;
        } else {
          console.error('Fetch error:', _error);
        }
        setError(errorMessage);
        setProperty(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProperty();
  }, [id, API_URL, fetchOtherProperties, params]);

  async function fetchOtherProperties() {
    setOtherLoading(true);
    setOtherError(null);
    try {
      const res = await axios.get<Property[]>(`${API_URL}/properties`);
      const others = res.data.filter((p) => p._id !== id);
      const shuffledOthers = [...others];
      for (let i = shuffledOthers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledOthers[i], shuffledOthers[j]] = [shuffledOthers[j], shuffledOthers[i]];
      }
      setOtherProperties(shuffledOthers.slice(0, 6));
    } catch (_error: unknown) {
      let errorMessage = 'Failed to load other properties';
      if (_error instanceof Error) {
        console.error('Other properties error:', _error.message);
        errorMessage = _error.message;
      } else {
        console.error('Other properties error:', _error);
      }
      setOtherError(errorMessage);
      setOtherProperties([]);
    } finally {
      setOtherLoading(false);
    }
  }

  const images = Array.isArray(property?.images) && property.images.length > 0
    ? property.images
    : ['https://via.placeholder.com/800x600?text=No+Image'];

  const handlePrevImage = () => setMainIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const handleNextImage = () => setMainIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.message.length > maxMessageLength) {
      setFormError(`Message must be ${maxMessageLength} characters or less.`);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFormError('Please enter a valid email address.');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      await axios.post(`${API_URL}/inquiries`, {
        ...formData,
        propertyId: property?._id,
        propertyTitle: property?.title,
        cardUrl: `${window.location.origin}/properties/${property?._id}`,
      });
      setFormData({ name: '', email: '', message: '' });
      setModalOpen(false);
      setSuccessModalOpen(true);
      setTimeout(() => setSuccessModalOpen(false), 2000);
    } catch (_error: unknown) {
      let errorMessage = 'Failed to send inquiry.';
      if (_error instanceof Error) {
        console.error('Inquiry error:', _error.message);
        errorMessage = _error.message;
      } else {
        console.error('Inquiry error:', _error);
      }
      setFormError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  };

  return (
    <ErrorBoundary>
      <motion.div
        ref={sectionRef}
        variants={sectionVariants}
        initial="hidden"
        animate={isSectionInView ? 'visible' : 'hidden'}
        className="py-10 px-4 max-w-5xl mx-auto bg-gray-50"
      >
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <h2 className="text-2xl font-bold text-red-600 font-sans">Error</h2>
            <p className="text-gray-700 mt-2 font-sans">{error}</p>
          </div>
        ) : loading ? (
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-2xl mb-8"></div>
            <div className="h-8 bg-gray-200 rounded-full w-3/4 mb-4"></div>
            <div className="flex gap-4 mb-8">
              <div className="h-6 bg-gray-200 rounded-full w-1/4"></div>
              <div className="h-6 bg-gray-200 rounded-full w-1/4"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg p-4 border border-[#f97316]/10">
                  <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-3/4 mx-auto"></div>
                </div>
              ))}
            </div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        ) : !property ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <h2 className="text-2xl font-bold text-red-600 font-sans">Property Not Found</h2>
            <p className="text-gray-700 mt-2 font-sans">The requested property could not be found.</p>
          </div>
        ) : (
          <>
            {/* Image Gallery */}
            <div className="mb-8 relative">
              <motion.img
                src={images[mainIdx]}
                alt={property.title}
                className="rounded-2xl w-full max-h-[480px] object-cover shadow-xl border border-[#f97316]/10"
                variants={imageVariants}
                key={mainIdx}
              />
              {images.length > 1 && (
                <div className="flex items-center justify-between mt-2 max-h-16">
                  <button
                    onClick={handlePrevImage}
                    className="p-2 bg-[#f97316] text-white rounded-full hover:bg-[#e86a15] transition-colors focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2"
                    aria-label="Previous image"
                  >
                    <ChevronLeftIcon className="w-5 h-5" />
                  </button>
                  <div className="flex gap-1 overflow-x-auto py-1">
                    {images.map((img, idx) => (
                      <motion.img
                        key={idx}
                        src={img}
                        alt={`Property image ${idx + 1}`}
                        className={`w-20 h-14 sm:w-24 sm:h-16 rounded-lg object-cover border cursor-pointer shadow-sm ${
                          mainIdx === idx ? 'ring-2 ring-[#f97316]' : 'border-gray-200'
                        }`}
                        onClick={() => setMainIdx(idx)}
                        style={{ opacity: mainIdx === idx ? 1 : 0.7 }}
                        whileHover={{ opacity: 1, scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={handleNextImage}
                    className="p-2 bg-[#f97316] text-white rounded-full hover:bg-[#e86a15] transition-colors focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2"
                    aria-label="Next image"
                  >
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Main Info */}
            <div className="mb-8 bg-white rounded-2xl p-6 shadow-xl border border-[#f97316]/10">
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#f97316] mb-3 font-sans">
                {property.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-2xl font-bold text-gray-900 font-sans">
                  ₦{property.price?.toLocaleString() || 'N/A'}
                </span>
                {property.location && (
                  <span className="text-gray-500 text-base font-sans">{property.location}</span>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {property.bedrooms !== undefined && (
                <div className="bg-gray-50 rounded-lg p-4 text-center border border-[#f97316]/10 Buna shadow-sm">
                  <div className="text-lg font-bold text-gray-900 font-sans">{property.bedrooms}</div>
                  <div className="text-gray-500 text-xs font-sans">Bedrooms</div>
                </div>
              )}
              {property.bathrooms !== undefined && (
                <div className="bg-gray-50 rounded-lg p-4 text-center border border-[#f97316]/10 shadow-sm">
                  <div className="text-lg font-bold text-gray-900 font-sans">{property.bathrooms}</div>
                  <div className="text-gray-500 text-xs font-sans">Bathrooms</div>
                </div>
              )}
              {property.area && (
                <div className="bg-gray-50 rounded-lg p-4 text-center border border-[#f97316]/10 shadow-sm">
                  <div className="text-lg font-bold text-gray-900 font-sans">{property.area}</div>
                  <div className="text-gray-500 text-xs font-sans">Area (sq m)</div>
                </div>
              )}
              {property.status && (
                <div className="bg-gray-50 rounded-lg p-4 text-center border border-[#f97316]/10 shadow-sm">
                  <div className="text-lg font-bold text-gray-900 capitalize font-sans">{property.status}</div>
                  <div className="text-gray-500 text-xs font-sans">Status</div>
                </div>
              )}
            </div>

            {/* Description */}
            {property.description && (
              <div className="mb-8 bg-white rounded-2xl p-6 shadow-xl border border-[#f97316]/10">
                <h2 className="text-xl font-semibold text-[#f97316] mb-2 font-sans">Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line font-sans">
                  {property.description}
                </p>
              </div>
            )}

            {/* Contact Button */}
            <div className="mt-8 text-center">
              <button
                className="px-8 py-3 bg-[#f97316] text-white rounded-full font-semibold hover:bg-[#e86a15] focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2 transition-all duration-300 font-sans"
                onClick={() => setModalOpen(true)}
                aria-label="Contact agent about this property"
              >
                Contact Agent
              </button>
            </div>

            {/* Other Properties Section */}
            <section className="max-w-5xl mx-auto px-4 mt-16 mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-[#f97316] mb-6 font-sans text-center">
                Other Properties
              </h2>
              {otherLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-20 h-20 rounded-full border-4 border-[#f97316]/30 border-t-[#f97316] animate-spin"></div>
                </div>
              ) : otherError ? (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-600 font-semibold font-sans">
                  {otherError}
                </div>
              ) : otherProperties.length === 0 ? (
                <div className="text-gray-500 text-center font-sans">No other properties to show.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  {otherProperties.map((p) => (
                    <PropertyCard key={p._id} property={p} />
                  ))}
                </div>
              )}
            </section>
            {/* Inquiry Modal */}
            {modalOpen && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 relative border border-[#f97316]/20">
                  <button
                    className="absolute top-3 right-3 text-gray-600 hover:text-[#f97316] focus:ring-2 focus:ring-[#f97316] focus:ring-offset-1 font-sans"
                    onClick={() => setModalOpen(false)}
                    aria-label="Close Inquiry Modal"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                  <h3 className="text-xl font-bold text-[#f97316] mb-4 font-sans">
                    Inquire About {property.title}
                  </h3>
                  {formError && (
                    <div
                      className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-4 font-sans"
                      aria-live="polite"
                    >
                      {formError}
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-semibold text-[#f97316] mb-1 font-sans"
                      >
                        Your Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        className="w-full p-3 border border-gray-300 rounded-full text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-[#f97316] transition-all duration-200 font-sans"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        aria-required="true"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-[#f97316] mb-1 font-sans"
                      >
                        Your Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="w-full p-3 border border-gray-300 rounded-full text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-[#f97316] transition-all duration-200 font-sans"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        aria-required="true"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-semibold text-[#f97316] mb-1 font-sans"
                      >
                        Your Inquiry
                      </label>
                      <textarea
                        id="message"
                        placeholder="Type your inquiry here..."
                        className="w-full p-3 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-[#f97316] transition-all duration-200 resize-none h-24 font-sans"
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value.slice(0, maxMessageLength) })
                        }
                        required
                        aria-required="true"
                      />
                      <p className="text-sm text-gray-600 mt-1 font-sans">
                        {formData.message.length}/{maxMessageLength} characters
                      </p>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        type="button"
                        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2 transition-all duration-300 font-sans"
                        onClick={() => setModalOpen(false)}
                        aria-label="Cancel inquiry"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-[#f97316] text-white rounded-full font-semibold hover:bg-[#e86a15] focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2 transition-all duration-300 font-sans disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={submitting}
                        aria-label="Submit inquiry"
                      >
                        {submitting ? 'Sending...' : 'Submit'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {/* Success Modal */}
            {successModalOpen && (
              <motion.div
                className="fixed inset-0 flex items-center justify-center z-50"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="bg-black bg-opacity-30 absolute inset-0" aria-hidden="true"></div>
                <div className="relative bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full flex flex-col items-center border border-[#f97316]/20">
                  <CheckCircleIcon className="w-16 h-16 text-green-500 mb-4" />
                  <h3 className="text-2xl font-bold text-[#f97316] mb-2 font-sans">Success!</h3>
                  <p className="text-gray-700 text-center mb-4 font-sans">
                    Your inquiry has been sent successfully. We will get back to you soon!
                  </p>
                  <button
                    onClick={() => setSuccessModalOpen(false)}
                    className="px-6 py-2 bg-[#f97316] text-white rounded-full font-semibold hover:bg-[#e86a15] focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2 transition-all duration-300 font-sans"
                    aria-label="Close success modal"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </ErrorBoundary>
  );
}