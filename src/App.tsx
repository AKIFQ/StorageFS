import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StorageFS from "./pages/StorageFS";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StorageFS />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}
