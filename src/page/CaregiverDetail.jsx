export default function CaregiverDetail() {
  // location経由で、選択された介護士のデータを取得
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);

  const caregiver = location.state?.caregiver;

  // データが存在しない場合のエラーメッセージ表示
  if (!caregiver) {
    return <p>介護士の情報が見つかりませんでした。</p>;
  }

  const handleReserveClick = () => {
    if (selectedDate) {
      const y = selectedDate.getFullYear();
      const m = selectedDate.getMonth() + 1;
      const d = selectedDate.getDate();
      const formatted = `${y}-${String(m).padStart(2, "0")}-${String(
        d
      ).padStart(2, "0")}`;

      console.log("Detailで補正された日付:", formatted);
      navigate(`/Reserve/${caregiver.id}`, {
        state: {
          caregiver,
          date: formatted,
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
                scheduleDates={caregiver.schedule.map((s) => s.date)}
                onDateChange={setSelectedDate}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 画面下中央に固定された「予約する」ボタン */}
      <button className="reservation" onClick={handleReserveClick}>
        予約する
      </button>
    </>
  );
}
