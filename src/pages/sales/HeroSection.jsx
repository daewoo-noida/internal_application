import React, { useEffect, useRef, useState } from "react";

export default function ModernHeroCarousel() {
    const heroImages = [
        // { src: "/images/homeBanner_1.jpg", title: "Innovation for India" },
        { src: "/images/homeBanner_2.jpg", title: "Innovation for India" },
        { src: "/images/homeBanner_3.jpg", title: "Innovation for India" },
        { src: "/images/homeBanner_4.jpg", title: "Innovation for India" },
        { src: "/images/homeBanner_5.jpg", title: "Innovation for India" },

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
        <section className="pt-5 " style={{ marginTop: 20 }}>
            <div className=" w-full text-center p-3">
                {/* Carousel */}
                <div className="relative overflow-hidden  rounded-2xl">

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
                                {/* <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div> */}

                                {/* Animated Title on Image */}

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
