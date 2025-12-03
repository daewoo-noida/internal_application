import React, { useEffect, useState } from "react";

export default function DailyCarousel({ items = [] }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (!items.length) return;

        const today = new Date().toISOString().split("T")[0];
        const saved = JSON.parse(localStorage.getItem("dailyCarousel"));

        if (saved?.date === today && saved?.index < items.length) {
            setIndex(saved.index);
        } else {
            const newIndex = Math.floor(Math.random() * items.length);
            setIndex(newIndex);

            localStorage.setItem(
                "dailyCarousel",
                JSON.stringify({ date: today, index: newIndex })
            );
        }
    }, [items]);

    if (!items.length) return null;

    const card = items[index];

    return (
        <div className="bg-gray-50 rounded-xl ">
            <h3 className="text-xl font-semibold mb-4">{card.title}</h3>
            <blockquote className="text-gray-700 italic leading-relaxed">
                {card.quote}
            </blockquote>
            <cite className="text-sm text-gray-500 block mt-2">{card.author}</cite>
        </div>
    );
}
