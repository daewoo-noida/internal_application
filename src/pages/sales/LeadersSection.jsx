export default function LeadersSection() {
    const leaders = [
        {
            name: "Hari Kiran",
            title: "COO & Co-Founder, EBG Group",
            img: "images/hari.jpg",
            content: `At DAEWOO, our journey to becoming one of India’s most impactful consumer electronics brands is powered by the strategic leadership of Hari Kiran, COO of EBG Group. As a core architect of EBG’s growth, his operational discipline and long-term vision have shaped the organisation’s foundation.
 With deep expertise in building large-scale systems and driving sustainable expansion, Hari ensures Daewoo operates with precision, efficiency, and stability. Under his guidance, Daewoo is not just expanding, it is advancing with purpose and setting new benchmarks in quality and performance.`
        },
        {
            name: "Ketan Sahu",
            title: "Retails Head, Daewoo appliances",
            img: "images/ketan.png",
            content: `Daewoo’s mission to build India’s strongest retail and distribution network is led by the experienced leadership of Ketan Sahu. With decades of retail expertise — including a successful tenure at BPL — Ketan brings unmatched market insight and operational discipline to our national retail strategy.
He oversees Daewoo’s complete retail wing, ensuring strong distribution channels, high-performing stores, and partner profitability. His leadership keeps Daewoo competitive, efficient, and ready to win across every market in India.
`
        },
        {
            name: "Aryan Sharma",
            title: "Sales Head, Daewoo appliances",
            img: "images/aryan.jpg",
            content: `At DAEWOO, our vision to build a trusted, future-ready electronics brand is brought to life through the leadership of Aryan Sharma. Driving expansion with high-potential franchise partners, Aryan ensures seamless execution across sales, onboarding, store setup, and partner support.
With a sharp understanding of India’s market potential, he focuses on building profitable franchise ecosystems and high-performance stores. His dedication and direction continue to accelerate Daewoo’s rise as a dominant force in the Indian electronics industry.
`
        }
    ];

    return (
        <section className="py-16 bg-white">
            <h2 className="text-center text-3xl font-bold text-gray-900 mb-12">
                FROM OUR <span className="text-blue-600">LEADERS</span>
            </h2>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-6">
                {leaders.map((leader, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-md rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all"
                    >
                        <div className="flex justify-center mb-4">
                            <img
                                src={leader.img}
                                alt={leader.name}
                                className="w-32 h-32 rounded-full object-cover border-4 border-blue-600"
                            />
                        </div>

                        <p className="text-gray-700 whitespace-pre-line text-sm leading-relaxed mb-4">
                            {leader.content}
                        </p>

                        <div className="text-center mt-4">
                            <h3 className="text-xl font-bold text-blue-700">{leader.name}</h3>
                            <p className="text-sm font-medium text-gray-600">{leader.title}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}