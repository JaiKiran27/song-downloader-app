import { useState } from "react";
import DownloadButton from "./DownloadButton";

function SongResults({ results }) {
  const [activePreviewId, setActivePreviewId] = useState(null);

  if (!results.length) {
    return null;
  }

  const handlePreviewToggle = (videoId) => {
    setActivePreviewId((current) => (current === videoId ? null : videoId));
  };

  const getThumbnailUrl = (item) => {
    if (item.thumbnail) {
      return item.thumbnail;
    }
    return `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`;
  };

  return (
    <div className="results">
      {results.map((item) => (
        <article key={item.id} className="song-card">
          <img
            src={getThumbnailUrl(item)}
            alt={item.title}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.src = `https://i.ytimg.com/vi/${item.id}/mqdefault.jpg`;
            }}
          />
          <div className="song-info">
            <h3>{item.title}</h3>
            <p>{item.uploader || "Unknown uploader"}</p>
          </div>
          <button
            type="button"
            className="preview-btn"
            onClick={() => handlePreviewToggle(item.id)}
          >
            {activePreviewId === item.id ? "Hide Preview" : "Play Preview"}
          </button>
          <DownloadButton songTitle={item.title} videoUrl={item.webpage_url} />
          {activePreviewId === item.id ? (
            <div className="preview-player-wrap">
              <iframe
                className="preview-player"
                src={`https://www.youtube-nocookie.com/embed/${item.id}?autoplay=1&rel=0`}
                title={`Preview player for ${item.title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}

export default SongResults;
