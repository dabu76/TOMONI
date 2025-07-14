import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();
//グローバル変数生成
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/data/user_profile.json")
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.error("ユーザー情報の取得に失敗しました。", err);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
