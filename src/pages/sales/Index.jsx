import React, { useState, useEffect } from 'react';
import FranchiseCarousel from './Franchises';
import SignatureStoreCarousel from './SingatureStorecarousel';
import MapToMarket from './MapToMarket';
import HeroSection from './HeroSection';
import LeadersSection from './LeadersSection';

export default function Index() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [brandSlide, setBrandSlide] = useState(0);
  const [productSlide, setProductSlide] = useState(0);
  const [franchiseSlide, setFranchiseSlide] = useState(0);
  const [storeSlide, setStoreSlide] = useState(0);
  const [franchiseFilter, setFranchiseFilter] = useState('Available');
  const [storeFilter, setStoreFilter] = useState('Available');
  const totalSlides = 9;
  const totalBrandSlides = 6;
  const totalProductSlides = 5;
  const totalFranchiseSlides = 5;
  const totalStoreSlides = 5;

  // Add CSS for X icon sizing
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      a.footer-social-link:last-child img {
        width: 12px;
        height: auto;
      }
      a.text-gray-400.hover\\:text-white.transition-colors.footer-social-link img {
        position: relative;
        top: 6px;
      }
      @keyframes smoothScroll {
        0% { transform: translateX(0%); }
        100% { transform: translateX(-100%); }
      }
      section.hero-section.pt-32.pb-24.bg-white img.h-16.w-auto {
        height: 3rem;
      }
      section.hero-section.pt-32.pb-24.bg-white {
        background: url(/images/herobg.jpg);
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
        margin-top: 60px;
        padding-bottom: 0;
      }
      .w-full.px-0.heroCrousel {
        padding-top: 80px;
        height: 420px;
        overflow: hidden;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Auto-play hero carousel functionality - very slow smooth continuous scroll
  useEffect(() => {
    const autoPlayInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 0.01) % totalSlides);
    }, 100);

    return () => clearInterval(autoPlayInterval);
  }, []);

  // Auto-play brands carousel functionality
  useEffect(() => {
    const brandAutoPlayInterval = setInterval(() => {
      setBrandSlide((prev) => (prev + 1) % totalBrandSlides);
    }, 2500);

    return () => clearInterval(brandAutoPlayInterval);
  }, []);

  // Auto-play product showcase carousel functionality
  useEffect(() => {
    const productAutoPlayInterval = setInterval(() => {
      setProductSlide((prev) => (prev + 1) % totalProductSlides);
    }, 3500);

    return () => clearInterval(productAutoPlayInterval);
  }, []);

  // Auto-play franchise carousel functionality (reverse direction, slower speed)
  useEffect(() => {
    const franchiseAutoPlayInterval = setInterval(() => {
      setFranchiseSlide((prev) => {
        const nextSlide = prev - 1;
        if (nextSlide < 0) {
          // Reset to end for seamless loop
          setTimeout(() => setFranchiseSlide(totalFranchiseSlides - 1), 1000);
          return -1;
        }
        return nextSlide;
      });
    }, 5000); // Slower speed (5 seconds)

    return () => clearInterval(franchiseAutoPlayInterval);
  }, []);

  // Auto-play store carousel functionality (faster speed, normal direction)
  useEffect(() => {
    const storeAutoPlayInterval = setInterval(() => {
      setStoreSlide((prev) => {
        const nextSlide = prev + 1;
        if (nextSlide >= totalStoreSlides) {
          // Reset to 0 for seamless loop
          setTimeout(() => setStoreSlide(0), 1000);
          return totalStoreSlides;
        }
        return nextSlide;
      });
    }, 2500); // Faster speed (2.5 seconds)

    return () => clearInterval(storeAutoPlayInterval);
  }, []);


  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation - Exact Match */}

      {/* Hero Section with Auto-Play Carousel */}
      <HeroSection />



      {/* Message From Our Founder */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Text Content */}
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900 leading-tight">
                Message From Our Founder
              </h2>
              <p className="text-lg md:text-xl mb-6 text-gray-700 font-medium">
                EBG – Where Purpose Meets Performance | Trusted by 40+ Brands
              </p>
              <p className="text-gray-700 mb-8 leading-relaxed">
                At EBG Group, we are driven by the vision of solving real-world challenges through purposeful, impactful action. With over 36 Brands under our umbrella, we are committed to transforming industries from energy solutions to advanced manufacturing, creating lasting value and sustainable growth. Our mission is clear, to shape industries that matter, delivering tangible results that improve lives. This is the promise we continue to fulfill every day. Our recent partnership with Daewoo marks a significant milestone in this journey. By aligning with a global leader in engineering and infrastructure, we are enhancing our ability to deliver advanced technologies, expand our market presence, and address India’s most pressing industrial needs with speed, scale, and precision.
              </p>

              {/* Feature List */}
              <ul className="space-y-4">
                {[
                  "An ocean of experience in creative solutions",
                  "Innovation-driven approach to business solutions",
                  "Quality assurance and performance excellence",
                  "Strategic partnerships for mutual growth"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-4 mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Founder Image & Info */}
            <div className="flex flex-col items-center text-center">
              <div className="w-72 h-72 md:w-80 md:h-80 mb-4 rounded-3xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-500">
                <img
                  src="/images/irfan.jpg"
                  alt="Dr. Irfan - Founder & CEO"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-1">Dr. Irfan</h3>
              <p className="text-gray-600 font-medium">Founder & CEO</p>
            </div>

          </div>
        </div>
      </section>

      {/* Trusted by 40+ Brands - Auto-Play Carousel */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by 40+ Brands</h2>
          <p className="text-gray-600 mb-12 max-w-3xl mx-auto text-lg">
            We're proud to work with industry-recognized, innovative companies across various sectors.
          </p>

          {/* Brands Auto-Play Carousel */}
          <div className="relative overflow-hidden">
            <div
              className="flex carousel-transition-smooth"
              style={{ transform: `translateX(-${brandSlide * 16.66}%)` }}
            >
              {/* First set of logos */}
              {[
                { logo: "logo_1.png", name: "AIROCLEAN" },
                { logo: "logo_2.png", name: "kabego" },
                { logo: "logo_3.png", name: "MEXPLE" },
                { logo: "logo_4.png", name: "LUXER" },
                { logo: "logo_5.png", name: "LE BRIN" },
                { logo: "logo_6.png", name: "Great Outdoor" }
              ].map((brand, index) => (
                <div key={index} className="w-1/6 flex-shrink-0 h-16 flex items-center justify-center px-4">
                  <img
                    src={`/images/${brand.logo}`}
                    alt={brand.name}
                    className="max-h-12 w-auto object-contain"
                  />
                </div>
              ))}

              {/* Duplicate set for seamless loop */}
              {[
                { logo: "logo_1.png", name: "AIROCLEAN" },
                { logo: "logo_2.png", name: "kabego" },
                { logo: "logo_3.png", name: "MEXPLE" },
                { logo: "logo_4.png", name: "LUXER" },
                { logo: "logo_5.png", name: "LE BRIN" },
                { logo: "logo_6.png", name: "Great Outdoor" }
              ].map((brand, index) => (
                <div key={`dup-${index}`} className="w-1/6 flex-shrink-0 h-16 flex items-center justify-center px-4">
                  <img
                    src={`/images/${brand.logo}`}
                    alt={brand.name}
                    className="max-h-12 w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <LeadersSection />

      {/* Master Franchise Opportunities - Exact Match */}
      <FranchiseCarousel />

      {/* Signature Store Opportunities - Exact Match */}
      <SignatureStoreCarousel />

      {/* The Daewoo Map to Market Leadership - Exact Match */}
      <MapToMarket />

      {/* Motivation & Innovations - Exact Match */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">Motivation & Innovations</h2>
          <p className="text-gray-600 mb-12 max-w-3xl mx-auto text-lg text-center">
            Stay motivated and innovative with our daily insights and resources.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Quote Of The Day</h3>
              <blockquote className="text-gray-700 italic mb-4 leading-relaxed">
                "Success is not final, failure is not fatal: it is the courage to continue that counts."
              </blockquote>
              <cite className="text-sm text-gray-500">- Zig Ziglar</cite>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Sales Weapon Of The Day</h3>
              <p className="text-gray-700 mb-2 font-medium">Jeffrey Gitomer</p>
              <p className="text-sm text-gray-500">Sales expert and motivational speaker</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Bank Details</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-semibold text-gray-900">A/C Name:</span> <span className="text-gray-700">Think eBikeGo Private Limited</span></p>
                <p><span className="font-semibold text-gray-900">Bank Name:</span> <span className="text-gray-700">ICICI Bank</span></p>
                <p><span className="font-semibold text-gray-900">A/C No:</span> <span className="text-gray-700">123805009535  </span></p>
                <p><span className="font-semibold text-gray-900">Branch</span> <span className="text-gray-700">Mumbai – Andheri W.E. Highway  </span></p>
                <p><span className="font-semibold text-gray-900">IFSC Code:</span> <span className="text-gray-700">ICIC0001238</span></p>
              </div>
              <button className="mt-4 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-full font-semibold text-sm transition-colors">
                Copy Details
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Legends Aren't Hired, They're Made - Exact Match */}
      {/* <section className="py-20 text-black relative overflow-hidden legends-section-bg">
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
            Legends Aren't Hired
          </h2>
          <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            They're Made. ★
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            We're saving this space for the Ones who raise the bar.
          </p>
          <button className="bg-white hover:bg-gray-100 text-black px-8 py-3 rounded-full font-semibold text-lg transition-colors">
            Join Our Team
          </button>
        </div>
      </section> */}

      {/* Employee Of The Month - Exact Match */}
      {/* <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Employee Of The Month</h2>
          <p className="text-gray-600 mb-12 max-w-3xl mx-auto text-lg">
            Recognizing our outstanding team members who go above and beyond.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Johnson", title: "User Success Coordinator", image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300" },
              { name: "Michael Chen", title: "Senior Dealership Executive", image: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=300" },
              { name: "Emily Rodriguez", title: "Sales & Dealership Manager", image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300" }
            ].map((employee, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 mx-auto rounded-full mb-4 overflow-hidden">
                  <img
                    src={employee.image}
                    alt={employee.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{employee.name}</h3>
                <p className="text-gray-600">{employee.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Footer - Exact Match */}

    </div>
  );
}