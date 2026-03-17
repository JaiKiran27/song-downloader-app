import { useState } from "react";
import { Loader2 } from "lucide-react";
import SearchBar from "./components/SearchBar";
import SongResults from "./components/SongResults";

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
    <main className="relative min-h-screen overflow-hidden bg-ui-bg/90 px-4 py-10 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 -top-16 h-72 w-72 rounded-full bg-ui-secondary/20 blur-3xl" />
        <div className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-ui-primary/20 blur-3xl" />
      </div>

      <section className="relative mx-auto w-full max-w-[1100px] rounded-3xl border border-white/10 bg-ui-card/65 p-6 shadow-soft backdrop-blur-xl sm:p-8">
        <div className="mb-8 space-y-3">
          <p className="inline-block rounded-full border border-ui-secondary/40 bg-ui-secondary/10 px-3 py-1 text-xs font-semibold tracking-widest text-ui-secondary">
            AI MUSIC TOOL
          </p>
          <h1 className="text-3xl font-black leading-tight text-ui-text [text-shadow:0_0_10px_rgba(56,189,248,0.3)] sm:text-4xl">
            Song Downloader
          </h1>
          <p className="max-w-2xl text-sm text-ui-muted sm:text-base">
            Find a track, preview it instantly, choose quality, and download the exact MP3 you
            want.
          </p>
        </div>

        <SearchBar onSearch={handleSearch} loading={loading} />

        {loading ? (
          <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-ui-secondary/30 bg-ui-deep/80 px-3 py-2 text-sm text-ui-text">
            <Loader2 className="h-4 w-4 animate-spin text-ui-secondary" />
            Searching tracks...
          </div>
        ) : null}

        {error ? (
          <p className="mt-3 rounded-xl border border-rose-300/25 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
            {error}
          </p>
        ) : null}

        <SongResults results={results} loading={loading} />
      </section>
    </main>
  );
}

export default App;
