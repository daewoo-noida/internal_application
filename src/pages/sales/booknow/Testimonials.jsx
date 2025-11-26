import { useState } from "react";

export default function Testimonials() {
    const testimonials = [
        {
            name: "Jane Doe",
            role: "Startup Founder",
            photo: "/testimonials/jane.jpg",
            quote:
                "The entrepreneurship program transformed my idea into a real business. The mentorship and resources were invaluable!",
        },
        {
            name: "John Smith",
            role: "Community Volunteer",
            photo: "/testimonials/john.jpg",
            quote:
                "Participating in the community initiatives gave me the tools to make a tangible difference in my neighborhood.",
        },
        {
            name: "Emily Clark",
            role: "Innovator",
            photo: "/testimonials/emily.jpg",
            quote:
                "The innovation workshops sparked ideas I never thought possible. Truly a life-changing experience.",
        },
    ];

    const [current, setCurrent] = useState(0);
    const length = testimonials.length;

    const nextSlide = () => setCurrent(current === length - 1 ? 0 : current + 1);
    const prevSlide = () => setCurrent(current === 0 ? length - 1 : current - 1);

    return (
        <section className="testimonials-section py-20 md:py-32 bg-gray-50 dark:bg-gray-900">
            <div className="container-default text-center">
                <h2 className="section-title-9 mb-12 fade-up" data-aos="fade-up">
                    What Our <span className="text-[#0070b9]">Participants Say</span>
                </h2>
                <div className="relative">
                    {testimonials.map((t, index) => (
                        <div
                            key={index}
                            className={`transition-all duration-700 ease-in-out ${index === current ? "opacity-100" : "opacity-0 absolute inset-0"
                                }`}
                            data-aos="fade-up"
                        >
                            <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                                <img
                                    src={t.photo}
                                    alt={t.name}
                                    className="w-24 h-24 rounded-full mx-auto mb-6"
                                />
                                <p className="text-gray-600 dark:text-gray-300 italic mb-4">"{t.quote}"</p>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                    {t.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{t.role}</p>
                            </div>
                        </div>
                    ))}

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#0070b9] text-white hover:bg-[#0070b9] transition"
                    >
                        &#10094;
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#0070b9] text-white hover:bg-[#0070b9] transition"
                    >
                        &#10095;
                    </button>
                </div>
            </div>
        </section>
    );
}
