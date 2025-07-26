'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function AppointmentForm({ onSuccess }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
  });
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Validation function
  const validateForm = () => {
    const newErrors = { name: '', email: '', phone: '', service: '', date: '' };
    let isValid = true;

    // Name: Required, 2+ characters, letters and spaces only
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

    // Email: Required, valid format
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Phone: Required, valid format (e.g., +2341234567890 or 08012345678)
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^\+?\d{10,14}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number (10-14 digits)';
      isValid = false;
    }

    // Service: Required
    if (!formData.service) {
      newErrors.service = 'Please select a service';
      isValid = false;
    }

    // Date: Required, must be a future date
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
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

  const isFormValid = () => {
    return (
      formData.name.length >= 2 &&
      /^[a-zA-Z\s]+$/.test(formData.name) &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      /^\+?\d{10,14}$/.test(formData.phone.replace(/\s/g, '')) &&
      formData.service !== '' &&
      formData.date !== '' &&
      new Date(formData.date) >= new Date().setHours(0, 0, 0, 0)
    );
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', phone: '', service: '', date: '' });
    setErrors({ name: '', email: '', phone: '', service: '', date: '' });
    setStatus('');
    setModalOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto border border-[#f97316]/10 relative transition-transform duration-300 hover:-translate-y-1">
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-block w-2 h-8 bg-[#f97316] rounded-full"></span>
        <h3 className="text-xl font-bold text-[#f97316] tracking-tight font-sans">Book an Appointment</h3>
      </div>
      <p className="text-sm text-gray-600 mb-6 font-sans">
        Appointments require admin approval. You will be notified once your appointment is approved.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your name"
            className={`w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#f97316] focus:border-[#f97316] transition-colors duration-200 text-sm`}
            value={formData.name}
            onChange={handleChange}
            required
            aria-label="Full Name"
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <p id="name-error" className="text-red-500 text-xs mt-1" aria-live="polite">{errors.name}</p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#f97316] focus:border-[#f97316] transition-colors duration-200 text-sm`}
            value={formData.email}
            onChange={handleChange}
            required
            aria-label="Email Address"
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-red-500 text-xs mt-1" aria-live="polite">{errors.email}</p>
          )}
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Enter your phone number"
            className={`w-full p-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#f97316] focus:border-[#f97316] transition-colors duration-200 text-sm`}
            value={formData.phone}
            onChange={handleChange}
            required
            aria-label="Phone Number"
            aria-describedby={errors.phone ? 'phone-error' : undefined}
          />
          {errors.phone && (
            <p id="phone-error" className="text-red-500 text-xs mt-1" aria-live="polite">{errors.phone}</p>
          )}
        </div>
        <div>
          <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">Select a Service</label>
          <select
            id="service"
            name="service"
            className={`w-full p-2 border ${errors.service ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#f97316] focus:border-[#f97316] transition-colors duration-200 text-sm`}
            value={formData.service}
            onChange={handleChange}
            required
            aria-label="Select a Service"
            aria-describedby={errors.service ? 'service-error' : undefined}
          >
            <option value="">Select a Service</option>
            <option value="property">Property Management</option>
            <option value="construction">Site Construction</option>
            <option value="legal">Legal Consultation</option>
          </select>
          {errors.service && (
            <p id="service-error" className="text-red-500 text-xs mt-1" aria-live="polite">{errors.service}</p>
          )}
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Appointment Date</label>
          <input
            id="date"
            name="date"
            type="date"
            className={`w-full p-2 border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#f97316] focus:border-[#f97316] transition-colors duration-200 text-sm`}
            value={formData.date}
            onChange={handleChange}
            required
            aria-label="Appointment Date"
            aria-describedby={errors.date ? 'date-error' : undefined}
          />
          {errors.date && (
            <p id="date-error" className="text-red-500 text-xs mt-1" aria-live="polite">{errors.date}</p>
          )}
        </div>
        <div className="flex justify-end gap-3 mt-2">
          <button
            type="button"
            className="px-5 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-1 transition-all duration-200"
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-[#f97316] text-white rounded-xl font-semibold text-sm shadow-md hover:bg-[#e86a15] focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2 transition-all duration-300 disabled:opacity-60"
            disabled={submitting || !isFormValid()}
          >
            {submitting ? (
              <span className="flex items-center gap-2"><svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg> Booking...</span>
            ) : 'Book Appointment'}
          </button>
        </div>
        {status.includes('Error') && (
          <p className="text-center text-sm mt-2 text-red-600" aria-live="polite">{status}</p>
        )}
      </form>

      {/* Success Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-opacity duration-300">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm mx-4 border border-[#f97316]/20 relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-[#f97316] text-2xl focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2"
              onClick={handleReset}
              aria-label="Close Modal"
            >
              ×
            </button>
            <div className="flex flex-col items-center gap-2 mb-3">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#dcfce7"></circle><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2l4-4" /></svg>
              <h4 className="text-lg font-bold text-green-700">Appointment Booked!</h4>
              <p className="text-gray-700 text-center text-sm">{status}</p>
            </div>
            <button
              onClick={handleReset}
              className="mt-2 w-full bg-[#f97316] text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-[#e86a15] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2"
              aria-label="Book another appointment"
            >
              Book Another Appointment
            </button>
            
            </div>

          </div>
      )}
    </div>
  );
}