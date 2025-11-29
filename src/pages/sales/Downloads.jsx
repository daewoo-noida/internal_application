import { useState } from "react";
import { downloadsData } from "../../utils/downloadsData";

export default function Downloads() {

  const PDF_BASE = import.meta.env.VITE_PDF_BASE;

  const [path, setPath] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const user = JSON.parse(localStorage.getItem("userData"));


  // -------------------------------------------------------------------
  // Get current folder based on path
  // -------------------------------------------------------------------
  const getCurrentFolder = () => {
    let current = { children: downloadsData };
    for (const id of path) {
      current = current.children.find((item) => item.id === id);
    }
    return current;
  };

  const currentFolder = getCurrentFolder();

  // -------------------------------------------------------------------
  // Folder navigation
  // -------------------------------------------------------------------
  const openFolder = (id) => {
    setPath([...path, id]);
  };

  const goBack = () => {
    setPath(path.slice(0, -1));
  };

  // -------------------------------------------------------------------
  // Recursive Search Function
  // -------------------------------------------------------------------
  const searchTree = (nodes, currentPath = []) => {
    let results = [];

    nodes.forEach((node) => {
      const newPath = [...currentPath, node.id || node.title];

      if (
        node.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (node.desc && node.desc.toLowerCase().includes(searchTerm.toLowerCase()))
      ) {
        results.push({ ...node, path: newPath });
      }

      if (node.children) {
        results = results.concat(searchTree(node.children, newPath));
      }
    });

    return results;
  };

  // -------------------------------------------------------------------
  // Handle Search Input
  // -------------------------------------------------------------------
  const handleSearch = (value) => {
    setSearchTerm(value);

    if (value.trim() === "") {
      setSearchResults([]);
      return;
    }

    const results = searchTree(downloadsData);
    setSearchResults(results);
  };

  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);


  return (
    <div className="min-h-screen bg-gray-100 pt-[10vh] flex flex-col lg:flex-row">

      {/* ===== MOBILE FOLDERS (Dropdown Style) ===== */}
      <div className="lg:hidden px-4 mt-4">
        <div
          className="w-full bg-white border rounded-lg px-4 py-3 flex justify-between items-center shadow-sm"
          onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
        >
          <span className="text-gray-700 font-medium">
            {path.length === 0 ? "Select Folder" : path[0].replace("-", " ")}
          </span>
          <span className="text-gray-500">▼</span>
        </div>

        {mobileDropdownOpen && (
          <div className="bg-white border rounded-lg mt-2 shadow-md">
            {downloadsData.map((folder) => (
              <button
                key={folder.id}
                onClick={() => {
                  setPath([folder.id]);
                  setMobileDropdownOpen(false);
                  setSearchTerm("");
                  setSearchResults([]);
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 text-gray-700"
              >
                {folder.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside className="hidden lg:block w-60 bg-white p-6 m-3 rounded-3xl">
        <h2 className="text-xl font-bold mb-4">Folders</h2>

        {downloadsData.map((folder) => (
          <button
            key={folder.id}
            onClick={() => {
              setPath([folder.id]);
              setSearchTerm("");
              setSearchResults([]);
            }}
            className={`block w-full text-left px-4 py-3 rounded-lg mb-2 font-medium 
          ${path[0] === folder.id ? "bg-black text-white" : "bg-gray-100"}`}
          >
            {folder.title}
          </button>
        ))}
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6 w-full">

        {/* HEADER CARD */}
        <div className="mb-6 bg-white p-5 sm:p-7 rounded-2xl border shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Welcome, <span className="text-[#0070b9]">{user.name}</span>
          </h2>

          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
            Access all your Daewoo digital assets, documents, and essential resources below.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="mb-5">
          <input
            type="text"
            placeholder="Search files or folders..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-3 border border-blue-900 rounded-lg text-sm sm:text-base"
          />
        </div>

        {/* ================= BREADCRUMB ================= */}
        {!searchTerm && path.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-2 text-gray-600 text-sm sm:text-base">
            <button onClick={() => setPath([])} className="hover:underline">
              Home
            </button>

            {path.map((p, index) => (
              <span key={index} className="flex items-center gap-1">
                → <span className="capitalize">{p.replace("-", " ")}</span>
              </span>
            ))}
          </div>
        )}

        {/* BACK BUTTON */}
        {!searchTerm && path.length > 0 && (
          <button
            onClick={goBack}
            className="mb-6 px-4 py-2 bg-gray-200 rounded-lg text-sm sm:text-base"
          >
            ← Back
          </button>
        )}

        {/* ================= SEARCH RESULTS ================= */}
        {searchTerm && (
          <div className="mb-10">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">Search Results</h3>

            {searchResults.length === 0 && (
              <p className="text-gray-500 text-sm sm:text-base">No results found.</p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {searchResults.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-4 sm:p-6 rounded-xl hover:shadow-xl transition cursor-pointer"
                  onClick={() => {
                    setPath(item.path.slice(0, -1));
                    setSearchTerm("");
                    setSearchResults([]);
                  }}
                >
                  <div className="text-3xl sm:text-4xl mb-2">{item.icon || "📁"}</div>
                  <h3 className="text-base sm:text-lg font-semibold mb-1">
                    {item.title}
                  </h3>

                  {!item.children && (
                    <a href={`${PDF_BASE}/${item.file}`} target="_blank" className="text-sm text-[#0070b9] underline">
                      Download
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= NORMAL FOLDER VIEW ================= */}
        {!searchTerm && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {currentFolder.children?.map((item, index) => (
              <div
                key={index}
                className="bg-white p-4 sm:p-6 rounded-xl hover:shadow-xl transition cursor-pointer"
                onClick={() => item.children && openFolder(item.id)}
              >
                <div className="text-3xl sm:text-4xl mb-2">{item.icon || "📁"}</div>
                <h3 className="text-base sm:text-lg font-semibold mb-1">
                  {item.title}
                </h3>

                {!item.children && (
                  <a href={`${PDF_BASE}/${item.file}`} target="_blank" className="text-sm text-[#0070b9] underline">
                    Download
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );

}
