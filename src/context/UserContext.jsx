import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();
//グローバル変数生成
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("/data/user_profile.json").then((res) => {
      setUser(res.data);
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
