import { Outlet, Link, useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import LoginModal from "./LoginModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightToBracket,
  faUserPlus,
  faRightFromBracket, // 로그아웃 아이콘
} from "@fortawesome/free-solid-svg-icons";
import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";

export default function Layout() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const { isLoggedIn, setIsLoggedIn, setUser } = useContext(UserContext);

  // 로그아웃 처리 함수
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
      navigate("/"); // 로그아웃 후 홈으로 이동 (필요에 따라 생략 가능)
    } catch (err) {
      console.error("ログアウトに失敗しました。", err);
    }
  };

  return (
    <>
      {/* 로그인/회원가입/로그아웃 버튼 */}
      <p className="login">
        {!isLoggedIn ? (
          <>
            <span className="login_btn" onClick={() => setShowLoginModal(true)}>
              <FontAwesomeIcon icon={faRightToBracket} />
            </span>
            <span
              className="member_btn"
              onClick={() => navigate("/Signup")}
              style={{ cursor: "pointer" }}
            >
              <FontAwesomeIcon icon={faUserPlus} />
            </span>
          </>
        ) : (
          <span
            className="logout_btn"
            onClick={handleLogout}
            style={{ cursor: "pointer" }}
          >
            <FontAwesomeIcon icon={faRightFromBracket} /> ログアウト
          </span>
        )}
      </p>

      {/* 로그인 모달 */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}

      {/* 헤더 */}
      <div className="main_header">
        <h2 className="title">
          <Link to="/">TOMONI</Link>
        </h2>
      </div>

      {/* 내비게이션 */}
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

      {/* 자식 라우트 렌더링 */}
      <Outlet />
    </>
  );
}
