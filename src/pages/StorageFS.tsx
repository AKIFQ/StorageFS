import React, { useState, useEffect, useRef } from 'react';
import {
  IonContent,
  IonPage,
  IonSearchbar,
  IonIcon,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonModal,
  IonItem,
  IonLabel,
  IonInput,
  IonList,
  IonBreadcrumb,
  IonBreadcrumbs,
  IonButtons,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonToast,
  IonAlert,
  IonHeader,
  IonToolbar,
  IonTitle
} from '@ionic/react';
import {
  homeOutline,
  storefrontOutline,
  briefcaseOutline,
  schoolOutline,
  archiveOutline,
  cubeOutline,
  createOutline,
  micOutline,
  micOffOutline,
  chevronForwardOutline,
  imageOutline,
  listOutline,
  gridOutline,
  lockClosedOutline,
  lockOpenOutline,
  eyeOutline,
  eyeOffOutline,
  carOutline,
  homeSharp,
  reorderThreeOutline,
  camera
} from 'ionicons/icons';
import Header from '../components/Header';
import './StorageFS.css';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { useStorageState } from '../hooks/useStorageState';
import { addNewMode, addNewZone, addNewContainer, addNewItem, deleteMode, deleteZone, deleteContainer } from '../utils/itemManagement';
import type { Mode, Zone, Container, Item, SearchResult, Breadcrumb } from '../types/index';

// Import speech recognition utilities
import { 
  isSpeechRecognitionSupported, 
  startSpeechRecognition 
} from '../utils/SpeechUtils';

// Import voice assistant component
import VoiceAssistantComponent from '../components/VoiceAssistant';

// Import voice command processor
import { processVoiceCommand } from '../utils/processVoiceCommand';

// Our initial demo data
const initialModes = [
  { id: 1, name: 'MyHome', icon: homeOutline },
  { id: 2, name: 'MyBusiness', icon: briefcaseOutline },
  { id: 3, name: 'MySchool', icon: schoolOutline },
  { id: 4, name: 'Storage Unit', icon: cubeOutline },
  { id: 6, name: 'Farm House', icon: homeOutline },
];

const initialZones = {
  'MyHome': [
    { id: 1, name: 'Inside', icon: homeOutline, color: 'primary' },
    { id: 2, name: 'Garage', icon: storefrontOutline, color: 'secondary' },
    { id: 3, name: 'Basement', icon: archiveOutline, color: 'tertiary' },
    { id: 4, name: 'Attic', icon: cubeOutline, color: 'light' }
  ],
  'MyBusiness': [
    { id: 1, name: 'Office', icon: briefcaseOutline, color: 'primary' },
    { id: 2, name: 'Storage', icon: cubeOutline, color: 'secondary' }
  ],
  'MySchool': [
    { id: 1, name: 'Classroom', icon: schoolOutline, color: 'primary' },
    { id: 2, name: 'Locker', icon: cubeOutline, color: 'secondary' }
  ],
  'Storage Unit': [
    { id: 1, name: 'Unit A1', icon: cubeOutline, color: 'primary' },
    { id: 2, name: 'Unit B2', icon: cubeOutline, color: 'secondary' }
  ],

  'Farm House': [
    { id: 1, name: 'Living Room', icon: homeOutline, color: 'primary' },
    { id: 2, name: 'Deck', icon: homeOutline, color: 'secondary' }
  ],
};

// Simplified data for vault mode (just a subset for demonstration)
const vaultInitialModes = [
  { id: 1, name: 'Private Home', icon: homeOutline },
  { id: 2, name: 'Personal', icon: briefcaseOutline },
];

const vaultInitialZones = {
  'Private Home': [
    { id: 1, name: 'Safe', icon: homeOutline, color: 'primary' },
    { id: 2, name: 'Hidden', icon: storefrontOutline, color: 'secondary' },
  ],
  'Personal': [
    { id: 1, name: 'Documents', icon: briefcaseOutline, color: 'primary' },
  ]
};

