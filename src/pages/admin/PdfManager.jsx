import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Icon } from "@iconify/react";

export default function FileManager() {
    const API = import.meta.env.VITE_API_URL;
    const FILE_BASE = import.meta.env.VITE_FILE_BASE;

    const [tree, setTree] = useState([]);
    const [currentFolder, setCurrentFolder] = useState(null);
    const [breadcrumb, setBreadcrumb] = useState([]);

    const [selectedFile, setSelectedFile] = useState(null);

    // ---------------- FETCH TREE ----------------
    const loadTree = async () => {
        const res = await fetch(`${API}/files/tree`);
        const data = await res.json();
        setTree(data);
    };

    useEffect(() => {
        loadTree();
    }, []);

    const getChildren = (parentId = null) =>
        tree.filter((node) => String(node.parent) === String(parentId));

    const currentNodes = getChildren(currentFolder);

    // ---------------- CREATE FOLDER POPUP ----------------
    const createFolder = () => {
        Swal.fire({
            title: "Create New Folder",
            input: "text",
            inputPlaceholder: "Enter folder name",
            showCancelButton: true,
            confirmButtonText: "Create",
            backdrop: true,
        }).then(async (result) => {
            if (!result.value) return;

            await fetch(`${API}/files/folder`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: result.value,
                    parent: currentFolder,
                }),
            });

            loadTree();
            Swal.fire("Success", "Folder created", "success");
        });
    };

    // ---------------- FILE SELECT POPUP ----------------
    const handleFileChange = (e) => {
        const f = e.target.files[0];
        setSelectedFile(f);

        Swal.fire({
            title: "File Selected",
            html: `
        <b>${f.name}</b><br/>
        Click <span style='color:green'>Submit Upload</span> to upload.
      `,
            icon: "info",
        });
    };

    // ---------------- UPLOAD FILE ----------------
    const uploadFile = async () => {
        if (!selectedFile) {
            Swal.fire("No File", "Please select a file first", "warning");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("parent", currentFolder);

        await fetch(`${API}/files/upload`, {
            method: "POST",
            body: formData,
        });

        setSelectedFile(null);
        loadTree();

        Swal.fire("Uploaded!", "Your file has been uploaded", "success");
    };

    // ---------------- ENTER FOLDER ----------------
    const enterFolder = (folder) => {
        setCurrentFolder(folder._id);
        setBreadcrumb((prev) => [...prev, folder]);
    };

    // ---------------- GO BACK ----------------
    const goBackTo = (index) => {
        const newCrumb = breadcrumb.slice(0, index + 1);
        setBreadcrumb(newCrumb);
        setCurrentFolder(newCrumb.length ? newCrumb[newCrumb.length - 1]._id : null);
    };

    // ---------------- DELETE NODE ----------------
    const deleteNode = async (id) => {
        Swal.fire({
            title: "Delete?",
            text: "This will remove everything inside also.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Delete",
        }).then(async (res) => {
            if (res.isConfirmed) {
                await fetch(`${API}/files/${id}`, { method: "DELETE" });
                loadTree();
                Swal.fire("Deleted!", "", "success");
            }
        });
    };

    // ---------------- RENAME NODE ----------------
    const renameNode = (node) => {
        Swal.fire({
            title: "Rename",
            input: "text",
            inputValue: node.name,
            showCancelButton: true,
            confirmButtonText: "Update",
        }).then(async (res) => {
            if (!res.value) return;

            await fetch(`${API}/files/rename/${node._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: res.value }),
            });

            loadTree();
            Swal.fire("Renamed", "", "success");
        });
    };

    return (
        <div className="p-10">
            <h1 className="text-4xl font-bold mb-8">Admin File Manager</h1>

            {/* ACTION BUTTONS */}
            <div className="flex gap-4 mb-10">

                {/* File Upload */}
                <label className="px-6 py-3 bg-blue-600 text-white rounded cursor-pointer">
                    Upload File
                    <input type="file" className="hidden" onChange={handleFileChange} />
                </label>

                <button
                    className="px-6 py-3 bg-green-600 text-white rounded"
                    onClick={uploadFile}
                >
                    Submit Upload
                </button>

                <button
                    className="px-6 py-3 bg-black text-white rounded"
                    onClick={createFolder}
                >
                    + Folder
                </button>
            </div>

            {/* BREADCRUMB */}
            <div className="mb-6 flex gap-2 text-lg">
                <span
                    className="cursor-pointer"
                    onClick={() => {
                        setBreadcrumb([]);
                        setCurrentFolder(null);
                    }}
                >
                    Home
                </span>

                {breadcrumb.map((b, index) => (
                    <span key={index} onClick={() => goBackTo(index)} className="cursor-pointer">
                        → {b.name}
                    </span>
                ))}
            </div>

            {/* GRID VIEW */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                {currentNodes.map((item) => (
                    <div
                        key={item._id}
                        className="relative group bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer min-h-[200px] flex flex-col justify-between"
                    >
                        {/* Always Visible Icons for Admin */}
                        <div className="absolute top-3 right-3 flex gap-3 z-50">
                            <Icon
                                icon="mdi:pencil"
                                className="text-yellow-600 text-2xl cursor-pointer hover:scale-110"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    renameNode(item);
                                }}
                            />
                            <Icon
                                icon="mdi:trash-can"
                                className="text-red-600 text-2xl cursor-pointer hover:scale-110"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNode(item._id);
                                }}
                            />
                        </div>

                        {/* Icon */}
                        <div
                            className="flex justify-center mt-4"
                            onClick={() => item.type === "folder" && enterFolder(item)}
                        >
                            {item.type === "folder" ? (
                                <Icon icon="mdi:folder" className="text-yellow-500 text-6xl" />
                            ) : (
                                <Icon icon="mdi:file-pdf-box" className="text-red-500 text-6xl" />
                            )}
                        </div>

                        {/* Full Name (NO Truncate, Small for files) */}
                        <h3
                            className={`text-center text-gray-800 font-semibold my-3 break-words ${item.type === "folder" ? "text-lg" : "text-sm"
                                }`}
                            style={{ wordBreak: "break-word" }}
                        >
                            {item.name}
                        </h3>

                        {/* Download button for files */}
                        {item.type === "file" && (
                            <div className="text-center">
                                <a
                                    href={`${FILE_BASE}/${item.filePath}`}
                                    target="_blank"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm shadow hover:bg-blue-700"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    Download
                                </a>
                            </div>
                        )}
                    </div>


                ))}
            </div>
        </div>
    );
}
