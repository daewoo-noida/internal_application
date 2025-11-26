import React from "react";

export default function StepSidebar({ step }) {
    const steps = [
        "Personal Details",
        "Documents Upload",
        "Payment Details",
        "Office & Allocation",
        "Summary",
    ];

    return (
        <>
            {/* --- MOBILE TOP STEPS --- */}
            <div className="md:hidden bg-white shadow-sm flex justify-between p-3">
                {steps.map((label, index) => {
                    const num = index + 1;
                    const active = step === num;
                    const done = num < step;

                    return (
                        <div
                            key={label}
                            className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold border-2
                                ${active ? "border-[#0070b9] text-[#0070b9]" : ""}
                                ${done ? "bg-[#0070b9] text-white border-[#0070b9]" : ""}
                                ${!active && !done ? "text-gray-400 border-gray-300" : ""}
                            `}
                        >
                            {done ? "✓" : num}
                        </div>
                    );
                })}
            </div>

            {/* --- DESKTOP SIDEBAR --- */}
            <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 shadow-sm p-8">

                <h2 className="text-xl font-bold mb-8 text-[#0070b9]">
                    Registration Steps
                </h2>

                <div className="flex flex-col gap-6">
                    {steps.map((label, index) => {
                        const num = index + 1;
                        const active = step === num;
                        const done = num < step;

                        return (
                            <div key={label} className="flex items-center gap-4">

                                {/* Circle */}
                                <div
                                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center font-semibold
                                        ${active ? "border-[#0070b9] text-[#0070b9]" : ""}
                                        ${done ? "bg-[#0070b9] text-white border-[#0070b9]" : ""}
                                        ${!active && !done ? "border-gray-300 text-gray-400" : ""}
                                    `}
                                >
                                    {done ? "✓" : num}
                                </div>

                                {/* Label */}
                                <span
                                    className={`text-sm font-medium
                                        ${active ? "text-[#0070b9]" : "text-gray-600"}
                                    `}
                                >
                                    {label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
