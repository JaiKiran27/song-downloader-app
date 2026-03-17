import DownloadButton from "./DownloadButton";

function SongResults({ results }) {
  if (!results.length) {
    return null;
  }

  return (
    <div className="results">
      {results.map((item) => (
        <article key={item.id} className="song-card">
          {item.thumbnail ? <img src={item.thumbnail} alt={item.title} /> : null}
          <div className="song-info">
            <h3>{item.title}</h3>
            <p>{item.uploader || "Unknown uploader"}</p>
          </div>
          <DownloadButton songTitle={item.title} videoUrl={item.webpage_url} />
        </article>
      ))}
    </div>
  );
}

export default SongResults;
