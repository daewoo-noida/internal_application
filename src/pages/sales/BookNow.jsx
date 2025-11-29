import React, { useState, useEffect } from 'react';

export default function BookNow() {
  const [partnerSlide, setPartnerSlide] = useState(0);
  const totalPartnerSlides = 5;

  // Auto-play partner logo carousel functionality
  useEffect(() => {
    const partnerAutoPlayInterval = setInterval(() => {
      setPartnerSlide((prev) => (prev + 1) % totalPartnerSlides);
    }, 3000);

    return () => clearInterval(partnerAutoPlayInterval);
  }, []);

  return (
    <div className="min-h-screen bg-white book-now-page">

      {/* ======================
         Hero Banner Section
      ======================= */}
      <section className="relative h-96 bg-black overflow-hidden">
        {/* Background Image with Black Overlay */}
        <div className="absolute inset-0">
          <img
            src="/images/herobg.jpg"
            alt="Book Now Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Chase Targets & Book With Confidence.
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
              Every pitch is progress. Stay focused, stay bold, and let every booking fuel your legacy.
            </p>
          </div>
        </div>
      </section>

      {/* ======================
         Drive. Deliver. Win. Repeat. Section
      ======================= */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Drive. Deliver. Win. Repeat.</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every pitch is progress. Stay focused, stay bold, and let every booking fuel your legacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Regional Rights Card */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Regional Rights</h3>
              </div>
            </div>

            {/* Logistics Support Card */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Logistics Support</h3>
              </div>
            </div>

            {/* High ROI Model Card */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">High ROI Model</h3>
              </div>
            </div>

            {/* Full Training Card */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.482 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Full Training</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================
         Master Franchise Portal Section
      ======================= */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Master Franchise Portal</h2>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Image - Map */}
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/1591062/pexels-photo-1591062.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                  alt="India Map"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>

              {/* Right Image - Handshake */}
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                  alt="Business Agreement"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="absolute top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Payment
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Select Your Franchise Territory Card */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Select Your Franchise Territory</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Choose a Territory:</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>-- Select Region --</option>
                    <option>Mumbai Metropolitan</option>
                    <option>Delhi NCR</option>
                    <option>Bangalore</option>
                    <option>Chennai</option>
                    <option>Kolkata</option>
                  </select>
                </div>
                <button className="w-full bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                  Book Now
                </button>
              </div>
            </div>

            {/* Update Payment Details Card */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Update Payment Details</h3>
              <p className="text-gray-600 mb-4">This is a secure area. Please log in to access the client data.</p>
              <button className="w-full bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Access Protected Data
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ======================
         Signature Franchise Portal Section
      ======================= */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Signature Franchise Portal</h2>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Image - Map */}
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/1591062/pexels-photo-1591062.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                  alt="India Map"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>

              {/* Right Image - Daewoo Store */}
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                  alt="Daewoo Signature Store"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-white text-center">
                    <h3 className="text-2xl font-bold">DAEWOO SIGNATURE STORE</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Book Your Signature Franchise Card */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Book Your Signature Franchise</h3>
              <p className="text-gray-600 mb-4">Click the button below to open the application form for a Signature Franchise.</p>
              <button className="w-full bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Book Now
              </button>
            </div>

            {/* Payment Details Card */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                  alt="Payment Process"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Payment
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================
         Franchisee Onboarding Flow Section - Beautiful Redesign
      ======================= */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-gray-800 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl mb-6 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Your Journey to Success</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From your first call to grand store launch - we've streamlined every step to get you started quickly and efficiently.
            </p>
          </div>

          {/* Beautiful 7-Step Process Flow */}
          <div className="relative">
            {/* Progress Line */}
            <div className="hidden lg:block absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-green-500 rounded-full"></div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 lg:gap-4">
              {[
                {
                  step: 1,
                  title: "Submit Expression of Interest (EOI)",
                  description: "Start your journey with a simple expression of interest",
                  icon: "📝",
                  color: "from-yellow-400 to-orange-500"
                },
                {
                  step: 2,
                  title: "Territory Finalization & Brand Fee Submission",
                  description: "Secure your exclusive territory and submit brand fees",
                  icon: "🏢",
                  color: "from-orange-500 to-red-500"
                },
                {
                  step: 3,
                  title: "Letter of Intent (LOI) Issued",
                  description: "Receive official confirmation of your partnership",
                  icon: "📄",
                  color: "from-red-500 to-pink-500"
                },
                {
                  step: 4,
                  title: "Design Approval & Civil Work Initiation",
                  description: "Balance Payment Released to eBikeGo",
                  icon: "🏗️",
                  color: "from-pink-500 to-purple-500"
                },
                {
                  step: 5,
                  title: "Installation of Fixtures, Fascia & Branding",
                  description: "Complete store setup by Daewoo team",
                  icon: "🎨",
                  color: "from-purple-500 to-indigo-500"
                },
                {
                  step: 6,
                  title: "Opening Stock Allocation & Staff Training",
                  description: "Stock your store and train your team",
                  icon: "📦",
                  color: "from-indigo-500 to-blue-500"
                },
                {
                  step: 7,
                  title: "GRAND LAUNCH EVENT",
                  description: "With Influencers + QuickCommerce Activation",
                  icon: "🎉",
                  color: "from-blue-500 to-green-500"
                }
              ].map((item, index) => (
                <div key={item.step} className="relative group">
                  {/* Step Card */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 group-hover:border-yellow-400/30">
                    {/* Step Number & Icon */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${item.color} text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg`}>
                        {item.step}
                      </div>
                      <div className="text-2xl">{item.icon}</div>
                    </div>

                    {/* Content */}
                    <h4 className="font-bold text-gray-900 mb-2 text-sm leading-tight">{item.title}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{item.description}</p>

                    {/* Connecting Line (Mobile) */}
                    {index < 6 && (
                      <div className="lg:hidden absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-gradient-to-b from-gray-300 to-transparent"></div>
                    )}
                  </div>

                  {/* Connecting Line (Desktop) */}
                  {index < 6 && (
                    <div className="hidden lg:block absolute top-16 -right-2 w-4 h-0.5 bg-gradient-to-r from-gray-300 to-gray-200"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Info Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-20">
            {/* Compliance Card */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Simple & Streamlined Compliance</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {['PAN & Aadhaar', 'Business Registration', 'GST Certificate', 'Rent/Ownership Proof', 'Bank Statement', 'Passport Photos'].map((item, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-yellow-50 transition-colors">
                    <div className="w-2 h-2 bg-[#0070b9] rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Setup Card */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Fewer Barriers. Faster Setup.</h3>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We've streamlined the process to make your store launch smooth and scalable.
                Our team provides comprehensive support throughout your journey with us.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Guaranteed Success</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">7 Steps</div>
                  <div className="text-sm text-gray-500">to Launch</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================
         Partner Logos Section
      ======================= */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Partners</h2>
          <p className="text-gray-600 mb-12 max-w-3xl mx-auto text-lg">
            We're proud to work with industry-recognized, innovative companies across various sectors.
          </p>

          {/* Partner Logos Auto-Play Carousel */}
          <div className="relative overflow-hidden">
            <div
              className="flex carousel-transition-smooth"
              style={{ transform: `translateX(-${partnerSlide * 20}%)` }}
            >
              {/* First set of partner logos */}
              {[
                { logo: "logo.png", name: "DAEWOO" },
                { logo: "logo_1.png", name: "acer (OFFICIAL LICENSEE)" },
                { logo: "logo_2.png", name: "ALPHOMEGA" },
                { logo: "logo_3.png", name: "AROHA ORGANIC" },
                { logo: "logo_4.png", name: "Čelvara ATELIER" }
              ].map((partner, index) => (
                <div key={index} className="w-1/5 flex-shrink-0 h-20 flex items-center justify-center px-4">
                  <img
                    src={`images/${partner.logo}`}
                    alt={partner.name}
                    className="max-h-16 w-auto object-contain"
                  />
                </div>
              ))}

              {/* Duplicate set for seamless loop */}
              {[
                { logo: "logo.png", name: "DAEWOO" },
                { logo: "logo_1.png", name: "acer (OFFICIAL LICENSEE)" },
                { logo: "logo_2.png", name: "ALPHOMEGA" },
                { logo: "logo_3.png", name: "AROHA ORGANIC" },
                { logo: "logo_4.png", name: "Čelvara ATELIER" }
              ].map((partner, index) => (
                <div key={`dup-${index}`} className="w-1/5 flex-shrink-0 h-20 flex items-center justify-center px-4">
                  <img
                    src={`images/${partner.logo}`}
                    alt={partner.name}
                    className="max-h-16 w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Exact Match */}

    </div>
  );
}
