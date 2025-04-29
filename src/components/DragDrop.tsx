import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

export const DragDrop = ({ onFilesDrop }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onFilesDrop
  });

  return (
    <div {...getRootProps()} className="dropzone">
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here...</p>
      ) : (
        <p>Drag and drop files here, or click to select files</p>
      )}
    </div>
  );
};
