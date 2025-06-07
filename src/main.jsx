import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./page/Signup.jsx";
import CaregiverDetail from "./page/CaregiverDetail.jsx";
import "./index.css";
import Layout from "./components/Layout";

import "./style/custom.scss";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<App />} />
          <Route path="Signup" element={<Signup />} />
          <Route path="detail/:id" element={<CaregiverDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
