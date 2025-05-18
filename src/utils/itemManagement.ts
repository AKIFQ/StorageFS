import { Mode, Zones, Containers, Items, Zone, Container } from '../types';
import { homeOutline, cubeOutline } from 'ionicons/icons';

export const addNewMode = (
  modes: Mode[],
  zones: Zones,
  name: string
): { updatedModes: Mode[], updatedZones: Zones } => {
  const newMode = {
    id: modes.length + 1,
    name,
    icon: homeOutline
  };
  
  return {
    updatedModes: [...modes, newMode],
    updatedZones: { ...zones, [name]: [] }
  };
};

export const addNewZone = (
  zones: Zones,
  containers: Containers,
  currentMode: string,
  name: string
): { updatedZones: Zones, updatedContainers: Containers } => {
  const newZone = {
    id: zones[currentMode]?.length + 1 || 1,
    name,
    icon: cubeOutline,
    color: 'primary'
  };

  return {
    updatedZones: {
      ...zones,
      [currentMode]: [...(zones[currentMode] || []), newZone]
    },
    updatedContainers: {
      ...containers,
      [`${currentMode}-${name}`]: []
    }
  };
};

export const addNewContainer = (
  containers: Containers,
  items: Items,
  currentMode: string,
  currentZone: string,
  name: string
): { updatedContainers: Containers, updatedItems: Items } => {
  const containerId = `${currentMode}-${currentZone}`;
  const newContainer = {
    id: (containers[containerId]?.length || 0) + 1,
    name,
    type: 'container',
    items: 0,
    image: '/assets/insert_img.png'
  };

  return {
    updatedContainers: {
      ...containers,
      [containerId]: [...(containers[containerId] || []), newContainer]
    },
    updatedItems: {
      ...items,
      [`${containerId}-${name}`]: []
    }
  };
};

export const addNewItem = (
  items: Items,
  containers: Containers,
  currentMode: string,
  currentZone: string,
  currentContainer: string,
  name: string
): { updatedItems: Items, updatedContainers: Containers } => {
  const itemId = `${currentMode}-${currentZone}-${currentContainer}`;
  const newItem = {
    id: (items[itemId]?.length || 0) + 1,
    name
  };

  const containerId = `${currentMode}-${currentZone}`;
  const containerList = [...(containers[containerId] || [])];
  const containerIndex = containerList.findIndex(c => c.name === currentContainer);

  if (containerIndex >= 0) {
    containerList[containerIndex] = {
      ...containerList[containerIndex],
      items: containerList[containerIndex].items + 1
    };
  }

  return {
    updatedItems: {
      ...items,
      [itemId]: [...(items[itemId] || []), newItem]
    },
    updatedContainers: {
      ...containers,
      [containerId]: containerList
    }
  };
};

export const deleteMode = (
  modes: Mode[],
  zones: Zones,
  containers: Containers,
  modeName: string
): { updatedModes: Mode[], updatedZones: Zones, updatedContainers: Containers } => {
  const updatedModes = modes.filter(mode => mode.name !== modeName);
  const updatedZones = { ...zones };
  delete updatedZones[modeName];

  const updatedContainers = { ...containers };
  Object.keys(updatedContainers).forEach(key => {
    if (key.startsWith(`${modeName}-`)) {
      delete updatedContainers[key];
    }
  });

  return { updatedModes, updatedZones, updatedContainers };
};

export const deleteZone = (
  zones: Zones,
  containers: Containers,
  currentMode: string,
  zoneName: string
): { updatedZones: Zones, updatedContainers: Containers } => {
  const updatedZones = {
    ...zones,
    [currentMode]: zones[currentMode].filter((zone: Zone) => zone.name !== zoneName)
  };

  const updatedContainers = { ...containers };
  delete updatedContainers[`${currentMode}-${zoneName}`];

  return { updatedZones, updatedContainers };
};

export const deleteContainer = (
  containers: Containers,
  items: Items,
  currentMode: string,
  currentZone: string,
  containerName: string
): { updatedContainers: Containers, updatedItems: Items } => {
  const containerId = `${currentMode}-${currentZone}`;
  const updatedContainers = {
    ...containers,
    [containerId]: containers[containerId].filter((container: Container) => container.name !== containerName)
  };

  const updatedItems = { ...items };
  delete updatedItems[`${containerId}-${containerName}`];

  return { updatedContainers, updatedItems };
}; 