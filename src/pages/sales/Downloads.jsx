import { useState } from "react";
import { downloadsData } from "../../franchisePdf/downloadsData";

export default function Downloads() {

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

  return (
    <div className="flex min-h-screen bg-gray-100" style={{ padding: "9vh 0vh 0vh" }}>

      {/* ========================= SIDEBAR ========================= */}
      <aside className="w-72 bg-white p-6 border-r">
        <h2 className="text-xl font-bold mb-4">Folders</h2>

        {downloadsData.map((folder) => (
          <button
            key={folder.id}
            onClick={() => {
              setPath([folder.id]);
              setSearchTerm("");
              setSearchResults([]);
            }}
            className={`block w-full text-left px-4 py-3 rounded-lg mb-2 font-medium ${path[0] === folder.id ? "bg-black text-white" : "bg-gray-100"
              }`}
          >
            {folder.title}
          </button>
        ))}
      </aside>

      {/* ========================= MAIN CONTENT ========================= */}
      <main className="flex-1 p-10">

        <div className="mb-10 bg-white p-7 rounded-2xl border"
          style={{ borderColor: "#0070b9 !importent" }}>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Welcome, <span style={{ color: "#0070b9" }}>{user.name}</span>
          </h2>

          <p className="text-gray-600 leading-relaxed  max-w-3xl">
            Access all your Daewoo digital assets, documents, and essential resources
            below. Explore master files, state-wise PDFs, DDP toolkits, catalogues,
            PR sheets, legal documentation, and more — all available for instant and
            secure download.
          </p>
        </div>


        {/* SEARCH BAR */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search files or folders..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-3 border border-blue-900 rounded-lg "
          />
        </div>

        {/* ========================= BREADCRUMB ========================= */}
        {!searchTerm && path.length > 0 && (
          <div className="mb-6 flex items-center gap-2 text-gray-600">
            <button onClick={() => setPath([])} className="hover:underline">
              Home
            </button>

            {path.map((p, index) => (
              <span key={index} className="flex items-center gap-2">
                → <span className="capitalize">{p.replace("-", " ")}</span>
              </span>
            ))}
          </div>
        )}

        {/* BACK BUTTON */}
        {!searchTerm && path.length > 0 && (
          <button
            onClick={goBack}
            className="mb-6 px-4 py-2 bg-gray-200 "
          >
            ← Back
          </button>
        )}

        {/* ========================= SEARCH RESULTS ========================= */}
        {searchTerm && (
          <div className="mb-10">
            <h3 className="text-xl font-semibold mb-4">Search Results</h3>

            {searchResults.length === 0 && (
              <p className="text-gray-500">No results found.</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {searchResults.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl hover:shadow-xl transition cursor-pointer"
                  onClick={() => {
                    setPath(item.path.slice(0, -1)); // Open correct folder
                    setSearchTerm("");
                    setSearchResults([]);
                  }}
                >
                  <div className="text-4xl mb-3">{item.icon || "📁"}</div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>

                  {/* {item.desc && (
                    <p className="text-gray-600 mb-4">{item.desc}</p>
                  )} */}

                  {!item.children && (
                    <a
                      href={item.file}
                      download
                      className="px-4 py-2 bg-black text-white rounded-lg inline-block"
                    >
                      Download
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================= NORMAL FOLDER VIEW ========================= */}
        {!searchTerm && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentFolder.children?.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl hover:shadow-xl transition cursor-pointer"
                onClick={() => item.children && openFolder(item.id)}
              >
                <div className="text-4xl mb-3">{item.icon || "📁"}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>

                {/* {item.desc && (
                  <p className="text-gray-600 mb-4">{item.desc}</p>
                )} */}

                {!item.children && (
                  <a
                    href={item.file}
                    download
                    className="px-4 py-2 bg-black text-white rounded-lg inline-block"
                  >
                    Download PDF
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
