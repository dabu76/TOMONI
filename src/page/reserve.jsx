import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
export default function Reserve() {
  const { id } = useParams();
  const location = useLocation();
  const { caregiver, startDate, endDate } = location.state || {};
  let [beforetime, setBeforeTime] = useState("");
  let [aftertime, setAfterTime] = useState("");
  let [result, setResult] = useState(0);
  const [selectedRange, setSelectedRange] = useState(() => {
    if (!startDate || !endDate) return [null, null];
    return [new Date(startDate), new Date(endDate)];
  });
  //時給計算
  useEffect(() => {
    if (
      beforetime &&
      aftertime &&
      caregiver?.hourlyRate &&
      selectedRange[0] &&
      selectedRange[1]
    ) {
      const [startH, startM] = beforetime.split(":").map(Number);
      const [endH, endM] = aftertime.split(":").map(Number);

      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;
      const diffHours = (endMinutes - startMinutes) / 60;

      if (diffHours <= 0) {
        alert("終了時刻は開始時刻より後にしてください。");
        setAfterTime("");
        setResult(0);
        return;
      }

      // 日数を計算
      const oneDay = 1000 * 60 * 60 * 24;
      const diffDays =
        Math.ceil((selectedRange[1] - selectedRange[0]) / oneDay) + 1;

      const total = diffDays * diffHours * caregiver.hourlyRate;
      setResult(total);
    }
  }, [beforetime, aftertime, caregiver, selectedRange]);

  const handleReserve = () => {
    const format = (date) => date.toISOString().split("T")[0];

    if (!selectedRange[0]) {
      alert("日付を選択してください。");
      return;
    }

    const start = format(selectedRange[0]);
    const end = selectedRange[1] ? format(selectedRange[1]) : start;

    if (start === end) {
      alert(`${caregiver.name} さんで ${start} に予約されました！`);
    } else {
      alert(`${caregiver.name} さんで ${start} 〜 ${end} に予約されました！`);
    }
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
          selectRange={true}
          value={selectedRange}
          onChange={setSelectedRange}
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
