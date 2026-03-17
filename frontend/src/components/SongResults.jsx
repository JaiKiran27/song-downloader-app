import { useState } from "react";
import { Play, X } from "lucide-react";
import DownloadButton from "./DownloadButton";

function SongResults({ results, loading }) {
  const [activePreviewId, setActivePreviewId] = useState(null);

  if (loading) {
    return (
      <div className="mt-6 grid grid-cols-1 gap-4">
        {[1, 2, 3].map((index) => (
          <article
            key={index}
            className="animate-pulse rounded-2xl border border-white/5 bg-ui-card/60 p-4 backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <div className="h-20 w-28 rounded-lg bg-ui-deep" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded bg-ui-deep" />
                <div className="h-3 w-1/2 rounded bg-ui-deep" />
              </div>
            </div>
          </article>
        ))}
      </div>
    );
  }

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
    <div className="mt-6 grid grid-cols-1 gap-4">
      {results.map((item) => (
        <article
          key={item.id}
          className="group rounded-2xl border border-white/5 bg-ui-card/60 p-3 shadow-soft backdrop-blur-md transition duration-300 hover:-translate-y-[3px] hover:shadow-card sm:p-4"
        >
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => handlePreviewToggle(item.id)}
              className="relative overflow-hidden rounded-lg"
              aria-label={`Toggle preview for ${item.title}`}
            >
              <img
                src={getThumbnailUrl(item)}
                alt={item.title}
                loading="lazy"
                className="h-20 w-28 rounded-lg object-cover transition duration-300 group-hover:scale-105"
                onError={(event) => {
                  event.currentTarget.src = `https://i.ytimg.com/vi/${item.id}/mqdefault.jpg`;
                }}
              />
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition group-hover:opacity-100">
                <Play className="h-5 w-5 text-white" />
              </span>
            </button>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-bold text-ui-text">{item.title}</h3>
            <p className="mt-1 truncate text-sm text-ui-muted">
              {item.uploader || "Unknown uploader"}
            </p>
          </div>
          <button
            type="button"
            className="rounded-xl border border-ui-secondary bg-transparent px-3 py-2 text-sm font-semibold text-ui-secondary transition hover:bg-ui-secondary/10"
            onClick={() => handlePreviewToggle(item.id)}
          >
            <span className="inline-flex items-center gap-1">
              {activePreviewId === item.id ? <X className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {activePreviewId === item.id ? "Hide Preview" : "Play Preview"}
            </span>
          </button>
          <DownloadButton songTitle={item.title} videoUrl={item.webpage_url} />
          </div>
          {activePreviewId === item.id ? (
            <div className="mt-3 w-full overflow-hidden rounded-xl border border-white/10 bg-ui-deep/50 opacity-100 transition-opacity duration-200">
              <iframe
                className="block aspect-video w-full border-0"
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
