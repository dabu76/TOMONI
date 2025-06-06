import { useState } from "react";
import { useSignupValidation } from "../hooks/useSignupValidation";

export default function Signup() {
  // 入力状態・エラーメッセージ・バリデーション関数をフックから取得
  const {
    email,
    setEmail,
    password,
    setPassword,
    passwordConfirm,
    setPasswordConfirm,
    errors,
    validate,
    validateField,
  } = useSignupValidation();

  const [sentCode, setSentCode] = useState(null); // 生成された認証コード
  const [isVerified, setIsVerified] = useState(false); // 認証完了フラグ
  const [showCodeInput, setShowCodeInput] = useState(false); // 認証コード入力欄表示フラグ
  const [authCode, setAuthCode] = useState(""); // ユーザーが入力した認証コード
  const [showPassword, setShowPassword] = useState(false); // パスワード表示切替

  // フォーム送信時の処理（バリデーション＋認証チェック）
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isVerified) {
      alert("メール認証を完了してください。");
      return;
    }

    if (validate()) {
      alert("登録成功！");
      window.location.href = "/"; // または "/index"
    }
  };

  // 認証コード送信処理
  const handleSendVerification = () => {
    const code = Math.floor(100000 + Math.random() * 900000); // 6桁の乱数
    console.log("認証コード:", code);
    setSentCode(code.toString());
    setShowCodeInput(true);
    setIsVerified(false); // 新しく送信された場合はリセット
  };

  // 認証コード確認処理
  const handleVerifyCode = () => {
    if (authCode === sentCode) {
      alert("認証完了！");
      setIsVerified(true);
    } else {
      alert("認証コードが違います。");
      setIsVerified(false);
    }
  };

  return (
    <div className="login_background">
      <div className="login_container">
        <h2 className="sign_header">サインイン</h2>

        {/* メールアドレス入力欄 */}
        <label htmlFor="email">メールアドレス</label>
        <div className="email_confirm">
          <input
            type="email"
            className="email"
            placeholder="例）example@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => validateField("email")}
          />
          <button
            type="button"
            className="send_verification"
            onClick={handleSendVerification}
          >
            送信
          </button>
        </div>
        {errors.email && <p className="error">{errors.email}</p>}

        {/* 認証コード入力欄（条件付き表示） */}
        {showCodeInput && (
          <div className="input_group">
            <label htmlFor="authCode">認証コード</label>
            <div className="auth_code_row">
              <input
                type="text"
                className="auth_code"
                placeholder="コードを入力してください"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
              />
              <button
                className="auth_btn"
                type="button"
                onClick={handleVerifyCode}
              >
                確認
              </button>
            </div>
          </div>
        )}

        {/* パスワード入力欄 */}
        <label htmlFor="password">パスワード</label>
        <div className="input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            className="password"
            placeholder="パスワードを入力してください"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => validateField("password")}
          />
          <p
            className="toggle"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "🙈" : "👁"}
          </p>
        </div>
        {errors.password && <p className="error">{errors.password}</p>}

        {/* パスワード確認入力欄 */}
        <label htmlFor="password_confirm">パスワード（確認用）</label>
        <input
          type="password"
          className="password_confirm"
          placeholder="もう一度パスワードを入力してください"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          onBlur={() => validateField("passwordConfirm")}
        />
        {errors.passwordConfirm && (
          <p className="error">{errors.passwordConfirm}</p>
        )}

        {/* 登録ボタン */}
        <button className="signup" onClick={handleSubmit}>
          登録する
        </button>
      </div>
    </div>
  );
}
