import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";

// ユーザーのマイページを表示・編集するコンポーネント
export default function MyPage() {
  // グローバルユーザー情報とローディング状態をコンテキストから取得
  const { user, loading } = useContext(UserContext);

  // 編集モードかどうかの状態
  const [isEditing, setIsEditing] = useState(false);

  // 編集用にローカルで保持するユーザーデータ
  const [editedUser, setEditedUser] = useState(null);

  // 保存ボタンを押したときの処理
  const handleSave = async () => {
    const payload = {
      id: editedUser.id ?? 0, // IDがnullの場合は0を設定
      userId: editedUser.userId ?? 0,
      name: editedUser.name,
      age: Number(editedUser.age), // 年齢を数値に変換
      disease: editedUser.disease,
      notes: editedUser.notes,
      medicines: (editedUser.medicines || []).map((med) => ({
        name: med.name,
        time: med.time,
        alarm: med.alarm,
      })),
    };
    try {
      // PUTリクエストでサーバーに変更を送信
      await axios.put("https://localhost:7184/api/user/update", payload, {
        withCredentials: true,
      });
      console.log("更新成功");

      // 編集モードを終了する
      setIsEditing(false);

      // 編集データを最新状態に再設定する（再レンダリングのため）
      setEditedUser({ ...editedUser });
    } catch (err) {
      console.error("更新失敗:", err);
    }
  };

  // user が変更されたときに editedUser を初期化
  useEffect(() => {
    if (user) {
      setEditedUser({ ...user });
    }
  }, [user]);

  // ローディング中またはユーザー情報がまだ設定されていない場合はローディング表示
  if (loading || !editedUser) return <p>読み込み中...</p>;

  return (
    <div className="mypage_container">
      <h2>マイページ</h2>

      {/* 基本情報セクション */}
      <div className="profile-section">
        <h3>基本情報</h3>
        <ul className="no-bullets">
          <li>
            <strong>名前:</strong>{" "}
            {isEditing ? (
              <input
                value={editedUser.name}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, name: e.target.value })
                }
              />
            ) : (
              editedUser.name
            )}
          </li>
          <li>
            <strong>年齢:</strong> {editedUser.age}歳
          </li>
          <li>
            <strong>疾患:</strong>{" "}
            {isEditing ? (
              <input
                value={editedUser.disease}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, disease: e.target.value })
                }
              />
            ) : (
              editedUser.disease
            )}
          </li>
          <li>
            <strong>メモ:</strong>{" "}
            {isEditing ? (
              <textarea
                value={editedUser.notes}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, notes: e.target.value })
                }
              />
            ) : (
              editedUser.notes
            )}
          </li>
        </ul>
      </div>

      {/* 服薬情報セクション */}
      <div className="medicine-section">
        <h3>服薬情報</h3>
        {editedUser.medicines && editedUser.medicines.length > 0 ? (
          <ul className="no-bullets">
            {editedUser.medicines.map((med, idx) => (
              <li key={idx}>
                {isEditing ? (
                  <>
                    {/* 薬の名前と時間を編集可能 */}
                    <input
                      value={med.name}
                      onChange={(e) => {
                        const newMeds = [...editedUser.medicines];
                        newMeds[idx].name = e.target.value;
                        setEditedUser({ ...editedUser, medicines: newMeds });
                      }}
                    />
                    <input
                      type="time"
                      value={med.time}
                      onChange={(e) => {
                        const newMeds = [...editedUser.medicines];
                        newMeds[idx].time = e.target.value;
                        setEditedUser({ ...editedUser, medicines: newMeds });
                      }}
                    />
                  </>
                ) : (
                  <>
                    {med.name} を {med.time} に服用
                  </>
                )}
                {/* アラームのオンオフ切替ボタン */}
                <label style={{ marginLeft: "10px" }}>
                  アラーム:
                  <button
                    className="tg_button"
                    onClick={() => {
                      const newMeds = [...editedUser.medicines];
                      newMeds[idx].alarm = !newMeds[idx].alarm;
                      setEditedUser({ ...editedUser, medicines: newMeds });
                    }}
                  >
                    {med.alarm ? "あり" : "なし"}
                  </button>
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <p>服薬情報がありません。</p>
        )}
      </div>

      {/* 修正・保存ボタン */}
      <div className="modify_button">
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)}>修正</button>
        ) : (
          <button onClick={handleSave}>保存</button>
        )}
      </div>
    </div>
  );
}
