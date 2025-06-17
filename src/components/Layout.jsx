// 複数の場所で再利用するため、コンポーネントとして分離

import { Outlet, Link, useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import LoginModal from "./LoginModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightToBracket,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { createContext, useState } from "react";

export default function Layout() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      <p className="login">
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
      </p>

      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)}>
          <form className="login_form">
            <h2>ログイン</h2>
            <input
              className="login_input"
              type="text"
              placeholder="メールアドレス"
            />
            <input
              className="login_input"
              type="password"
              placeholder="パスワード"
            />
            <button className="login_btn2" type="submit">
              ログイン
            </button>
          </form>
        </LoginModal>
      )}

      <div className="main_header">
        <h2 className="title">
          <Link to="/">TOMONI</Link>
        </h2>
      </div>

      <Nav activeKey="1" className="custom-nav">
        <Nav.Item>
          <Nav.Link eventKey="1" href="/">
            介護士を探す
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="2" href="#/history">
            依頼履歴
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="3" href="#/mypage">
            アカウント
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <Outlet />
    </>
  );
}
