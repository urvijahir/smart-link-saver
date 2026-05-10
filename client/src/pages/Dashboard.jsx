import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaLink, FaTrash, FaEdit, FaSignOutAlt } from "react-icons/fa";

const Dashboard = () => {
  const [links, setLinks] = useState([]);

  const [loading, setLoading] = useState(false);

  // Dark mode
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark",
  );

  // Form inputs
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");

  //  Search input
  const [search, setSearch] = useState("");

  //  Modal + edit states
  const [showModal, setShowModal] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editNote, setEditNote] = useState("");

  //  Save dark mode
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Toggle dark/light mode
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Fetch all links from backend
  const fetchLinks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://smart-link-saver.onrender.com/api/links",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setLinks(res.data);
    } catch {
      toast.error("Failed to load links");
    } finally {
      setLoading(false);
    }
  };

  // Run once when page loads
  useEffect(() => {
    fetchLinks();
  }, []);

  // Add new link
  const handleAddLink = async (e) => {
    e.preventDefault();

    // Validate empty fields
    if (!title.trim() || !url.trim()) {
      toast.error("Title and URL are required!");
      return;
    }

    // Validate URL format
    const urlPattern = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;
    if (!urlPattern.test(url)) {
      toast.error("Enter valid URL (must start with http/https).");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "https://smart-link-saver.onrender.com/api/links",
        { title, url, note },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Link added ✅");

      setTitle("");
      setUrl("");
      setNote("");

      fetchLinks();
    } catch {
      toast.error("Add failed ❌");
    }
  };

  // Delete link
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this link?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `https://smart-link-saver.onrender.com/api/links/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success("Deleted");
      fetchLinks();
    } catch {
      toast.error("Delete failed");
    }
  };

  // Open edit modal
  const openModal = (link) => {
    setCurrentId(link._id);
    setEditTitle(link.title);
    setEditNote(link.note);
    setShowModal(true);
  };

  // Update link
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `https://smart-link-saver.onrender.com/api/links/${currentId}`,
        { title: editTitle, note: editNote },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Updated");
      setShowModal(false);
      fetchLinks();
    } catch {
      toast.error("Update failed");
    }
  };

  // Logout user
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // Filter links based on search
  const filteredLinks = links.filter((link) =>
    `${link.title} ${link.note} ${link.url}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
        {/* Main Card */}
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex gap-2">
              <FaLink /> My Links
            </h2>

            <div className="flex gap-2">
              <button
                onClick={toggleDarkMode}
                className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded-lg"
              >
                {darkMode ? "☀️" : "🌙"}
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>

          {/* Search */}
          <input
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800 dark:text-white"
            placeholder="🔍 Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Add Form */}
          <form onSubmit={handleAddLink} className="space-y-3 mb-5">
            <input
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800 dark:text-white"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800 dark:text-white"
              placeholder="URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <input
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800 dark:text-white"
              placeholder="Note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg">
              + Add Link
            </button>
          </form>

          {loading && <p className="text-center">Loading...</p>}

          {/* Links */}
          {filteredLinks.map((link) => (
            <div
              key={link._id}
              className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl mb-3 shadow-md hover:shadow-xl transition"
            >
              <h4 className="font-semibold text-lg text-gray-800 dark:text-white">
                {link.title}
              </h4>

              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 text-sm underline break-all"
              >
                {link.url}
              </a>

              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {link.note}
              </p>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => openModal(link)}
                  className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg"
                >
                  <FaEdit /> Edit
                </button>

                <button
                  onClick={() => handleDelete(link._id)}
                  className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}

          {/* Edit Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-80 shadow-xl">
                <h3 className="text-lg font-bold mb-3 dark:text-white">
                  Edit Link
                </h3>

                <input
                  className="w-full p-3 mb-2 border rounded-lg dark:bg-gray-800 dark:text-white"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />

                <input
                  className="w-full p-3 mb-2 border rounded-lg dark:bg-gray-800 dark:text-white"
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                />

                <div className="flex justify-between mt-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-400 text-white px-3 py-1 rounded"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleUpdate}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
