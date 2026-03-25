# 🎵 Song Downloader App

A full-stack application that allows users to **search for a song by name and download the audio**. The system searches YouTube for the requested song, extracts the audio stream, converts it to MP3, and provides a downloadable file.

This project is built for **learning backend architecture, API integration, and media processing pipelines**.

---

## 🚀 Features

- Search songs by name
- Fetch top 5 YouTube results with thumbnails
- Select the best match and download as MP3
- Choose MP3 quality (128 / 192 / 320 kbps) before download
- REST API backend with FastAPI
- React frontend with live search
- Audio conversion using FFmpeg with selectable bitrate

---

## 🧠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, JavaScript, CSS |
| Backend | FastAPI, Python 3.11+ |
| Media | yt-dlp, FFmpeg |
| Server | Uvicorn (ASGI) |

---

## 🏗 System Architecture

```
User → React Frontend (localhost:3000)
     → FastAPI Backend (localhost:8000)
     → YouTube Search via yt-dlp
     → Audio extraction + FFmpeg MP3 conversion
     → File served back to browser
```

---

## 📁 Project Structure

```
song-downloader-app/
├── backend/
│   ├── main.py          # FastAPI app, routes (/health, /search, /download)
│   ├── downloader.py    # YouTube search + yt-dlp download logic
│   ├── utils.py         # Filename helpers
│   ├── downloads/       # Downloaded MP3 files stored here
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.jsx
│   │   │   ├── SongResults.jsx
│   │   │   └── DownloadButton.jsx
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── main.py              # Root entrypoint (re-exports backend app)
└── README.md
```

---

## ⚙️ Prerequisites

- **Python 3.11+**
- **Node.js 18+** and npm
- **FFmpeg** — Install via winget (Windows):
  ```powershell
  winget install Gyan.FFmpeg
  ```
  Or via apt (Linux):
  ```bash
  sudo apt install ffmpeg
  ```

---

## 🛠 Installation

### 1. Clone the repository

```bash
git clone https://github.com/JaiKiran27/song-downloader-app.git
cd song-downloader-app
```

### 2. Backend setup

```bash
pip install -r backend/requirements.txt
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

---

## ▶️ Running the App

Open **two terminals** from the project root.

### Terminal 1 — Start the backend

```powershell
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

Backend runs at: `http://127.0.0.1:8000`

### Terminal 2 — Start the frontend

```powershell
cd frontend
npm start
```

Frontend runs at: `http://localhost:3000`

> The frontend is pre-configured to proxy all API requests to the backend, so no extra configuration is needed.

---

## 🌐 Live Deployment

- Frontend (Vercel): https://song-downloader-9tj0hc3uq-jais-projects-f1c2e068.vercel.app/
- Backend (Render): https://song-downloader-app-backend.onrender.com
- Backend Health Check: https://song-downloader-app-backend.onrender.com/health

You can use the frontend URL directly. It is connected to the deployed backend on Render.

---

## ⚙️ Production Environment Variables

For hosted frontend deployments (Vercel/Netlify), set:

- `REACT_APP_API_BASE_URL=https://song-downloader-app-backend.onrender.com`

This ensures both search and download requests go to the deployed backend.

---

## ✅ Quick Production Test

1. Open the Vercel URL.
2. Search for any song title.
3. Pick a result and select quality (128/192/320).
4. Click **Download MP3** and confirm the downloaded file plays correctly.

---

## 📝 Deployment Notes

- Render free instances may take a few seconds to wake up on the first request.
- Keep FFmpeg available in the Render environment for successful conversion.
- If downloads fail in production, first test `GET /health`, then `GET /search`.

---

## 🔌 API Endpoints

### `GET /health`
Returns server status.
```json
{ "status": "ok" }
```

### `GET /search?song={song_name}`
Returns top 5 YouTube results for the query.
```json
{
  "query": "Believer Imagine Dragons",
  "count": 5,
  "results": [
    {
      "id": "...",
      "title": "...",
      "duration": 204,
      "uploader": "...",
      "thumbnail": "...",
      "webpage_url": "https://www.youtube.com/watch?v=..."
    }
  ]
}
```

### `GET /download?song={song_name}&video_url={youtube_url}&quality={128|192|320}`
Downloads and converts the audio to MP3, returns the file directly.

---

## 🔄 Application Workflow

1. User types a song name in the search bar.
2. Frontend calls `GET /search?song=...` on the backend.
3. Backend queries YouTube via yt-dlp and returns 5 results.
4. User picks a result, chooses quality, and clicks **Download MP3**.
5. Frontend calls `GET /download?song=...&video_url=...&quality=...`.
6. Backend downloads the audio using yt-dlp and converts it to MP3 via FFmpeg.
7. The MP3 file is saved in `backend/downloads/` and streamed to the browser.
8. Browser saves the file locally.

---

## 🧩 Future Improvements

- Download progress bar
- Playlist support
- Cache previously downloaded songs
- Dark mode UI
-   Add background task queue (Redis + Celery)
-   AI-based song search (e.g., "sad anime piano song")

------------------------------------------------------------------------

# ⚠️ Disclaimer

This project is intended **only for educational purposes** to
demonstrate backend architecture, API integration, and media processing
techniques.

------------------------------------------------------------------------

# 👨‍💻 Author

Jai Kiran Pampana
Junior Developer | GenAI Enthusiast
