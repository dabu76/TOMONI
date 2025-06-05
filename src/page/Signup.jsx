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
  } = useSignupValidation();

  // フォーム送信時の処理（バリデーションチェック）
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert("登録成功！");
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
          />
          <button className="send_verification">送信</button>
        </div>
        {errors.email && <p className="error">{errors.email}</p>}

        {/* パスワード入力欄 */}
        <label htmlFor="password">パスワード</label>
        <input
          type="password"
          className="password"
          placeholder="パスワードを入力してください"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p className="error">{errors.password}</p>}

        {/* パスワード確認欄 */}
        <label htmlFor="password_confirm">パスワード（確認用）</label>
        <input
          type="password"
          className="password_confirm"
          placeholder="もう一度パスワードを入力してください"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
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
