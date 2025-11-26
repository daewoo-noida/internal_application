import { useEffect, useRef } from "react";

export default function ClientLogoCarousel() {
    const sliderRef = useRef(null);

    useEffect(() => {
        const slider = sliderRef.current;
        let scrollAmount = 0;

        const autoScroll = () => {
            if (!slider) return;
            scrollAmount += 1;
            slider.scrollLeft = scrollAmount;

            if (scrollAmount >= slider.scrollWidth / 2) {
                scrollAmount = 0; // infinite loop
            }
        };

        const interval = setInterval(autoScroll, 20);
        return () => clearInterval(interval);
    }, []);

    const brands = [
        "/images/brands/1.png",
        "/images/brands/2.png",
        "/images/brands/3.png",
        "/images/brands/4.png",
        "/images/brands/5.png",
        "/images/brands/6.png",
        "/images/brands/7.png",
        "/images/brands/8.png",
        "/images/brands/9.png",
        "/images/brands/10.png",
        "/images/brands/11.png",
        "/images/brands/12.png",
        "/images/brands/13.png",
        "/images/brands/14.png",
        "/images/brands/15.png",
        "/images/brands/16.png",
        "/images/brands/17.png",
        "/images/brands/18.png",
        "/images/brands/19.png",
        "/images/brands/20.png",
        "/images/brands/22.png",
        "/images/brands/23.png",
        "/images/brands/24.png",
        "/images/brands/25.png",
        "/images/brands/26.png",
        "/images/brands/27.png",
        "/images/brands/28.png",
        "/images/brands/29.png",
        "/images/brands/30.png",
        "/images/brands/31.png",
        "/images/brands/32.png",
        "/images/brands/33.png",
        "/images/brands/34.png",
        "/images/brands/35.png",
    ];

    return (
        <section className="py-16 bg-white">
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Trusted by <span className="text-[#0070b9]">30+ Brands</span>
                </h2>
                <p className="text-gray-600 mt-2 text-lg">
                    We're proud to work with innovative and industry-leading companies.
                </p>
            </div>

            <div className="relative overflow-hidden">

                {/* Carousel Container */}
                <div
                    ref={sliderRef}
                    className="flex items-center gap-16 overflow-x-scroll py-6 scrollbar-hide"
                >
                    {[...brands, ...brands].map((logo, index) => (
                        <img
                            key={index}
                            src={logo}
                            alt="brand-logo"
                            className="h-16 md:h-16 object-contain opacity-70 hover:opacity-100 transition duration-300"
                        />
                    ))}
                </div>

                {/* Gradient Fade Left */}
                <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-white pointer-events-none"></div>

                {/* Gradient Fade Right */}
                <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-white pointer-events-none"></div>
            </div>
        </section>
    );
}
