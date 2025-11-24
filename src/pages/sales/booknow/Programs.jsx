export default function Programs() {
    const programs = [
        {
            title: "Entrepreneurship Training",
            description:
                "Hands-on programs designed to equip aspiring entrepreneurs with the skills and knowledge to launch and grow successful businesses.",
            icon: "/icons/entrepreneurship.svg",
        },
        {
            title: "Community Engagement",
            description:
                "Initiatives that foster social responsibility, encourage volunteerism, and create a positive impact in local communities.",
            icon: "/icons/community.svg",
        },
        {
            title: "Innovation Workshops",
            description:
                "Workshops to spark creativity, encourage problem-solving, and drive innovative solutions across sectors.",
            icon: "/icons/innovation.svg",
        },
    ];

    return (
        <section className="programs-section py-20 md:py-32 bg-white dark:bg-gray-900">
            <div className="container-default text-center">
                <h2 className="section-title-9 mb-12 fade-up" data-aos="fade-up">
                    Our <span className="text-blue-600">Programs</span>
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {programs.map((program, index) => (
                        <div
                            key={index}
                            className="program-card fade-up bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition hover:shadow-xl"
                            data-aos="fade-up"
                            data-aos-delay={index * 100 + 100}
                        >
                            <img
                                src={program.icon}
                                alt={program.title}
                                className="w-16 h-16 mb-6 mx-auto"
                            />
                            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                                {program.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">{program.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
