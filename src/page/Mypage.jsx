import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";

export default function MyPage() {
  const { user, loading } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);

  useEffect(() => {
    if (user) {
      setEditedUser({ ...user });
    }
  }, [user]);

  if (loading) return <p>読み込み中...</p>;
  if (!user || !editedUser) return <p>ログインしてください。</p>;

  return (
    <div className="mypage_container">
      <h2>マイページ</h2>

      <div className="profile-section">
        <h3>基本情報</h3>
        <ul className="no-bullets">
          <li>
            <strong>ユーザーID:</strong> {user.userId}
          </li>
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
              user.name
            )}
          </li>
          <li>
            <strong>年齢:</strong> {user.age}歳
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
              user.disease
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
              user.notes
            )}
          </li>
        </ul>
      </div>

      <div className="medicine-section">
        <h3>服薬情報</h3>
        {editedUser.medicines && editedUser.medicines.length > 0 ? (
          <ul className="no-bullets">
            {editedUser.medicines.map((med, idx) => (
              <li key={idx}>
                {isEditing ? (
                  <>
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

      <div className="modify_button">
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)}>修正</button>
        ) : (
          <button
            onClick={() => {
              setIsEditing(false);
            }}
          >
            保存
          </button>
        )}
      </div>
    </div>
  );
}
