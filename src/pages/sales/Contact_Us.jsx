export default function Contact_Us() {
  return (
    <div className="min-h-screen bg-white contact-us-pages">


      {/* ======================
         Banner Section
      ======================= */}
      <section className="relative h-96 bg-black overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="/images/herobg.jpg"
            alt="Contact Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Get in Touch
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
              We're here to help you with any questions or support you need
            </p>
          </div>
        </div>
      </section>

      {/* ======================
         Main content (replace with your real sections)
      ======================= */}
      <main>
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 grid gap-10 md:grid-cols-2 md:items-start">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Contact Us
              </h2>
              <p className="mt-4 text-gray-600">
                Replace this section with your original content (address, map, FAQs, etc.).
              </p>

              {/* Example contact info block */}
              <div className="mt-8 space-y-2 text-sm">
                <p><strong>Email:</strong> info@example.com</p>
                <p><strong>Phone:</strong> +91-00000-00000</p>
                <p><strong>Office:</strong> Your address line 1, City, State</p>
              </div>
            </div>

            {/* Example contact form (placeholder) */}
            <form className="space-y-4 rounded-2xl border p-6 shadow-sm bg-white">
              <div>
                <label htmlFor="name" className="block text-sm font-medium">Your name</label>
                <input id="name" name="name" className="mt-1 w-full border rounded-lg p-3" placeholder="John Doe" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium">Email</label>
                <input id="email" name="email" type="email" className="mt-1 w-full border rounded-lg p-3" placeholder="john@example.com" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium">Message</label>
                <textarea id="message" name="message" rows="5" className="mt-1 w-full border rounded-lg p-3" placeholder="How can we help?" />
              </div>
              <button type="button" className="inline-flex items-center rounded-lg px-5 py-3 font-medium text-white bg-black hover:opacity-90">
                Send message
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer - Exact Match */}

    </div>
  );
}
