import React, { useState, useEffect } from "react";
import { clientAPI } from "../../../utils/api";

export default function AddClient() {
    const user = JSON.parse(localStorage.getItem("userData")); // logged-in user

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        altPhone: "",
        territory: "",
        state: "",
        district: "",
        city: "",
        streetAddress: "",
        pin: "",
        officeBranch: "",
        bda: "",
        bde: "",
        bdm: "",
        leadSource: "",
        gst: "",
        dealAmount: "",
        tokenReceivedAmount: "",
        receivedPercent: "",
        remainPercent: "",
        balanceAmount: "",
        tokenDate: "",
        modeOfPayment: "",
        additionalCommitment: "",
        remark: "",
        adharImages: [],
        panImage: null,
        companyPanImage: null,
        addressProof: null,
    });

    // -----------------------
    // States → Districts Data
    // -----------------------

    const stateDistrictMap = {
        Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
        Karnataka: ["Bengaluru", "Mysuru", "Hubli", "Mangalore"],
        TamilNadu: ["Chennai", "Coimbatore", "Madurai", "Salem"],
        UttarPradesh: ["Lucknow", "Kanpur", "Varanasi", "Agra"],
        Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],

    };

    const territories = [
        "Delhi NCR",
        "Telangana",
        "Odisha",
        "Rajasthan",
        "Western Madhya Pradesh",
        "Eastern Madhya Pradesh",
        "Mumbai Metropolitan & Western Maharashtra",
        "Central & South Gujarat",
        "North Gujarat & Saurashtra",
        "Western & Central Uttar Pradesh",
        "Andhra Pradesh",
        "South & Urban Karnataka",
        "Chennai & Northern Tamil Nadu",
        "North & Central Karnataka",
        "Haryana",
        "Southern & Western Tamil Nadu",
        "West Bengal",
        "Marathwada & Southern Maharashtra",
        "Vidarbha & North Maharashtra",
        "Eastern Uttar Pradesh & Bundelkhand",
        "Chhattisgarh",
        "Goa",
        "Himachal Pradesh",
        "Jammu & Kashmir",
        "North East",
        "Uttarakhand",
        "Jharkhand",
        "Punjab",
        "Bihar",
        "Kerala",
    ];

    const officeBranches = [
        "Noida",
        "Zirakpur",
        "Chandigadh",
        "Mumbai",
        "Hyderabad",
        "Others",
    ];

    // ---------------------------------------------
    // AUTO-SET BDA/BDE/BDM BASED ON USER ROLE
    // ---------------------------------------------
    useEffect(() => {
        if (!user) return;

        if (user.designation === "bda") setFormData((f) => ({ ...f, bda: user.id }));
        if (user.designation === "bde") setFormData((f) => ({ ...f, bde: user.id }));
        if (user.designation === "bdm") setFormData((f) => ({ ...f, bdm: user.id }));
    }, []);

    // -----------------------------
    // Payment Auto Calculations
    // -----------------------------
    useEffect(() => {
        const deal = Number(formData.dealAmount || 0);
        const received = Number(formData.tokenReceivedAmount || 0);

        const receivedPercent = deal > 0 ? ((received / deal) * 100).toFixed(2) : 0;
        const remainPercent = (100 - receivedPercent).toFixed(2);
        const balanceAmount = deal - received;

        setFormData((prev) => ({
            ...prev,
            receivedPercent,
            remainPercent,
            balanceAmount,
        }));
    }, [formData.dealAmount, formData.tokenReceivedAmount]);

    // -----------------------------
    // Handle normal input
    // -----------------------------
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // -----------------------------
    // Handle file uploads
    // -----------------------------
    const handleFileChange = (e) => {
        const { name, files } = e.target;

        if (name === "adharImages") {
            if (files.length > 2) {
                alert("Only 2 Aadhaar images allowed");
                return;
            }
            setFormData((prev) => ({ ...prev, adharImages: files }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: files[0] }));
        }
    };

    // -----------------------------
    // Submit to backend
    // -----------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();

        const fd = new FormData();

        Object.keys(formData).forEach((key) => {
            if (key === "adharImages") {
                Array.from(formData.adharImages).forEach((file) =>
                    fd.append("adharImages", file)
                );
            } else {
                fd.append(key, formData[key]);
            }
        });

        try {
            await clientAPI.create(fd);
            alert("Client added successfully!");
        } catch (err) {
            alert("Error adding client");
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 mt-5 rounded-xl shadow-md border">
            <h2 className="text-2xl font-semibold">Add Client</h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mt-4">

                {/* PERSONAL INFO */}
                <input className="border p-3 rounded" name="name" placeholder="Client Name" onChange={handleChange} required />
                <input className="border p-3 rounded" name="email" placeholder="Email" onChange={handleChange} />

                <input className="border p-3 rounded" name="phone" placeholder="Phone" onChange={handleChange} required />
                <input className="border p-3 rounded" name="altPhone" placeholder="Alternate Phone" onChange={handleChange} />

                {/* TERRITORY */}
                <select
                    name="territory"
                    className="border p-3 rounded"
                    value={formData.territory}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Territory</option>
                    {territories.map((t, i) => (
                        <option key={i}>{t}</option>
                    ))}
                </select>

                {/* STATE */}
                <select
                    name="state"
                    className="border p-3 rounded"
                    onChange={handleChange}
                >
                    <option value="">Select State</option>
                    {Object.keys(stateDistrictMap).map((s) => (
                        <option key={s}>{s}</option>
                    ))}
                </select>

                {/* DISTRICT */}
                <select
                    name="district"
                    className="border p-3 rounded"
                    onChange={handleChange}
                    disabled={!formData.state}
                >
                    <option value="">Select District</option>
                    {(stateDistrictMap[formData.state] || []).map((d) => (
                        <option key={d}>{d}</option>
                    ))}
                </select>

                <input className="border p-3 rounded" name="city" placeholder="City" onChange={handleChange} />
                <input className="border p-3 rounded" name="streetAddress" placeholder="Street Address" onChange={handleChange} />
                <input className="border p-3 rounded" name="pin" placeholder="PIN Code" onChange={handleChange} />

                {/* DOCUMENT UPLOADS */}
                <label className="mt-2 font-semibold col-span-2">Aadhaar Upload (Max 2)</label>
                <input type="file" name="adharImages" multiple accept="image/*" onChange={handleFileChange} className="col-span-2" />

                <label className="font-semibold col-span-2">PAN Upload</label>
                <input type="file" name="panImage" accept="image/*" onChange={handleFileChange} className="col-span-2" />

                <label className="font-semibold col-span-2">Company PAN (Optional)</label>
                <input type="file" name="companyPanImage" accept="image/*" onChange={handleFileChange} className="col-span-2" />

                <label className="font-semibold col-span-2">Address Proof (Optional)</label>
                <input type="file" name="addressProof" accept="image/*" onChange={handleFileChange} className="col-span-2" />

                <input className="border p-3 rounded col-span-2" name="gst" placeholder="GST Number" onChange={handleChange} />

                {/* OFFICE BRANCH */}
                <select className="border p-3 rounded col-span-2" name="officeBranch" onChange={handleChange} required>
                    <option value="">Select Office Branch</option>
                    {officeBranches.map((b) => (
                        <option key={b}>{b}</option>
                    ))}
                </select>

                {/* PAYMENT */}
                <input className="border p-3 rounded" name="dealAmount" placeholder="Deal Amount" type="number" onChange={handleChange} />
                <input className="border p-3 rounded" name="tokenReceivedAmount" placeholder="Received Amount" type="number" onChange={handleChange} />

                <input className="border p-3 rounded" disabled value={formData.receivedPercent + "%"} placeholder="Received %" />
                <input className="border p-3 rounded" disabled value={formData.remainPercent + "%"} placeholder="Remain %" />

                <input className="border p-3 rounded col-span-2" disabled value={`Balance Amount: ₹ ${formData.balanceAmount}`} />

                <textarea className="border p-3 rounded col-span-2" name="remark" placeholder="Remark" onChange={handleChange}></textarea>

                {/* SUBMIT */}
                <button className="bg-black text-white py-3 rounded col-span-2 hover:bg-gray-900">
                    Submit Client
                </button>
            </form>
        </div>
    );
}
