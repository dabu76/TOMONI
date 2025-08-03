import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

// 介護士の予約スケジュールページ
export default function CaregiverSchedule() {
  const { user } = useContext(UserContext);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  // ステータスのラベル
  const statusLabels = {
    pending: "承認待ち",
    confirmed: "承認済み",
    canceled: "キャンセル済み",
  };

  const getStatusLabel = (status) => {
    return statusLabels[status] || "不明";
  };

  // スケジュールの取得
  const fetchSchedules = () => {
    if (user?.role === "caregiver") {
      axios
        .get(`https://localhost:7184/api/schedule/${user.userId}`)
        .then((res) => setSchedules(res.data))
        .catch((err) => console.error("スケジュールの取得に失敗:", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  };

  // 予約キャンセル処理（確認付き）
  const handleCancel = async (scheduleId) => {
    if (!window.confirm("本当にこの予約をキャンセルしますか？")) return;

    try {
      await axios.put(
        `https://localhost:7184/api/schedule/${scheduleId}/cancel`
      );
      alert("スケジュールをキャンセルしました。");
      fetchSchedules(); // キャンセル後に再取得
    } catch (err) {
      console.error("キャンセルに失敗しました:", err);
      alert("キャンセルに失敗しました。");
    }
  };

  // 予約承認処理（確認付き）
  const handleConfirm = async (scheduleId) => {
    if (!window.confirm("この予約を承認しますか？")) return;

    try {
      await axios.put(
        `https://localhost:7184/api/schedule/${scheduleId}/confirm`
      );
      alert("スケジュールを承認しました。");
      fetchSchedules(); // 承認後に再取得
    } catch (err) {
      console.error("承認に失敗しました:", err);
      alert("承認に失敗しました。");
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [user]);

  if (loading) return <p>読み込み中...</p>;
  if (!user || user.role !== "caregiver") {
    return <p>介護士としてログインしてください。</p>;
  }

  return (
    <div className="caregiver_container">
      <div className="caregiver_header">
        <h2>介護士スケジュール一覧</h2>
      </div>

      {schedules.length === 0 ? (
        <p>現在、登録されたスケジュールはありません。</p>
      ) : (
        <ul className="pending_list">
          {schedules.map((s, i) => (
            <li key={i}>
              {/* 日時情報 */}
              {new Date(s.startDateTime).toLocaleString()} ～{" "}
              {new Date(s.endDateTime).toLocaleString()}
              <br />
              クライアントID: {s.clientId}
              <br />
              予約状況: {getStatusLabel(s.status)}
              <br />
              {/* 状態別のボタン・表示 */}
              {(() => {
                if (s.status === "pending") {
                  return (
                    <div>
                      <button
                        className="caregiverBtn"
                        onClick={() => handleConfirm(s.id)}
                      >
                        承認する
                      </button>
                      <button
                        className="caregiverBtn"
                        onClick={() => handleCancel(s.id)}
                      >
                        取り消す
                      </button>
                    </div>
                  );
                } else if (s.status === "confirmed") {
                  return (
                    <button onClick={() => handleCancel(s.id)}>取り消す</button>
                  );
                } else if (s.status === "canceled") {
                  return (
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      キャンセル済み
                    </span>
                  );
                }
              })()}
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
