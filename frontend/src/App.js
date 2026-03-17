import { useState } from "react";
import SearchBar from "./components/SearchBar";
import SongResults from "./components/SongResults";
import "./App.css";

function App() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiBase = process.env.REACT_APP_API_BASE_URL || "";

  const handleSearch = async (songName) => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({ song: songName });
      const response = await fetch(`${apiBase}/search?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Search request failed");
      }

      const data = await response.json();
      setResults(data.results || []);
    } catch (err) {
      setError(err.message || "Unable to search right now.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app">
      <section className="panel">
        <h1>Song Downloader</h1>
        <p>Search a song and download the MP3 from the best YouTube match.</p>
        <SearchBar onSearch={handleSearch} loading={loading} />
        {error ? <p className="error">{error}</p> : null}
        <SongResults results={results} />
      </section>
    </main>
  );
}

export default App;
