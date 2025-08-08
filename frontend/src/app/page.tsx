// // frontend/src/app/page.tsx
// "use client";
// import { useState, useEffect, useRef, useCallback, Component, ReactNode } from 'react';
// import axios from 'axios';
// import { FixedSizeGrid, FixedSizeGridProps } from 'react-window';
// import AutoSizer from 'react-virtualized-auto-sizer';
// import Link from 'next/link';
// import { motion, useInView, Variants } from 'framer-motion';
// import PropertyCard from '../components/PropertyCard';
// import Hero from '../components/Hero';
// import Head from 'next/head';

// type Property = {
//   _id?: string;
//   title: string;
//   description?: string;
//   images?: string[];
//   image?: string;
//   price?: string;
//   location?: string;
//   bedrooms?: string;
//   bathrooms?: string;
//   area?: string;
// };

// interface CellProps {
//   columnIndex: number;
//   rowIndex: number;
//   style: React.CSSProperties;
// }

// // Error Boundary Component
// class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
//   state = { hasError: false };
//   static getDerivedStateFromError() {
//     return { hasError: true };
//   }
//   render() {
//     if (this.state.hasError) {
//       return <p className="text-center text-red-600 text-lg font-medium font-sans py-16">Error rendering properties.</p>;
//     }
//     return this.props.children;
//   }
// }

// export default function Home() {
//   const [properties, setProperties] = useState<Property[]>([]);
//   const [search, setSearch] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [skip, setSkip] = useState(0);
//   const loaderRef = useRef<HTMLDivElement | null>(null);
//   const gridRef = useRef<any>(null); // Fix: Use 'any' instead of 'FixedSizeGrid'

//   // Refs for scroll animations
//   const aboutRef = useRef<HTMLElement>(null);
//   const servicesRef = useRef<HTMLElement>(null);
//   const propertiesRef = useRef<HTMLElement>(null);
//   const isAboutInView = useInView(aboutRef, { once: true, margin: '-100px' });
//   const isServicesInView = useInView(servicesRef, { once: true, margin: '-100px' });
//   const isPropertiesInView = useInView(propertiesRef, { once: true, margin: '-100px' });

//   const PAGE_SIZE = 10;
//   const CARD_HEIGHT = 400; // Adjusted to match PropertyCard + padding
//   const CARD_WIDTH = 380; // Adjusted to match PropertyCard + padding

//   const fetchMoreProperties = useCallback(async (currentSkip = skip, initial = false) => {
//     if (loading || !hasMore) return;
//     setLoading(true);
//     try {
//       const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/properties`, {
//         params: { skip: currentSkip, limit: PAGE_SIZE },
//       });
//       console.log('API response:', res.data); // Debug API response
//       const { properties: newProps, hasMore: more } = res.data;
//       setProperties((prev) => (initial ? newProps : [...prev, ...newProps]));
//       setHasMore(more);
//       setSkip(currentSkip + newProps.length);
//     } catch (error) {
//       console.error('Error fetching properties:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [loading, hasMore, skip]);

//   useEffect(() => {
//     fetchMoreProperties(0, true);
//   }, []);

//   useEffect(() => {
//     if (!loaderRef.current || !hasMore) return;
//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && !loading) {
//           fetchMoreProperties();
//         }
//       },
//       { rootMargin: '200px' }
//     );
//     observer.observe(loaderRef.current);
//     return () => observer.disconnect();
//   }, [fetchMoreProperties, hasMore, loading]);

//   // Reset scroll on search change
//   useEffect(() => {
//     if (gridRef.current) {
//       gridRef.current.scrollTo({ scrollLeft: 0, scrollTop: 0 });
//     }
//   }, [search]);

//   const filteredProperties = properties.filter((property: Property) =>
//     property.title.toLowerCase().includes(search.toLowerCase())
//   );

//   // Placeholder card for loading state
//   const PlaceholderCard = () => (
//     <div className="bg-gray-200 rounded-xl shadow-md h-[380px] w-[360px] animate-pulse mx-auto">
//       <div className="h-[200px] bg-gray-300" />
//       <div className="p-4">
//         <div className="h-6 bg-gray-300 mb-2" />
//         <div className="h-4 bg-gray-300 mb-2" />
//         <div className="h-4 bg-gray-300" />
//       </div>
//     </div>
//   );

