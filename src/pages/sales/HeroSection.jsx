import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ModernHeroCarousel() {
    const heroImages = [
        { src: "/images/homeBanner_2.jpg", title: "Innovation for India" },
        { src: "/images/homeBanner_3.jpg", title: "Innovation for India" },
        { src: "/images/homeBanner_4.jpg", title: "Innovation for India" },
        { src: "/images/homeBanner_5.jpg", title: "Innovation for India" },
    ];

    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = heroImages.length;
    const slideInterval = useRef(null);

    const startAutoSlide = () => {
        slideInterval.current = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % totalSlides);
        }, 3500);
    };

    const stopAutoSlide = () => clearInterval(slideInterval.current);

    useEffect(() => {
        startAutoSlide();
        return () => stopAutoSlide();
    }, []);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

    return (
        <section className="pt-5" style={{ marginTop: "6vh" }}>
            <div className="w-full text-center p-3">
                <div
                    className="relative overflow-hidden rounded-2xl"
                    onMouseEnter={stopAutoSlide}
                    onMouseLeave={startAutoSlide}
                >

                    {/* Slides */}
                    <div
                        className="flex transition-transform duration-[1200ms] ease-out"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                        {heroImages.map((img, idx) => (
                            <div key={idx} className="relative flex-shrink-0 w-full">
                                <div className="w-full bg-black flex items-center justify-center">
                                    <img src={img.src} alt={img.title} className="w-full object-contain" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* LEFT Icon */}
                    <button
                        onClick={prevSlide}
                        className="absolute top-1/2 left-4 -translate-y-1/2 p-3 bg-white/50 
                                   hover:bg-white rounded-full shadow transition"
                    >
                        <ChevronLeft size={26} />
                    </button>

                    {/* RIGHT Icon */}
                    <button
                        onClick={nextSlide}
                        className="absolute top-1/2 right-4 -translate-y-1/2 p-3 bg-white/50 
                                   hover:bg-white rounded-full shadow transition"
                    >
                        <ChevronRight size={26} />
                    </button>

                </div>
            </div>
        </section>
    );
}
