import React from "react";

export default function Contact_Us() {



  return (
    <div className="min-h-screen bg-white contact-us-pages " style={{ marginTop: "12vh" }} >

      {/* ======================
          Contact Top Banner
      ======================= */}
      <section
        className=" relative overflow-hidden rounded-2xl flex items-center justify-center"
        style={{
          margin: "12vh 3vh",
          backgroundImage: "url('/images/contact.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "70vh",
        }}
      >
        {/* Background */}
        {/* <div className="absolute "></div> */}

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center h-full ">
          <div className="text-center text-[#0070b9] px-4">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
              Get in Touch
            </h1>
            <p className="text-lg text-[#0070b9] mt-4">
              A dedicated support window for the Daewoo Sales Team <br /> Helping you move faster, close better, and deliver a seamless experience across all sales channels.
            </p>
          </div>
        </div>
      </section>

      {/* ======================
          Contact Section
      ======================= */}
      <main className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12">

          {/* LEFT SIDE */}
          <div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h2>

            {/* OFFICE BOXES */}
            <div className="space-y-6">


              <div className="p-6 rounded-2xl border bg-white shadow-sm hover:shadow-md transition">
                <h3 className="text-xl font-semibold text-[#0070b9] mb-3">
                  Get in Touch
                </h3>

                <p className="text-gray-700 mb-1 font-medium">General Enquiries:</p>

                <a
                  href="mailto:help@daewooappliances.in"
                  className="block text-[#0070b9] underline"
                >
                  help@daewooappliances.in
                </a>

                <a
                  href="mailto:support@daewooappliances.in"
                  className="block text-[#0070b9] underline"
                >
                  support@daewooappliances.in
                </a>
              </div>


              {/* Noida Corporate */}
              <div className="p-6 rounded-2xl border bg-white shadow-sm hover:shadow-md transition">
                <h3 className="text-xl font-semibold text-[#0070b9] mb-2">
                  EBG Group Noida Corporate Office
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  BLOCK-C, Office Number 805, A Tower,<br />
                  Bhutani Cyberpark – Bhutani 62 Avenue,<br />
                  Phase 2, Industrial Area,<br />
                  Noida, Uttar Pradesh – 201309.
                </p>
              </div>

              {/* Emails */}


              {/* Let’s Connect Card */}

            </div>
          </div>

          {/* RIGHT FORM */}
          <div>
            <form className="space-y-5 rounded-2xl border p-8 shadow-md bg-white">

              <div>
                <label className="block text-sm font-medium">Your Name</label>
                <input
                  className="mt-1 w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-600 outline-none"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="mt-1 w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-600 outline-none"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Message</label>
                <textarea
                  rows="5"
                  className="mt-1 w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-600 outline-none"
                  placeholder="How can we help?"
                />
              </div>

              <button
                type="button"
                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
              >
                Send Message
              </button>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
}
