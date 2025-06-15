import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  //時給計算
  useEffect(() => {
    if (
      beforetime &&
      aftertime &&
      caregiver?.hourlyRate &&
      selectedRange[0] &&
      selectedRange[1]
    ) {
      // 開始日時を生成（選択された日付＋入力された時刻）
      const [startH, startM] = beforetime.split(":").map(Number);
      const startDateTime = new Date(selectedRange[0]);
      startDateTime.setHours(startH, startM, 0, 0);

      // 終了日時を生成（選択された日付＋入力された時刻）
      const [endH, endM] = aftertime.split(":").map(Number);
      const endDateTime = new Date(selectedRange[1]);
      endDateTime.setHours(endH, endM, 0, 0);

      // 終了が開始よりも前の場合、アラートを出して入力をリセット
      if (endDateTime <= startDateTime) {
        alert("終了時刻は開始より後にしてください。");
        setAfterTime("");
        setResult(0);
        return;
      }

      const diffMs = endDateTime - startDateTime;
      const diffHours = diffMs / (1000 * 60 * 60);

      const total = Math.round(diffHours * caregiver.hourlyRate);
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
    navigate("/reserve");
  };
  return (
    <div className="reserve_page">
      <h2>予約ページ</h2>
      <div className="reserve_time">
        <div>開始時間</div>
        <input
          type="time"
          onChange={(e) => setBeforeTime(e.target.value)}
          className="reserve_time_now"
        />
        <div>終了時間</div>
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
          onChange={(range) => {
            if (!Array.isArray(range) || range.length !== 2) {
              setSelectedRange(range);
              return;
            }

            const [start, end] = range;
            const oneDay = 1000 * 60 * 60 * 24;
            let current = new Date(start);
            const reservedDates = caregiver.schedule.map((s) => s.date);

            let overlapFound = false;
            while (current <= end) {
              const formatted = current.toISOString().split("T")[0];
              if (reservedDates.includes(formatted)) {
                overlapFound = true;
                break;
              }
              current = new Date(current.getTime() + oneDay);
            }

            if (overlapFound) {
              alert("選択範囲に既に予約されている日があります。");
              setSelectedRange([null, null]);
            } else {
              setSelectedRange(range);
            }
          }}
          tileDisabled={({ date }) => {
            const formatted = date.toISOString().split("T")[0];
            const isPast = date < new Date().setHours(0, 0, 0, 0);
            const isReserved = caregiver.schedule
              .map((s) => s.date)
              .includes(formatted);
            return isPast || isReserved;
          }}
        />
      </div>
      {/* 予約確定ボタン */}
      <button onClick={handleReserve}>予約を確定する</button>
    </div>
  );
}
