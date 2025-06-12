import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Calender from "../components/Calender";

export default function CaregiverDetail() {
  // location経由で、選択された介護士のデータを取得
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedRange, setSelectedRange] = useState([null, null]);

  const caregiver = location.state?.caregiver;
  // データが存在しない場合のエラーメッセージ表示
  if (!caregiver) {
    return <p>介護士の情報が見つかりませんでした。</p>;
  }

  // 「予約する」ボタンをクリックしたときの処理
  const handleReserveClick = () => {
    const format = (date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")}`;

    if (selectedRange[0] && selectedRange[1]) {
      //日付の2つとも選択された場合→期間予約
      navigate(`/Reserve/${caregiver.id}`, {
        state: {
          caregiver,
          startDate: format(selectedRange[0]),
          endDate: format(selectedRange[1]),
        },
      });
    } else if (selectedRange[0]) {
      //日付1つだけ選択された場合 → 単一予約

      const formatted = format(selectedRange[0]);
      navigate(`/Reserve/${caregiver.id}`, {
        state: {
          caregiver,
          startDate: formatted,
        },
      });
    } else {
      //日付を選択していない場合 → そのまま進む
      navigate(`/Reserve/${caregiver.id}`, {
        state: {
          caregiver,
        },
      });
    }
  };
  return (
    <>
      <div className="container2">
        {/* 介護士のプロフィール画像と名前 */}
        <div className="caregiver_picture">
          <img src={caregiver.image || "/placeholder-image.png"} />
          <h2 className="caregiver_name">{caregiver.name}</h2>
        </div>

        {/* 詳細情報（対応言語、紹介文、カレンダー） */}
        <div className="content">
          <div className="content_right">
            <div className="content_introduce">
              <p>対応言語: {caregiver.languages?.join(" / ") || "情報なし"}</p>
              <p>自己紹介: {caregiver.profile || "紹介文なし"}</p>
            </div>
            <div className="content_calender">
              {/* カレンダー：予約可能な日付を渡す */}
              <Calender
                selectRange={true}
                scheduleDates={caregiver.schedule.map((s) => s.date)}
                onDateChange={setSelectedRange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 画面下中央に固定された「予約する」ボタン */}
      <button
        className="reservation"
        onClick={handleReserveClick}
        disabled={!selectedRange[0]}
      >
        予約する
      </button>
    </>
  );
}
