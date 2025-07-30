// frontend/src/app/admin/properties/page.jsx
'use client';
import { useEffect, useState, useRef } from 'react';
import adminAuth from '../../../utils/adminAuth';
import { CloudArrowUpIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

// Environment variables for Cloudinary
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_URL = CLOUDINARY_CLOUD_NAME
  ? `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`
  : null;

export default function AdminProperties() {
  // State declarations
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

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search.trim().toLowerCase()), 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch properties on mount
  useEffect(() => {
    fetchProperties();
  }, []);

  // Focus management for modals
  useEffect(() => {
    if (isEditing && editModalRef.current) {
      editModalRef.current.focus();
    }
    if (deletePropertyId && deleteModalRef.current) {
      deleteModalRef.current.focus();
    }
  }, [isEditing, deletePropertyId]);

  // Fetch properties from API
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

  // Handle input changes for new property form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'description' && value.length > 1000) return;
    setNewProperty({ ...newProperty, [name]: value });
    setFormError('');
  };

  // Handle image file uploads
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

  // Add image URL manually
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

  // Remove an image
  const handleRemoveImage = (url) => {
    setNewProperty((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== url),
    }));
  };

  // Add new property
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

  // Start editing a property
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

  // Start delete confirmation
  const handleDeleteClick = (property) => {
    setDeletePropertyId(property._id);
  };

  // Edit modal
  const renderEditModal = () => (
    isEditing &&
    editProperty && (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-black bg-opacity-40 absolute inset-0" aria-hidden="true"></div>
        <div
          ref={editModalRef}
          className="relative bg-card rounded-xl shadow-card px-8 py-10 max-w-lg w-full flex flex-col items-center"
          tabIndex={-1}
          aria-modal="true"
          role="dialog"
          aria-labelledby="edit-modal-title"
        >
          <h3 id="edit-modal-title" className="text-2xl font-bold text-primary mb-4 font-sans">
            Edit Property
          </h3>
          <form
            className="w-full space-y-4"
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
              className="w-full px-4 py-2 border rounded"
              name="title"
              value={editProperty.title}
              onChange={(e) => setEditProperty({ ...editProperty, title: e.target.value })}
              placeholder="Title"
              required
              aria-label="Property Title"
            />
            <textarea
              className="w-full px-4 py-2 border rounded"
              name="description"
              value={editProperty.description}
              onChange={(e) => setEditProperty({ ...editProperty, description: e.target.value })}
              placeholder="Description"
              required
              aria-label="Property Description"
            />
            <input
              type="text"
              className="w-full px-4 py-2 border rounded"
              name="price"
              value={editProperty.price}
              onChange={(e) => setEditProperty({ ...editProperty, price: e.target.value })}
              placeholder="Price (optional)"
              aria-label="Property Price"
            />
            <input
              type="text"
              className="w-full px-4 py-2 border rounded"
              name="location"
              value={editProperty.location}
              onChange={(e) => setEditProperty({ ...editProperty, location: e.target.value })}
              placeholder="Location (optional)"
              aria-label="Property Location"
            />
            <input
              type="number"
              className="w-full px-4 py-2 border rounded"
              name="bedrooms"
              value={editProperty.bedrooms}
              onChange={(e) => setEditProperty({ ...editProperty, bedrooms: e.target.value })}
              placeholder="Bedrooms (optional)"
              min="0"
              aria-label="Bedrooms"
            />
            <input
              type="number"
              className="w-full px-4 py-2 border rounded"
              name="bathrooms"
              value={editProperty.bathrooms}
              onChange={(e) => setEditProperty({ ...editProperty, bathrooms: e.target.value })}
              placeholder="Bathrooms (optional)"
              min="0"
              aria-label="Bathrooms"
            />
            <input
              type="number"
              className="w-full px-4 py-2 border rounded"
              name="area"
              value={editProperty.area}
              onChange={(e) => setEditProperty({ ...editProperty, area: e.target.value })}
              placeholder="Area (sq ft, optional)"
              min="0"
              aria-label="Area (sq ft)"
            />
            <div className="flex gap-4 justify-end mt-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 rounded"
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
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
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
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-black bg-opacity-40 absolute inset-0" aria-hidden="true"></div>
        <div
          ref={deleteModalRef}
          className="relative bg-card rounded-xl shadow-card px-8 py-8 max-w-sm w-full flex flex-col items-center delete-modal"
          tabIndex={-1}
          aria-modal="true"
          role="dialog"
          aria-labelledby="delete-modal-title"
        >
          <h3 id="delete-modal-title" className="text-xl font-bold text-primary mb-4 font-sans">
            Delete Property?
          </h3>
          <p className="mb-6 text-center">Are you sure you want to delete this property? This action cannot be undone.</p>
          <div className="flex gap-4 justify-center">
            <button
              className="px-4 py-2 bg-gray-200 rounded"
              onClick={() => setDeletePropertyId(null)}
              aria-label="Cancel deletion"
            >
              Cancel
            </button>
            <button
              className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold"
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

  // Filter properties based on debounced search
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
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-40 absolute inset-0" aria-hidden="true"></div>
          <div
            className="relative bg-card rounded-xl shadow-card px-8 py-10 max-w-sm w-full flex flex-col items-center transform transition-all duration-300 scale-100"
            tabIndex={-1}
            aria-modal="true"
            role="dialog"
            aria-labelledby="success-modal-title"
          >
            <CheckCircleIcon className="w-16 h-16 text-green-500 mb-4" aria-hidden="true" />
            <h3 id="success-modal-title" className="text-2xl font-bold text-primary mb-2 font-sans">
              Success!
            </h3>
            <p className="text-neutral text-center mb-6 font-sans">Property added successfully</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="px-6 py-2 bg-accent text-white rounded-xl font-semibold hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all duration-300 font-sans"
              aria-label="Close success modal"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <section className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-primary text-center mb-10 tracking-tight font-sans">
            Manage Properties
          </h2>

          {/* Add Property Form */}
          <form
            onSubmit={handleAddProperty}
            className="mb-12 bg-card rounded-xl shadow-card p-8 space-y-6"
          >
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-neutral mb-1 font-sans"
              >
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                placeholder="Enter property title"
                value={newProperty.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border ${
                  formError.includes('Title') ? 'border-error' : 'border-border'
                } rounded-xl text-sm text-neutral focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300 font-sans bg-background`}
                required
                aria-label="Property Title"
                aria-describedby={formError.includes('Title') ? 'title-error' : undefined}
              />
              {formError.includes('Title') && (
                <p id="title-error" className="text-error text-xs mt-1 font-sans" aria-live="polite">
                  {formError}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-sm font-semibold text-neutral mb-1 font-sans"
              >
                Price
              </label>
              <input
                type="text"
                name="price"
                id="price"
                placeholder="Enter property price (optional)"
                value={newProperty.price}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-border rounded-xl text-sm text-neutral focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300 font-sans bg-background"
                aria-label="Property Price"
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-semibold text-neutral mb-1 font-sans"
              >
                Location
              </label>
              <input
                type="text"
                name="location"
                id="location"
                placeholder="Enter property location (optional)"
                value={newProperty.location}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-border rounded-xl text-sm text-neutral focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300 font-sans bg-background"
                aria-label="Property Location"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="bedrooms"
                  className="block text-sm font-semibold text-neutral mb-1 font-sans"
                >
                  Bedrooms
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  id="bedrooms"
                  placeholder="e.g. 3"
                  value={newProperty.bedrooms}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm text-neutral focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300 font-sans bg-background"
                  aria-label="Bedrooms"
                />
              </div>
              <div>
                <label
                  htmlFor="bathrooms"
                  className="block text-sm font-semibold text-neutral mb-1 font-sans"
                >
                  Bathrooms
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  id="bathrooms"
                  placeholder="e.g. 2"
                  value={newProperty.bathrooms}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm text-neutral focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300 font-sans bg-background"
                  aria-label="Bathrooms"
                />
              </div>
              <div>
                <label
                  htmlFor="area"
                  className="block text-sm font-semibold text-neutral mb-1 font-sans"
                >
                  Area (sq ft)
                </label>
                <input
                  type="number"
                  name="area"
                  id="area"
                  placeholder="e.g. 1200"
                  value={newProperty.area}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm text-neutral focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300 font-sans bg-background"
                  aria-label="Area (sq ft)"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-neutral mb-1 font-sans"
              >
                Description
              </label>
              <textarea
                name="description"
                id="description"
                placeholder="Enter property description"
                value={newProperty.description}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border ${
                  formError.includes('Description') ? 'border-error' : 'border-border'
                } rounded-xl text-sm text-neutral focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300 font-sans resize-none h-32 bg-background`}
                required
                aria-label="Property Description"
                aria-describedby={formError.includes('Description') ? 'description-error' : undefined}
              />
              <p className="text-xs text-neutral mt-1 font-sans">
                {newProperty.description.length}/1000 characters
              </p>
              {formError.includes('Description') && (
                <p id="description-error" className="text-error text-xs mt-1 font-sans" aria-live="polite">
                  {formError}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral mb-1 font-sans">
                Upload Images (max 5)
              </label>
              <div
                className={`relative w-full p-8 border-2 border-dashed rounded-xl text-center transition-all duration-300 ${
                  uploading || newProperty.images.length >= 5
                    ? 'border-border bg-background cursor-not-allowed'
                    : 'border-accent bg-card hover:border-accent-dark hover:bg-accent/10'
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
                      uploading || newProperty.images.length >= 5 ? 'text-neutral' : 'text-accent'
                    }`}
                    aria-hidden="true"
                  />
                  <p className="text-sm text-neutral font-medium font-sans">
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
              <input
                type="text"
                name="imageUrlInput"
                placeholder="Or paste image URL"
                value={newProperty.imageUrlInput}
                onChange={handleInputChange}
                className={`flex-1 px-4 py-3 border ${
                  formError.includes('image') ? 'border-error' : 'border-border'
                } rounded-xl text-sm text-neutral focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300 font-sans bg-background`}
                disabled={newProperty.images.length >= 5}
                aria-label="Image URL"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-6 py-3 bg-accent text-white rounded-xl font-semibold text-sm hover:bg-accent-dark transition-all duration-300 font-sans disabled:opacity-50 disabled:cursor-not-allowed"
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
                      className="absolute -top-2 -right-2 bg-error text-white rounded-full w-7 h-7 flex items-center justify-center text-sm shadow-md hover:bg-error/80 transition-all duration-200 opacity-0 group-hover:opacity-100"
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
                className="bg-error/10 border-l-4 border-error text-error p-4 rounded-xl font-sans"
                aria-live="polite"
              >
                {formError}
              </div>
            )}

            <button
              type="submit"
              className="w-full px-6 py-3 bg-accent text-white rounded-xl font-semibold text-sm hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all duration-300 font-sans disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
            <label htmlFor="property-search" className="sr-only">
              Search properties
            </label>
            <input
              id="property-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, location, or description..."
              className="w-full sm:w-96 px-4 py-3 border border-border rounded-xl text-sm text-neutral focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300 font-sans bg-background"
              aria-label="Search properties"
            />
          </div>

          {/* Properties Table */}
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <svg
                className="animate-spin h-12 w-12 text-accent"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-label="Loading"
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
            </div>
          ) : error ? (
            <div
              className="bg-error/10 border-l-4 border-error text-error p-6 rounded-xl text-center font-sans text-lg"
              aria-live="polite"
            >
              {error}
            </div>
          ) : filteredProperties.length === 0 ? (
            <p className="text-center text-neutral text-lg font-medium font-sans py-16">
              No properties found.
            </p>
          ) : (
            <div className="bg-card rounded-xl shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-primary text-white">
                      <th className="py-4 px-6 text-left text-sm font-semibold tracking-wide font-sans">
                        Title
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold tracking-wide font-sans">
                        Price
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold tracking-wide font-sans">
                        Location
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold tracking-wide font-sans">
                        Bedrooms
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold tracking-wide font-sans">
                        Bathrooms
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold tracking-wide font-sans">
                        Area (sq ft)
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold tracking-wide font-sans">
                        Description
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold tracking-wide font-sans">
                        Images
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold tracking-wide font-sans">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProperties.map((p) => (
                      <tr
                        key={p._id}
                        className="border-b border-border last:border-none hover:bg-background transition-all duration-200"
                      >
                        <td className="py-4 px-6 font-semibold text-primary font-sans">{p.title}</td>
                        <td className="py-4 px-6 text-neutral font-sans">{p.price || '-'}</td>
                        <td className="py-4 px-6 text-neutral font-sans">{p.location || '-'}</td>
                        <td className="py-4 px-6 text-neutral font-sans">{p.bedrooms || '-'}</td>
                        <td className="py-4 px-6 text-neutral font-sans">{p.bathrooms || '-'}</td>
                        <td className="py-4 px-6 text-neutral font-sans">{p.area || '-'}</td>
                        <td className="py-4 px-6 text-neutral font-sans max-w-md truncate">
                          {p.description}
                        </td>
                        <td className="py-4 px-6">
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
                        <td className="py-4 px-6 flex gap-2">
                          <button
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all text-xs font-semibold"
                            onClick={() => handleEditClick(p)}
                            aria-label={`Edit ${p.title}`}
                          >
                            Edit
                          </button>
                          <button
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-all text-xs font-semibold"
                            onClick={() => handleDeleteClick(p)}
                            aria-label={`Delete ${p.title}`}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}