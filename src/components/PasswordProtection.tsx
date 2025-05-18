import React, { useState, useEffect } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
  useIonToast
} from '@ionic/react';

interface PasswordProtectionProps {
  isOpen: boolean;
  isSetup: boolean;
  onSuccess: () => void;
}

const PasswordProtection: React.FC<PasswordProtectionProps> = ({
  isOpen,
  isSetup,
  onSuccess
}) => {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [present] = useIonToast();

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const showToast = (message: string, isError = false) => {
    present({
      message,
      duration: 2000,
      position: 'bottom',
      color: isError ? 'danger' : 'success'
    });
  };

  const validatePassword = (pass: string) => {
    // Check if password is exactly 4 digits
    return /^\d{4}$/.test(pass);
  };

  const handleSubmit = () => {
    if (isSetup) {
      if (!validatePassword(password)) {
        setError('Password must be exactly 4 digits');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      localStorage.setItem('app_password', password);
      showToast('Password set successfully');
      onSuccess();
      resetForm();
    } else {
      const storedPassword = localStorage.getItem('app_password');
      if (!storedPassword) {
        // If no password is stored, force setup mode
        showToast('Please set up a password first', true);
        return;
      }

      if (password === storedPassword) {
        showToast('Unlocked successfully');
        onSuccess();
        resetForm();
      } else {
        setError('Incorrect password');
        setPassword('');
      }
    }
  };

  const resetForm = () => {
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <IonModal isOpen={isOpen} backdropDismiss={false}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            {isSetup ? 'Set Password' : 'Enter Password'}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">
            {isSetup ? 'Create 4-digit PIN' : 'Enter PIN'}
          </IonLabel>
          <IonInput
            type="number"
            value={password}
            maxlength={4}
            onIonChange={e => {
              const value = e.detail.value || '';
              if (value.length <= 4) {
                setPassword(value);
                setError('');
              }
            }}
            onKeyPress={handleKeyPress}
            placeholder="Enter 4-digit PIN"
          />
        </IonItem>

        {isSetup && (
          <IonItem>
            <IonLabel position="stacked">Confirm PIN</IonLabel>
            <IonInput
              type="number"
              value={confirmPassword}
              maxlength={4}
              onIonChange={e => {
                const value = e.detail.value || '';
                if (value.length <= 4) {
                  setConfirmPassword(value);
                  setError('');
                }
              }}
              onKeyPress={handleKeyPress}
              placeholder="Confirm 4-digit PIN"
            />
          </IonItem>
        )}

        {error && (
          <IonText color="danger" className="ion-padding">
            <p>{error}</p>
          </IonText>
        )}

        <IonButton
          expand="block"
          className="ion-margin-top"
          onClick={handleSubmit}
          disabled={!password || (isSetup && !confirmPassword)}
        >
          {isSetup ? 'Set Password' : 'Unlock'}
        </IonButton>
      </IonContent>
    </IonModal>
  );
};

export default PasswordProtection; 