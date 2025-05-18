import React, { useState, useEffect, useRef } from 'react';
import {
  IonButton,
  IonIcon,
  IonText,
  IonToast
} from '@ionic/react';
import { micOutline, micOffOutline } from 'ionicons/icons';
import { isSpeechRecognitionSupported, startSpeechRecognition } from '../utils/SpeechUtils';
import { processVoiceCommand } from '../utils/processVoiceCommand';
import './VoiceAssistant.css';

interface VoiceAssistantProps {
  onItemAdded: () => void;
  currentMode: string;
  currentZone: string;
  currentContainer: string;
  addItem: (name: string) => void;
  moveItem?: (itemName: string, destination: string) => void;
  deleteItem?: (itemName: string) => void;
  searchItems?: (query: string) => void;
  navigate?: (destination: string) => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  onItemAdded,
  currentMode,
  currentZone,
  currentContainer,
  addItem,
  moveItem,
  deleteItem,
  searchItems,
  navigate
}) => {
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsSupported(isSpeechRecognitionSupported());
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showFeedback = (message: string, isError = false) => {
    setToastMessage(message);
    setShowToast(true);
    if (isError) {
      setFeedbackMessage('Error: ' + message);
    } else {
      setFeedbackMessage(message);
    }
  };

  const handleVoiceCommand = (command: string) => {
    const result = processVoiceCommand(command);

    switch (result.action) {
      case 'add':
        if (result.target && currentContainer) {
          addItem(result.target);
          showFeedback(`Added "${result.target}" to ${currentContainer}`);
          onItemAdded();
        } else {
          showFeedback('Please navigate to a container first', true);
        }
        break;

      case 'move':
        if (result.target && result.destination && moveItem) {
          moveItem(result.target, result.destination);
          showFeedback(`Moving "${result.target}" to ${result.destination}`);
        }
        break;

      case 'delete':
        if (result.target && deleteItem) {
          deleteItem(result.target);
          showFeedback(`Deleting "${result.target}"`);
        }
        break;

      case 'search':
        if (result.query && searchItems) {
          searchItems(result.query);
          showFeedback(`Searching for "${result.query}"`);
        }
        break;

      case 'navigate':
        if (result.destination && navigate) {
          navigate(result.destination);
          showFeedback(`Navigating to ${result.destination}`);
        }
        break;

      default:
        showFeedback('Command not recognized. Try saying "add [item name]"', true);
    }
  };

  const stopRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const handleVoiceInput = () => {
    if (!isSupported) {
      showFeedback('Voice recognition not supported', true);
      return;
    }

    setIsListening(true);
    setFinalTranscript('');
    setInterimTranscript('');
    setFeedbackMessage('Listening...');

    recognitionRef.current = startSpeechRecognition(
      (interim: string) => {
        setInterimTranscript(interim);
      },
      (final: string) => {
        setFinalTranscript(prev => prev + (prev ? ', ' : '') + final);
        setInterimTranscript('');
        handleVoiceCommand(final);
      },
      (error: string) => {
        console.error('Speech error:', error);
        showFeedback('Voice error occurred', true);
        stopRecognition();
      }
    );

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      stopRecognition();
    }, 10000); // Stop after 10 seconds of no final result
  };

  return (
    <div className="voice-assistant">
      <div className="voice-button-container">
        <IonButton
          fill="clear"
          onClick={isListening ? stopRecognition : handleVoiceInput}
          className={`voice-button ${isListening ? 'listening' : ''}`}
        >
          <IonIcon icon={isListening ? micOutline : micOffOutline} />
        </IonButton>
      </div>

      {(interimTranscript || finalTranscript || feedbackMessage) && (
        <div className="voice-feedback-container">
          {feedbackMessage && (
            <div className="voice-feedback">
              <IonText>{feedbackMessage}</IonText>
            </div>
          )}
          {(interimTranscript || finalTranscript) && (
            <div className="voice-transcript">
              <IonText>
                {interimTranscript ? `"${interimTranscript}..."` : `"${finalTranscript}"`}
              </IonText>
            </div>
          )}
        </div>
      )}

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={3000}
        position="bottom"
      />
    </div>
  );
};

export default VoiceAssistant;
