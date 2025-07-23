import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// グローバルで共有するユーザー情報のコンテキストを作成
export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null); // ユーザー情報
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ログイン状態
  const [loading, setLoading] = useState(true); // ローディング状態

  // 初回マウント時にログイン状態をチェック
  useEffect(() => {
    axios
      .get("https://localhost:7184/api/auth/check", { withCredentials: true })
      .then((res) => {
        setUser({
          userId: res.data.userId,
          email: res.data.email,
          role: res.data.role,
          name: res.data.name,
          age: res.data.age,
          disease: res.data.disease,
          notes: res.data.notes,
          medicines: res.data.medicines,
        });
        setIsLoggedIn(true);
      })
      .catch(() => {
        setUser(null);
        setIsLoggedIn(false);
      })
      .finally(() => setLoading(false));
  }, []);

  // プロバイダーとしてコンテキストをアプリに供給
  return (
    <UserContext.Provider
      value={{ user, setUser, isLoggedIn, setIsLoggedIn, loading }}
    >
      {children}
    </UserContext.Provider>
  );
}
