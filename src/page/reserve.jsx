import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
export default function Reserve() {
  const { id } = useParams();
  const location = useLocation();
  const { caregiver, date } = location.state || {};
  let [beforetime, setBeforeTime] = useState("");
  let [aftertime, setAfterTime] = useState("");
  let [result, setResult] = useState(0);
  useEffect(() => {
    if (beforetime && aftertime && caregiver?.hourlyRate) {
      const [startH, startM] = beforetime.split(":").map(Number);
      const [endH, endM] = aftertime.split(":").map(Number);

      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;
      const diffHours = (endMinutes - startMinutes) / 60;

      if (diffHours > 0) {
        setResult(diffHours * caregiver.hourlyRate);
      } else {
        alert("現在の時間が後の時間より大きいです");
        setAfterTime("");
        setResult("");
      }
    }
  }, [beforetime, aftertime, caregiver]);
  const [selectedDate, setSelectedDate] = useState(() => {
    if (!date) return null;

    const [y, m, d] = date.split("-").map(Number);
    const constructedDate = new Date(y, m - 1, d, 12); //  UTC影響を避けるため12時に設定
    return constructedDate;
  });
  const handleReserve = () => {
    if (!selectedDate) {
      alert("日付を選択してください。");
      return;
    }

    const formatted = selectedDate.toISOString().split("T")[0];
    alert(`${caregiver.name} さんで ${formatted} に予約されました！`);
    // 実際の予約API呼び出しはここに記述
  };

  return (
    <div className="reserve_page">
      <h2>予約ページ</h2>
      <div className="reserve_time">
        <input
          type="time"
          onChange={(e) => setBeforeTime(e.target.value)}
          className="reserve_time_now"
        />
        ~
        <input
          type="time"
          value={aftertime}
          onChange={(e) => setAfterTime(e.target.value)}
          className="reserve_time_after"
        />
      </div>
      <p>合計金額: ¥{result}</p>

      {/* 日付選択（すでに選択されていれば反映） */}
      <div className="calendar_area">
        <p>日付を選択してください:</p>
        <Calendar
          locale="ja"
          value={selectedDate}
          onChange={setSelectedDate}
          tileDisabled={({ date }) => {
            const formatted = date.toISOString().split("T")[0];
            return caregiver.schedule.map((s) => s.date).includes(formatted);
          }}
        />
      </div>
      {/* 予約確定ボタン */}
      <button onClick={handleReserve}>予約を確定する</button>
    </div>
  );
}
