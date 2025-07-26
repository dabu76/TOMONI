import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ReservationDetail() {
  const { reservationId } = useParams();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7184/api/reservation/${reservationId}`
        );
        setReservation(response.data);
      } catch (err) {
        console.error("予約情報の取得に失敗:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [reservationId]);

  const formatted = (dateStr) => {
    const date = new Date(dateStr);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  };

  if (loading) return <p>読み込み中...</p>;
  if (!reservation) return <p>予約情報が見つかりません。</p>;

  return (
    <div className="reservation_container">
      <h2>予約詳細ページ</h2>
      <div className="reservation_info">
        <p>介護士: {reservation.caregiverName}</p>
        <p>
          日付: {formatted(reservation.startDateTime)} ～{" "}
          {formatted(reservation.endDateTime)}
        </p>
        <p>お願い内容: {reservation.message}</p>
        <p>合計金額: ¥{reservation.total.toLocaleString()}</p>
      </div>
    </div>
  );
}
