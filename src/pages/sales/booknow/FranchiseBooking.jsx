export default function FranchiseBooking() {
    return (
        <section className="franchise-booking py-20 md:py-32 bg-gray-50 dark:bg-gray-900 relative">
            <div className="container-default">
                <div className="grid md:grid-cols-2 gap-12 items-center">

                    {/* Left Image */}
                    <div className="relative fade-up" data-aos="fade-up" data-aos-delay="100">
                        <figure className="overflow-hidden rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                            <img
                                src="/images/franchise-booking.jpg"
                                alt="Franchise Booking"
                                className="w-full h-[350px] md:h-[420px] object-cover"
                            />
                        </figure>
                        {/* Decorative shape */}
                        <img
                            src="/images/shape-franchise.svg"
                            className="absolute -bottom-5 -left-5 w-24 animate-float"
                            alt=""
                        />
                    </div>

                    {/* Right Content */}
                    <div className="fade-up" data-aos="fade-up" data-aos-delay="200">
                        <h2 className="section-title-9 mb-5">
                            Book Your <span className="text-blue-600">Franchise Today</span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
                            Join WCI Initiatives as a franchise partner and become part of a growing community focused on innovation, sustainability, and social impact. Expand your reach and make a difference in local communities.
                        </p>
                        <a href="#contact" className="btn btn-lg btn-primary hover:btn-accent dark:btn-accent">
                            Book Now
                        </a>
                    </div>

                </div>
            </div>
        </section>
    );
}
