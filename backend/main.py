from pathlib import Path

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

if __package__:
    from .downloader import download_song_as_mp3, search_youtube
else:
    from downloader import download_song_as_mp3, search_youtube

app = FastAPI(title="Song Downloader API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/search")
async def search_song(song: str = Query(..., min_length=2)) -> dict[str, object]:
    try:
        results = search_youtube(song)
        return {"query": song, "count": len(results), "results": results}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Search failed: {exc}") from exc


@app.get("/download")
async def download_song(
    song: str = Query(..., min_length=2),
    video_url: str | None = Query(default=None),
    quality: str = Query(default="192", pattern="^(128|192|320)$"),
) -> FileResponse:
    try:
        file_path: Path = download_song_as_mp3(
            song_name=song,
            video_url=video_url,
            quality=quality,
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Download failed: {exc}") from exc

    return FileResponse(
        path=file_path,
        media_type="audio/mpeg",
        filename=file_path.name,
    )
