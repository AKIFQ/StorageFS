import { homeOutline, cubeOutline } from 'ionicons/icons';
import { Mode, Zones, Containers, Items } from '../types';

export const initialModes: Mode[] = [
  {
    id: 1,
    name: 'Home',
    icon: homeOutline
  },
  {
    id: 2,
    name: 'Office',
    icon: homeOutline
  }
];

export const initialZones: Zones = {
  Home: [
    {
      id: 1,
      name: 'Living Room',
      icon: cubeOutline,
      color: 'primary'
    },
    {
      id: 2,
      name: 'Kitchen',
      icon: cubeOutline,
      color: 'primary'
    }
  ],
  Office: [
    {
      id: 1,
      name: 'Main Office',
      icon: cubeOutline,
      color: 'primary'
    }
  ]
};

export const initialContainers: Containers = {
  'Home-Living Room': [
    {
      id: 1,
      name: 'TV Cabinet',
      type: 'container',
      items: 0,
      image: '/assets/insert_img.png'
    }
  ],
  'Home-Kitchen': [
    {
      id: 1,
      name: 'Upper Cabinets',
      type: 'container',
      items: 0,
      image: '/assets/insert_img.png'
    }
  ],
  'Office-Main Office': [
    {
      id: 1,
      name: 'Filing Cabinet',
      type: 'container',
      items: 0,
      image: '/assets/insert_img.png'
    }
  ]
};

export const initialItems: Items = {
  'Home-Living Room-TV Cabinet': [],
  'Home-Kitchen-Upper Cabinets': [],
  'Office-Main Office-Filing Cabinet': []
}; 