import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Icon } from "@iconify/react";
export default function Downloads() {
  const API = import.meta.env.VITE_API_URL;
  const FILE_BASE = import.meta.env.VITE_FILE_BASE;

  const [tree, setTree] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const user = JSON.parse(localStorage.getItem("userData"));

  // ---------------- LOAD TREE ----------------
  const loadTree = async () => {
    const res = await fetch(`${API}/files/tree`);
    const data = await res.json();
    setTree(data);
  };

  useEffect(() => {
    loadTree();
  }, []);

  // Get children of selected folder
  const getChildren = (parentId = null) =>
    tree.filter((node) => String(node.parent) === String(parentId));

  const enterFolder = (folder) => {
    setCurrentFolder(folder._id);
    setBreadcrumb((prev) => [...prev, folder]);
  };

  const goBackTo = (index) => {
    const newPath = breadcrumb.slice(0, index + 1);
    setBreadcrumb(newPath);
    setCurrentFolder(newPath.length ? newPath[newPath.length - 1]._id : null);
  };

  const currentNodes = getChildren(currentFolder);

  // ---------------- SEARCH ----------------
  const performSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    const results = tree.filter((n) => n.name.toLowerCase().includes(term));
    setSearchResults(results);
  };

  useEffect(() => {
    performSearch();
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gray-100 pt-[10vh] p-4 lg:p-10" style={{ marginTop: "10vh" }}>

      {/* HEADER CARD */}
      <div className="bg-white p-6 rounded-2xl mb-6 shadow">
        <h2 className="text-3xl font-bold mb-2">
          Welcome, <span className="text-[#0070b9]">{user.name}</span>
        </h2>
        <p className="text-gray-600">
          Browse and download digital assets, documents, franchise materials,
          layouts, and more.
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search files or folders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-blue-900 rounded-lg"
        />
      </div>

      {/* BREADCRUMB */}
      {!searchTerm && (
        <div className="mb-6 flex flex-wrap items-center gap-2 text-gray-700">
          <span
            onClick={() => {
              setBreadcrumb([]);
              setCurrentFolder(null);
            }}
            className="cursor-pointer hover:underline"
          >
            Home
          </span>

          {breadcrumb.map((b, index) => (
            <span key={index} className="flex items-center gap-2">
              →
              <span
                className="cursor-pointer hover:underline"
                onClick={() => goBackTo(index)}
              >
                {b.name}
              </span>
            </span>
          ))}
        </div>
      )}

      {/* SEARCH RESULTS LIST */}
      {searchTerm && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {searchResults.length === 0 && (
            <p className="text-gray-500 text-sm col-span-full">
              No matching files or folders.
            </p>
          )}

          {searchResults.map((item) => (
            <div
              key={item._id}
              className="bg-white p-4 shadow rounded-xl hover:shadow-xl transition cursor-pointer"
              onClick={() =>
                item.type === "folder" ? enterFolder(item) : null
              }
            >
              <div className="text-4xl mb-2">
                {item.type === "folder" ? "📁" : "📄"}
              </div>

              <h3 className="font-semibold truncate">{item.name}</h3>

              {item.type === "file" && (
                <a
                  href={`${FILE_BASE}/${item.filePath}`}
                  target="_blank"
                  className="text-sm text-[#0070b9] underline"
                >
                  Download
                </a>

              )}
            </div>
          ))}
        </div>
      )}

      {/* NORMAL VIEW */}
      {!searchTerm && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {currentNodes.map((item) => (
            <div
              key={item._id}
              className="bg-white p-6 rounded-2xl hover:shadow-xl transition cursor-pointer min-h-[200px] flex flex-col justify-between"
              onClick={() => item.type === "folder" && enterFolder(item)}
            >
              <div className="flex justify-center">
                {item.type === "folder" ? (
                  <Icon icon="mdi:folder" className="text-yellow-500 text-5xl" />
                ) : (
                  <Icon icon="mdi:file-pdf-box" className="text-red-500 text-5xl" />
                )}
              </div>

              <h3
                className={`text-center font-semibold break-words ${item.type === "folder" ? "text-lg" : "text-sm"
                  }`}
                style={{ wordBreak: "break-word" }}
              >
                {item.name}
              </h3>

              {item.type === "file" && (
                <div className="text-center ">
                  <a
                    href={`${FILE_BASE}/${item.filePath}`}
                    target="_blank"
                    className="text-sm px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
                  >
                    Download
                  </a>
                </div>
              )}
            </div>

          ))}
        </div>
      )}
    </div>
  );
}
