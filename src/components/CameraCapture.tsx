import React, { useState } from 'react';
import {
  IonButton,
  IonIcon,
  IonToast,
  IonSpinner,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons
} from '@ionic/react';
import {
  camera,
  closeOutline,
  imageOutline,
  refreshOutline
} from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import './CameraCapture.css';

interface CameraCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onImageCaptured: (photoUrl: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({
  isOpen,
  onClose,
  onImageCaptured
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showToast, setShowToast] = useState(false);

  const handleTakePhoto = async (source: CameraSource = CameraSource.Camera) => {
    try {
      setIsLoading(true);
      setError('');

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source,
        correctOrientation: true,
        height: 1024,
        width: 1024,
        presentationStyle: 'fullscreen'
      });
      
      if (image.dataUrl) {
        onImageCaptured(image.dataUrl);
        onClose();
      } else {
        throw new Error('No image data received');
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      setError(err.message || 'Failed to capture image');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError('');
    handleTakePhoto();
  };

  return (
    <>
      <IonModal isOpen={isOpen} onDidDismiss={onClose} className="camera-modal">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Take Photo</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={onClose}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        
        <IonContent className="camera-content">
          <div className="camera-options">
            <IonButton
              expand="block"
              onClick={() => handleTakePhoto(CameraSource.Camera)}
              disabled={isLoading}
            >
              <IonIcon icon={camera} slot="start" />
              Take Photo
            </IonButton>

            <IonButton
              expand="block"
              fill="outline"
              onClick={() => handleTakePhoto(CameraSource.Photos)}
              disabled={isLoading}
            >
              <IonIcon icon={imageOutline} slot="start" />
              Choose from Gallery
            </IonButton>

            {error && (
              <div className="error-container">
                <p className="error-message">{error}</p>
                <IonButton
                  fill="clear"
                  onClick={handleRetry}
                  disabled={isLoading}
                >
                  <IonIcon icon={refreshOutline} slot="start" />
                  Retry
                </IonButton>
              </div>
            )}

            {isLoading && (
              <div className="loading-container">
                <IonSpinner name="circular" />
                <p>Processing...</p>
              </div>
            )}
          </div>
        </IonContent>
      </IonModal>

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={error}
        duration={3000}
        position="bottom"
        color="danger"
      />
    </>
  );
};

export default CameraCapture;
