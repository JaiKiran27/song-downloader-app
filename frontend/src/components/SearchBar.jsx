import { useEffect, useRef, useState } from "react";

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
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search a song..."
          value={song}
          onChange={(event) => setSong(event.target.value)}
          disabled={loading}
        />
        <button
          type="button"
          className={`mic-btn ${isListening ? "listening" : ""}`}
          onClick={handleMicClick}
          disabled={loading}
          aria-label={isListening ? "Stop voice input" : "Start voice input"}
        >
          <span className={`mic-icon ${isListening ? "stop" : ""}`} aria-hidden="true" />
          <span className="sr-only">
            {isListening ? "Stop voice input" : "Start voice input"}
          </span>
        </button>
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      {voiceError ? <p className="voice-error">{voiceError}</p> : null}
    </>
  );
}

export default SearchBar;
