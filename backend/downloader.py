import shutil
from pathlib import Path
from typing import Any

from yt_dlp import YoutubeDL

# Locate ffmpeg: prefer PATH, fall back to known WinGet install location
_FFMPEG_PATH = shutil.which("ffmpeg")
if _FFMPEG_PATH:
    _FFMPEG_LOCATION = str(Path(_FFMPEG_PATH).parent)
else:
    _FFMPEG_LOCATION = r"C:\Users\ASUS\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.0.1-full_build\bin"

if __package__:
    from .utils import ensure_directory, slugify_song_name
else:
    from utils import ensure_directory, slugify_song_name

DOWNLOADS_DIR = ensure_directory(Path(__file__).parent / "downloads")


def search_youtube(song_name: str) -> list[dict[str, Any]]:
    """Return up to 5 YouTube search results for a song query."""
    ydl_opts: dict[str, Any] = {
        "quiet": True,
        "skip_download": True,
        "extract_flat": "in_playlist",
        "ffmpeg_location": _FFMPEG_LOCATION,
    }

    with YoutubeDL(ydl_opts) as ydl:
        result = ydl.extract_info(f"ytsearch5:{song_name}", download=False)

    entries = result.get("entries", []) if result else []
    parsed_results: list[dict[str, Any]] = []
    for entry in entries:
        if not entry:
            continue
        video_id = entry.get("id")
        if not video_id:
            continue
        parsed_results.append(
            {
                "id": video_id,
                "title": entry.get("title", "Unknown title"),
                "duration": entry.get("duration"),
                "uploader": entry.get("uploader"),
                "thumbnail": entry.get("thumbnail"),
                "webpage_url": f"https://www.youtube.com/watch?v={video_id}",
            }
        )
    return parsed_results


def download_song_as_mp3(song_name: str, video_url: str | None = None) -> Path:
    """Download a song from YouTube and convert it to MP3."""
    base_name = slugify_song_name(song_name)
    output_template = str(DOWNLOADS_DIR / f"{base_name}.%(ext)s")

    query = video_url or f"ytsearch1:{song_name}"

    ydl_opts: dict[str, Any] = {
        "format": "bestaudio/best",
        "outtmpl": output_template,
        "quiet": True,
        "noplaylist": True,
        "ffmpeg_location": _FFMPEG_LOCATION,
        "postprocessors": [
            {
                "key": "FFmpegExtractAudio",
                "preferredcodec": "mp3",
                "preferredquality": "192",
            }
        ],
    }

    with YoutubeDL(ydl_opts) as ydl:
        ydl.extract_info(query, download=True)

    mp3_path = DOWNLOADS_DIR / f"{base_name}.mp3"
    if not mp3_path.exists():
        raise FileNotFoundError("MP3 output file was not generated.")

    return mp3_path
