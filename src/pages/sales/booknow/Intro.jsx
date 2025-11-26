export default function Intro() {
    return (
        <section className="intro py-20 md:py-32 relative">
            <div className="container-default">
                <div className="grid md:grid-cols-2 gap-10 items-center">

                    {/* Left Content */}
                    <div className="fade-up" data-aos="fade-up" data-aos-delay="100">
                        <h2 className="section-title-9 mb-5">
                            Why Choose <span className="text-[#0070b9]">WCI Initiatives?</span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
                            WCI Initiatives empowers communities through awareness, education, and sustainable programs that focus on creative storytelling, digital safety, environmental responsibility, and social development.
                        </p>
                        <a href="#programs" className="btn btn-lg btn-secondary hover:btn-white dark:btn-accent">
                            Learn More
                        </a>
                    </div>

                    {/* Right Image */}
                    <div className="relative fade-up" data-aos="fade-up" data-aos-delay="200">
                        <figure className="overflow-hidden rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                            <img
                                src="/images/intro-img.jpg"
                                alt="Why Choose WCI"
                                className="w-full h-[350px] md:h-[420px] object-cover"
                            />
                        </figure>
                        {/* Decorative Shape */}
                        <img
                            src="/images/shape-intro.svg"
                            className="absolute top-0 right-0 w-20 animate-float"
                            alt=""
                        />
                    </div>

                </div>
            </div>
        </section>
    );
}
