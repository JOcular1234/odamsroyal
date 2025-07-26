// frontend/src/app/properties/[id]/page.jsx
'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import PropertyCard from '../../../components/PropertyCard';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperty() {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/properties/${id}`);
        setProperty(res.data);
      } catch {
        setProperty(null);
      }
      setLoading(false);
    }
    if (id) fetchProperty();
  }, [id]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!property) return <div className="text-center py-10 text-red-500">Property not found.</div>;

  return (
    <div className="py-8">
      <PropertyCard property={property} />
    </div>
  );
}
