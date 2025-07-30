import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

// 介護士の予約スケジュールページ
export default function CaregiverSchedule() {
  const { user } = useContext(UserContext);
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    if (user?.role === "caregiver") {
      axios
        .get(`https://localhost:7184/api/schedule/${user.userId}`)
        .then((res) => setSchedules(res.data))
        .catch((err) => console.error("スケジュールの取得に失敗:", err));
    }
  }, [user]);

  if (!user || user.role !== "caregiver") {
    return <p>介護士としてログインしてください。</p>;
  }

  return (
    <div>
      <h2>介護士スケジュール一覧</h2>
      <ul>
        {schedules.map((s, i) => (
          <li key={i}>
            {new Date(s.startDateTime).toLocaleString()} ～{" "}
            {new Date(s.endDateTime).toLocaleString()}
            <br />
            クライアントID: {s.clientId}
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}
