import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function ReservationComplete() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.state) {
      alert("不正なアクセスです。トップページに戻ります。");
      navigate("/");
    }
  }, [location, navigate]);

  if (!location.state) return null;

  const { caregiverName, dateRange, total } = location.state;

  return (
    <div className="reservation_Container">
      <div className="reservation_title">
        <h2>予約完了</h2>
      </div>
      <div className="reservation_body">
        <div className="reservation_info">{location.state.caregiverName}</div>
        <div className="reservation_time"></div>
      </div>
    </div>
  );
}
