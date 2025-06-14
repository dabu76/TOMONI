import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useState } from "react";
import { ja } from "date-fns/locale";

// 介護士のスケジュールをカレンダーで可視化するコンポーネント
export default function Calender({
  scheduleDates,
  onDateChange,
  setIsReserve,
}) {
  // カレンダーの初期選択を無効にするため、値を null に設定
  const [value, setValue] = useState([null, null]);

  // 日付が変更されたときに実行される処理
  const handleChange = (newDate) => {
    // まだ範囲が選択されていない（片方だけ選択された）場合はそのまま反映
    if (!Array.isArray(newDate) || newDate.length !== 2) {
      setValue(newDate);
      onDateChange(newDate);
      return;
    }

    // 選択された日付の配列から開始日と終了日を取得
    const [start, end] = newDate;

    // 1日をミリ秒で定義（86400000ミリ秒）
    const oneDay = 1000 * 60 * 60 * 24;

    // 開始日を基準にしてループ用の日付オブジェクトを作成
    let current = new Date(start);

    // 登録されている予約日をSetに変換して高速検索できるようにする
    const scheduleSet = new Set(scheduleDates);

    // 選択範囲に予約済みの日が含まれているかどうかを判定するフラグ
    let conflict = false;

    // 開始日から終了日までを1日ずつ進めながら、予約日と重複しているか確認
    while (current <= end) {
      const formatted = current.toISOString().split("T")[0];
      if (scheduleSet.has(formatted)) {
        conflict = true;
        break;
      }
      current = new Date(current.getTime() + oneDay);
    }

    // 重複している予約日が含まれていた場合、警告を出して選択をリセット
    if (conflict) {
      alert(
        "選択範囲に予約済みの日付が含まれています。別の日を選択してください。"
      );
      setValue([null, null]);
      onDateChange([null, null]);
      setIsReserve(false);
    } else {
      // 問題がなければ選択範囲をそのまま反映
      setValue(newDate);
      onDateChange(newDate);
      setIsReserve(true);
    }
  };
  const handleReserve = () => {
    setIsReserve(false);
  };
  return (
    <div>
      <Calendar
        locale="ja"
        onChange={handleChange}
        value={value}
        onClickDay={handleReserve}
        selectRange={true}
        tileDisabled={({ date }) => {
          //今日の日数
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          // 表示日を yyyy-mm-dd 形式に変換
          const formatted = date.toISOString().split("T")[0];
          //昨日までの日はを計算
          const isBeforeToday = date < today;
          const isNotScheduled = scheduleDates.includes(formatted);
          // スケジュールに含まれていない日は選択不可に
          return isBeforeToday || isNotScheduled;
        }}
      />
    </div>
  );
}
