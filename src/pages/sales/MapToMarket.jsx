import React, { useEffect } from "react";
import { franchiseAPI } from "../../utils/api";

export default function MapToMarket() {

    const [franchises, setFranchises] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [franchiseFilter, setFranchiseFilter] = React.useState("All");
    // const [searchTerm, setSearchTerm] = React.useState("");

    // const states = [
    //     { name: "Delhi NCR", status: "Booked" },
    //     { name: "Telangana", status: "Booked" },
    //     { name: "Odisha", status: "Booked" },
    //     { name: "Rajsthan", status: "Booked" },
    //     { name: "Western Madhya Pradesh", status: "Booked" },
    //     { name: "Eastern Madhya Pradesh", status: "Booked" },
    //     { name: "Mumbai Metropolitan & Western Maharashtra", status: "Booked" },
    //     { name: "Central & South Gujrat", status: "Booked" },
    //     { name: "North Gujarat & Saurashtra", status: "Booked" },
    //     { name: "Western & Central Uttar Pradesh", status: "Booked" },
    //     { name: "Andhra Pradesh", status: "Booked" },
    //     { name: "South & Urban Karnataka", status: "Booked" },
    //     { name: "Chennai & Northern Tamil Nadu", status: "Booked" },
    //     { name: "North & Central Karnataka", status: "Booked" },
    //     { name: "Haryana", status: "Booked" },
    //     { name: "Southern & Western Tamil Nadu", status: "Booked" },
    //     { name: "West Bengal", status: "Available" },
    //     { name: "Marathawada & Southern Maharashtra", status: "Booked" },
    //     { name: "Vidarbha & North Maharastra", status: "Available" },
    //     { name: "Eastern Uttar Pradesh & Bundelkhand", status: "Available" },
    //     { name: "Chattishgarh", status: "Booked" },
    //     { name: "Goa", status: "Available" },
    //     { name: "Himachal Pradesh", status: "Available" },
    //     { name: "Jammu & kashmir", status: "Available" },
    //     { name: "North East", status: "Available" },
    //     { name: "Uttrakhand", status: "Available" },
    //     { name: "Jharkhand", status: "Booked" },
    //     { name: "Punjab", status: "Booked" },
    //     { name: "Bihar", status: "Available" },
    //     { name: "Kerala", status: "Available" },
    // ];


    const fetchFranchises = async () => {
        try {
            const response = await franchiseAPI.getAll('master');
            // console.log('Fetched franchises:', response.data);
            setFranchises(response.data);
        } catch (error) {
            console.error('Error fetching franchises:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFranchises();
    }, []);


    const columns = 3;
    const columnStates = Array.from({ length: columns }, (_, colIndex) =>
        franchises.filter((_, index) => index % columns === colIndex)
    );

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                    The Daewoo Map to Market Leadership
                </h2>
                <p className="text-center mb-8 text-lg font-semibold text-gray-700">Master Franchise Availability</p>
                {/* Legend */}
                <div className="flex justify-center mb-8 space-x-6">
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-700">Available</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-700">Booked</span>
                    </div>
                </div>

                {/* Map */}
                <div className="bg-white rounded-lg p-8 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {columnStates.map((col, colIndex) => (
                            <div key={colIndex} className="space-y-3">
                                {col.map((state, index) => (
                                    <div key={index} className="flex items-center">
                                        <div
                                            className={`w-3 h-3 rounded-full mr-3 ${state.status === "Available" ? "bg-green-500" : "bg-red-500"
                                                }`}
                                        ></div>
                                        <span className="text-gray-700 text-sm">{state.title}</span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
