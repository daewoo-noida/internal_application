import React, { useEffect, useState } from "react";
import FranchiseCarousel from "./Franchises";
import SignatureStoreCarousel from "./SingatureStorecarousel";
import MapToMarket from "./MapToMarket";
import HeroSection from "./HeroSection";
import LeadersSection from "./LeadersSection";
import ClientLogoCarousel from "./ClientLogoCarousel";
import { Copy } from "lucide-react";
import OfferPopup from "../../components/LandingPopup";
import DDPFranchise from "./DDPFranchise";
import MotivationSection from "./MotivationSection";
import ArticlesList from "./ArticlesList";
export default function Index() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // smooth hero carousel autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 0.01) % 9);
    }, 100);
    return () => clearInterval(interval);
  }, []);


  const [copied, setCopied] = useState(false);

  const bankDetailsText = `
A/C Name: Think eBikeGo Pvt. Ltd.
Bank: ICICI Bank
A/C No: 123805009535
Branch: Andheri, Mumbai
IFSC: ICIC0001238
  `.trim();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bankDetailsText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-white">

      <OfferPopup />
      {/* 🟢 HERO SECTION (already fixed) */}
      <HeroSection currentSlide={currentSlide} />

      <section className="py-10 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* TEXT */}
            <div>
              <h2 className="text-xl md:text-3xl font-bold mb-6 text-gray-900"> A NOTE FROM FOUNDER & CEO </h2>
              <p className="text-gray-700 mb-8 leading-relaxed text-base md:text-lg">
                At EBG Group, we are driven by the vision of solving real-world challenges through
                purposeful, impactful action. With over 36 Brands under our umbrella, we are committed to
                transforming industries from energy solutions to advanced manufacturing, creating lasting
                value and sustainable growth. Our mission is clear, to shape industries that matter,
                delivering tangible results that improve lives. This is the promise we continue to
                fulfill every day. Our recent partnership with Daewoo marks a significant milestone in
                this journey. By aligning with a global leader in engineering and infrastructure,
                we are enhancing our ability to deliver advanced technologies, expand our market presence,
                and address India’s most pressing industrial needs with speed, scale, and precision.
              </p>
            </div> {/* IMAGE AREA */}
            <div className="flex flex-col items-center text-center">
              <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-3xl overflow-hidden transform hover:scale-105 transition duration-500"> <img src="/images/irfan.png" alt="CEO" className="w-full h-full object-contain" /> </div> <h3 className="text-2xl font-semibold text-gray-900 mt-4"> Dr. Irfan </h3>
              <p className="text-gray-600 font-medium">Founder & CEO</p>
            </div>
          </div>
        </div>
      </section>



      <ClientLogoCarousel />


      <LeadersSection />
      <DDPFranchise />

      <FranchiseCarousel />

      <MapToMarket />

      <SignatureStoreCarousel />


      {/* <section className="py-10 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 ">

          <img src="/images/Article_section.png" alt="" className="rounded-lg" />

        </div> */}


      {/* </section> */}
      <ArticlesList />



      {/* 🟢 MOTIVATION SECTION */}
      < section className="py-10 md:py-16 bg-white" >
        <div className="max-w-7xl mx-auto px-4">

          {/* HEADER */}
          <h2 className="text-3xl md:text-3xl font-bold text-gray-900 mb-4 text-center">
            Motivation & Innovations
          </h2>

          <p className="text-gray-600 mb-12 max-w-3xl mx-auto text-center text-base md:text-lg">
            Stay motivated and innovative with our daily insights.
          </p>

          {/* GRID - ONLY TWO CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* CARD 1 – Motivation Carousel */}
            <MotivationSection />

            {/* CARD 2 – Bank Details */}
            <div className="bg-gray-50 rounded-xl p-6 border relative">
              <h3 className="text-xl font-semibold mb-4">Bank Details</h3>

              {/* Copy Button */}
              <button
                onClick={copyToClipboard}
                className="absolute top-5 right-5 p-2 bg-white border rounded-lg hover:bg-gray-100 transition flex items-center gap-1"
              >
                <Copy size={16} />
                <span className="text-sm">{copied ? "Copied!" : "Copy"}</span>
              </button>

              <div className="space-y-2 text-sm mt-2">
                <p><b>A/C Name:</b> Think eBikeGo Pvt. Ltd.</p>
                <p><b>Bank:</b> ICICI Bank</p>
                <p><b>A/C No:</b> 123805009535</p>
                <p><b>Branch:</b> Andheri, Mumbai</p>
                <p><b>IFSC:</b> ICIC0001238</p>
              </div>
            </div>

          </div>
        </div>
      </section >


    </div >
  );
}
