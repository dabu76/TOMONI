import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";

// APIのベースURL
const API_BASE = "https://localhost:7184/api";

// ログインモーダルのコンポーネント定義
export default function LoginModal({ onClose }) {
  const { setIsLoggedIn, setUser } = useContext(UserContext);
  // ユーザーが入力したメールアドレスとパスワードを管理するstate
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // エラーメッセージを表示するためのstate

  // 「ログイン」ボタンが押された時の処理
  const handleLogin = async () => {
    try {
      // APIにログインリクエストを送信
      const response = await axios.post(
        `${API_BASE}/auth/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true, // 認証用のCookieをリクエストに含めるための設定
        }
      );
      setIsLoggedIn(true);
      // モーダルを閉じる（親コンポーネントから渡された関数）
      onClose();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("予期しないエラーが発生しました。");
      }
    }
  };

  // モーダルの背景（黒い部分）をクリックした時にモーダルを閉じる処理
  const handleBackgroundClick = (e) => {
    if (e.target.classList.contains("modal_background")) {
      onClose();
    }
  };

  // 実際に画面に表示される部分（JSX）
  return (
    <div className="modal_background" onClick={handleBackgroundClick}>
      <div className="modal_content">
        <h3>ログイン</h3>

        {/* エラーメッセージがある場合に表示 */}
        {error && <p className="error">{error}</p>}

        {/* メールアドレスの入力欄 */}
        <input
          className="login_input"
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* パスワードの入力欄 */}
        <input
          className="login_input"
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* ログインボタン */}
        <button className="loginBtn" onClick={handleLogin}>
          ログイン
        </button>
      </div>
    </div>
  );
}
