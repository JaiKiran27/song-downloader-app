import shutil
import os
import base64
import tempfile
from pathlib import Path
from typing import Any

from yt_dlp import YoutubeDL

# Locate ffmpeg from env or PATH. Avoid hardcoded OS-specific fallbacks.
_FFMPEG_ENV = os.getenv("FFMPEG_LOCATION")
_FFMPEG_PATH = shutil.which("ffmpeg")
_FFMPEG_LOCATION = _FFMPEG_ENV or (str(Path(_FFMPEG_PATH).parent) if _FFMPEG_PATH else None)

if __package__:
    from .utils import ensure_directory, slugify_song_name
else:
    from utils import ensure_directory, slugify_song_name

DOWNLOADS_DIR = ensure_directory(Path(__file__).parent / "downloads")
ALLOWED_MP3_QUALITIES = {"128", "192", "320"}


def get_runtime_status() -> dict[str, object]:
    """Return non-sensitive runtime diagnostics for deployment troubleshooting."""
    cookie_mode = "none"
    if os.getenv("YTDLP_COOKIEFILE"):
        cookie_mode = "file"
    elif os.getenv("YTDLP_COOKIES_B64"):
        cookie_mode = "base64"

    cookiefile_resolved = False
    cookiefile_error = ""
    try:
        cookiefile_resolved = bool(_cookiefile_from_env())
    except Exception as exc:
        cookiefile_error = str(exc)

    return {
        "ffmpeg_location": _FFMPEG_LOCATION or "",
        "ffmpeg_found": bool(_FFMPEG_LOCATION),
        "cookie_mode": cookie_mode,
        "cookiefile_resolved": cookiefile_resolved,
        "cookiefile_error": cookiefile_error,
    }


def _cookiefile_from_env() -> str | None:
    """Resolve yt-dlp cookiefile from env vars.

    Supported env vars:
    - YTDLP_COOKIEFILE: absolute path to cookies.txt
    - YTDLP_COOKIES_B64: base64-encoded cookies.txt content
    """
    cookiefile_path = os.getenv("YTDLP_COOKIEFILE")
    if cookiefile_path:
        return cookiefile_path

    cookies_b64 = os.getenv("YTDLP_COOKIES_B64")
    if not cookies_b64:
        return None

    try:
        cookie_bytes = base64.b64decode(cookies_b64)
    except Exception as exc:
        raise RuntimeError("YTDLP_COOKIES_B64 is not valid base64.") from exc

    temp_dir = Path(tempfile.gettempdir())
    cookie_file = temp_dir / "yt-dlp-cookies.txt"
    cookie_file.write_bytes(cookie_bytes)
    return str(cookie_file)


def _base_ydl_opts() -> dict[str, Any]:
    """Shared yt-dlp options for deployed environments."""
    ydl_opts: dict[str, Any] = {
        "quiet": True,
        "noplaylist": True,
        "retries": 3,
        "extractor_retries": 3,
        "socket_timeout": 20,
        "http_headers": {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/123.0.0.0 Safari/537.36"
            )
        },
        # Prefer non-web clients first; can reduce bot-check frequency on some hosts.
        "extractor_args": {
            "youtube": {
                "player_client": ["android", "ios", "web"],
            }
        },
    }

    if _FFMPEG_LOCATION:
        ydl_opts["ffmpeg_location"] = _FFMPEG_LOCATION

    cookiefile = _cookiefile_from_env()
    if cookiefile:
        ydl_opts["cookiefile"] = cookiefile

    return ydl_opts


def search_youtube(song_name: str) -> list[dict[str, Any]]:
    """Return up to 5 YouTube search results for a song query."""
    ydl_opts = _base_ydl_opts()
    ydl_opts.update(
        {
            "skip_download": True,
            "extract_flat": "in_playlist",
        }
    )

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


def download_song_as_mp3(
    song_name: str,
    video_url: str | None = None,
    quality: str = "192",
) -> Path:
    """Download a song from YouTube and convert it to MP3."""
    if not _FFMPEG_LOCATION:
        raise RuntimeError(
            "FFmpeg is not installed or not in PATH. On Render, install ffmpeg or set FFMPEG_LOCATION."
        )

    selected_quality = quality if quality in ALLOWED_MP3_QUALITIES else "192"
    base_name = slugify_song_name(song_name)
    output_template = str(DOWNLOADS_DIR / f"{base_name}.%(ext)s")

    query = video_url or f"ytsearch1:{song_name}"

    ydl_opts = _base_ydl_opts()
    ydl_opts.update(
        {
            "format": "bestaudio/best",
            "outtmpl": output_template,
            "postprocessors": [
                {
                    "key": "FFmpegExtractAudio",
                    "preferredcodec": "mp3",
                    "preferredquality": selected_quality,
                }
            ],
        }
    )

    with YoutubeDL(ydl_opts) as ydl:
        ydl.extract_info(query, download=True)

    mp3_path = DOWNLOADS_DIR / f"{base_name}.mp3"
    if not mp3_path.exists():
        raise FileNotFoundError("MP3 output file was not generated.")

    return mp3_path
