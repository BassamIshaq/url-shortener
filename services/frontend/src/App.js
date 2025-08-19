import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3001";

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const response = await axios.get(`${API_BASE}/urls`);
      setUrls(response.data);
    } catch (error) {
      console.error("Error fetching URLs:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/shorten`, {
        originalUrl,
      });

      setShortUrl(response.data.shortUrl);
      setOriginalUrl("");
      fetchUrls(); // Refresh the list
    } catch (error) {
      alert("Error creating short URL");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    alert("Copied to clipboard!");
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">URL Shortener</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <input
            type="url"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            placeholder="Enter URL to shorten"
            className="flex-1 p-3 border rounded-lg"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Shortening..." : "Shorten"}
          </button>
        </div>
      </form>

      {shortUrl && (
        <div className="bg-green-100 p-4 rounded-lg mb-8">
          <p className="font-semibold">Short URL created:</p>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={shortUrl}
              readOnly
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={() => copyToClipboard(shortUrl)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Copy
            </button>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">Recent URLs</h2>
        <div className="space-y-4">
          {urls.map((url) => (
            <div key={url._id} className="bg-gray-100 p-4 rounded-lg">
              <p className="font-semibold truncate">{url.originalUrl}</p>
              <p className="text-blue-500">/{url.shortCode}</p>
              <p className="text-sm text-gray-600">{url.clicks} clicks</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
