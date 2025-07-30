import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

export default function ReservationComplete() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    caregiver,
    Total,
    matchingRequest,
    startDateTime,
    endDateTime,
    userId,
  } = location.state || {};

  useEffect(() => {
    if (!caregiver || !userId || !startDateTime || !endDateTime) {
      alert("不正なアクセスです。トップページに戻ります。");
      navigate("/");
      return;
    }

    console.log(" Reservation Data to Send:");
    console.log("caregiverId:", caregiver.id);
    console.log("userId:", userId);
    console.log("startDateTime:", startDateTime);
    console.log("endDateTime:", endDateTime);
    console.log("total:", Total);
    console.log("message:", matchingRequest?.message);
    console.log("additionalRequest:", matchingRequest?.additionalRequest);

    const saveReservation = async () => {
      try {
        const response = await axios.post(
          "https://localhost:7184/api/reservation",
          {
            caregiverId: caregiver.id,
            clientId: Number(userId),
            startDateTime: new Date(startDateTime).toISOString(),
            endDateTime: new Date(endDateTime).toISOString(),
            total: Number(Total) || 0,
            message: matchingRequest?.message || "",
            additionalRequest: matchingRequest?.additionalRequest || "",
            status: "confirmed",
          }
        );

        console.log(" 予約情報が保存されました:", response.data);
      } catch (err) {
        console.error(" 予約情報の保存に失敗:", err);
        alert("予約情報の保存に失敗しました。");
        navigate("/");
      }
    };

    saveReservation();
  }, []);

  return (
    <div className="reservation_Container">
      <div className="reservation_title">
        <h2>予約が完了しました！</h2>
      </div>
      <div className="reservation_body">
        <h3>予約内容</h3>
        <p>
          <strong>介護士名：</strong> {caregiver?.name}
        </p>
        <p>
          <strong>プロフィール：</strong> {caregiver?.profile}
        </p>
        <p>
          <strong>言語：</strong> {caregiver?.languages?.join(" / ")}
        </p>
        <p>
          <strong>対応エリア：</strong> {caregiver?.city}
        </p>
        <p>
          <strong>予約日時：</strong> {startDateTime} 〜 {endDateTime}
        </p>
        <p>
          <strong>金額：</strong> ¥{Total?.toLocaleString()}
        </p>
      </div>
      <div className="reservation_message">
        <h3>登録された利用者情報</h3>
        <p>{matchingRequest?.message || "（情報なし）"}</p>
      </div>
      {matchingRequest?.additionalRequest && (
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
