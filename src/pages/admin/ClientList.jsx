import React, { useEffect, useState } from "react";
import adminAPI from "../../utils/api";

export default function ClientsList() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadClients();
    }, []);

    const loadClients = async () => {
        try {
            const { data } = await adminAPI.allClients();
            setClients(data.clients || []);
        } catch (err) {
            console.error("Error loading clients", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">All Clients</h1>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Territory</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deal Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token Received</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center p-6 text-gray-600">Loading...</td>
                            </tr>
                        ) : clients.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center p-6 text-gray-600">No clients found</td>
                            </tr>
                        ) : (
                            clients.map((c) => (
                                <tr key={c._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">{c.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{c.territory}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{c.state}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">₹{c.dealAmount?.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">₹{c.tokenReceivedAmount?.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{c.createdBy?.name || "Unknown"}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}