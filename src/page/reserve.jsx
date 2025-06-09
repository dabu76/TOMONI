export default function Reserve() {
  const { id } = useParams();
  const location = useLocation();
  const { caregiver, date } = location.state || {};

  const [selectedDate, setSelectedDate] = useState(() => {
    if (!date) return null;

    const [y, m, d] = date.split("-").map(Number);
    const constructedDate = new Date(y, m - 1, d, 12); // ⏰ UTC影響を避けるため12時に設定
    console.log("Reserveで生成した日付:", constructedDate.toISOString());
    return constructedDate;
  });

  const handleReserve = () => {
    if (!selectedDate) {
      alert("日付を選択してください。");
      return;
    }

    const formatted = selectedDate.toISOString().split("T")[0];
    alert(`${caregiver.name} さんで ${formatted} に予約されました！`);
    // 実際の予約API呼び出しはここに記述
  };

  return (
    <div className="reserve_page">
      <h2>予約ページ</h2>

      {/* 介護士の基本情報 */}
      <div className="caregiver_summary">
        <img src={caregiver.image || "/placeholder-image.png"} width={120} />
        <h3>{caregiver.name}</h3>
      </div>

      {/* 日付選択（すでに選択されていれば反映） */}
      <div className="calendar_area">
        <p>日付を選択してください:</p>
        <Calendar
          locale="ja"
          value={selectedDate}
          onChange={setSelectedDate}
          tileDisabled={({ date }) => {
            const formatted = date.toISOString().split("T")[0];
            return caregiver.schedule.map((s) => s.date).includes(formatted);
          }}
        />
      </div>

      {/* 予約確定ボタン */}
      <button onClick={handleReserve}>予約を確定する</button>
    </div>
  );
}
