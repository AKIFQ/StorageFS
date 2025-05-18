import React from 'react';
import { IonIcon } from '@ionic/react';
import { cubeOutline } from 'ionicons/icons';
import './Header.css';

const Header: React.FC = () => {
  return (
    <div className="header-content">
      <div className="logo-container">
        <IonIcon icon={cubeOutline} className="logo-icon" />
        <h1 className="logo-title">StorageFS</h1>
      </div>
    </div>
  );
};

export default Header; 