import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

// APIのベースURL
const API_BASE = "https://localhost:7184/api";

// ログインモーダルのコンポーネント定義
// props:
// - onSuccess: ログイン成功時に呼び出される関数（ユーザーデータを渡す）
// - onClose: モーダルを閉じる処理
export default function LoginModal({ onSuccess, onClose }) {
  const { setUser, setIsLoggedIn } = useContext(UserContext);

  // 入力フォームの状態管理
  const [email, setEmail] = useState(""); // メールアドレス
  const [password, setPassword] = useState(""); // パスワード
  const [error, setError] = useState(""); // エラーメッセージ

  // 「ログイン」ボタンが押された時の処理
  const handleLogin = async () => {
    try {
      // APIにPOSTリクエストを送信
      const response = await axios.post(
        `${API_BASE}/auth/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true, // Cookieを含める設定（JWTなど）
        }
      );

      // レスポンスからユーザーデータを取り出す
      const userData = {
        userId: response.data.userId,
        email: response.data.email,
        role: response.data.role, // caregiver または customer
      };

      // Contextにユーザー情報を保存
      setUser(userData);
      setIsLoggedIn(true);

      // モーダルを閉じる
      onClose();

      // 親にユーザーデータを渡して遷移処理を任せる
      onSuccess(userData);
    } catch (err) {
      // エラー処理
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("予期しないエラーが発生しました。");
      }
    }
  };

  // モーダルの背景をクリックしたら閉じる処理
  const handleBackgroundClick = (e) => {
    if (e.target.classList.contains("modal_background")) {
      onClose();
    }
  };

  return (
    <div className="modal_background" onClick={handleBackgroundClick}>
      <div className="modal_content">
        <h3>ログイン</h3>

        {/* エラーメッセージ表示 */}
        {error && <p className="error">{error}</p>}

        {/* メールアドレス入力 */}
        <input
          className="login_input"
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* パスワード入力 */}
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