//   const sectionVariants: Variants = {
//     hidden: { opacity: 0, y: 50 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
//   };

//   const cardVariants: Variants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: (i: number) => ({
//       opacity: 1,
//       y: 0,
//       transition: { delay: i * 0.2, duration: 0.6, ease: 'easeOut' },
//     }),
//   };

//   return (
//     <>
//       <Head>
//         <title>Odamz Royal Consultz Nig Ltd | Premier Real Estate Firm in Nigeria</title>
//         <meta name="description" content="Odamz Royal Consultz Nig Ltd is a leading real estate company in Nigeria, specializing in property management, site construction, and legal advisory. Trusted for quality and client satisfaction." />
//         <meta name="keywords" content="real estate Nigeria, property management Nigeria, site construction Nigeria, legal advisory, real estate firm, property consultants, Odamz Royal, Lagos, Abuja" />
//         <meta property="og:title" content="Odamz Royal Consultz Nig Ltd | Premier Real Estate Firm in Nigeria" />
//         <meta property="og:description" content="Odamz Royal Consultz Nig Ltd specializes in property management, site construction, and legal advisory in Nigeria. Delivering exceptional real estate solutions." />
//         <meta property="og:type" content="website" />
//         <meta property="og:url" content="https://odamzroyal.vercel.app" />
//         <meta name="twitter:card" content="summary_large_image" />
//         <meta name="twitter:title" content="Odamz Royal Consultz Nig Ltd | Premier Real Estate Firm in Nigeria" />
//         <meta name="twitter:description" content="Odamz Royal Consultz Nig Ltd: property management, site construction, legal advisory in Nigeria." />
//       </Head>
//       <main>
//         <Hero />
//         <motion.section
//           id="about"
//           ref={aboutRef}
//           className="py-20 bg-gray-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
//           variants={sectionVariants}
//           initial="hidden"
//           animate={isAboutInView ? 'visible' : 'hidden'}
//         >
//           <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-6 font-sans">
//             About Odamz Royal Consultz
//           </h2>
//           <p className="text-base md:text-lg text-gray-600 text-center max-w-3xl mx-auto mb-8 font-sans">
//             Odamz Royal Consultz Nig Ltd is a premier real estate firm in Nigeria, specializing in property management, site construction, and legal advisory. Our dedication to quality and client satisfaction sets us apart in delivering exceptional real estate solutions.
//           </p>
//           <div className="text-center">
//             <Link href="/about">
//               <button className="bg-[#f97316] text-white px-8 py-3 rounded-full font-semibold text-base hover:bg-[#e86a15] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2 shadow-lg hover:shadow-xl">
//                 Learn More
//               </button>
//             </Link>
//           </div>
//         </motion.section>
//         <motion.section
//           id="services"
//           ref={servicesRef}
//           className="py-20 bg-white"
//           variants={sectionVariants}
//           initial="hidden"
//           animate={isServicesInView ? 'visible' : 'hidden'}
//         >
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-10 font-sans">
//               Our Services
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//               {[
//                 {
//                   title: 'Property Management',
//                   description: 'We manage tenant relations, rent collection, inspections, and maintenance for both residential and commercial properties with unmatched professionalism.',
//                   icon: '🏠',
//                 },
//                 {
//                   title: 'Construction Projects',
//                   description: 'From architectural design to project execution, we deliver high-quality construction solutions tailored to your vision.',
//                   icon: '🏗️',
//                 },
//                 {
//                   title: 'Legal Advisory',
//                   description: 'Our expert legal team provides support for property acquisition, documentation, dispute resolution, and due diligence.',
//                   icon: '⚖️',
//                 },
//               ].map((service, index) => (
//                 <motion.div
//                   key={index}
//                   className="bg-gray-50 rounded-2xl shadow-lg p-8 text-center transform hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
//                   variants={cardVariants}
//                   initial="hidden"
//                   animate={isServicesInView ? 'visible' : 'hidden'}
//                   custom={index}
//                 >
//                   <div className="text-4xl mb-4">{service.icon}</div>
//                   <h3 className="text-xl font-semibold text-gray-900 mb-3 font-sans">
//                     {service.title}
//                   </h3>
//                   <p className="text-base text-gray-600 font-sans">{service.description}</p>
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//         </motion.section>
//         <motion.section
//           id="properties"
//           ref={propertiesRef}
//           className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-50"
//           variants={sectionVariants}
//           initial="hidden"
//           animate={isPropertiesInView ? 'visible' : 'hidden'}
//         >
//           <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-10 font-sans">
//             All Properties
//           </h2>
//           <div className="w-full max-w-md mx-auto mb-10">
//             <input
//               type="text"
//               placeholder="Search properties by keyword..."
//               className="w-full p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#f97316] focus:border-[#f97316] transition-all duration-300 text-base font-sans shadow-sm"
//               onChange={(e) => setSearch(e.target.value)}
//               value={search}
//               aria-label="Search properties"
//             />
//           </div>
//           {loading && properties.length === 0 ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//               {Array(6).fill(0).map((_, i) => (
//                 <PlaceholderCard key={i} />
//               ))}
//             </div>
//           ) : filteredProperties.length === 0 ? (
//             <p className="text-center text-gray-600 text-lg font-medium font-sans py-16">
//               No properties found matching your search.
//             </p>
//           ) : (
//             <ErrorBoundary>
//               <div style={{ height: Math.max(Math.ceil(filteredProperties.length / 3) * CARD_HEIGHT, 400) }}>
//                 <AutoSizer>
//                   {({ height, width }: { height: number; width: number }) => {
//                     const columnCount = width >= 1024 ? 3 : width >= 640 ? 2 : 1;
//                     const rowCount = Math.ceil(filteredProperties.length / columnCount);
//                     // Define Cell inside AutoSizer to access columnCount
//                     const Cell = ({ columnIndex, rowIndex, style }: CellProps) => {
//                       const index = rowIndex * columnCount + columnIndex;
//                       console.log(`Rendering cell: row=${rowIndex}, col=${columnIndex}, index=${index}`); // Debug index
//                       if (index >= filteredProperties.length) return null;
//                       const property = filteredProperties[index];
//                       return (
//                         <div style={{ ...style, padding: '10px' }}>
//                           <PropertyCard property={property} />
//                         </div>
//                       );
//                     };
//                     return (
//                       <FixedSizeGrid
//                         ref={gridRef}
//                         columnCount={columnCount}
//                         columnWidth={CARD_WIDTH}
//                         height={height}
//                         rowCount={rowCount}
//                         rowHeight={CARD_HEIGHT}
//                         width={width}
//                         itemData={filteredProperties}
//                       >
//                         {Cell}
//                       </FixedSizeGrid>
//                     );
//                   }}
//                 </AutoSizer>
//               </div>
//             </ErrorBoundary>
//           )}
//           {loading && properties.length > 0 && (
//             <div className="text-center mt-6">Loading more...</div>
//           )}
//           <div ref={loaderRef} style={{ height: 1 }} />
//           {!hasMore && !loading && (
//             <div className="text-center mt-8 text-gray-500">No more properties to load.</div>
//           )}
//         </motion.section>
//       </main>
//     </>
//   );
// }


