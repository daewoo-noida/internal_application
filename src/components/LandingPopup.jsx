import { useEffect, useState } from "react";

export default function OfferPopup() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        // Check if popup was shown before
        const hasShown = localStorage.getItem("offerPopupShown");

        if (!hasShown) {
            // Show popup after delay
            setTimeout(() => setOpen(true), 200);
            localStorage.setItem("offerPopupShown", "true");
        }
    }, []);

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">

            <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-3xl overflow-hidden animate-slideUp relative">

                <button
                    onClick={() => setOpen(false)}
                    className="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded-full flex items-center justify-center"
                >
                    ✕
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="p-4 flex flex-col">
                        <div className="flex-1 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden border">
                            <img
                                src="images/popupimage.jpg"
                                alt="Offer"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">
                            Grand Cruise Challenge
                        </h2>

                        <p className="text-[#0070b9] font-semibold mb-3">
                            Mumbai • Lakshadweep • Goa
                        </p>

                        <p className="text-gray-700 leading-relaxed mb-1">
                            <strong>Luxury Cruise Trip | Fully Sponsored</strong>
                        </p>

                        <p className="text-gray-600 leading-relaxed mb-4">
                            Only for BDAs & BDEs — Grab your chance to experience the ultimate Royal Cruise Tour.
                        </p>

                        <p className="font-semibold text-gray-800 mb-1">How to Qualify:</p>
                        <p className="text-gray-600 mb-4">
                            Achieve <strong>₹3.5 Cr</strong> revenue during the offer period and secure your spot.
                        </p>

                        <p className="font-semibold text-gray-800 mb-2">Offer Validity:</p>
                        <p className="text-gray-600 mb-6">
                            Till <strong>31st December 2025</strong>
                        </p>

                        <button
                            onClick={() => setOpen(false)}
                            className="bg-[#0070b9] text-white px-5 py-2 rounded-lg hover:bg-[#005a94] transition"
                        >
                            Okay, Got it!
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
