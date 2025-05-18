import localforage from 'localforage';

// Configure localforage
localforage.config({
  name: 'StorageFS',
  storeName: 'storagefs_data',
  description: 'Storage for StorageFS app data'
});

// Define keys for our data
const KEYS = {
  MODES: 'modes',
  ZONES: 'zones',
  CONTAINERS: 'containers',
  ITEMS: 'items'
};

// Type definitions
export type Item = {
  id: number;
  name: string;
};

export type Container = {
  id: number;
  name: string;
  type: string;
  items: number;
  image: string;
};

export type Zone = {
  id: number;
  name: string;
  icon: string;
  color: string;
};

export type Mode = {
  id: number;
  name: string;
  icon: string;
};

// Storage Service
export const StorageService = {
  // Initialize storage (create if doesn't exist)
  async init() {
    try {
      // Check if data exists
      const hasData = await this.hasData();
      
      if (!hasData) {
        // Set initial data
        await this.setInitialData();
      }
      
      return true;
    } catch (error) {
      console.error('Error initializing storage:', error);
      return false;
    }
  },
  
  // Check if data exists
  async hasData() {
    try {
      const modes = await localforage.getItem(KEYS.MODES);
      return !!modes;
    } catch (error) {
      console.error('Error checking data:', error);
      return false;
    }
  },
  
  // Set initial data
  async setInitialData() {
    try {
      // Our initial demo data
      const initialModes = [
        { id: 1, name: 'MyHome', icon: 'homeOutline' },
        { id: 2, name: 'MyBusiness', icon: 'briefcaseOutline' },
        { id: 3, name: 'MySchool', icon: 'schoolOutline' },
        { id: 4, name: 'Storage Unit', icon: 'cubeOutline' },
        { id: 5, name: 'MyGarage', icon: 'carOutline' },
        { id: 6, name: 'Beach House', icon: 'homeOutline' },
        { id: 7, name: 'Cabin', icon: 'homeOutline' }
      ];
      
      const initialZones = {
        'MyHome': [
          { id: 1, name: 'Inside', icon: 'homeOutline', color: 'primary' },
          { id: 2, name: 'Garage', icon: 'storefrontOutline', color: 'secondary' },
          { id: 3, name: 'Basement', icon: 'archiveOutline', color: 'tertiary' },
          { id: 4, name: 'Attic', icon: 'cubeOutline', color: 'light' }
        ],
        'MyBusiness': [
          { id: 1, name: 'Office', icon: 'briefcaseOutline', color: 'primary' },
          { id: 2, name: 'Storage', icon: 'cubeOutline', color: 'secondary' }
        ],
        'MySchool': [
          { id: 1, name: 'Classroom', icon: 'schoolOutline', color: 'primary' },
          { id: 2, name: 'Locker', icon: 'cubeOutline', color: 'secondary' }
        ],
        'Storage Unit': [
          { id: 1, name: 'Unit A1', icon: 'cubeOutline', color: 'primary' },
          { id: 2, name: 'Unit B2', icon: 'cubeOutline', color: 'secondary' }
        ],
        'MyGarage': [
          { id: 1, name: 'Shelves', icon: 'homeSharp', color: 'primary' },
          { id: 2, name: 'Tool Area', icon: 'storefrontOutline', color: 'secondary' }
        ],
        'Beach House': [
          { id: 1, name: 'Living Room', icon: 'homeOutline', color: 'primary' },
          { id: 2, name: 'Deck', icon: 'homeOutline', color: 'secondary' }
        ],
        'Cabin': [
          { id: 1, name: 'Main Floor', icon: 'homeOutline', color: 'primary' },
          { id: 2, name: 'Loft', icon: 'homeOutline', color: 'secondary' }
        ]
      };
      
      const initialContainers = {
        'MyHome-Inside': [
          { id: 1, name: 'Living Room Shelf', type: 'shelf', items: 4, image: '/assets/insert_img.png' },
          { id: 2, name: 'Kitchen Cabinet', type: 'cabinet', items: 4, image: '/assets/insert_img.png' }
        ],
        'MyHome-Garage': [
          { id: 1, name: 'Red Toolbox', type: 'container', items: 3, image: '/assets/insert_img.png' },
          { id: 2, name: 'Wall Mount', type: 'shelf', items: 4, image: '/assets/insert_img.png' }
        ],
        'MyBusiness-Office': [
          { id: 1, name: 'File Cabinet', type: 'cabinet', items: 5, image: '/assets/insert_img.png' }
        ],
        'Storage Unit-Unit A1': [
          { id: 1, name: 'Box 1', type: 'box', items: 6, image: '/assets/insert_img.png' },
          { id: 2, name: 'Furniture', type: 'misc', items: 2, image: '/assets/insert_img.png' }
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
      
      // Save initial data
      await Promise.all([
        localforage.setItem(KEYS.MODES, initialModes),
        localforage.setItem(KEYS.ZONES, initialZones),
        localforage.setItem(KEYS.CONTAINERS, initialContainers),
        localforage.setItem(KEYS.ITEMS, initialItems)
      ]);
      
      return true;
    } catch (error) {
      console.error('Error setting initial data:', error);
      return false;
    }
  },
  
  // Get all data
  async getAllData() {
    try {
      const [modes, zones, containers, items] = await Promise.all([
        localforage.getItem(KEYS.MODES),
        localforage.getItem(KEYS.ZONES),
        localforage.getItem(KEYS.CONTAINERS),
        localforage.getItem(KEYS.ITEMS)
      ]);
      
      return {
        modes: modes as Mode[],
        zones: zones as Record<string, Zone[]>,
        containers: containers as Record<string, Container[]>,
        items: items as Record<string, Item[]>
      };
    } catch (error) {
      console.error('Error getting all data:', error);
      throw error;
    }
  },
  
  // Save all data
  async saveAllData(data: {
    modes: Mode[],
    zones: Record<string, Zone[]>,
    containers: Record<string, Container[]>,
    items: Record<string, Item[]>
  }) {
    try {
      await Promise.all([
        localforage.setItem(KEYS.MODES, data.modes),
        localforage.setItem(KEYS.ZONES, data.zones),
        localforage.setItem(KEYS.CONTAINERS, data.containers),
        localforage.setItem(KEYS.ITEMS, data.items)
      ]);
      
      return true;
    } catch (error) {
      console.error('Error saving all data:', error);
      return false;
    }
  },
  
  // Export data
  async exportData() {
    try {
      const data = await this.getAllData();
      return JSON.stringify(data);
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  },
  
  // Import data
  async importData(jsonData: string) {
    try {
      const data = JSON.parse(jsonData);
      
      // Validate data structure
      if (!data.modes || !data.zones || !data.containers || !data.items) {
        throw new Error('Invalid data format');
      }
      
      // Save imported data
      await this.saveAllData(data);
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  },
  
  // Clear all data
  async clearAllData() {
    try {
      await localforage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }
};

export default StorageService; 