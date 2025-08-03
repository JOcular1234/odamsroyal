// frontend/src/app/admin/properties/page.jsx
'use client';
import { useEffect, useState, useRef } from 'react';
import adminAuth from '../../../utils/adminAuth';
import {
  HomeIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  DocumentTextIcon,
  PhotoIcon,
  CheckCircleIcon,
  CloudArrowUpIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon as Square3Stack3DIcon
} from '@heroicons/react/24/outline';
import { 
  BuildingLibraryIcon as BedIcon, 
  BuildingOffice2Icon as BathIcon 
} from '@heroicons/react/24/solid'; // Use closest Heroicons for missing ones

import { useRouter } from 'next/navigation';

// Environment variables for Cloudinary
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_URL = CLOUDINARY_CLOUD_NAME
  ? `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`
  : null;

export default function AdminProperties() {
  const [role, setRole] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRole(localStorage.getItem('admin_role') || '');
    }
  }, []);
  // State declarations (unchanged)
  if (role && role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-8 bg-white rounded-xl shadow text-center">
        <h2 className="text-2xl font-bold text-[#f97316] mb-4">Access Restricted</h2>
        <p className="text-gray-700">You do not have permission to manage properties.</p>
      </div>
    );
  }
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newProperty, setNewProperty] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    images: [],
    imageUrlInput: '',
  });
  const [adding, setAdding] = useState(false);
  const [formError, setFormError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [editProperty, setEditProperty] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deletePropertyId, setDeletePropertyId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();
  const editModalRef = useRef(null);
  const deleteModalRef = useRef(null);

  // Debounce search input (unchanged)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search.trim().toLowerCase()), 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch properties on mount (unchanged)
  useEffect(() => {
    fetchProperties();
  }, []);

  // Focus management for modals (unchanged)
  useEffect(() => {
    if (isEditing && editModalRef.current) {
      editModalRef.current.focus();
    }
    if (deletePropertyId && deleteModalRef.current) {
      deleteModalRef.current.focus();
    }
  }, [isEditing, deletePropertyId]);

  // Fetch properties from API (unchanged)
  async function fetchProperties() {
    setLoading(true);
    setError('');
    try {
      const response = await adminAuth.makeAuthenticatedRequest('/admin/properties');
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      const data = await response.json();
      setProperties(data);
    } catch (err) {
      if (err.message === 'Authentication failed') {
        router.push('/admin/login');
      } else {
        setError(err.message || 'Failed to fetch properties');
      }
    } finally {
      setLoading(false);
    }
  }

  // Handle input changes for new property form (unchanged)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'description' && value.length > 1000) return;
    setNewProperty({ ...newProperty, [name]: value });
    setFormError('');
  };

  // Handle image file uploads (unchanged)
  const handleFileChange = async (e) => {
    if (!CLOUDINARY_URL || !CLOUDINARY_UPLOAD_PRESET) {
      setFormError('Cloudinary configuration is missing');
      return;
    }
    const files = Array.from(e.target.files).slice(0, 5 - newProperty.images.length);
    if (files.length === 0) return;
    setUploading(true);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        const response = await fetch(CLOUDINARY_URL, {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          throw new Error(`Failed to upload image: ${file.name}`);
        }
        const data = await response.json();
        uploadedUrls.push(data.secure_url);
      }
      setNewProperty((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls].slice(0, 5),
      }));
    } catch (err) {
      setFormError(err.message || 'Failed to upload image(s) to Cloudinary');
    } finally {
      setUploading(false);
    }
  };

  // Add image URL manually (unchanged)
  const handleAddImageUrl = () => {
    if (
      newProperty.imageUrlInput &&
      newProperty.images.length < 5 &&
      !newProperty.images.includes(newProperty.imageUrlInput)
    ) {
      setNewProperty((prev) => ({
        ...prev,
        images: [...prev.images, prev.imageUrlInput].slice(0, 5),
        imageUrlInput: '',
      }));
    }
  };

  // Remove an image (unchanged)
  const handleRemoveImage = (url) => {
    setNewProperty((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== url),
    }));
  };

  // Add new property (unchanged)
  const handleAddProperty = async (e) => {
    e.preventDefault();
    if (!newProperty.title || !newProperty.description) {
      setFormError('Title and description are required');
      return;
    }
    if (newProperty.description.length < 10) {
      setFormError('Description must be at least 10 characters');
      return;
    }
    setAdding(true);
    setFormError('');
    try {
      const response = await adminAuth.makeAuthenticatedRequest('/admin/properties', {
        method: 'POST',
        body: JSON.stringify({
          title: newProperty.title,
          description: newProperty.description,
          price: newProperty.price || undefined,
          location: newProperty.location || undefined,
          bedrooms: newProperty.bedrooms || undefined,
          bathrooms: newProperty.bathrooms || undefined,
          area: newProperty.area || undefined,
          images: newProperty.images,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add property');
      }
      setNewProperty({
        title: '',
        description: '',
        price: '',
        location: '',
        bedrooms: '',
        bathrooms: '',
        area: '',
        images: [],
        imageUrlInput: '',
      });
      await fetchProperties();
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 2000);
    } catch (err) {
      if (err.message === 'Authentication failed') {
        router.push('/admin/login');
      } else {
        setFormError(err.message || 'Failed to add property');
      }
    } finally {
      setAdding(false);
    }
  };

  // Start editing a property (unchanged)
  const handleEditClick = (property) => {
    setEditProperty({
      _id: property._id,
      title: property.title || '',
      description: property.description || '',
      price: property.price || '',
      location: property.location || '',
      bedrooms: property.bedrooms || '',
      bathrooms: property.bathrooms || '',
      area: property.area || '',
      images: property.images || [],
    });
    setIsEditing(true);
  };

  // Start delete confirmation (unchanged)
  const handleDeleteClick = (property) => {
    setDeletePropertyId(property._id);
  };

  // Edit modal
  const renderEditModal = () => (
    isEditing &&
    editProperty && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div
          ref={editModalRef}
          className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full"
          tabIndex={-1}
          aria-modal="true"
          role="dialog"
          aria-labelledby="edit-modal-title"
        >
          <h3 id="edit-modal-title" className="text-lg font-semibold mb-4 text-gray-900">
            Edit Property
          </h3>
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!editProperty.title || !editProperty.description) {
                alert('Title and description are required');
                return;
              }
              if (editProperty.description.length < 10) {
                alert('Description must be at least 10 characters');
                return;
              }
              try {
                const response = await adminAuth.makeAuthenticatedRequest(
                  `/admin/properties/${editProperty._id}`,
                  {
                    method: 'PUT',
                    body: JSON.stringify({
                      title: editProperty.title,
                      description: editProperty.description,
                      price: editProperty.price || undefined,
                      location: editProperty.location || undefined,
                      bedrooms: editProperty.bedrooms || undefined,
                      bathrooms: editProperty.bathrooms || undefined,
                      area: editProperty.area || undefined,
                      images: editProperty.images || [],
                    }),
                  }
                );
                if (!response.ok) throw new Error('Failed to update property');
                setIsEditing(false);
                setEditProperty(null);
                await fetchProperties();
              } catch (err) {
                alert(err.message || 'Failed to update property');
              }
            }}
          >
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-[#f97316] focus:outline-none"
              name="title"
              value={editProperty.title}
              onChange={(e) => setEditProperty({ ...editProperty, title: e.target.value })}
              placeholder="Title"
              required
              aria-label="Property Title"
            />
            <textarea
              className="w-full px-4 py-2 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-[#f97316] focus:outline-none"
              name="description"
              value={editProperty.description}
              onChange={(e) => setEditProperty({ ...editProperty, description: e.target.value })}
              placeholder="Description"
              required
              aria-label="Property Description"
            />
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-[#f97316] focus:outline-none"
              name="price"
              value={editProperty.price}
              onChange={(e) => setEditProperty({ ...editProperty, price: e.target.value })}
              placeholder="Price (optional)"
              aria-label="Property Price"
            />
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-[#f97316] focus:outline-none"
              name="location"
              value={editProperty.location}
              onChange={(e) => setEditProperty({ ...editProperty, location: e.target.value })}
              placeholder="Location (optional)"
              aria-label="Property Location"
            />
            <input
              type="number"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-[#f97316] focus:outline-none"
              name="bedrooms"
              value={editProperty.bedrooms}
              onChange={(e) => setEditProperty({ ...editProperty, bedrooms: e.target.value })}
              placeholder="Bedrooms (optional)"
              min="0"
              aria-label="Bedrooms"
            />
            <input
              type="number"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-[#f97316] focus:outline-none"
              name="bathrooms"
              value={editProperty.bathrooms}
              onChange={(e) => setEditProperty({ ...editProperty, bathrooms: e.target.value })}
              placeholder="Bathrooms (optional)"
              min="0"
              aria-label="Bathrooms"
            />
            <input
              type="number"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-[#f97316] focus:outline-none"
              name="area"
              value={editProperty.area}
              onChange={(e) => setEditProperty({ ...editProperty, area: e.target.value })}
              placeholder="Area (sq ft, optional)"
              min="0"
              aria-label="Area (sq ft)"
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                onClick={() => {
                  setIsEditing(false);
                  setEditProperty(null);
                }}
                aria-label="Cancel editing"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-[#f97316] text-white hover:bg-[#e56b15] font-semibold"
                aria-label="Save changes"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );

  // Delete confirmation modal
  const renderDeleteConfirm = () => (
    deletePropertyId && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div
          ref={deleteModalRef}
          className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full"
          tabIndex={-1}
          aria-modal="true"
          role="dialog"
          aria-labelledby="delete-modal-title"
        >
          <h3 id="delete-modal-title" className="text-lg font-semibold mb-4 text-gray-900">
            Delete Property?
          </h3>
          <p className="mb-6 text-gray-700">
            Are you sure you want to delete this property? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
              onClick={() => setDeletePropertyId(null)}
              aria-label="Cancel deletion"
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 font-semibold"
              onClick={async () => {
                setIsDeleting(true);
                try {
                  const response = await adminAuth.makeAuthenticatedRequest(
                    `/admin/properties/${deletePropertyId}`,
                    { method: 'DELETE' }
                  );
                  if (!response.ok) throw new Error('Failed to delete property');
                  setDeletePropertyId(null);
                  await fetchProperties();
                } catch (err) {
                  alert(err.message || 'Failed to delete property');
                } finally {
                  setIsDeleting(false);
                }
              }}
              disabled={isDeleting}
              aria-label="Confirm deletion"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    )
  );

  // Filter properties based on debounced search (unchanged)
  const filteredProperties = properties.filter((p) => {
    if (!debouncedSearch) return true;
    return (
      (p.title && p.title.toLowerCase().includes(debouncedSearch)) ||
      (p.location && p.location.toLowerCase().includes(debouncedSearch)) ||
      (p.description && p.description.toLowerCase().includes(debouncedSearch))
    );
  });

  return (
    <>
      {renderEditModal()}
      {renderDeleteConfirm()}
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div
            className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full flex flex-col items-center"
            tabIndex={-1}
            aria-modal="true"
            role="dialog"
            aria-labelledby="success-modal-title"
          >
            <CheckCircleIcon className="w-16 h-16 text-green-500 mb-4" aria-hidden="true" />
            <h3 id="success-modal-title" className="text-lg font-semibold mb-4 text-gray-900">
              Success!
            </h3>
            <p className="text-gray-700 text-center mb-6">Property added successfully</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="px-4 py-2 rounded bg-[#f97316] text-white hover:bg-[#e56b15] font-semibold"
              aria-label="Close success modal"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <section className="py-14 max-w-5xl mx-auto px-2 sm:px-6 font-sans">
        <div className="flex items-center gap-3 mb-8">
          <span className="inline-block w-2 h-8 bg-[#f97316] rounded-full"></span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#f97316] tracking-tight">
            Manage Properties
          </h2>
        </div>

        {/* Add Property Form */}
        <form
          onSubmit={handleAddProperty}
          className="mb-12 bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-[#f97316]/10"
        >
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-gray-900 mb-1"
            >
              Title
            </label>
            <div className="relative">
              <HomeIcon className="w-5 h-5 text-[#f97316] absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                name="title"
                id="title"
                placeholder="Enter property title"
                value={newProperty.title}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  formError.includes('Title') ? 'border-red-500' : 'border-gray-200'
                } shadow-sm focus:ring-2 focus:ring-[#f97316] focus:outline-none`}
                required
                aria-label="Property Title"
                aria-describedby={formError.includes('Title') ? 'title-error' : undefined}
              />
            </div>
            {formError.includes('Title') && (
              <p id="title-error" className="text-red-500 text-xs mt-1" aria-live="polite">
                {formError}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-semibold text-gray-900 mb-1"
            >
              Price
            </label>
            <div className="relative">
              <CurrencyDollarIcon className="w-5 h-5 text-[#f97316] absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                name="price"
                id="price"
                placeholder="Enter property price (optional)"
                value={newProperty.price}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-[#f97316] focus:outline-none"
                aria-label="Property Price"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-semibold text-gray-900 mb-1"
            >
              Location
            </label>
            <div className="relative">
              <MapPinIcon className="w-5 h-5 text-[#f97316] absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                name="location"
                id="location"
                placeholder="Enter property location (optional)"
                value={newProperty.location}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-[#f97316] focus:outline-none"
                aria-label="Property Location"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="bedrooms"
                className="block text-sm font-semibold text-gray-900 mb-1"
              >
                Bedrooms
              </label>
              <div className="relative">
                <BedIcon className="w-5 h-5 text-[#f97316] absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="number"
                  name="bedrooms"
                  id="bedrooms"
                  placeholder="e.g. 3"
                  value={newProperty.bedrooms}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-[#f97316] focus:outline-none"
                  aria-label="Bedrooms"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="bathrooms"
                className="block text-sm font-semibold text-gray-900 mb-1"
              >
                Bathrooms
              </label>
              <div className="relative">
                <BathIcon className="w-5 h-5 text-[#f97316] absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="number"
                  name="bathrooms"
                  id="bathrooms"
                  placeholder="e.g. 2"
                  value={newProperty.bathrooms}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-[#f97316] focus:outline-none"
                  aria-label="Bathrooms"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="area"
                className="block text-sm font-semibold text-gray-900 mb-1"
              >
                Area (sq ft)
              </label>
              <div className="relative">
                <Square3Stack3DIcon className="w-5 h-5 text-[#f97316] absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="number"
                  name="area"
                  id="area"
                  placeholder="e.g. 1200"
                  value={newProperty.area}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-[#f97316] focus:outline-none"
                  aria-label="Area (sq ft)"
                />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-900 mb-1"
            >
              Description
            </label>
            <div className="relative">
              <DocumentTextIcon className="w-5 h-5 text-[#f97316] absolute left-3 top-2.5 pointer-events-none" />
              <textarea
                name="description"
                id="description"
                placeholder="Enter property description"
                value={newProperty.description}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  formError.includes('Description') ? 'border-red-500' : 'border-gray-200'
                } shadow-sm focus:ring-2 focus:ring-[#f97316] focus:outline-none resize-none h-32`}
                required
                aria-label="Property Description"
                aria-describedby={formError.includes('Description') ? 'description-error' : undefined}
              />
            </div>
            <p className="text-xs text-gray-700 mt-1">
              {newProperty.description.length}/1000 characters
            </p>
            {formError.includes('Description') && (
              <p id="description-error" className="text-red-500 text-xs mt-1" aria-live="polite">
                {formError}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Upload Images (max 5)
            </label>
            <div
              className={`relative w-full p-8 border-2 border-dashed rounded-lg text-center transition ${
                uploading || newProperty.images.length >= 5
                  ? 'border-gray-200 bg-white cursor-not-allowed'
                  : 'border-[#f97316] bg-white hover:border-[#e56b15]'
              }`}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                disabled={uploading || newProperty.images.length >= 5}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                aria-label="Upload images"
              />
              <div className="flex flex-col items-center">
                <CloudArrowUpIcon
                  className={`w-12 h-12 mb-3 ${
                    uploading || newProperty.images.length >= 5 ? 'text-gray-400' : 'text-[#f97316]'
                  }`}
                  aria-hidden="true"
                />
                <p className="text-sm text-gray-700 font-medium">
                  {uploading
                    ? 'Uploading...'
                    : newProperty.images.length >= 5
                    ? 'Maximum 5 images reached'
                    : 'Drag and drop images or click to upload'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <PhotoIcon className="w-5 h-5 text-[#f97316] absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                name="imageUrlInput"
                placeholder="Or paste image URL"
                value={newProperty.imageUrlInput}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  formError.includes('image') ? 'border-red-500' : 'border-gray-200'
                } shadow-sm focus:ring-2 focus:ring-[#f97316] focus:outline-none`}
                disabled={newProperty.images.length >= 5}
                aria-label="Image URL"
              />
            </div>
            <button
              type="button"
              onClick={handleAddImageUrl}
              className="px-4 py-2 rounded bg-[#f97316] text-white hover:bg-[#e56b15] font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
              disabled={!newProperty.imageUrlInput || newProperty.images.length >= 5}
              aria-label="Add image URL"
            >
              Add URL
            </button>
          </div>

          {newProperty.images.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {newProperty.images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={img}
                    alt={`preview-${idx}`}
                    className="w-28 h-24 object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(img)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm shadow-md hover:bg-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100"
                    title="Remove image"
                    aria-label={`Remove image ${idx + 1}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {formError && (
            <div
              className="bg-red-100 border-l-4 border-red-500 text-red-500 p-4 rounded-lg"
              aria-live="polite"
            >
              {formError}
            </div>
          )}

          <button
            type="submit"
            className="w-full px-4 py-2 rounded bg-[#f97316] text-white hover:bg-[#e56b15] font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
            disabled={adding || uploading}
            aria-label="Add Property"
          >
            {adding ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                Adding...
              </span>
            ) : uploading ? (
              'Uploading...'
            ) : (
              'Add Property'
            )}
          </button>
        </form>

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
          <div className="relative w-full md:w-72">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              id="property-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, location, or description..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-[#f97316] focus:outline-none"
              aria-label="Search properties"
            />
          </div>
        </div>

        {/* Properties Table */}
        {loading ? (
          <div className="flex justify-center py-16">
            <span className="text-gray-400 text-lg">Loading...</span>
          </div>
        ) : error ? (
          <div className="flex justify-center py-10">
            <span className="text-red-500 font-semibold">{error}</span>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="flex justify-center py-12">
            <span className="text-gray-400 text-lg">No properties found.</span>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl shadow-xl border border-[#f97316]/10 bg-white">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-[#f97316]">
                <tr>
                  <th className="py-3 px-4 text-left text-white font-bold tracking-wide rounded-tl-2xl">
                    Title
                  </th>
                  <th className="py-3 px-4 text-left text-white font-bold tracking-wide">
                    Price
                  </th>
                  <th className="py-3 px-4 text-left text-white font-bold tracking-wide">
                    Location
                  </th>
                  <th className="py-3 px-4 text-left text-white font-bold tracking-wide">
                    Bedrooms
                  </th>
                  <th className="py-3 px-4 text-left text-white font-bold tracking-wide">
                    Bathrooms
                  </th>
                  <th className="py-3 px-4 text-left text-white font-bold tracking-wide">
                    Area (sq ft)
                  </th>
                  <th className="py-3 px-4 text-left text-white font-bold tracking-wide">
                    Description
                  </th>
                  <th className="py-3 px-4 text-left text-white font-bold tracking-wide">
                    Images
                  </th>
                  <th className="py-3 px-4 text-left text-white font-bold tracking-wide rounded-tr-2xl">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.map((p) => (
                  <tr
                    key={p._id}
                    className="border-b last:border-none hover:bg-[#f97316]/5 transition"
                  >
                    <td className="py-2 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <HomeIcon className="w-5 h-5 text-[#f97316]" />
                        <span className="font-semibold text-gray-900">{p.title}</span>
                      </div>
                    </td>
                    <td className="py-2 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <CurrencyDollarIcon className="w-5 h-5 text-[#f97316]" />
                        {p.price || '-'}
                      </div>
                    </td>
                    <td className="py-2 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="w-5 h-5 text-[#f97316]" />
                        {p.location || '-'}
                      </div>
                    </td>
                    <td className="py-2 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <BedIcon className="w-5 h-5 text-[#f97316]" />
                        {p.bedrooms || '-'}
                      </div>
                    </td>
                    <td className="py-2 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <BathIcon className="w-5 h-5 text-[#f97316]" />
                        {p.bathrooms || '-'}
                      </div>
                    </td>
                    <td className="py-2 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Square3Stack3DIcon className="w-5 h-5 text-[#f97316]" />
                        {p.area || '-'}
                      </div>
                    </td>
                    <td className="py-2 px-4 max-w-md truncate">
                      <div className="flex items-center gap-2">
                        <DocumentTextIcon className="w-5 h-5 text-[#f97316]" />
                        {p.description}
                      </div>
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex gap-3 flex-wrap">
                        {(p.images || []).map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`${p.title}-${idx}`}
                            className="w-24 h-20 object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                          />
                        ))}
                      </div>
                    </td>
                    <td className="py-2 px-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1 rounded bg-green-500 text-white text-xs font-bold hover:bg-green-600 transition"
                          onClick={() => handleEditClick(p)}
                          aria-label={`Edit ${p.title}`}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-1 rounded bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition"
                          onClick={() => handleDeleteClick(p)}
                          aria-label={`Delete ${p.title}`}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}