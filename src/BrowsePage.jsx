import { useState } from "react";
import { Link } from "react-router-dom";

export default function BrowsePage({ posts, fetchPosts }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFlag, setFilterFlag] = useState("All");
  const [sortOption, setSortOption] = useState("newest");

  const filteredPosts = posts.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterFlag === "All" || p.flag === filterFlag)
  );

  const sortedPosts = [...filteredPosts].sort((a, b) => {
  if (sortOption === "newest") return new Date(b.created_at) - new Date(a.created_at);
  if (sortOption === "oldest") return new Date(a.created_at) - new Date(b.created_at);
  if (sortOption === "upvotes") return b.upvotes - a.upvotes;
});

  return (
    <div className="browse-page">
      <h1>📜 Quest Log</h1>

      {/* 🔎 Toolbar (Search + Filter + Sort) */}
    <div className="toolbar parchment-box">
    
    {/* Search */}
    <input
        type="text"
        className="toolbar-input"
        placeholder="🔎 Search quests..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
    />

    {/* Filter by Flag */}
    <select
        value={filterFlag}
        onChange={(e) => setFilterFlag(e.target.value)}
        className="toolbar-select"
    >
        <option value="All">🏷️ All Flags</option>
        <option value="Quest">🧭 Quest</option>
        <option value="Treasure Hunt">💰 Treasure Hunt</option>
        <option value="Heist">🗡 Heist</option>
    </select>

    {/* Sorting */}
    <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        className="toolbar-select"
    >
        <option value="newest">📅 Newest</option>
        <option value="oldest">📜 Oldest</option>
        <option value="upvotes">⭐ Most Upvoted</option>
    </select>

    </div>

      <div className="post-container">
        {sortedPosts.map((p) => (
          <div key={p.id} className="post-scroll">

            <h2>📜 {p.title} {p.flag && <span>({p.flag})</span>}</h2>

            <Link to={`/post/${p.id}`}>
              <button className="view-btn">🔍 View Quest</button>
            </Link><br />

            {p.image_url && (
              <img src={p.image_url} className="post-image-small" alt="quest" />
            )} 

            <p className="timestamp">📅 Created: {new Date(p.created_at).toLocaleString()}</p>

            <p>⭐ Inspiration: <b>{p.upvotes}</b></p>

          </div>
        ))}
      </div>
    </div>
  );
}
