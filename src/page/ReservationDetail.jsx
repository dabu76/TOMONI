// ReservationDetail.jsx
import { useLocation } from "react-router-dom";

export default function ReservationDetail() {
  const location = useLocation(); // `location.state`から渡されたデータを取得
  const { reservation } = location.state || {}; // reservationのデータを取り出す
  console.log(reservation);

  // 日付と時刻を「YYYY-MM-DD HH:mm」形式にフォーマットする関数
  function formatted(dateStr) {
    const date = new Date(dateStr);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  }

  if (!reservation) {
    return <p>予約情報が見つかりません。</p>; // reservationが存在しない場合のエラーメッセージ
  }

  return (
    <div className="reservation_container">
      <h2>予約詳細ページ</h2>
      <div className="reservation_info">
        <p>介護士: {reservation.caregiverId}</p>
        <p>
          日付: {formatted(reservation.startDateTime)} ～{" "}
          {formatted(reservation.endDateTime)}
        </p>
        <p>お願い内容: {reservation.message}</p>
        <p>合計金額: {reservation.total}</p>
      </div>
    </div>
  );
}
