import re
from pathlib import Path


def slugify_song_name(song_name: str) -> str:
    """Create a safe file stem from a song name."""
    cleaned = re.sub(r"[^a-zA-Z0-9\s-]", "", song_name).strip().lower()
    slug = re.sub(r"[\s_-]+", "-", cleaned)
    return slug[:80] if slug else "song"


def ensure_directory(path: Path) -> Path:
    """Ensure a directory exists and return it."""
    path.mkdir(parents=True, exist_ok=True)
    return path
