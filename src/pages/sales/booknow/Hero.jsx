export default function Hero() {
    return (
        <section className="hero md:py-36 py-16 relative overflow-x-hidden">
            <div className="absolute inset-0 pointer-events-none">
                {/* BG Gradients */}
                <div className="conic-top-right"></div>
                <div className="conic-top-left"></div>
            </div>

            <div className="container-default relative z-10">
                <div className="grow-up fade-wrapper">
                    <div className="text-center">
                        <h1
                            className="section-title-9 xl:!tracking-[-2px] mb-5 clip-y"
                            data-aos="fade-up"
                            data-aos-delay="100"
                        >
                            Empower Your Future with
                            <span className="text-[#0070b9]"> WCI Initiatives</span>
                        </h1>

                        <p
                            className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8"
                            data-aos="fade-up"
                            data-aos-delay="200"
                        >
                            Building awareness through creative storytelling, digital safety,
                            environmental education, and community empowerment.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex justify-center gap-4" data-aos="fade-up" data-aos-delay="300">
                            <a href="#programs" className="btn btn-lg btn-secondary hover:btn-white dark:btn-accent">
                                Explore Programs
                            </a>
                            <a href="#contact" className="btn btn-lg btn-white dark:btn-white-dark">
                                Contact Us
                            </a>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="relative mt-14" data-aos="fade-up" data-aos-delay="400">
                        <figure className="rounded-3xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
                            <img
                                src="/images/hero-main.jpg"
                                alt="WCI Programs"
                                className="w-full h-[420px] md:h-[500px] lg:h-[580px] object-cover"
                            />
                        </figure>

                        {/* Decorative Floating Shapes */}
                        <img
                            src="/images/shape-hero-1.svg"
                            className="absolute top-5 left-5 w-16 animate-float"
                            alt=""
                        />
                        <img
                            src="/images/shape-hero-2.svg"
                            className="absolute bottom-5 right-10 w-20 animate-float-delay"
                            alt=""
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
