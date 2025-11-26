export default function CTA() {
    return (
        <section className="cta-section py-20 md:py-32 bg-[#0070b9] text-white">
            <div className="container-default text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 fade-up" data-aos="fade-up">
                    Join Our Community of Innovators
                </h2>
                <p className="text-lg md:text-xl mb-8 fade-up" data-aos="fade-up" data-aos-delay="100">
                    Subscribe to our newsletter and get the latest updates, tips, and exclusive resources directly in your inbox.
                </p>
                <form
                    className="flex flex-col sm:flex-row justify-center items-center gap-4 fade-up"
                    data-aos="fade-up"
                    data-aos-delay="200"
                >
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="px-5 py-3 rounded-lg w-full sm:w-80 text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                    />
                    <button
                        type="submit"
                        className="px-6 py-3 bg-white text-[#0070b9] font-semibold rounded-lg hover:bg-gray-100 transition"
                    >
                        Subscribe
                    </button>
                </form>
                <p className="text-sm text-white/80 mt-4 fade-up" data-aos="fade-up" data-aos-delay="300">
                    We respect your privacy. Unsubscribe at any time.
                </p>
            </div>
        </section>
    );
}
