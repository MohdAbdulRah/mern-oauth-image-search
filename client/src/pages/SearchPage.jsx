import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export default function SearchPage() {
  const [term, setTerm] = useState('');
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [topSearches, setTopSearches] = useState([]);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTop();
    fetchHistory();
  }, []);

  async function fetchTop() {
    try {
      const res = await axios.get(`${API}/api/top-searches`, { withCredentials: true });
      setTopSearches(res.data);
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchHistory() {
    try {
      const res = await axios.get(`${API}/api/history`, { withCredentials: true });
      setHistory(res.data);
    } catch (e) {
      /* user may not be logged in */
    }
  }

  async function handleSearch(e) {
    e?.preventDefault();
    if (!term) return;
    try {
      const res = await axios.post(`${API}/api/search`, { term }, { withCredentials: true });
      setResults(res.data.results);
      setMessage(`You searched for "${res.data.term}" — ${res.data.total} results.`);
      setSelected(new Set());
      fetchTop();
      fetchHistory();
    } catch (err) {
      if (err.response && err.response.status === 401) window.location.href = '/login';
      else console.error(err);
    }
  }

  function toggleSelect(id) {
    const s = new Set(selected);
    if (s.has(id)) s.delete(id);
    else s.add(id);
    setSelected(s);
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Left side - Search Area */}
      <div className="flex-1">
        {/* Top Searches */}
        <div className="mb-4 p-4 bg-white rounded-xl shadow-sm border">
          <strong className="block mb-2 text-gray-700 text-lg font-semibold">
            Top Searches:
          </strong>
          <div className="flex flex-wrap gap-2">
            {topSearches.map((t) => (
              <button
                key={t.term}
                onClick={() => {
                  setTerm(t.term);
                  handleSearch();
                }}
                className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-full text-sm font-medium transition"
              >
                {t.term} ({t.count})
              </button>
            ))}
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex items-center gap-3 mb-4">
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search images..."
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
          <a
            href={`${API}/auth/logout`}
            className="text-red-500 hover:underline ml-2"
          >
            Logout
          </a>
        </form>

        {/* Message */}
        {message && (
          <div className="mb-3 text-gray-700 text-sm font-medium bg-green-50 border border-green-200 p-2 rounded">
            {message}
          </div>
        )}

        {/* Selected Count */}
        <div className="text-sm text-gray-600 mb-3">
          Selected: <span className="font-semibold">{selected.size}</span> images
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map((img) => (
            <div
              key={img.id}
              className="relative rounded-lg overflow-hidden shadow-sm group"
            >
              <img
                src={img.thumb}
                alt={img.description || 'img'}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <label className="absolute top-2 right-2 bg-white/80 p-1 rounded">
                <input
                  type="checkbox"
                  checked={selected.has(img.id)}
                  onChange={() => toggleSelect(img.id)}
                  className="accent-blue-600"
                />
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Right side - Sidebar */}
      <div className="w-full md:w-80 bg-white p-5 rounded-xl shadow-sm border">
        {/* Search History */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-2 text-gray-800">
            Your Search History
          </h4>
          <ul className="text-sm text-gray-600 space-y-1 max-h-60 overflow-y-auto">
            {history.length === 0 && <li>No history or not logged in</li>}
            {history.map((h, idx) => (
              <li key={idx} className="border-b pb-1">
                {h.term}{' '}
                <span className="text-xs text-gray-400">
                  — {new Date(h.timestamp).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Selected Images */}
        <div>
          <h4 className="text-lg font-semibold mb-2 text-gray-800">
            Selected Images ({selected.size})
          </h4>
          <button
            onClick={() =>
              alert('You can now perform actions (download, save, create collection)')
            }
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition font-medium"
          >
            Do Action
          </button>
        </div>
      </div>
    </div>
  );
}
