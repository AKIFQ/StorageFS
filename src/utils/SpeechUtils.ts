// This utility file handles speech recognition for our app

// Type definitions for speech recognition
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  start(): void;
  stop(): void;
  abort(): void;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

// Check if the browser supports speech recognition
export const isSpeechRecognitionSupported = (): boolean => {
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
};

// Get the SpeechRecognition constructor
export const getSpeechRecognition = (): SpeechRecognition | null => {
  const SpeechRecognitionImpl = window.SpeechRecognition || window.webkitSpeechRecognition;
  return SpeechRecognitionImpl ? new SpeechRecognitionImpl() : null;
};

// Initialize speech recognition
export const initSpeechRecognition = (
  onResult: (text: string) => void,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (error: string) => void
): SpeechRecognition | null => {
  const recognition = getSpeechRecognition();
  
  if (!recognition) {
    console.warn('Speech recognition is not supported in this browser');
    return null;
  }
  
  // Configure recognition
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';
  
  // Set up event handlers
  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const result = event.results[0][0].transcript;
    onResult(result);
  };
  
  if (onStart) recognition.onstart = onStart;
  if (onEnd) recognition.onend = onEnd;
  if (onError) recognition.onerror = (event: SpeechRecognitionErrorEvent) => onError(event.error);
  
  return recognition;
};

// New streaming speech recognition with interim results
export function startStreamingSpeechRecognition(
  onInterim: (text: string) => void,
  onFinal: (text: string) => void,
  onError: (err: string) => void
): SpeechRecognition | null {
  const recognition = getSpeechRecognition();
  if (!recognition) return null;

  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    let interim = '';
    let final = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript.trim();
      if (event.results[i].isFinal) {
        final += transcript + ' ';
      } else {
        interim += transcript + ' ';
      }
    }

    if (interim) onInterim(interim.trim());
    if (final) onFinal(final.trim());
  };

  recognition.onerror = (e: SpeechRecognitionErrorEvent) => onError(e.error);

  recognition.start();
  return recognition;
}

// Start listening for speech (basic version)
export const startSpeechRecognition = (
  onInterim: (text: string) => void,
  onFinal: (text: string) => void,
  onError: (error: string) => void
): SpeechRecognition => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.lang = 'en-US';
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const result = event.results[event.resultIndex];
    const transcript = result[0].transcript;

    if (result.isFinal) {
      onFinal(transcript.trim());
    } else {
      onInterim(transcript.trim());
    }
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    onError(event.error);
  };

  recognition.start();
  return recognition;
}; 