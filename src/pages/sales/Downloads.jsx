export default function Downloads() {
  return (
    <div className="min-h-screen bg-white downloads-page">
      {/* ======================
         Banner Section
      ======================= */}
      <section className="relative h-96 bg-black overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="/images/herobg.jpg"
            alt="Downloads Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Download Center
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
              Access comprehensive resources, documents, and materials for your business success
            </p>
          </div>
        </div>
      </section>

      {/* ======================
         Main content
      ======================= */}
      <main>
        {/* Quick Access Section */}
        <section className="xl:py-[100px] lg:py-[90px] md:py-20 py-16 bg-gradient-to-br from-gray-50 to-white dark:from-background-2 dark:to-background-3">
          <div className="main-container">
            <div className="text-center space-y-6 mb-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-2xl mb-4">
                <svg className="w-8 h-8 text-dark dark:text-white" fill="currentColor" viewbox="0 0 20 20">
                  <path clip-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" fill-rule="evenodd"></path>
                </svg>
              </div>
              <p className="text-lg text-gray-600 dark:text-accent/60 font-medium" data-delay="0.2" data-ns-animate="">Resource Library</p>
              <h2 className="text-4xl font-bold text-gray-900 mb-4" data-delay="0.3" data-ns-animate="">Quick Access Downloads</h2>
              <p className="text-xl text-gray-600 dark:text-accent/60 max-w-3xl mx-auto" data-delay="0.4" data-ns-animate="">
                Get instant access to all the resources you need for your business success
              </p>
            </div>
            {/* Download Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Franchise Documents */}
              <div className="group" data-delay="0.4" data-ns-animate="">
                <div className="bg-white dark:bg-background-3 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-white/10 hover:border-gray-400/30 h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img alt="Franchise Documents" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="https://images.pexels.com/photos/1591062/pexels-photo-1591062.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=800&amp;h=600&amp;fit=crop" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-4 right-4 w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewbox="0 0 20 20">
                        <path clip-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" fill-rule="evenodd"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Franchise Documents</h3>
                    <p className="text-gray-600 dark:text-accent/60 mb-6">Essential documents for franchise operations and compliance</p>
                    <div className="space-y-3">
                      <a className="block w-full bg-white text-gray-900 py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-300 text-center font-semibold border-2 border-gray-900 hover:border-gray-700" href="#">
                        Download All
                      </a>
                      <a className="block w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white py-3 px-6 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-center font-medium border border-gray-200 dark:border-gray-600" href="#">
                        View Guidelines
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              {/* Product Catalogs */}
              <div className="group" data-delay="0.5" data-ns-animate="">
                <div className="bg-white dark:bg-background-3 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-white/10 hover:border-gray-400/30 h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img alt="Product Catalogs" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=800&amp;h=600&amp;fit=crop" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-4 right-4 w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewbox="0 0 20 20">
                        <path clip-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" fill-rule="evenodd"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Product Catalogs</h3>
                    <p className="text-gray-600 dark:text-accent/60 mb-6">Complete product information and specifications</p>
                    <div className="space-y-3">
                      <a className="block w-full bg-white text-gray-900 py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-300 text-center font-semibold border-2 border-gray-900 hover:border-gray-700" href="#">
                        View Catalogs
                      </a>
                      <a className="block w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white py-3 px-6 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-center font-medium border border-gray-200 dark:border-gray-600" href="#">
                        Download PDF
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              {/* Marketing Materials */}
              <div className="group" data-delay="0.6" data-ns-animate="">
                <div className="bg-white dark:bg-background-3 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-white/10 hover:border-gray-400/30 h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img alt="Marketing Materials" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=800&amp;h=600&amp;fit=crop" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-4 right-4 w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewbox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Marketing Materials</h3>
                    <p className="text-gray-600 dark:text-accent/60 mb-6">Professional marketing assets and promotional materials</p>
                    <div className="space-y-3">
                      <a className="block w-full bg-white text-gray-900 py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-300 text-center font-semibold border-2 border-gray-900 hover:border-gray-700" href="#">
                        Download Assets
                      </a>
                      <a className="block w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white py-3 px-6 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-center font-medium border border-gray-200 dark:border-gray-600" href="#">
                        View Gallery
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              {/* Training Resources */}
              <div className="group" data-delay="0.7" data-ns-animate="">
                <div className="bg-white dark:bg-background-3 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-white/10 hover:border-gray-400/30 h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img alt="Training Resources" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=800&amp;h=600&amp;fit=crop" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-4 right-4 w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewbox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.482 0z"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Training Resources</h3>
                    <p className="text-gray-600 dark:text-accent/60 mb-6">Comprehensive training materials and courses</p>
                    <div className="space-y-3">
                      <a className="block w-full bg-white text-gray-900 py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-300 text-center font-semibold border-2 border-gray-900 hover:border-gray-700" href="#">
                        Access Training
                      </a>
                      <a className="block w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white py-3 px-6 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-center font-medium border border-gray-200 dark:border-gray-600" href="#">
                        View Courses
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              {/* Legal Documents */}
              <div className="group" data-delay="0.8" data-ns-animate="">
                <div className="bg-white dark:bg-background-3 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-white/10 hover:border-gray-400/30 h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img alt="Legal Documents" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="https://images.pexels.com/photos/1591061/pexels-photo-1591061.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=800&amp;h=600&amp;fit=crop" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-4 right-4 w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewbox="0 0 20 20">
                        <path clip-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" fill-rule="evenodd"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Legal Documents</h3>
                    <p className="text-gray-600 dark:text-accent/60 mb-6">Important legal agreements and compliance documents</p>
                    <div className="space-y-3">
                      <a className="block w-full bg-white text-gray-900 py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-300 text-center font-semibold border-2 border-gray-900 hover:border-gray-700" href="#">
                        Download All
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              {/* Business Tools */}
              <div className="group" data-delay="0.9" data-ns-animate="">
                <div className="bg-white dark:bg-background-3 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-white/10 hover:border-gray-400/30 h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img alt="Business Tools" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=800&amp;h=600&amp;fit=crop" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-4 right-4 w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewbox="0 0 20 20">
                        <path clip-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" fill-rule="evenodd"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Business Tools</h3>
                    <p className="text-gray-600 dark:text-accent/60 mb-6">Essential tools and resources for business operations</p>
                    <div className="space-y-3">
                      <a className="block w-full bg-white text-gray-900 py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-300 text-center font-semibold border-2 border-gray-900 hover:border-gray-700" href="#">
                        Download Tools
                      </a>
                      <a className="block w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white py-3 px-6 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-center font-medium border border-gray-200 dark:border-gray-600" href="#">
                        View Resources
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Featured Downloads Section */}
        <section className="xl:py-[100px] lg:py-[90px] md:py-20 py-16 bg-background-3 dark:bg-background-7">
          <div className="main-container">
            <div className="text-center space-y-4 mb-16">
              <p className="text-xl text-secondary/60 dark:text-accent/60" data-delay="0.2" data-ns-animate="">Popular Downloads</p>
              <h2 className="text-4xl font-bold text-gray-900 mb-4" data-delay="0.3" data-ns-animate="">Featured Downloads</h2>
            </div>
            {/* Featured Downloads Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Master Franchise Agreement */}
              <div className="bg-white dark:bg-background-3 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group" data-delay="0.4" data-ns-animate="">
                <div className="relative h-40 overflow-hidden">
                  <img alt="Master Franchise Agreement" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="https://images.pexels.com/photos/1591062/pexels-photo-1591062.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=800&amp;h=400&amp;fit=crop" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 right-4 w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewbox="0 0 20 20">
                      <path clip-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" fill-rule="evenodd"></path>
                    </svg>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Master Franchise Agreement</h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">Complete franchise agreement template with all legal terms and conditions</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>📄 PDF</span>
                      <span>📅 Updated: Jan 2025</span>
                      <span>📊 2.3 MB</span>
                    </div>
                    <a className="bg-gray-800 text-white border border-gray-800 px-6 py-2 rounded-lg hover:bg-gray-900 transition-colors font-medium" href="#">
                      Download
                    </a>
                  </div>
                </div>
              </div>
              {/* Product Catalog 2025 */}
              <div className="bg-white dark:bg-background-3 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group" data-delay="0.5" data-ns-animate="">
                <div className="relative h-40 overflow-hidden">
                  <img alt="Product Catalog 2025" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=800&amp;h=400&amp;fit=crop" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 right-4 w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewbox="0 0 20 20">
                      <path clip-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" fill-rule="evenodd"></path>
                    </svg>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Product Catalog 2025</h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">Complete product range with specifications, pricing, and features</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>📄 PDF</span>
                      <span>📅 Updated: Jan 2025</span>
                      <span>📊 15.7 MB</span>
                    </div>
                    <a className="bg-gray-800 text-white border border-gray-800 px-6 py-2 rounded-lg hover:bg-gray-900 transition-colors font-medium" href="#">
                      Download
                    </a>
                  </div>
                </div>
              </div>
              {/* Marketing Kit */}
              <div className="bg-white dark:bg-background-3 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group" data-delay="0.6" data-ns-animate="">
                <div className="relative h-40 overflow-hidden">
                  <img alt="Marketing Kit" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=800&amp;h=400&amp;fit=crop" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 right-4 w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewbox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Marketing Kit</h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">Complete marketing materials including logos, banners, and templates</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>📁 ZIP</span>
                      <span>📅 Updated: Jan 2025</span>
                      <span>📊 45.2 MB</span>
                    </div>
                    <a className="bg-gray-800 text-white border border-gray-800 px-6 py-2 rounded-lg hover:bg-gray-900 transition-colors font-medium" href="#">
                      Download
                    </a>
                  </div>
                </div>
              </div>
              {/* Training Manual */}
              <div className="bg-white dark:bg-background-3 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group" data-delay="0.7" data-ns-animate="">
                <div className="relative h-40 overflow-hidden">
                  <img alt="Training Manual" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=800&amp;h=400&amp;fit=crop" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 right-4 w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewbox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.482 0z"></path>
                    </svg>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Training Manual</h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">Comprehensive training guide for franchise partners and staff</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>📄 PDF</span>
                      <span>📅 Updated: Jan 2025</span>
                      <span>📊 8.9 MB</span>
                    </div>
                    <a className="bg-gray-800 text-white border border-gray-800 px-6 py-2 rounded-lg hover:bg-gray-900 transition-colors font-medium" href="#">
                      Download
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

    </div>
  )
}
