// ReservationDetail.jsx
import { useLocation } from "react-router-dom";

export default function ReservationDetail() {
  const location = useLocation(); // `location.state`로 전달된 데이터 받기
  const { reservation } = location.state || {}; // reservation 데이터

  if (!reservation) {
    return <p>予約情報が見つかりません。</p>; // 만약 reservation이 없다면 에러 처리
  }

  return (
    <div>
      <h2>予約詳細ページ</h2>
      <p>介護士ID: {reservation.caregiverId}</p>
      <p>
        日付: {reservation.startDateTime} ～ {reservation.endDateTime}
      </p>
      {/* 필요한 예약 정보 바로 사용 */}
    </div>
  );
}
