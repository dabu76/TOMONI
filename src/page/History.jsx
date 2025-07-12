import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function History() {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();
  const handleClickReservation = (reservation) => {
    navigate(`/reservation/${reservation.id}`, {
      state: { reservation }, // state로 reservation 객체 전달
    });
  };
  if (loading || !user) {
    return <p>ユーザー情報を読み込み中...</p>;
  }
  // 予約比較のための現在日時
  const now = new Date();
  // 今日の日付を取得
  const todayStr = now.toISOString().split("T")[0];
  // 今日の予約を抽出
  const todayReservations = user.reservations.filter((r) => {
    return r.startDateTime.startsWith(todayStr) && r.status !== "cancel";
  });
  // 未来の予約を抽出（現在時刻より後）
  const futureReservations = user.reservations.filter((f) => {
    const reservationTime = new Date(f.startDateTime);
    return reservationTime > now && f.status !== "cancel";
  });
  // 過去の予約を抽出（現在時刻より前）
  const pastReservations = user.reservations.filter((p) => {
    const reservationTime = new Date(p.startDateTime);
    return reservationTime < now && p.status !== "cancel";
  });
  // ISO形式の日付文字列を「MM月DD日 HH時MM分」形式に変換する関数
  function formatDateTime(isoString) {
    const formatDate = new Date(isoString);
    const month = formatDate.getMonth() + 1;
    const day = formatDate.getDate();
    const hours = String(formatDate.getHours()).padStart(2, "0");
    const minutes = String(formatDate.getMinutes()).padStart(2, "0");
    return `${month}月${day}日 ${hours}時${minutes}分`;
  }
  return (
    <div className="history_container">
      <h2>予約履歴ページ</h2>
      <div className="today_reserve">
        今日の予約内容
        <div className="reserve_list today">
          {todayReservations.length > 0 ? (
            <p
              className="pointer"
              onClick={() => handleClickReservation(user.reservations[i])}
            >
              {formatDateTime(todayReservations[0].startDateTime)}~
              {formatDateTime(todayReservations[0].endDateTime)}
            </p>
          ) : (
            <p>本日の予約はありません。</p>
          )}
        </div>
      </div>
      <div className="future_reserve">
        今後の予約予定
        {futureReservations.length > 0 ? (
          futureReservations.slice(0, 5).map((f, i) => (
            <div className="reserve_list" key={i}>
              <p
                className="pointer"
                onClick={() => handleClickReservation(user.reservations[i])}
              >
                {formatDateTime(f.startDateTime)}~
                {formatDateTime(f.endDateTime)}
              </p>
            </div>
          ))
        ) : (
          <p>今後の予約はありません。</p>
        )}
      </div>
      <div className="past_reserve">
        過去の予約履歴
        {pastReservations.length > 0 ? (
          pastReservations.slice(0, 5).map((p, i) => (
            <div className="reserve_list" key={i}>
              <p
                className="pointer"
                onClick={() => handleClickReservation(user.reservations[i])}
              >
                {formatDateTime(p.startDateTime)}~
                {formatDateTime(p.endDateTime)}
              </p>
            </div>
          ))
        ) : (
          <p>過去の予約履歴はありません。</p>
        )}
      </div>
    </div>
  );
}
