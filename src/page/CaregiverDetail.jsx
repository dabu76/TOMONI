import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import Calender from "../components/Calender";

export default function CaregiverDetail() {
  // location経由で、選択された介護士のデータを取得
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);

  const caregiver = location.state?.caregiver;

  // データが無い場合のエラー表示
  if (!caregiver) {
    return <p>介護士の情報が見つかりませんでした。</p>;
  }
  const handleReserveClick = () => {
    navigate("/reservation", {
      state: {
        caregiver,
        date: selectedDate ? selectedDate.toISOString().split("T")[0] : null,
      },
    });
  };
  return (
    <>
      <div className="container2">
        {/* 介護士の写真表示 */}
        <div className="caregiver_picture">
          <img src={caregiver.image || "/placeholder-image.png"} />
          <h2 className="caregiver_name">{caregiver.name}</h2>
        </div>

        {/* 詳細情報（言語、紹介文、カレンダー） */}
        <div className="content">
          <div className="content_right">
            <div className="content_introduce">
              <p> 対応言語: {caregiver.languages?.join(" / ") || "情報なし"}</p>
              <p>自己紹介: {caregiver.profile || "紹介文なし"}</p>
            </div>
            <div className="content_calender">
              {/* カレンダーに対応可能な日程を渡す */}
              <Calender
                scheduleDates={caregiver.schedule.map((s) => s.date)}
                onDateChange={setSelectedDate}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 画面下中央の固定「予約する」ボタン */}
      <button className="reservation" onClick={handleReserveClick}>
        予約する
      </button>
    </>
  );
}
