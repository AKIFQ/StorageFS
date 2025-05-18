import {
  homeOutline,
  briefcaseOutline,
  schoolOutline,
  cubeOutline,
  storefrontOutline,
  archiveOutline
} from 'ionicons/icons';
import { Mode, Zones, Containers, Items } from '../types';

// Regular Mode Data
export const mockModes: Mode[] = [
  { id: 1, name: 'MyHome', icon: homeOutline },
  { id: 2, name: 'MyBusiness', icon: briefcaseOutline },
  { id: 3, name: 'MySchool', icon: schoolOutline },
  { id: 4, name: 'Storage Unit', icon: cubeOutline }
];

export const mockZones: Zones = {
  'MyHome': [
    { id: 1, name: 'Inside', icon: homeOutline, color: 'primary' },
    { id: 2, name: 'Garage', icon: storefrontOutline, color: 'secondary' },
    { id: 3, name: 'Basement', icon: archiveOutline, color: 'tertiary' },
    { id: 4, name: 'Attic', icon: cubeOutline, color: 'warning' }
  ],
  'MyBusiness': [
    { id: 1, name: 'Office', icon: briefcaseOutline, color: 'success' },
    { id: 2, name: 'Storage', icon: cubeOutline, color: 'danger' }
  ],
  'MySchool': [
    { id: 1, name: 'Classroom', icon: schoolOutline, color: 'tertiary' },
    { id: 2, name: 'Locker', icon: cubeOutline, color: 'warning' }
  ],
  'Storage Unit': [
    { id: 1, name: 'Unit A1', icon: cubeOutline, color: 'success' },
    { id: 2, name: 'Unit B2', icon: cubeOutline, color: 'danger' }
  ]
};

export const mockContainers: Containers = {
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

export const mockItems: Items = {
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