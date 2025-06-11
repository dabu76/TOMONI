import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useState } from "react";
import { ja } from "date-fns/locale";

// 介護士のスケジュールをカレンダーで可視化するコンポーネント
export default function Calender({ scheduleDates, onDateChange, selectRange }) {
  const [value, setValue] = useState(selectRange ? [null, null] : new Date());

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
        selectRange={selectRange}
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
