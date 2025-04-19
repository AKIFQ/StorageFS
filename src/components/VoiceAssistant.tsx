import React, { useState } from "react";
import { useSpeechRecognition } from "react-speech-recognition";

export const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  const handleCommand = (command) => {
    if (command.includes("search")) {
      // Handle search command
    } else if (command.includes("upload")) {
      // Handle upload command
    }
  };

  return (
    <div className="voice-assistant">
      <button onClick={() => setIsListening(!isListening)}>
        {isListening ? "Stop Listening" : "Start Listening"}
      </button>
      {transcript && <p>Command: {transcript}</p>}
    </div>
  );
}
