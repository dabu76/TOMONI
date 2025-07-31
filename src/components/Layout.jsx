import { Outlet, Link, useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import LoginModal from "./LoginModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightToBracket,
  faUserPlus,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";

export default function Layout() {
  const [showLoginModal, setShowLoginModal] = useState(false); // モーダル表示制御
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn, setUser } = useContext(UserContext);

  // ログアウト処理
  const handleLogout = async () => {
    try {
      await axios.post(
        "https://localhost:7184/api/auth/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
      setIsLoggedIn(false);
      alert("ログアウトしました。");
      navigate("/");
    } catch (err) {
      console.error("ログアウトに失敗しました。", err);
    }
  };

  // ログイン成功後の処理：ユーザー情報取得 → Context保存 → ページ遷移
  const handleLoginSuccess = async () => {
    try {
      const res = await axios.get("https://localhost:7184/api/auth/check", {
        withCredentials: true,
      });

      const userData = {
        userId: res.data.userId,
        email: res.data.email,
        role: res.data.role, // caregiver または customer
      };

      setUser(userData);
      setIsLoggedIn(true);
      setShowLoginModal(false);
      alert("ログインしました。");

      // ✅ ロールに応じてリダイレクト
      if (userData.role === "customer") {
        navigate("/mypage");
      } else if (userData.role === "caregiver") {
        navigate("/caregiver/schedule");
      }
    } catch (error) {
      console.error("ユーザー情報の取得に失敗", error);
    }
  };

  return (
    <>
      {/* ログイン／新規登録／ログアウトボタン */}
      <p className="login">
        {!isLoggedIn ? (
          <>
            {/* ログインボタン */}
            <span className="login_btn" onClick={() => setShowLoginModal(true)}>
              <FontAwesomeIcon icon={faRightToBracket} />
            </span>

            {/* 新規登録ボタン */}
            <span
              className="member_btn"
              onClick={() => navigate("/Signup")}
              style={{ cursor: "pointer" }}
            >
              <FontAwesomeIcon icon={faUserPlus} />
            </span>
          </>
        ) : (
          // ログアウトボタン
          <span
            className="logout_btn"
            onClick={handleLogout}
            style={{ cursor: "pointer" }}
          >
            <FontAwesomeIcon icon={faRightFromBracket} /> ログアウト
          </span>
        )}
      </p>

      {/* ログインモーダル */}
      {showLoginModal && (
        <LoginModal
          onSuccess={handleLoginSuccess}
          onClose={() => setShowLoginModal(false)}
        />
      )}

      {/* ヘッダー */}
      <div className="main_header">
        <h2 className="title">
          <Link to="/">TOMONI</Link>
        </h2>
      </div>

      {/* ナビゲーションバー */}
      <Nav activeKey="1" className="custom-nav">
        <Nav.Item>
          <Nav.Link eventKey="1" href="/">
            介護士を探す
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="2" href="/history">
            依頼履歴
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="3" href="/mypage">
            アカウント
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {/* 子ルート（Outlet） */}
      <Outlet />
    </>
  );
}
