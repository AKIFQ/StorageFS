import React, { useRef, useState } from "react";
import { Camera } from "@capacitor/camera";

export const CameraCapture = () => {
  const [photo, setPhoto] = useState(null);
  
  const takePhoto = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: "base64"
    });
    setPhoto(image?.base64String);
  };

  return (
    <div className="camera-capture">
      <button onClick={takePhoto}>Take Photo</button>
      {photo && <img src={`data:image/jpeg;base64,${photo}`} />}
    </div>
  );
}
