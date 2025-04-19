import React from "react";
import { IonPage, IonContent } from "@ionic/react";
import "./Settings.css";

export const Settings = () => {
  return (
    <IonPage>
      <IonContent>
        <div className="settings-container">
          <h1>Settings</h1>
          <section>
            <h2>Storage</h2>
            <div className="setting-item">
              <label>Enable auto-backup</label>
              <input type="checkbox" />
            </div>
          </section>
          <section>
            <h2>Security</h2>
            <div className="setting-item">
              <label>Enable biometric authentication</label>
              <input type="checkbox" />
            </div>
          </section>
        </div>
      </IonContent>
    </IonPage>
  );
}
