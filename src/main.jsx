import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./page/Signup.jsx";
import CaregiverDetail from "./page/CaregiverDetail.jsx";
import "./index.css";
import Layout from "./components/Layout";
import Reserve from "./page/Reserve";
import "./style/custom.scss";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<App />} /> {/* トップページ */}
          <Route path="Signup" element={<Signup />} />{" "}
          {/* ユーザー登録ページ */}
          <Route path="detail/:id" element={<CaregiverDetail />} />{" "}
          {/* 介護士の詳細ページ */}
          <Route path="Reserve/:id" element={<Reserve />} />{" "}
          {/* 予約確認・確定ページ */}
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
