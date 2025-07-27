import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// ユーザーのマイページ画面
export default function MyPage() {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false); // 編集モードの切り替え
  const [editedUser, setEditedUser] = useState(null); // 編集中のユーザー情報
  const [newMed, setNewMed] = useState({ name: "", time: "", alarm: false }); // 新規追加する薬

  // 未ログインの場合はアラートを表示してトップページにリダイレクト
  useEffect(() => {
    if (!loading && !user) {
      alert("ログインが必要です。");
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  // 初回マウント時またはuser変更時に薬情報も含めてロード
  useEffect(() => {
    if (user) {
      setEditedUser({
        ...user,
        medicines: [],
      });
      fetchMedicines(user);
    }
  }, [user]);

  const fetchMedicines = async (userData) => {
    try {
      const response = await axios.get(
        "https://localhost:7184/api/user/medicines",
        {
          withCredentials: true,
        }
      );
      const medicines = response.data || [];
      setEditedUser((prevUser) => ({
        ...prevUser,
        medicines: medicines.map((med) => ({
          id: med.id,
          name: med.name,
          time: med.time,
          alarm: med.alarm,
        })),
      }));
    } catch (err) {
      setEditedUser((prevUser) => ({
        ...prevUser,
        medicines: [],
      }));
    }
  };

  const handleRemoveMedicine = (idToRemove) => {
    const updatedMedicines = editedUser.medicines.filter(
      (med) => med.id !== idToRemove
    );
    setEditedUser({ ...editedUser, medicines: updatedMedicines });
    alert("薬が削除されました。保存ボタンを押してください。");
  };

  const handleSave = async () => {
    let finalMedicines = [...editedUser.medicines];

    if (newMed.name && newMed.time) {
      finalMedicines = [...finalMedicines, { ...newMed, id: 0 }];
      setNewMed({ name: "", time: "", alarm: false });
    }

    const payload = {
      name: editedUser.name,
      age: Number(editedUser.age),
      disease: editedUser.disease,
      notes: editedUser.notes,
      medicines: finalMedicines,
    };

    try {
      await axios.put("https://localhost:7184/api/user/update", payload, {
        withCredentials: true,
      });
      setIsEditing(false);
      fetchMedicines(user);
      alert("プロフィールが更新されました！");
    } catch (err) {
      alert("プロフィールの更新に失敗しました。");
    }
  };

  if (loading || !editedUser) {
    return <p>読み込み中...</p>;
  }

  return (
    <div className="mypage_container">
      <h2>マイページ</h2>

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
            <strong>年齢:</strong>{" "}
            {isEditing ? (
              <input
                type="number"
                value={editedUser.age}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, age: e.target.value })
                }
              />
            ) : (
              `${editedUser.age}歳`
            )}
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
    </div>
  );
}
