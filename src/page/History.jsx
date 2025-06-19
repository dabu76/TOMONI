import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function History() {
  const { user, loading } = useContext(UserContext);
  if (loading || !user) {
    return <p>ユーザー情報を読み込み中...</p>;
  }
  //예약 비교를 위한 날짜변수
  const now = new Date();
  //오늘날짜 가져오기
  const todayStr = now.toISOString().split("T")[0];
  //오늘예약변수
  const todayReservations = user.reservations.filter((r) => {
    return r.startDateTime.startsWith(todayStr);
  });
  //미래예약변수
  const futureReservations = user.reservations.filter((f) => {
    const reservationTime = new Date(f.startDateTime);
    return reservationTime > now;
  });
  //과거 예약변수
  const pastReservations = user.reservations.filter((p) => {
    const reservationTime = new Date(p.startDateTime);
    return reservationTime < now;
  });
  function formatDateTime(isoString) {
    const formatDate = new Date(isoString);
    const month = formatDate.getMonth() + 1;
    const day = formatDate.getDate();
    const hours = String(formatDate.getHours()).padStart(2, "0");
    const minutes = String(formatDate.getMinutes()).padStart(2, "0");
    return `${month}月${day}日 ${hours}時${minutes}分`;
  }
  return (
    <div>
      <h2>予約履歴ページ</h2>
      오늘 예약
      <div className="today_reserve">
        {formatDateTime(todayReservations[0].startDateTime)}~
        {formatDateTime(todayReservations[0].endDateTime)}
      </div>
      <div className="future_reserve">
        미래의 예약
        {futureReservations.map((f, i) => (
          <p key={i}>
            {formatDateTime(f.startDateTime)}~{formatDateTime(f.endDateTime)}
          </p>
        ))}
      </div>
      <div className="past_reserve">
        과거의 예약
        {pastReservations.map((p, i) => (
          <p key={i}>
            {formatDateTime(p.startDateTime)}~{formatDateTime(p.endDateTime)}
          </p>
        ))}
      </div>
    </div>
  );
}
