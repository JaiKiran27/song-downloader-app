import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

function DownloadButton({ songTitle, videoUrl }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [quality, setQuality] = useState("192");

  const handleDownload = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        song: songTitle,
        video_url: videoUrl,
        quality,
      });
      const response = await fetch(`/download?${params.toString()}`);
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Download failed");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${songTitle}.mp3`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-w-[230px]">
      <div className="flex flex-wrap items-center gap-2">
        <select
          className="min-w-[128px] rounded-xl border border-ui-secondary/40 bg-ui-deep px-3 py-2 text-sm font-semibold text-ui-text outline-none transition focus:border-ui-secondary focus:ring-2 focus:ring-ui-secondary/20"
          value={quality}
          onChange={(event) => setQuality(event.target.value)}
          disabled={loading}
          aria-label="Select MP3 quality"
        >
          <option value="128">128 kbps</option>
          <option value="192">192 kbps</option>
          <option value="320">320 kbps</option>
        </select>
        <button
          className="inline-flex items-center gap-2 rounded-xl bg-ui-primary px-4 py-2 text-sm font-bold text-ui-bg transition hover:scale-[1.01] hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-70"
          onClick={handleDownload}
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {loading ? "Downloading..." : "Download MP3"}
        </button>
      </div>

      {error ? <p className="mt-2 text-xs text-rose-300">{error}</p> : null}
    </div>
  );
}

export default DownloadButton;
