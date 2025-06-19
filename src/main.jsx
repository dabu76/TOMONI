import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./page/Signup.jsx";
import CaregiverDetail from "./page/CaregiverDetail.jsx";
import "./index.css";
import Layout from "./components/Layout";
import Reserve from "./page/Reserve";
import ReservationComplete from "./page/ReservationComplete .jsx";
import { UserProvider } from "./context/UserContext";
import History from "./page/History";
import "./style/custom.scss";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<App />} /> {/* トップページ */}
            {/* ユーザー登録ページ */}
            <Route path="Signup" element={<Signup />} />{" "}
            {/* 介護士の詳細ページ */}
            <Route path="detail/:id" element={<CaregiverDetail />} />{" "}
            {/* 予約確認・確定ページ */}
            <Route path="Reserve/:id" element={<Reserve />} />{" "}
            <Route
              path="ReservationComplete"
              element={<ReservationComplete></ReservationComplete>}
            />
            <Route path="History" element={<History></History>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  </React.StrictMode>
);
