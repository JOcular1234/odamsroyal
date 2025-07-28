// // frontend/src/app/admin/properties/page.jsx
// "use client";
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { CloudArrowUpIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

// const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
// const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
// const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

// export default function AdminProperties() {
//   const [properties, setProperties] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [newProperty, setNewProperty] = useState({
//     title: '',
//     description: '',
//     images: [],
//     imageUrlInput: '',
//   });
//   const [adding, setAdding] = useState(false);
//   const [formError, setFormError] = useState('');
//   const [uploading, setUploading] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);

//   useEffect(() => {
//     fetchProperties();
//   }, []);

//   async function fetchProperties() {
//     setLoading(true);
//     setError('');
//     try {
//       const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/properties`, {
//         withCredentials: true,
//       });
//       setProperties(res.data);
//     } catch (err) {
//       setError('Failed to fetch properties');
//     }
//     setLoading(false);
//   }

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     if (name === 'description' && value.length > 1000) return; // Limit description to 1000 characters
//     setNewProperty({ ...newProperty, [name]: value });
//     setFormError('');
//   };

//   const handleFileChange = async (e) => {
//     const files = Array.from(e.target.files).slice(0, 5 - newProperty.images.length);
//     if (files.length === 0) return;
//     setUploading(true);
//     try {
//       const uploadedUrls = [];
//       for (const file of files) {
//         const formData = new FormData();
//         formData.append('file', file);
//         formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
//         const res = await axios.post(CLOUDINARY_URL, formData);
//         uploadedUrls.push(res.data.secure_url);
//       }
//       setNewProperty((prev) => ({
//         ...prev,
//         images: [...prev.images, ...uploadedUrls].slice(0, 5),
//       }));
//     } catch (err) {
//       setFormError('Failed to upload image(s) to Cloudinary');
//     }
//     setUploading(false);
//   };

//   const handleAddImageUrl = () => {
//     if (
//       newProperty.imageUrlInput &&
//       newProperty.images.length < 5 &&
//       !newProperty.images.includes(newProperty.imageUrlInput)
//     ) {
//       setNewProperty((prev) => ({
//         ...prev,
//         images: [...prev.images, prev.imageUrlInput].slice(0, 5),
//         imageUrlInput: '',
//       }));
//     }
//   };

//   const handleRemoveImage = (url) => {
//     setNewProperty((prev) => ({
//       ...prev,
//       images: prev.images.filter((img) => img !== url),
//     }));
//   };

//   const handleAddProperty = async (e) => {
//     e.preventDefault();
//     if (!newProperty.title || !newProperty.description) {
//       setFormError('Title and description are required');
//       return;
//     }
//     if (newProperty.description.length < 10) {
//       setFormError('Description must be at least 10 characters');
//       return;
//     }
//     setAdding(true);
//     setFormError('');
//     try {
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/admin/properties`,
//         {
//           title: newProperty.title,
//           description: newProperty.description,
//           images: newProperty.images,
//         },
//         { withCredentials: true }
//       );
//       setNewProperty({ title: '', description: '', images: [], imageUrlInput: '' });
//       await fetchProperties();
//       setShowSuccessModal(true);
//       setTimeout(() => setShowSuccessModal(false), 2000);
//     } catch (err) {
//       const msg =
//         err.response?.data?.message ||
//         err.response?.data?.error ||
//         err.message ||
//         'Failed to add property';
//       setFormError(msg);
//       console.error('Add property error:', err, err.response?.data);
//     }
//     setAdding(false);
//   };

//   return (
//     <>
//       {/* Success Modal */}
//       {showSuccessModal && (
//         <div className="fixed inset-0 flex items-center justify-center z-50">
//           <div className="bg-black bg-opacity-40 absolute inset-0" aria-hidden="true"></div>
//           <div className="relative bg-card rounded-xl shadow-card px-8 py-10 max-w-sm w-full flex flex-col items-center transform transition-all duration-300 scale-100">
//             <CheckCircleIcon className="w-16 h-16 text-green-500 mb-4" aria-hidden="true" />
//             <h3 className="text-2xl font-bold text-primary mb-2 font-sans">Success!</h3>
//             <p className="text-neutral text-center mb-6 font-sans">Property added successfully</p>
//             <button
//               onClick={() => setShowSuccessModal(false)}
//               className="px-6 py-2 bg-accent text-white rounded-xl font-semibold hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all duration-300 font-sans"
//               aria-label="Close success modal"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       <section className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-4xl font-bold text-primary text-center mb-10 tracking-tight font-sans">
//             Manage Properties
//           </h2>

//           {/* Add Property Form */}
//           <form
//             onSubmit={handleAddProperty}
//             className="mb-12 bg-card rounded-xl shadow-card p-8 space-y-6"
//           >
//             <div>
//               <label
//                 htmlFor="title"
//                 className="block text-sm font-semibold text-neutral mb-1 font-sans"
//               >
//                 Property Title
//               </label>
//               <input
//                 type="text"
//                 name="title"
//                 id="title"
//                 placeholder="Enter property title"
//                 value={newProperty.title}
//                 onChange={handleInputChange}
//                 className={`w-full px-4 py-3 border ${
//                   formError.includes('Title') ? 'border-error' : 'border-border'
//                 } rounded-xl text-sm text-neutral focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300 font-sans bg-background`}
//                 required
//                 aria-label="Property Title"
//                 aria-describedby={formError.includes('Title') ? 'title-error' : undefined}
//               />
//               {formError.includes('Title') && (
//                 <p id="title-error" className="text-error text-xs mt-1 font-sans" aria-live="polite">
//                   {formError}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label
//                 htmlFor="description"
//                 className="block text-sm font-semibold text-neutral mb-1 font-sans"
//               >
//                 Description
//               </label>
//               <textarea
//                 name="description"
//                 id="description"
//                 placeholder="Enter property description"
//                 value={newProperty.description}
//                 onChange={handleInputChange}
//                 className={`w-full px-4 py-3 border ${
//                   formError.includes('Description') ? 'border-error' : 'border-border'
//                 } rounded-xl text-sm text-neutral focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300 font-sans resize-none h-32 bg-background`}
//                 required
//                 aria-label="Property Description"
//                 aria-describedby={formError.includes('Description') ? 'description-error' : undefined}
//               />
//               <p className="text-xs text-neutral mt-1 font-sans">
//                 {newProperty.description.length}/1000 characters
//               </p>
//               {formError.includes('Description') && (
//                 <p id="description-error" className="text-error text-xs mt-1 font-sans" aria-live="polite">
//                   {formError}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-neutral mb-1 font-sans">
//                 Upload Images (max 5)
//               </label>
//               <div
//                 className={`relative w-full p-8 border-2 border-dashed rounded-xl text-center transition-all duration-300 ${
//                   uploading || newProperty.images.length >= 5
//                     ? 'border-border bg-background cursor-not-allowed'
//                     : 'border-accent bg-card hover:border-accent-dark hover:bg-accent/10'
//                 }`}
//               >
//                 <input
//                   type="file"
//                   accept="image/*"
//                   multiple
//                   onChange={handleFileChange}
//                   disabled={uploading || newProperty.images.length >= 5}
//                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
//                   aria-label="Upload images"
//                 />
//                 <div className="flex flex-col items-center">
//                   <CloudArrowUpIcon
//                     className={`w-12 h-12 mb-3 ${
//                       uploading || newProperty.images.length >= 5 ? 'text-neutral' : 'text-accent'
//                     }`}
//                     aria-hidden="true"
//                   />
//                   <p className="text-sm text-neutral font-medium font-sans">
//                     {uploading
//                       ? 'Uploading...'
//                       : newProperty.images.length >= 5
//                       ? 'Maximum 5 images reached'
//                       : 'Drag and drop images or click to upload'}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="flex gap-4 items-center">
//               <input
//                 type="text"
//                 name="imageUrlInput"
//                 placeholder="Or paste image URL"
//                 value={newProperty.imageUrlInput}
//                 onChange={handleInputChange}
//                 className={`flex-1 px-4 py-3 border ${
//                   formError.includes('image') ? 'border-error' : 'border-border'
//                 } rounded-xl text-sm text-neutral focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300 font-sans bg-background`}
//                 disabled={newProperty.images.length >= 5}
//                 aria-label="Image URL"
//               />
//               <button
//                 type="button"
//                 onClick={handleAddImageUrl}
//                 className="px-6 py-3 bg-accent text-white rounded-xl font-semibold text-sm hover:bg-accent-dark transition-all duration-300 font-sans disabled:opacity-50 disabled:cursor-not-allowed"
//                 disabled={!newProperty.imageUrlInput || newProperty.images.length >= 5}
//                 aria-label="Add image URL"
//               >
//                 Add URL
//               </button>
//             </div>

//             {newProperty.images.length > 0 && (
//               <div className="flex flex-wrap gap-4">
//                 {newProperty.images.map((img, idx) => (
//                   <div key={idx} className="relative group">
//                     <img
//                       src={img}
//                       alt={`preview-${idx}`}
//                       className="w-28 h-24 object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => handleRemoveImage(img)}
//                       className="absolute -top-2 -right-2 bg-error text-white rounded-full w-7 h-7 flex items-center justify-center text-sm shadow-md hover:bg-error/80 transition-all duration-200 opacity-0 group-hover:opacity-100"
//                       title="Remove image"
//                       aria-label={`Remove image ${idx + 1}`}
//                     >
//                       ×
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {formError && (
//               <div
//                 className="bg-error/10 border-l-4 border-error text-error p-4 rounded-xl font-sans"
//                 aria-live="polite"
//               >
//                 {formError}
//               </div>
//             )}

//             <button
//               type="submit"
//               className="w-full px-6 py-3 bg-accent text-white rounded-xl font-semibold text-sm hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all duration-300 font-sans disabled:opacity-50 disabled:cursor-not-allowed"
//               disabled={adding || uploading}
//               aria-label="Add Property"
//             >
//               {adding ? (
//                 <span className="flex items-center justify-center">
//                   <svg
//                     className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     />
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//                     />
//                   </svg>
//                   Adding...
//                 </span>
//               ) : uploading ? (
//                 'Uploading...'
//               ) : (
//                 'Add Property'
//               )}
//             </button>
//           </form>

//           {/* Properties Table */}
//           {loading ? (
//             <div className="flex justify-center items-center py-16">
//               <svg
//                 className="animate-spin h-12 w-12 text-accent"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 aria-label="Loading"
//               >
//                 <circle
//                   className="opacity-25"
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth="4"
//                 />
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//                 />
//               </svg>
//             </div>
//           ) : error ? (
//             <div
//               className="bg-error/10 border-l-4 border-error text-error p-6 rounded-xl text-center font-sans text-lg"
//               aria-live="polite"
//             >
//               {error}
//             </div>
//           ) : properties.length === 0 ? (
//             <p className="text-center text-neutral text-lg font-medium font-sans py-16">
//               No properties found.
//             </p>
//           ) : (
//             <div className="bg-card rounded-xl shadow-card overflow-hidden">
//               <div className="overflow-x-auto">
//                 <table className="min-w-full">
//                   <thead>
//                     <tr className="bg-primary text-white">
//                       <th className="py-4 px-6 text-left text-sm font-semibold tracking-wide font-sans">
//                         Title
//                       </th>
//                       <th className="py-4 px-6 text-left text-sm font-semibold tracking-wide font-sans">
//                         Description
//                       </th>
//                       <th className="py-4 px-6 text-left text-sm font-semibold tracking-wide font-sans">
//                         Images
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {properties.map((p) => (
//                       <tr
//                         key={p._id}
//                         className="border-b border-border last:border-none hover:bg-background transition-all duration-200"
//                       >
//                         <td className="py-4 px-6 font-semibold text-primary font-sans">
//                           {p.title}
//                         </td>
//                         <td className="py-4 px-6 text-neutral font-sans max-w-md truncate">
//                           {p.description}
//                         </td>
//                         <td className="py-4 px-6">
//                           <div className="flex gap-3 flex-wrap">
//                             {(p.images || []).map((img, idx) => (
//                               <img
//                                 key={idx}
//                                 src={img}
//                                 alt={`${p.title}-${idx}`}
//                                 className="w-24 h-20 object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
//                               />
//                             ))}
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </div>
//       </section>
//     </>
//   );
// }


'use client';
import { useEffect, useState } from 'react';
import adminAuth from '../../../utils/adminAuth';
import { CloudArrowUpIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newProperty, setNewProperty] = useState({
    title: '',
    description: '',
    images: [],
    imageUrlInput: '',
  });
  const [adding, setAdding] = useState(false);
  const [formError, setFormError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchProperties();
  }, []);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'description' && value.length > 1000) return; // Limit description to 1000 characters
    setNewProperty({ ...newProperty, [name]: value });
    setFormError('');
  };

  const handleFileChange = async (e) => {
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
          throw new Error('Failed to upload image to Cloudinary');
        }
        const data = await response.json();
        uploadedUrls.push(data.secure_url);
      }
      setNewProperty((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls].slice(0, 5),
      }));
    } catch (err) {
      setFormError('Failed to upload image(s) to Cloudinary');
    } finally {
      setUploading(false);
    }
  };

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

  const handleRemoveImage = (url) => {
    setNewProperty((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== url),
    }));
  };

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
          images: newProperty.images,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add property');
      }
      setNewProperty({ title: '', description: '', images: [], imageUrlInput: '' });
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

  return (
    <>
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-40 absolute inset-0" aria-hidden="true"></div>
          <div className="relative bg-card rounded-xl shadow-card px-8 py-10 max-w-sm w-full flex flex-col items-center transform transition-all duration-300 scale-100">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mb-4" aria-hidden="true" />
            <h3 className="text-2xl font-bold text-primary mb-2 font-sans">Success!</h3>
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
                Property Title
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
          ) : properties.length === 0 ? (
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
                        Description
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold tracking-wide font-sans">
                        Images
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((p) => (
                      <tr
                        key={p._id}
                        className="border-b border-border last:border-none hover:bg-background transition-all duration-200"
                      >
                        <td className="py-4 px-6 font-semibold text-primary font-sans">
                          {p.title}
                        </td>
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