// frontend/src/app/page.tsx
"use client";
import { useState, useEffect, useRef, useCallback, Component, ReactNode } from 'react';
import axios from 'axios';
import { FixedSizeGrid, FixedSizeGridProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import Link from 'next/link';
import { motion, useInView, Variants } from 'framer-motion';
import PropertyCard from '../components/PropertyCard';
import Hero from '../components/Hero';
import Head from 'next/head';

type Property = {
  _id?: string;
  title: string;
  description?: string;
  images?: string[];
  image?: string;
  price?: string;
  location?: string;
  bedrooms?: string;
  bathrooms?: string;
  area?: string;
};

interface CellProps {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
}

// Error Boundary Component
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return <p className="text-center text-red-600 text-lg font-medium font-sans py-16">Error rendering properties.</p>;
    }
    return this.props.children;
  }
}

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<any>(null); // Using 'any' from previous fix

  // Refs for scroll animations
  const aboutRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const propertiesRef = useRef<HTMLElement>(null);
  const isAboutInView = useInView(aboutRef, { once: true, margin: '-100px' });
  const isServicesInView = useInView(servicesRef, { once: true, margin: '-100px' });
  const isPropertiesInView = useInView(propertiesRef, { once: true, margin: '-100px' });

  const PAGE_SIZE = 10;
  const CARD_HEIGHT = 600; // Increased to 600px to accommodate PropertyCard (580px + padding)
  const CARD_WIDTH = 380; // Matches PropertyCard width

  const fetchMoreProperties = useCallback(async (currentSkip = skip, initial = false) => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/properties`, {
        params: { skip: currentSkip, limit: PAGE_SIZE },
      });
      console.log('API response:', res.data); // Debug API response
      const { properties: newProps, hasMore: more } = res.data;
      setProperties((prev) => (initial ? newProps : [...prev, ...newProps]));
      setHasMore(more);
      setSkip(currentSkip + newProps.length);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, skip]);

  useEffect(() => {
    fetchMoreProperties(0, true);
  }, []);

  useEffect(() => {
    if (!loaderRef.current || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          fetchMoreProperties();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [fetchMoreProperties, hasMore, loading]);

  // Reset scroll on search change
  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.scrollTo({ scrollLeft: 0, scrollTop: 0 });
    }
  }, [search]);

  const filteredProperties = properties.filter((property: Property) =>
    property.title.toLowerCase().includes(search.toLowerCase())
  );

  // Placeholder card for loading state
  const PlaceholderCard = () => (
    <div className="bg-gray-200 rounded-xl shadow-md h-[580px] w-[360px] animate-pulse mx-auto">
      <div className="h-[240px] bg-gray-300" />
      <div className="p-4">
        <div className="h-6 bg-gray-300 mb-2" />
        <div className="h-4 bg-gray-300 mb-2" />
        <div className="h-4 bg-gray-300" />
      </div>
    </div>
  );

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6, ease: 'easeOut' },
    }),
  };

  return (
    <>
      <Head>
        <title>Odamz Royal Consultz Nig Ltd | Premier Real Estate Firm in Nigeria</title>
        <meta name="description" content="Odamz Royal Consultz Nig Ltd is a leading real estate company in Nigeria, specializing in property management, site construction, and legal advisory. Trusted for quality and client satisfaction." />
        <meta name="keywords" content="real estate Nigeria, property management Nigeria, site construction Nigeria, legal advisory, real estate firm, property consultants, Odamz Royal, Lagos, Abuja" />
        <meta property="og:title" content="Odamz Royal Consultz Nig Ltd | Premier Real Estate Firm in Nigeria" />
        <meta property="og:description" content="Odamz Royal Consultz Nig Ltd specializes in property management, site construction, and legal advisory in Nigeria. Delivering exceptional real estate solutions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://odamzroyal.vercel.app" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Odamz Royal Consultz Nig Ltd | Premier Real Estate Firm in Nigeria" />
        <meta name="twitter:description" content="Odamz Royal Consultz Nig Ltd: property management, site construction, legal advisory in Nigeria." />
      </Head>
      <main>
        <Hero />
        <motion.section
          id="about"
          ref={aboutRef}
          className="py-20 bg-gray-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          variants={sectionVariants}
          initial="hidden"
          animate={isAboutInView ? 'visible' : 'hidden'}
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-6 font-sans">
            About Odamz Royal Consultz
          </h2>
          <p className="text-base md:text-lg text-gray-600 text-center max-w-3xl mx-auto mb-8 font-sans">
            Odamz Royal Consultz Nig Ltd is a premier real estate firm in Nigeria, specializing in property management, site construction, and legal advisory. Our dedication to quality and client satisfaction sets us apart in delivering exceptional real estate solutions.
          </p>
          <div className="text-center">
            <Link href="/about">
              <button className="bg-[#f97316] text-white px-8 py-3 rounded-full font-semibold text-base hover:bg-[#e86a15] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2 shadow-lg hover:shadow-xl">
                Learn More
              </button>
            </Link>
          </div>
        </motion.section>
        <motion.section
          id="services"
          ref={servicesRef}
          className="py-20 bg-white"
          variants={sectionVariants}
          initial="hidden"
          animate={isServicesInView ? 'visible' : 'hidden'}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-10 font-sans">
              Our Services
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Property Management',
                  description: 'We manage tenant relations, rent collection, inspections, and maintenance for both residential and commercial properties with unmatched professionalism.',
                  icon: '🏠',
                },
                {
                  title: 'Construction Projects',
                  description: 'From architectural design to project execution, we deliver high-quality construction solutions tailored to your vision.',
                  icon: '🏗️',
                },
                {
                  title: 'Legal Advisory',
                  description: 'Our expert legal team provides support for property acquisition, documentation, dispute resolution, and due diligence.',
                  icon: '⚖️',
                },
              ].map((service, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-50 rounded-2xl shadow-lg p-8 text-center transform hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
                  variants={cardVariants}
                  initial="hidden"
                  animate={isServicesInView ? 'visible' : 'hidden'}
                  custom={index}
                >
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 font-sans">
                    {service.title}
                  </h3>
                  <p className="text-base text-gray-600 font-sans">{service.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
        <motion.section
          id="properties"
          ref={propertiesRef}
          className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-50"
          variants={sectionVariants}
          initial="hidden"
          animate={isPropertiesInView ? 'visible' : 'hidden'}
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-10 font-sans">
            All Properties
          </h2>
          <div className="w-full max-w-md mx-auto mb-10">
            <input
              type="text"
              placeholder="Search properties by keyword..."
              className="w-full p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#f97316] focus:border-[#f97316] transition-all duration-300 text-base font-sans shadow-sm"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              aria-label="Search properties"
            />
          </div>
          {loading && properties.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(6).fill(0).map((_, i) => (
                <PlaceholderCard key={i} />
              ))}
            </div>
          ) : filteredProperties.length === 0 ? (
            <p className="text-center text-gray-600 text-lg font-medium font-sans py-16">
              No properties found matching your search.
            </p>
          ) : (
            <ErrorBoundary>
              <div style={{ height: Math.max(Math.ceil(filteredProperties.length / 3) * CARD_HEIGHT, 600) }}>
                <AutoSizer>
                  {({ height, width }: { height: number; width: number }) => {
                    const columnCount = width >= 1024 ? 3 : width >= 640 ? 2 : 1;
                    const rowCount = Math.ceil(filteredProperties.length / columnCount);
                    // Define Cell inside AutoSizer to access columnCount
                    const Cell = ({ columnIndex, rowIndex, style }: CellProps) => {
                      const index = rowIndex * columnCount + columnIndex;
                      console.log(`Rendering cell: row=${rowIndex}, col=${columnIndex}, index=${index}`); // Debug index
                      if (index >= filteredProperties.length) return null;
                      const property = filteredProperties[index];
                      return (
                        <div style={{ ...style, padding: '10px', zIndex: 1000 - rowIndex * 10 }}> {/* Add z-index based on row */}
                          <PropertyCard property={property} />
                        </div>
                      );
                    };
                    return (
                      <FixedSizeGrid
                        ref={gridRef}
                        columnCount={columnCount}
                        columnWidth={CARD_WIDTH}
                        height={height}
                        rowCount={rowCount}
                        rowHeight={CARD_HEIGHT}
                        width={width}
                        itemData={filteredProperties}
                      >
                        {Cell}
                      </FixedSizeGrid>
                    );
                  }}
                </AutoSizer>
              </div>
            </ErrorBoundary>
          )}
          {loading && properties.length > 0 && (
            <div className="text-center mt-6">Loading more...</div>
          )}
          <div ref={loaderRef} style={{ height: 1 }} />
          {!hasMore && !loading && (
            <div className="text-center mt-8 text-gray-500">No more properties to load.</div>
          )}
        </motion.section>
      </main>
    </>
  );
}