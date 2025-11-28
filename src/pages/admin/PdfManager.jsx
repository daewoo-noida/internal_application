import React, { useEffect, useState } from "react";

export default function PdfManager() {

    const API = import.meta.env.VITE_API_URL;
    const PDF_BASE = import.meta.env.VITE_PDF_BASE;

    const [pdfs, setPdfs] = useState([]);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [file, setFile] = useState(null);

    const loadPDFs = async () => {
        const res = await fetch(`${API}/pdf`);
        const data = await res.json();
        setPdfs(data);
    };

    const uploadPDF = async (e) => {
        e.preventDefault();
        if (!file) return alert("Select a file!");

        const formData = new FormData();
        formData.append("pdf", file);
        formData.append("title", title);
        formData.append("category", category);

        await fetch(`${API}/pdf/upload`, {
            method: "POST",
            body: formData,
        });

        setFile(null);
        setTitle("");
        setCategory("");
        loadPDFs();
    };

    const deletePDF = async (id) => {
        if (!confirm("Delete this file?")) return;

        await fetch(`${API}/pdf/${id}`, { method: "DELETE" });
        loadPDFs();
    };

    useEffect(() => {
        loadPDFs();
    }, []);

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold mb-6">PDF Manager</h1>

            {/* Upload Form */}
            <form onSubmit={uploadPDF} className="mb-10 bg-white p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Upload PDF</h3>

                <input
                    type="text"
                    placeholder="PDF Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="border p-2 rounded w-full mb-3"
                />

                <input
                    type="text"
                    placeholder="Category (optional)"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="border p-2 rounded w-full mb-3"
                />

                <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                    className="mb-4"
                />

                <button className="px-4 py-2 bg-black text-white rounded">Upload</button>
            </form>

            {/* List PDFs */}
            <table className="w-full bg-white rounded-lg shadow">
                <thead>
                    <tr className="border-b">
                        <th className="p-3 text-left">Title</th>
                        <th className="p-3 text-left">Category</th>
                        <th className="p-3">Download</th>
                        <th className="p-3">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {pdfs.map((pdf) => (
                        <tr key={pdf._id} className="border-b">
                            <td className="p-3">{pdf.title}</td>
                            <td className="p-3">{pdf.category}</td>
                            <td className="p-3 text-center">
                                <a
                                    href={`${PDF_BASE}/${pdf.fileName}`}
                                    download
                                    target="_blank"
                                    className="text-blue-600 underline"
                                >
                                    Download
                                </a>
                            </td>
                            <td className="p-3 text-center">
                                <button
                                    onClick={() => deletePDF(pdf._id)}
                                    className="text-red-600 font-bold"
                                >
                                    ✖ Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
