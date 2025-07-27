import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./page/Signup.jsx";
import CaregiverDetail from "./page/CaregiverDetail.jsx";
import "./index.css";
import Layout from "./components/Layout";
import Reserve from "./page/Reserve";
import ReservationComplete from "./page/ReservationComplete.jsx";
import { UserProvider } from "./context/UserContext";
import History from "./page/History";
import ReservationDetail from "./page/ReservationDetail";
import MyPage from "./page/Mypage.jsx";
import "./style/custom.scss";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <UserProvider>
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
          <Route
            path="reservation/:reservationId"
            element={<ReservationDetail />}
          />
          <Route path="ReservationComplete" element={<ReservationComplete />} />
          <Route path="History" element={<History />} />
          <Route path="mypage" element={<MyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </UserProvider>
);
