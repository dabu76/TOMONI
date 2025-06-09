import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useState } from "react";
import { ja } from "date-fns/locale";

// 介護士のスケジュールをカレンダーで可視化するコンポーネント
export default function Calender({ scheduleDates }) {
  const [value, setValue] = useState(new Date());
  // 選択された日付を親コンポーネントに渡す
  const handleChange = (newDate) => {
    setValue(newDate);
    onDateChange(newDate);
  };
  return (
    <div>
      <Calendar
        locale="ja"
        onChange={handleChange}
        value={value}
        tileDisabled={({ date }) => {
          // 表示日を yyyy-mm-dd 形式に変換
          const formatted = date.toISOString().split("T")[0];
          // スケジュールに含まれていない日は選択不可に
          return scheduleDates.includes(formatted);
        }}
      />
    </div>
  );
}
