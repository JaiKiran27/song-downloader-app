import { useEffect, useRef, useState } from "react";
import { Loader2, Mic, Search, Square } from "lucide-react";

function SearchBar({ onSearch, loading }) {
  const [song, setSong] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = song.trim();
    if (!trimmed) {
      return;
    }
    onSearch(trimmed);
  };

  const handleMicClick = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError("Voice input is not supported in this browser.");
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    setVoiceError("");
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim();
      if (transcript) {
        setSong(transcript);
      }
    };

    recognition.onerror = (event) => {
      if (event.error !== "aborted") {
        setVoiceError("Could not capture voice. Please try again.");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    setIsListening(true);
    recognition.start();
  };

  return (
    <>
      <form className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-ui-card/60 p-3 backdrop-blur-md sm:flex-row sm:items-center" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search a song..."
          value={song}
          onChange={(event) => setSong(event.target.value)}
          disabled={loading}
          className="w-full rounded-xl border border-slate-700 bg-ui-deep px-4 py-3 text-ui-text outline-none transition focus:border-ui-secondary focus:ring-2 focus:ring-ui-secondary/20"
        />
        <button
          type="button"
          className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border transition ${
            isListening
              ? "animate-pulse border-rose-300/60 bg-rose-500/80 text-white"
              : "border-ui-secondary/45 bg-ui-deep text-ui-secondary hover:border-ui-secondary hover:bg-ui-secondary/10"
          }`}
          onClick={handleMicClick}
          disabled={loading}
          aria-label={isListening ? "Stop voice input" : "Start voice input"}
        >
          {isListening ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          <span className="sr-only">
            {isListening ? "Stop voice input" : "Start voice input"}
          </span>
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-ui-primary px-5 py-3 text-sm font-bold text-ui-bg transition hover:scale-[1.01] hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      {voiceError ? (
        <p className="mt-2 rounded-lg border border-rose-300/25 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          {voiceError}
        </p>
      ) : null}
    </>
  );
}

export default SearchBar;
