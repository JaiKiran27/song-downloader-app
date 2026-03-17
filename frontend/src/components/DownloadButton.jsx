import { useState } from "react";

function DownloadButton({ songTitle, videoUrl }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDownload = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ song: songTitle, video_url: videoUrl });
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
    <div>
      <button className="download-btn" onClick={handleDownload} disabled={loading}>
        {loading ? "Downloading…" : "Download MP3"}
      </button>
      {error && <p style={{ color: "red", fontSize: "0.8em" }}>{error}</p>}
    </div>
  );
}

export default DownloadButton;
