// Types for the storage system
export interface Mode {
  id: number;
  name: string;
  icon: string;
}

export interface Zone {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export interface Container {
  id: number;
  name: string;
  type: string;
  items: number;
  image: string;
}

export interface Item {
  id: number;
  name: string;
  location?: string;
}

export interface Breadcrumb {
  text: string;
  path: string;
}

export interface SearchResult {
  location: string;
  items: Item[];
  mode: string;
  zone: string;
  container: string;
}

// Type aliases for collections
export type Zones = {
  [key: string]: Zone[];
};

export type Containers = {
  [key: string]: Container[];
};

export type Items = {
  [key: string]: Item[];
}; 