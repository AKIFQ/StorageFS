import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Item {
  id: number;
  name: string;
  description?: string;
  quantity?: number;
  location?: string;
  attachments?: string[];
}

export interface Container {
  id: number;
  name: string;
  type: string;
  items: number;
  image: string;
  attachments?: string[];
}

interface StorageContextType {
  currentMode: string | null;
  currentZone: string | null;
  currentContainer: string | null;
  items: { [key: string]: Item[] };
  containers: { [key: string]: Container[] };
  searchText: string;
  setCurrentMode: (mode: string | null) => void;
  setCurrentZone: (zone: string | null) => void;
  setCurrentContainer: (container: string | null) => void;
  addItem: (name: string) => void;
  deleteItem: (id: number) => void;
  addItemAttachment: (itemId: number, filePath: string) => boolean;
  addContainerAttachment: (containerId: number, filePath: string) => boolean;
  searchItems: () => void;
  getItemsForSearch: (query: string) => { location: string; items: Item[] }[];
  setSearchText: (text: string) => void;
}

export const StorageContext = createContext<StorageContextType | undefined>(undefined);

export const useStorage = () => {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error('useStorage must be used within a StorageProvider');
  }
  return context;
};

export const StorageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentMode, setCurrentMode] = useState<string | null>(null);
  const [currentZone, setCurrentZone] = useState<string | null>(null);
  const [currentContainer, setCurrentContainer] = useState<string | null>(null);
  const [items, setItems] = useState<{ [key: string]: Item[] }>({});
  const [containers, setContainers] = useState<{ [key: string]: Container[] }>({});
  const [searchText, setSearchText] = useState('');

  const addItem = (name: string) => {
    if (!currentMode || !currentZone || !currentContainer) return;

    const itemId = `${currentMode}-${currentZone}-${currentContainer}`;
    const itemList = [...(items[itemId] || [])];
    const newItem: Item = {
      id: Date.now(),
      name,
      location: `${currentMode} > ${currentZone} > ${currentContainer}`
    };

    itemList.push(newItem);
    setItems({
      ...items,
      [itemId]: itemList
    });

    // Update container item count
    const containerId = `${currentMode}-${currentZone}`;
    const containerList = [...(containers[containerId] || [])];
    const containerIndex = containerList.findIndex(c => c.name === currentContainer);

    if (containerIndex >= 0) {
      containerList[containerIndex] = {
        ...containerList[containerIndex],
        items: containerList[containerIndex].items + 1
      };

      setContainers({
        ...containers,
        [containerId]: containerList
      });
    }
  };

  const deleteItem = (id: number) => {
    if (!currentMode || !currentZone || !currentContainer) return;
    
    const itemId = `${currentMode}-${currentZone}-${currentContainer}`;
    const itemList = items[itemId] || [];
    
    const itemIndex = itemList.findIndex(item => item.id === id);
    if (itemIndex === -1) return;
    
    const updatedItems = [...itemList];
    updatedItems.splice(itemIndex, 1);
    
    setItems({
      ...items,
      [itemId]: updatedItems
    });
    
    const containerId = `${currentMode}-${currentZone}`;
    const containerList = [...(containers[containerId] || [])];
    const containerIndex = containerList.findIndex(c => c.name === currentContainer);
    
    if (containerIndex >= 0) {
      containerList[containerIndex] = {
        ...containerList[containerIndex],
        items: Math.max(0, containerList[containerIndex].items - 1)
      };
      
      setContainers({
        ...containers,
        [containerId]: containerList
      });
    }
  };

  const addItemAttachment = (itemId: number, filePath: string) => {
    if (!currentMode || !currentZone || !currentContainer) return false;
    
    const key = `${currentMode}-${currentZone}-${currentContainer}`;
    const itemList = [...(items[key] || [])];
    const index = itemList.findIndex(item => item.id === itemId);
    
    if (index >= 0) {
      const updatedItem = {
        ...itemList[index],
        attachments: [...(itemList[index].attachments || []), filePath]
      };
      
      itemList[index] = updatedItem;
      setItems({
        ...items,
        [key]: itemList
      });
      
      return true;
    }
    
    return false;
  };
  
  const addContainerAttachment = (containerId: number, filePath: string) => {
    if (!currentMode || !currentZone) return false;
    
    const key = `${currentMode}-${currentZone}`;
    const containerList = [...(containers[key] || [])];
    const index = containerList.findIndex(container => container.id === containerId);
    
    if (index >= 0) {
      const updatedContainer = {
        ...containerList[index],
        attachments: [...(containerList[index].attachments || []), filePath]
      };
      
      containerList[index] = updatedContainer;
      setContainers({
        ...containers,
        [key]: containerList
      });
      
      return true;
    }
    
    return false;
  };

  const searchItems = () => {
    if (!searchText.trim()) return;
    console.log(`Searching for: ${searchText}`);
  };

  const getItemsForSearch = (query: string) => {
    if (!query.trim()) return [];
    
    const results: { location: string, items: Item[] }[] = [];
    const lowerQuery = query.toLowerCase();
    
    Object.keys(items).forEach(locationKey => {
      const matchingItems = items[locationKey].filter(item => 
        item.name.toLowerCase().includes(lowerQuery)
      );
      
      if (matchingItems.length > 0) {
        const [mode, zone, container] = locationKey.split('-');
        results.push({
          location: `${mode} > ${zone} > ${container}`,
          items: matchingItems
        });
      }
    });
    
    return results;
  };

  const value = {
    currentMode,
    currentZone,
    currentContainer,
    items,
    containers,
    searchText,
    setCurrentMode,
    setCurrentZone,
    setCurrentContainer,
    addItem,
    deleteItem,
    addItemAttachment,
    addContainerAttachment,
    searchItems,
    getItemsForSearch,
    setSearchText
  };

  return (
    <StorageContext.Provider value={value}>
      {children}
    </StorageContext.Provider>
  );
}; 