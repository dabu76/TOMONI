import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./page/Signup.jsx";
import "./index.css";

import "./style/custom.scss";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/Signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