const vaultInitialContainers = {
  'Private Home-Safe': [
    { id: 1, name: 'Secure Box', type: 'box', items: 2, image: '/assets/placeholder.jpg' },
  ],
  'Private Home-Hidden': [
    { id: 1, name: 'Secret Folder', type: 'folder', items: 1, image: '/assets/placeholder.jpg' },
  ],
  'Personal-Documents': [
    { id: 1, name: 'Private Files', type: 'folder', items: 3, image: '/assets/placeholder.jpg' },
  ]
};

const vaultInitialItems = {
  'Private Home-Safe-Secure Box': [
    { id: 1, name: 'Important Document' },
    { id: 2, name: 'Backup Key' },
  ],
  'Private Home-Hidden-Secret Folder': [
    { id: 1, name: 'Personal Note' },
  ],
  'Personal-Documents-Private Files': [
    { id: 1, name: 'Password List' },
    { id: 2, name: 'Confidential Report' },
    { id: 3, name: 'Private Contract' },
  ]
};

const initialContainers = {
  'MyHome-Inside': [
    { id: 1, name: 'Living Room Shelf', type: 'shelf', items: 4, image: '/assets/placeholder.jpg' },
    { id: 2, name: 'Kitchen Cabinet', type: 'cabinet', items: 4, image: '/assets/placeholder.jpg' }
  ],
  'MyHome-Garage': [
    { id: 1, name: 'Red Toolbox', type: 'container', items: 3, image: '/assets/placeholder.jpg' },
    { id: 2, name: 'Wall Mount', type: 'shelf', items: 4, image: '/assets/placeholder.jpg' }
  ],
  'MyBusiness-Office': [
    { id: 1, name: 'File Cabinet', type: 'cabinet', items: 5, image: '/assets/placeholder.jpg' }
  ],
  'Storage Unit-Unit A1': [
    { id: 1, name: 'Box 1', type: 'box', items: 6, image: '/assets/placeholder.jpg' },
    { id: 2, name: 'Furniture', type: 'misc', items: 2, image: '/assets/placeholder.jpg' }
  ]
};

const initialItems = {
  'MyHome-Inside-Living Room Shelf': [
    { id: 1, name: 'HDMI Cable' },
    { id: 2, name: 'Remote Control' },
    { id: 3, name: 'Board Games' },
    { id: 4, name: 'Photo Albums' }
  ],
  'MyHome-Garage-Red Toolbox': [
    { id: 1, name: 'Hammer' },
    { id: 2, name: 'Screwdriver Set' },
    { id: 3, name: 'Pliers' }
  ],
  'MyBusiness-Office-File Cabinet': [
    { id: 1, name: 'Tax Documents' },
    { id: 2, name: 'Employee Files' },
    { id: 3, name: 'Receipts' },
    { id: 4, name: 'Contracts' },
    { id: 5, name: 'Invoices' }
  ],
  'Storage Unit-Unit A1-Box 1': [
    { id: 1, name: 'Winter Clothes' },
    { id: 2, name: 'Christmas Decorations' },
    { id: 3, name: 'Old Books' },
    { id: 4, name: 'Childhood Toys' },
    { id: 5, name: 'Photo Albums' },
    { id: 6, name: 'College Textbooks' }
  ]
};

// Type definitions
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
}

interface VoiceAssistantProps {
  currentMode: string;
  currentZone: string;
  currentContainer: string;
  addItem: (name: string) => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ 
  currentMode, 
  currentZone, 
  currentContainer, 
  addItem 
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new (window as any).webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const result = event.results[current];
        const text = result[0].transcript;
        
