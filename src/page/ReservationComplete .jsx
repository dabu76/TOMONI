import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function ReservationComplete() {
  const location = useLocation();
  const navigate = useNavigate();

  // 不正アクセス防止
  useEffect(() => {
    if (!location.state) {
      alert("不正なアクセスです。トップページに戻ります。");
      navigate("/");
    }
  }, [location, navigate]);

  const {
    caregiverName,
    dateRange,
    total,
    matchingRequest,
    startDateTime,
    endDateTime,
  } = location.state;

  // 午前・午後 時間 포맷
  const formatWithAmPm = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const isAm = hours < 12;
    const hour12 = hours % 12 === 0 ? 12 : hours % 12;
    const ampm = isAm ? "午前" : "午後";
    return `${ampm}${hour12}:${minutes}`;
  };

  // 전체 포맷: X月X日 午前X:XX
  const formatFullDateTime = (date) => {
    return `${date.getMonth() + 1}月${date.getDate()}日 ${formatWithAmPm(
      date
    )}`;
  };

  const start = new Date(startDateTime);
  const end = new Date(endDateTime);

  return (
    <div className="reservation_Container">
      <div className="reservation_title">
        <h2>予約が完了しました！</h2>
      </div>

      <div className="reservation_body">
        <h3>予約内容</h3>
        <p>
          <strong>介護士名：</strong> {caregiverName}
        </p>
        <p>
          <strong>予約日時：</strong> {formatFullDateTime(start)} 〜{" "}
          {formatFullDateTime(end)}
        </p>
        <p>
          <strong>金額：</strong> ¥{total.toLocaleString()}
        </p>
      </div>

      <div className="reservation_message">
        <h3>登録された利用者情報</h3>
        <p>{matchingRequest.message || "（情報なし）"}</p>
      </div>

      {matchingRequest.additionalRequest && (
        <div className="reservation_note">
          <h3>追加のお願い・特記事項</h3>
          <p>{matchingRequest.additionalRequest}</p>
        </div>
      )}
      <button className="reservation_btn" onClick={() => navigate("/")}>
        ホームに戻る
      </button>
    </div>
  );
}
