// import Image from 'next/image';
// import Link from 'next/link';

// export default function Hero() {
//   return (
//     <section className="relative h-[60vh] flex items-center justify-center text-center text-white overflow-hidden">
//       <Image
//         src="https://images.unsplash.com/photo-1568605114967-8130f3a36994"
//         alt="Real Estate Hero"
//         fill
//         style={{ objectFit: 'cover' }}
//         quality={85}
//         priority
//         sizes="100vw"
//         className="absolute inset-0 w-full h-full z-0"
//       />
//       <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
//       <div className="relative z-20 w-full flex flex-col items-center justify-center">
//         <h2 className="text-4xl md:text-5xl font-bold mb-4">Your Trusted Partner in Real Estate</h2>
//         <p className="text-lg mb-6">Property Management | Construction | Legal Advisory</p>
//         <Link href="/#properties">
//           <button className="bg-accent text-white px-6 py-3 rounded-md font-semibold hover:bg-opacity-90">
//             Explore Now
//           </button>
//         </Link>
//       </div>
//     </section>
//   );
// }

import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative h-[60vh] flex items-center justify-center text-center text-white overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1568605114967-8130f3a36994" // Replace with your project-specific image
        alt="Odamz Royal Consultz Real Estate Hero"
        fill
        quality={85}
        priority
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
      <div className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Your Trusted Partner in Real Estate
        </h2>
        <p className="text-sm md:text-base text-gray-200 max-w-xl mx-auto mb-6">
          Property Management | Construction | Legal Advisory
        </p>
        <Link href="/#properties">
          <button
            className="bg-[#f97316] text-white px-6 py-2.5 rounded-md font-medium text-sm hover:bg-[#e86a15] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-1"
            aria-label="Explore Properties"
          >
            Explore Now
          </button>
        </Link>
      </div>
    </section>
  );
}