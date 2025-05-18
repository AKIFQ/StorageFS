import { useState, useEffect } from 'react';
import { Mode, Zones, Containers, Items, Breadcrumb } from '../types';
import {
  mockModes,
  mockZones,
  mockContainers,
  mockItems
} from '../constants/mockData';

const STORAGE_KEYS = {
  MODES: 'storageFS_modes',
  ZONES: 'storageFS_zones',
  CONTAINERS: 'storageFS_containers',
  ITEMS: 'storageFS_items'
};

export const useStorageState = () => {
  // Initialize state from localStorage or use mock data
  const [modes, setModes] = useState<Mode[]>(mockModes);
  const [zones, setZones] = useState<Zones>(mockZones);
  const [containers, setContainers] = useState<Containers>(mockContainers);
  const [items, setItems] = useState<Items>(mockItems);

  const [currentMode, setCurrentMode] = useState<string>('');
  const [currentZone, setCurrentZone] = useState<string>('');
  const [currentContainer, setCurrentContainer] = useState<string>('');
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const [view, setView] = useState<string>('modes');

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MODES, JSON.stringify(modes));
    localStorage.setItem(STORAGE_KEYS.ZONES, JSON.stringify(zones));
    localStorage.setItem(STORAGE_KEYS.CONTAINERS, JSON.stringify(containers));
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  }, [modes, zones, containers, items]);

  const navigateToMode = (mode: string) => {
    setCurrentMode(mode);
    setCurrentZone('');
    setCurrentContainer('');
    setView('zones');
    setBreadcrumbs([{ text: mode, path: 'modes' }]);
  };

  const navigateToZone = (zone: string) => {
    setCurrentZone(zone);
    setCurrentContainer('');
    setView('containers');
    setBreadcrumbs([
      { text: currentMode, path: 'modes' },
      { text: zone, path: 'zones' }
    ]);
  };

  const navigateToContainer = (container: string) => {
    setCurrentContainer(container);
    setView('items');
    setBreadcrumbs([
      { text: currentMode, path: 'modes' },
      { text: currentZone, path: 'zones' },
      { text: container, path: 'containers' }
    ]);
  };

  const navigateToBreadcrumb = (path: string) => {
    switch (path) {
      case 'modes':
        setCurrentMode('');
        setCurrentZone('');
        setCurrentContainer('');
        setView('modes');
        setBreadcrumbs([]);
        break;
      case 'zones':
        setCurrentZone('');
        setCurrentContainer('');
        setView('zones');
        setBreadcrumbs([{ text: currentMode, path: 'modes' }]);
        break;
      case 'containers':
        setCurrentContainer('');
        setView('containers');
        setBreadcrumbs([
          { text: currentMode, path: 'modes' },
          { text: currentZone, path: 'zones' }
        ]);
        break;
      default:
        break;
    }
  };

  const handleNavigateHome = () => {
    setCurrentMode('');
    setCurrentZone('');
    setCurrentContainer('');
    setView('modes');
    setBreadcrumbs([]);
  };

  return {
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
  };
}; 