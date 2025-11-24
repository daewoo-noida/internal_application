import React, { useEffect, useRef, useState } from "react";

export default function ModernHeroCarousel() {
    const heroImages = [
        { src: "/images/hero1.jpg", title: "Innovation for India" },
        { src: "/images/hero2.jpg", title: "India’s Strategic Future" },
        { src: "/images/hero3.jpg", title: "Empowering Every State" },
        { src: "/images/hero4.jpg", title: "A Nation of Possibilities" },
        { src: "/images/hero5.jpg", title: "Transforming Opportunities" },
        { src: "/images/hero6.jpg", title: "Stronger Together" },
        { src: "/images/hero7.jpg", title: "Alliance for Growth" },
        { src: "/images/hero8.jpg", title: "Vision for 2030" },
        { src: "/images/hero9.jpg", title: "One India, One Future" },
    ];

    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = heroImages.length;
    const slideInterval = useRef(null);

    // Auto slide
    useEffect(() => {
        slideInterval.current = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % totalSlides);
        }, 3500);
        return () => clearInterval(slideInterval.current);
    }, [totalSlides]);

    return (
        <section className="bg-white flex items-center justify-center py-5 my-5">
            <div className="max-w-7xl w-full px-6 text-center pt-5">

                {/* Main Heading */}
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-10 tracking-tight">
                    A Strategic Alliance for India
                </h1>

                {/* Carousel */}
                <div className="relative overflow-hidden rounded-3xl shadow-2xl">

                    {/* Slide Images */}
                    <div
                        className="flex transition-transform duration-[1200ms] ease-out"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                        {heroImages.map((img, idx) => (
                            <div key={idx} className="relative flex-shrink-0 w-full">
                                <img
                                    src={img.src}
                                    alt={img.title}
                                    className="w-full h-[380px] md:h-[480px] lg:h-[550px] object-cover brightness-95"
                                />

                                {/* Animated Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                                {/* Animated Title on Image */}
                                <h2
                                    className={`absolute bottom-10 left-1/2 -translate-x-1/2 text-white text-2xl md:text-3xl font-semibold transition-all duration-700
                                    ${currentSlide === idx ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
                                `}
                                >
                                    {img.title}
                                </h2>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Dots */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
                        {heroImages.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                className={`w-3 h-3 rounded-full transition-all duration-300
                                    ${currentSlide === idx
                                        ? "bg-white scale-125 shadow-lg"
                                        : "bg-white/50 hover:bg-white/80"
                                    }
                                `}
                            ></button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
