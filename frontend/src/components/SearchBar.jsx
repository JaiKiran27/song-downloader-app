import { useState } from "react";

function SearchBar({ onSearch, loading }) {
  const [song, setSong] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = song.trim();
    if (!trimmed) {
      return;
    }
    onSearch(trimmed);
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search a song..."
        value={song}
        onChange={(event) => setSong(event.target.value)}
        disabled={loading}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}

export default SearchBar;
