import { useContext, useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { UserContext } from "../context/UserContext";

export default function Reserve() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { caregiver, startDate, endDate } = location.state || {};
  const { user } = useContext(UserContext);

  console.log("👤 user:", user);
  console.log("✅ user.userId:", user?.userId);

  const [beforetime, setBeforeTime] = useState("");
  const [aftertime, setAfterTime] = useState("");
  const [result, setResult] = useState(0);
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedRange, setSelectedRange] = useState(() => {
    if (!startDate || !endDate) return [null, null];
    return [new Date(startDate), new Date(endDate)];
  });
  const [additionalRequest, setAdditionalRequest] = useState("");
  const isReserveDisabled = !beforetime || !aftertime;

  const [matchingRequest, setMatchingRequest] = useState(null);

  useEffect(() => {
    if (user && caregiver) {
      setMatchingRequest({
        id: 0,
        clientId: user.userId, // 여기 수정
        caregiverId: caregiver.id,
        message: user.notes,
        additionalRequest,
        status: "pending",
      });
    }
  }, [user, caregiver, additionalRequest]);

  useEffect(() => {
    if (
      beforetime &&
      aftertime &&
      caregiver?.hourlyRate &&
      selectedRange[0] &&
      selectedRange[1]
    ) {
      const [startH, startM] = beforetime.split(":").map(Number);
      const start = new Date(selectedRange[0]);
      start.setHours(startH, startM, 0, 0);

      const [endH, endM] = aftertime.split(":").map(Number);
      const end = new Date(selectedRange[1]);
      end.setHours(endH, endM, 0, 0);

      if (end <= start) {
        alert("終了時刻は開始より後にしてください。");
        setAfterTime("");
        setResult(0);
        return;
      }

      const diffMs = end - start;
      const diffHours = diffMs / (1000 * 60 * 60);
      const total = Math.round(diffHours * caregiver.hourlyRate);
      setResult(total);
    }
  }, [beforetime, aftertime, caregiver, selectedRange]);

  const handleReserve = () => {
    const format = (date) => date.toISOString().split("T")[0];

    if (!selectedRange[0]) {
      setErrorMessage("日付を選択してください。");
      return;
    }
    if (!beforetime || !aftertime) {
      setErrorMessage("時間を選択してください。");
      return;
    }

    setErrorMessage("");

    const [startH, startM] = beforetime.split(":").map(Number);
    const [endH, endM] = aftertime.split(":").map(Number);
    const start = new Date(selectedRange[0]);
    start.setHours(startH, startM, 0, 0);
    const end = new Date(selectedRange[1]);
    end.setHours(endH, endM, 0, 0);

    const dateTextStart = format(start);
    const dateTextEnd = format(end);

    alert(
      `${caregiver.name} さんで ${dateTextStart} 〜 ${dateTextEnd} に予約されました！`
    );

    console.log("📦 Navigate with:", {
      caregiver,
      Total: result,
      matchingRequest,
      startDateTime: start.toISOString(),
      endDateTime: end.toISOString(),
      userId: user.userId,
    });

    navigate("/ReservationComplete", {
      state: {
        caregiver,
        Total: result,
        matchingRequest,
        startDateTime: start.toISOString(),
        endDateTime: end.toISOString(),
        userId: user.userId,
      },
    });
  };

  return (
    <div className="reserve_page">
      <h2>予約ページ</h2>
      {errorMessage && <p className="error_message">{errorMessage}</p>}
      <div className="reserve_time">
        <div>
          <div>開始時間</div>
          <input
            type="time"
            onChange={(e) => setBeforeTime(e.target.value)}
            className="reserve_time_now"
          />
        </div>

        <div>
          <div>終了時間</div>
          ~
          <input
            type="time"
            value={aftertime}
            onChange={(e) => setAfterTime(e.target.value)}
            className="reserve_time_after"
          />
        </div>
      </div>
      <p>合計金額: ¥{result}</p>

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

        <div className="reserve_memo_area">
          <h5>特記事項・希望など（任意）</h5>
          <input
            className="reserve_memo"
            type="text"
            placeholder="例)ペットにアレルギー"
            value={additionalRequest}
            onChange={(e) => setAdditionalRequest(e.target.value)}
          />
        </div>
      </div>

      <button
        className="reserve_Btn"
        onClick={handleReserve}
        disabled={isReserveDisabled}
      >
        予約を確定する
      </button>
    </div>
  );
}