        if (result.isFinal) {
          processFinalTranscript(text);
        } else {
          setTranscript(text);
        }
      };
      
      recognitionRef.current.onerror = () => {
        setIsListening(false);
        setFeedback('Voice recognition failed');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setFeedback('Voice recognition not supported in this browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setTranscript('');
      setFeedback('Listening...');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const processFinalTranscript = (text: string) => {
    const addPatterns = [
      /^add\s+(.+)$/i,
      /^add\s+a\s+(.+)$/i,
      /^add\s+an\s+(.+)$/i,
      /^add\s+the\s+(.+)$/i
    ];

    let matched = false;
    for (const pattern of addPatterns) {
      const match = text.toLowerCase().match(pattern);
      if (match && match[1]) {
        const items = match[1]
          .split(/,| and /)
          .map(item => item.trim())
          .filter(Boolean);
        
        if (currentMode && currentZone && currentContainer) {
          items.forEach(item => {
            const capitalizedItem = item.charAt(0).toUpperCase() + item.slice(1);
            addItem(capitalizedItem);
            setFeedback(`Added "${capitalizedItem}"`);
          });
          matched = true;
        } else {
          setFeedback('Please navigate to a container first');
        }
        break;
      }
    }

    if (!matched) {
      setFeedback('Try saying "add [item name]"');
    }

    setTranscript('');
    setIsListening(false);
  };

  return (
    <div className="voice-input-group">
      <button 
        className={`voice-button ${isListening ? 'listening' : ''}`}
        onClick={toggleListening}
      >
        <IonIcon icon={isListening ? micOutline : micOffOutline} />
      </button>
      {transcript && (
        <div className="voice-transcript">"{transcript}"</div>
      )}
      {feedback && !transcript && (
        <div className="voice-feedback">{feedback}</div>
      )}
    </div>
  );
};

// Main StorageFS Component
const StorageFS: React.FC = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [searchFeedback, setSearchFeedback] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newItemName, setNewItemName] = useState<string>('');
  const [newInlineItem, setNewInlineItem] = useState<string>('');
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<string>('grid');
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const recognitionRef = useRef<any>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  const {
    modes,
    setModes,
    zones,
    setZones,
    containers,
    setContainers,
    items,
    setItems,
    currentMode,
    currentZone,
    currentContainer,
    breadcrumbs,
    view,
    navigateToMode,
    navigateToZone,
    navigateToContainer,
    navigateToBreadcrumb,
    handleNavigateHome
  } = useStorageState();

  // Initialize data and check password on first load
  useEffect(() => {
    // Check if password exists
    // const hasPassword = localStorage.getItem('app_password') !== null;
    
    // Only show password modal if password exists or we need to set it up
    // setShowPasswordModal(true);
    // setIsLocked(true);
  }, []);

  // const handlePasswordSuccess = () => {
  //   setIsLocked(false);
  //   setShowPasswordModal(false);
  // };

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new (window as any).webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchText(transcript);
        handleSearch(transcript);
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = () => {
        setIsListening(false);
        showToastMessage('Voice recognition failed');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const showToastMessage = (message: string): void => {
    setToastMessage(message);
    setShowToast(true);
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    
    const results: SearchResult[] = [];
    Object.keys(items).forEach(locationKey => {
      const matchingItems = items[locationKey].filter((item: Item) => 
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      
      if (matchingItems.length > 0) {
        const [mode, zone, container] = locationKey.split('-');
        results.push({
          location: `${mode} > ${zone} > ${container}`,
          items: matchingItems,
          mode,
          zone,
          container
        });
      }
    });
    
    setSearchResults(results);
    
    if (results.length === 0) {
      showToastMessage(`No items found matching "${query}"`);
    } else {
      navigateToMode(results[0].mode);
      navigateToZone(results[0].zone);
      navigateToContainer(results[0].container);
      showToastMessage(`Found ${results.length} result(s). Navigated to first match.`);
    }
  };

  const handleAddItem = () => {
    if (!newItemName.trim()) return;
    
    if (view === 'modes') {
      const { updatedModes, updatedZones } = addNewMode(modes, zones, newItemName);
      setModes(updatedModes);
      setZones(updatedZones);
    } 
    else if (view === 'zones' && currentMode) {
      const { updatedZones, updatedContainers } = addNewZone(zones, containers, currentMode, newItemName);
      setZones(updatedZones);
      setContainers(updatedContainers);
    }
    else if (view === 'containers' && currentMode && currentZone) {
      const { updatedContainers, updatedItems } = addNewContainer(containers, items, currentMode, currentZone, newItemName);
      setContainers(updatedContainers);
      setItems(updatedItems);
    }
    
    setShowModal(false);
    setNewItemName('');
  };

  const handleAddInlineItem = () => {
    if (!newInlineItem.trim() || !currentMode || !currentZone || !currentContainer) return;
    
    const { updatedItems, updatedContainers } = addNewItem(
      items,
      containers,
      currentMode,
      currentZone,
      currentContainer,
      newInlineItem
    );
    
    setItems(updatedItems);
    setContainers(updatedContainers);
    setNewInlineItem('');
    showToastMessage(`Added "${newInlineItem}"`);
  };

  const handleDeleteMode = (modeName: string) => {
    const { updatedModes, updatedZones, updatedContainers } = deleteMode(modes, zones, containers, modeName);
    setModes(updatedModes);
    setZones(updatedZones);
    setContainers(updatedContainers);
    showToastMessage(`Deleted ${modeName}`);
  };

  const handleDeleteZone = (zoneName: string) => {
    if (!currentMode) return;
    
    const { updatedZones, updatedContainers } = deleteZone(zones, containers, currentMode, zoneName);
    setZones(updatedZones);
    setContainers(updatedContainers);
    showToastMessage(`Deleted ${zoneName}`);
  };

  const handleDeleteContainer = (containerName: string) => {
    if (!currentMode || !currentZone) return;
    
    const { updatedContainers, updatedItems } = deleteContainer(
      containers,
      items,
      currentMode,
      currentZone,
      containerName
    );
    
    setContainers(updatedContainers);
    setItems(updatedItems);
    showToastMessage(`Deleted ${containerName}`);
  };

  const handlePhotoTaken = async (containerName: string) => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        promptLabelHeader: 'Take Photo',
        promptLabelPhoto: 'Take Photo',
        promptLabelPicture: 'Choose from Gallery'
      });
      
      if (!image.dataUrl || !currentMode || !currentZone) return;

      const containerId = `${currentMode}-${currentZone}`;
      const containerList = [...(containers[containerId] || [])];
      const containerIndex = containerList.findIndex(c => c.name === containerName);
      
      if (containerIndex >= 0) {
        containerList[containerIndex] = {
          ...containerList[containerIndex],
          image: image.dataUrl
        };
        setContainers({
          ...containers,
          [containerId]: containerList
        });
        showToastMessage('Container photo updated');
      }
    } catch (error) {
      console.error('Camera error:', error);
      showToastMessage('Could not take photo');
    }
  };

  const addItem = (name: string): void => {
    if (!name.trim() || !currentMode || !currentZone || !currentContainer) return;
    
    const { updatedItems, updatedContainers } = addNewItem(
      items,
      containers,
      currentMode,
      currentZone,
      currentContainer,
      name
    );
    
    setItems(updatedItems);
    setContainers(updatedContainers);
    showToastMessage(`Added "${name}"`);
  };

  const toggleVoiceSearch = () => {
    if (!recognitionRef.current) {
      setFeedback('Voice recognition not supported in this browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setTranscript('');
      setFeedback('Listening...');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandalone) return;

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  // Render functions
  const renderModes = () => (
    <>
      <div className="section-header">
        <h2>Storage Locations</h2>
        <div className="button-group">
          <IonButton 
            fill="clear" 
            className="view-toggle-button"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            <IonIcon icon={viewMode === 'grid' ? listOutline : gridOutline} />
          </IonButton>
          <IonButton fill="clear" className="edit-button" onClick={() => setShowModal(true)}>
            <IonIcon icon={createOutline} />
            <span className="button-text">Add</span>
          </IonButton>
          <IonButton 
            fill="clear" 
            className="edit-button"
            onClick={() => setIsEditMode(!isEditMode)}
          >
            <IonIcon icon={reorderThreeOutline} />
            <span className="button-text">{isEditMode ? 'Done' : 'Edit'}</span>
          </IonButton>
        </div>
      </div>
      
      <div className={viewMode === 'grid' ? "mode-grid" : "mode-list"}>
        {modes.map((mode: Mode) => (
          viewMode === 'grid' ? (
            <IonCard 
              key={mode.id} 
              className="mode-card"
              onClick={() => !isEditMode && navigateToMode(mode.name)}
            >
              <IonCardContent>
                <div className="mode-icon">
                  <IonIcon icon={mode.icon} />
                </div>
                <div className="mode-name">{mode.name}</div>
                {isEditMode ? (
                  <IonButton 
                    fill="clear" 
                    color="danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMode(mode.name);
                    }}
                  >
                    Delete
                  </IonButton>
                ) : null}
              </IonCardContent>
            </IonCard>
          ) : (
            <IonItem 
              key={mode.id} 
              className="mode-list-item"
              onClick={() => !isEditMode && navigateToMode(mode.name)}
              button
            >
              <div className="mode-list-icon">
                <IonIcon icon={mode.icon} />
              </div>
              <IonLabel>
                <h3>{mode.name}</h3>
              </IonLabel>
              {isEditMode ? (
                <IonButton 
                  fill="clear" 
                  color="danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteMode(mode.name);
                  }}
                >
                  Delete
                </IonButton>
              ) : (
                <IonIcon 
                  icon={chevronForwardOutline} 
                  slot="end"
                />
              )}
            </IonItem>
          )
        ))}
      </div>
    </>
  );
  
  const renderZones = () => (
    <>
      <div className="section-header">
        <h2>Zones in {currentMode}</h2>
        <div className="button-group">
          <IonButton 
            fill="clear" 
            className="view-toggle-button"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            <IonIcon icon={viewMode === 'grid' ? listOutline : gridOutline} />
          </IonButton>
          <IonButton fill="clear" className="edit-button" onClick={() => setShowModal(true)}>
            <IonIcon icon={createOutline} />
            <span className="button-text">Add</span>
          </IonButton>
          <IonButton 
            fill="clear" 
            className="edit-button"
            onClick={() => setIsEditMode(!isEditMode)}
          >
            <IonIcon icon={reorderThreeOutline} />
            <span className="button-text">{isEditMode ? 'Done' : 'Edit'}</span>
          </IonButton>
        </div>
      </div>
      
      <div className={viewMode === 'grid' ? "zone-grid" : "zone-list"}>
        {zones[currentMode]?.map((zone: Zone) => (
          viewMode === 'grid' ? (
            <IonCard 
              key={zone.id} 
              className="zone-card"
              onClick={() => !isEditMode && navigateToZone(zone.name)}
            >
              <IonCardContent>
                <div className={`zone-icon-container ${zone.color}`}>
                  <IonIcon icon={zone.icon} />
                </div>
                <div className="zone-label">{zone.name}</div>
                {isEditMode ? (
                  <IonButton 
                    fill="clear" 
                    color="danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteZone(zone.name);
                    }}
                  >
                    Delete
                  </IonButton>
                ) : null}
              </IonCardContent>
            </IonCard>
          ) : (
            <IonItem 
              key={zone.id} 
              className="zone-list-item"
              onClick={() => !isEditMode && navigateToZone(zone.name)}
              button
            >
              <div className={`zone-list-icon ${zone.color}`}>
                <IonIcon icon={zone.icon} />
              </div>
              <IonLabel>
                <h3>{zone.name}</h3>
              </IonLabel>
              {isEditMode ? (
                <IonButton 
                  fill="clear" 
                  color="danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteZone(zone.name);
                  }}
                >
                  Delete
                </IonButton>
              ) : (
                <IonIcon 
                  icon={chevronForwardOutline} 
                  slot="end"
                />
              )}
            </IonItem>
          )
        ))}
      </div>
    </>
  );

  const renderContainers = () => {
    const containerId = `${currentMode}-${currentZone}`;
    
    return (
      <>
        <div className="section-header">
          <h2>Containers in {currentZone}</h2>
          <div className="button-group">
            <IonButton 
              fill="clear" 
              className="view-toggle-button"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              <IonIcon icon={viewMode === 'grid' ? listOutline : gridOutline} />
            </IonButton>
            <IonButton fill="clear" className="edit-button" onClick={() => setShowModal(true)}>
              <IonIcon icon={createOutline} />
              <span className="button-text">Add</span>
            </IonButton>
            <IonButton 
              fill="clear" 
              className="edit-button"
              onClick={() => setIsEditMode(!isEditMode)}
            >
              <IonIcon icon={reorderThreeOutline} />
              <span className="button-text">{isEditMode ? 'Done' : 'Edit'}</span>
            </IonButton>
          </div>
        </div>
        
        <div className={viewMode === 'grid' ? "container-grid" : "container-list"}>
          {containers[containerId]?.map((container: Container) => (
            viewMode === 'grid' ? (
              <IonCard key={container.id} className="container-card">
                <div className="container-image">
                  {container.image ? (
                    <img src={container.image} alt={container.name} />
                  ) : (
                    <img src="/assets/insert_img.png" alt="Insert photo placeholder" style={{width: '100%', height: '100%', objectFit: 'contain'}} />
                  )}
                </div>
                <IonCardContent>
                  <div className="container-header">
                    <h3>{container.name}</h3>
                    <span className="container-type">{container.type}</span>
                  </div>
                  <p className="container-items">{container.items} items</p>
                  {isEditMode ? (
                    <IonButton 
                      fill="clear" 
                      color="danger"
                      onClick={() => handleDeleteContainer(container.name)}
                    >
                      Delete
                    </IonButton>
                  ) : (
                    <div className="container-actions">
                      <IonButton 
                        fill="clear" 
                        size="small" 
                        className="action-button"
                        onClick={() => navigateToContainer(container.name)}
                      >
                        <IonIcon slot="start" icon={listOutline} />
                        <span>View Items</span>
                      </IonButton>
                      <IonButton
                        fill="clear"
                        size="small"
                        className="action-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePhotoTaken(container.name);
                        }}
                      >
                        <IonIcon slot="start" icon={camera} />
                        <span>Take Photo</span>
                      </IonButton>
                    </div>
                  )}
                </IonCardContent>
              </IonCard>
            ) : (
              <IonItem 
                key={container.id} 
                className="container-list-item"
                onClick={() => !isEditMode && navigateToContainer(container.name)}
                button
              >
                <div className="container-list-icon">
                  {container.image ? (
                    <img src={container.image} alt={container.name} />
                  ) : (
                    <img src="/assets/insert_img.png" alt="Insert photo placeholder" style={{width: '100%', height: '100%', objectFit: 'contain'}} />
                  )}
                </div>
                <IonLabel>
                  <h3>{container.name}</h3>
                  <p>{container.type} • {container.items} items</p>
                </IonLabel>
                {isEditMode ? (
                  <IonButton 
                    fill="clear" 
                    color="danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteContainer(container.name);
                    }}
                  >
                    Delete
                  </IonButton>
                ) : (
                  <div className="list-item-actions">
                    <IonButton
                      fill="clear"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePhotoTaken(container.name);
                      }}
                    >
                      <IonIcon icon={camera} />
                    </IonButton>
                    <IonIcon 
                      icon={chevronForwardOutline} 
                      slot="end"
                    />
                  </div>
                )}
              </IonItem>
            )
          ))}
        </div>
      </>
    );
  };
  
  const renderItems = () => {
    const itemId = `${currentMode}-${currentZone}-${currentContainer}`;
    
    const handleDeleteItem = (id: number): void => {
      const updatedItems = items[itemId]?.filter((item: Item) => item.id !== id) || [];
      setItems({
        ...items,
        [itemId]: updatedItems
      });
      
      // Update container item count
      const containerId = `${currentMode}-${currentZone}`;
      const containerList = [...(containers[containerId] || [])];
      const containerIndex = containerList.findIndex(c => c.name === currentContainer);
      if (containerIndex >= 0) {
        containerList[containerIndex] = {
          ...containerList[containerIndex],
          items: containerList[containerIndex].items - 1
        };
        setContainers({
          ...containers,
          [containerId]: containerList
        });
      }
    };
    
    return (
      <>
        <div className="section-header">
          <h2>Items in {currentContainer}</h2>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <IonButton fill="clear" className="edit-button">
              <IonIcon icon={reorderThreeOutline} />
              <span className="button-text">Edit</span>
            </IonButton>
          </div>
        </div>
        
        <div className="voice-add-container">
          <p>Add items by voice:</p>
          <VoiceAssistant
            currentMode={currentMode}
            currentZone={currentZone}
            currentContainer={currentContainer}
            addItem={addItem}
          />
        </div>
        
        <div className="inline-item-input">
          <IonInput
            value={newInlineItem}
            placeholder="Type item name and tap Next"
            onIonChange={e => setNewInlineItem(e.detail.value || '')}
            onKeyPress={e => e.key === 'Enter' && handleAddInlineItem()}
          />
          <IonButton onClick={handleAddInlineItem}>
            Next
          </IonButton>
        </div>
        
        {items[itemId]?.map((item: Item) => (
          <IonItemSliding key={item.id}>
            <IonItem className="item-entry">
              <IonLabel>{item.name}</IonLabel>
            </IonItem>
            <IonItemOptions side="end">
              <IonItemOption color="danger" onClick={() => handleDeleteItem(item.id)}>
                Delete
              </IonItemOption>
            </IonItemOptions>
          </IonItemSliding>
        ))}
      </>
    );
  };

  const renderSearchResults = () => (
    <div className="search-results">
      <div className="section-header">
        <h2>Search Results</h2>
        <IonButton 
          fill="clear" 
          onClick={() => setShowSearchResults(false)}
        >
          Back
        </IonButton>
      </div>
      
      {searchResults.length === 0 ? (
        <p className="no-results">No items found matching "{searchText}"</p>
      ) : (
        searchResults.map((result: SearchResult, i: number) => (
          <div key={i} className="result-group">
            <h3 className="location-path">{result.location}</h3>
            <div className="result-items">
              {result.items.map((item: Item) => (
                <IonItem key={item.id} className="result-item">
                  <IonLabel>{item.name}</IonLabel>
                </IonItem>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
  
  // Modal content
  const renderModalContent = () => (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            Add New {view === 'modes' ? 'Location' : 
              view === 'zones' ? 'Zone' : 
              view === 'containers' ? 'Container' : 'Item'}
          </IonTitle>
          <IonButton slot="end" fill="clear" onClick={() => setShowModal(false)}>
            Cancel
          </IonButton>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Name</IonLabel>
          <IonInput
            value={newItemName}
            placeholder={`Enter name for new ${view === 'modes' ? 'location' : 
              view === 'zones' ? 'zone' : 
              view === 'containers' ? 'container' : 'item'}`}
            onIonChange={e => setNewItemName(e.detail.value || '')}
          />
        </IonItem>
        
        <IonButton expand="block" onClick={handleAddItem} className="modal-button">
          Add
        </IonButton>
      </IonContent>
    </>
  );

  // Main render function
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <Header />
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {/* Search Bar */}
        <div className="search-container">
          <IonSearchbar
            value={searchText}
            onIonChange={e => {
              setSearchText(e.detail.value!);
              handleSearch(e.detail.value!);
            }}
            placeholder="Search items..."
            className="custom-searchbar"
            debounce={300}
          />
          <button
            className={`voice-search-button ${isListening ? 'active' : ''}`}
            onClick={toggleVoiceSearch}
          >
            <IonIcon icon={isListening ? micOutline : micOffOutline} />
          </button>
        </div>

        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <div className="breadcrumbs-container">
            <IonBreadcrumbs>
              <IonBreadcrumb onClick={() => navigateToBreadcrumb('modes')}>
                Home
              </IonBreadcrumb>
              {breadcrumbs.map((crumb, index) => (
                <IonBreadcrumb key={index} onClick={() => navigateToBreadcrumb(crumb.path)}>
                  {crumb.text}
                </IonBreadcrumb>
              ))}
            </IonBreadcrumbs>
          </div>
        )}
        {/* Main content */}
        <div className="main-content">
          {showSearchResults ? (
            renderSearchResults()
          ) : (
            <>
              {view === 'modes' && renderModes()}
              {view === 'zones' && renderZones()}
              {view === 'containers' && renderContainers()}
              {view === 'items' && renderItems()}
            </>
          )}
        </div>
        {/* Modals and Toasts */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} className="small-modal">
          {renderModalContent()}
        </IonModal>
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          position="bottom"
        />
        {showInstallPrompt && (
          <div className="pwa-install-prompt">
            <p>Add StorageFS to your home screen for a better experience!</p>
            <button onClick={handleInstallClick}>Add to Home Screen</button>
            <button onClick={() => setShowInstallPrompt(false)}>Dismiss</button>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default StorageFS;