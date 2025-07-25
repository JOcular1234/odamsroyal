import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'About Us | Odamz Royal Consultz Nig Ltd',
  description: 'Learn more about Odamz Royal Consultz Nig Ltd, our mission, vision, and values in the Nigerian real estate industry.',
  keywords: 'Odamz Royal, About Real Estate Nigeria, Company Profile Abuja, Property Management, Construction, Legal Advisory',
  openGraph: {
    title: 'About Us | Odamz Royal Consultz Nig Ltd',
    description: 'Discover our story, team, and commitment to excellence in real estate services.',
    url: 'https://yourdomain.com/about',
    type: 'website',
    images: ['https://yourdomain.com/preview.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Odamz Royal Consultz Nig Ltd',
    description: 'Get to know our company and team in Nigeria.',
  },
};

export default function About() {
  return (
    <section id="about" className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 bg-[#f97316] rounded-full flex items-center justify-center mb-3 shadow-md transform hover:scale-105 transition-transform duration-300">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            About Odamz Royal Consultz
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl leading-relaxed">
            A premier real estate firm in Nigeria, dedicated to delivering excellence in property management, construction, and legal advisory with trust and transparency.
          </p>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Left: Text Content */}
          <div className="bg-white rounded-lg shadow-md p-6 transform hover:-translate-y-1 transition-transform duration-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Our Mission & Vision</h3>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              At Odamz Royal Consultz Nig Ltd, our mission is to empower clients with the knowledge and resources needed to make informed real estate decisions. We specialize in personalized solutions for property acquisition, management, and legal processes.
            </p>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              Our vision is to be Nigeria’s leading real estate consultancy, known for excellence, transparency, and client satisfaction in residential and commercial developments.
            </p>
            <div className="text-center">
              <Link
                href="/contact"
                className="inline-block bg-[#f97316] text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-[#e86a15] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-1"
              >
                Contact Us Today
              </Link>
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative rounded-lg overflow-hidden shadow-md">
            <Image
              src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
              alt="Odamz Royal Consultz Team"
              width={400}
              height={300}
              className="object-cover w-full h-48 md:h-64"
              priority
            />
            <div className="absolute inset-0 bg-[#f97316]/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-sm font-medium text-center px-4">
                Our team delivers exceptional real estate solutions.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Our Core Values</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <h4 className="text-base font-medium text-gray-900 mb-1">Trust</h4>
              <p className="text-gray-600 text-sm">Building lasting relationships through integrity.</p>
            </div>
            <div className="text-center">
              <h4 className="text-base font-medium text-gray-900 mb-1">Excellence</h4>
              <p className="text-gray-600 text-sm">Delivering high-quality services that exceed expectations.</p>
            </div>
            <div className="text-center">
              <h4 className="text-base font-medium text-gray-900 mb-1">Transparency</h4>
              <p className="text-gray-600 text-sm">Ensuring clear communication in all transactions.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}