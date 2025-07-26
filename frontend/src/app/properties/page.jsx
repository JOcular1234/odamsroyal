// frontend/src/app/properties/pages.jsx
'use client';
import { useState , useEffect} from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PropertyCard from '../../components/PropertyCard';

export default function PropertiesPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch properties with React Query
  const { data: properties = [], isLoading, error } = useQuery({
  queryKey: ['properties'],
  queryFn: async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/properties`);
    return res.data;
  }
});

  const filteredProperties = properties.filter((property) =>
    property.title.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <main className="py-16 max-w-7xl mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-8">All Properties</h2>
      <input
        type="text"
        placeholder="Search properties by keyword..."
        className="w-full p-3 border rounded-md mb-8"
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProperties.map((property) => (
          <PropertyCard key={property._id} property={property} />
        ))}
      </div>
    </main>
  );
}



