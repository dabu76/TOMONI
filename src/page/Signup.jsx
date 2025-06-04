export default function Signup() {
  return (
    <div className="login_background">
      <div className="login_container">
        <h2 className="sign_header">サインイン</h2>
        <label htmlFor="email">メールアドレス</label>
        <div className="email_confirm">
          <input
            type="email"
            className="email"
            placeholder="例）example@mail.com"
          />
          <button className="send_verification">送信</button>
        </div>
        <label htmlFor="password">パスワード</label>
        <input
          type="password"
          className="password"
          placeholder="パスワードを入力してください"
        />

        <label htmlFor="password_confirm">パスワード（確認用）</label>
        <input
          type="password"
          className="password_confirm"
          placeholder="もう一度パスワードを入力してください"
        />

        <button className="signup">登録する</button>
      </div>
    </div>
  );
}
