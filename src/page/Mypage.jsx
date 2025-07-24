import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";

// ユーザーのマイページ画面
export default function MyPage() {
  const { user, loading } = useContext(UserContext);

  const [isEditing, setIsEditing] = useState(false); // 編集モードの切り替え
  const [editedUser, setEditedUser] = useState(null); // 編集中のユーザー情報
  const [newMed, setNewMed] = useState({ name: "", time: "", alarm: false }); // 新規追加する薬 (입력 필드 상태 관리용)

  // 初回マウント時またはuser変更時に薬情報も含めてロード
  useEffect(() => {
    if (user) {
      setEditedUser({
        ...user,
        medicines: [], // medicines 속성을 빈 배열로 미리 초기화
      });
      fetchMedicines(user); // 그 후에 약 정보 로드
    }
  }, [user]);

  // 薬情報を取得して、ユーザー情報と統合してstateに保存する
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

      console.log("薬情報ロード成功:", medicines);
    } catch (err) {
      console.error("薬情報ロード失敗:", err);
      setEditedUser((prevUser) => ({
        ...prevUser,
        medicines: [],
      }));
    }
  };

  // 약 삭제 핸들러
  const handleRemoveMedicine = (idToRemove) => {
    const updatedMedicines = editedUser.medicines.filter(
      (med) => med.id !== idToRemove
    );
    setEditedUser({ ...editedUser, medicines: updatedMedicines });
    console.log("薬削除後のmedicines:", updatedMedicines);
    alert("薬が削除されました。保存ボタンを押してください。"); // 사용자에게 저장 필요 알림
  };

  // 保存処理（PUTリクエストで更新）
  const handleSave = async () => {
    let finalMedicines = [...editedUser.medicines]; // 현재 editedUser의 약 목록을 복사

    // 새로운 약 정보가 입력되어 있다면 최종 목록에 추가
    if (newMed.name && newMed.time) {
      // 이름과 시간이 모두 입력되었을 때만 추가
      finalMedicines = [...finalMedicines, { ...newMed, id: 0 }]; // 새 약은 Id 0으로
      setNewMed({ name: "", time: "", alarm: false }); // 입력 필드 초기화
    }

    console.log("保存直前のmedicines:", finalMedicines); // 최종적으로 백엔드로 보낼 약 정보

    if (!editedUser || !finalMedicines) {
      // medicines가 이제 finalMedicines로 변경됨
      console.error("editedUserまたはmedicinesが存在しません");
      return;
    }

    const payload = {
      name: editedUser.name,
      age: Number(editedUser.age),
      disease: editedUser.disease,
      notes: editedUser.notes,
      medicines: finalMedicines, // <-- 최종 약 목록 사용
    };

    try {
      await axios.put("https://localhost:7184/api/user/update", payload, {
        withCredentials: true,
      });
      setIsEditing(false);
      fetchMedicines(user); // 재취득하여 최신 상태로 갱신
      alert("プロフィールが更新されました！");
    } catch (err) {
      console.error("更新失敗:", err);
      alert("プロフィールの更新に失敗しました。");
    }
  };

  // ローディング 또는 데이터 미취득 시 표시
  if (loading || !editedUser) {
    return <p>読み込み中...</p>;
  }

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

      {/* 薬情報セクション */}
      <div className="medicine-section">
        <h3>服薬情報</h3>
        {editedUser.medicines && editedUser.medicines.length > 0 ? (
          <ul className="no-bullets">
            {editedUser.medicines.map((med) => (
              <li key={med.id}>
                {isEditing ? (
                  <>
                    <input
                      value={med.name}
                      onChange={(e) => {
                        const newList = editedUser.medicines.map((item) =>
                          item.id === med.id
                            ? { ...item, name: e.target.value }
                            : item
                        );
                        setEditedUser({ ...editedUser, medicines: newList });
                      }}
                    />
                    <input
                      type="time"
                      value={med.time}
                      onChange={(e) => {
                        const newList = editedUser.medicines.map((item) =>
                          item.id === med.id
                            ? { ...item, time: e.target.value }
                            : item
                        );
                        setEditedUser({ ...editedUser, medicines: newList });
                      }}
                    />
                    <label>
                      アラーム:
                      <input
                        type="checkbox"
                        checked={med.alarm}
                        onChange={(e) => {
                          const newList = editedUser.medicines.map((item) =>
                            item.id === med.id
                              ? { ...item, alarm: e.target.checked }
                              : item
                          );
                          setEditedUser({ ...editedUser, medicines: newList });
                        }}
                      />
                    </label>
                    <button
                      onClick={() => handleRemoveMedicine(med.id)}
                      style={{
                        marginLeft: "10px",
                        backgroundColor: "red",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      削除
                    </button>
                  </>
                ) : (
                  <span>
                    {med.name} を {med.time} に服用（アラーム:
                    {med.alarm ? "あり" : "なし"}）
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>服薬情報がありません。</p>
        )}

        {/* 新しい薬を追加 */}
        {isEditing && (
          <div style={{ marginTop: "10px" }}>
            <h4>新しい薬を追加 (保存時に自動追加)</h4> {/* 텍스트 변경 */}
            <input
              type="text"
              placeholder="薬の名前"
              value={newMed.name}
              onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
            />
            <input
              type="time"
              value={newMed.time}
              onChange={(e) => setNewMed({ ...newMed, time: e.target.value })}
            />
            <label style={{ marginLeft: "10px" }}>
              アラーム:
              <input
                type="checkbox"
                checked={newMed.alarm}
                onChange={(e) =>
                  setNewMed({ ...newMed, alarm: e.target.checked })
                }
              />
            </label>
            {/* "追加" 버튼을 제거하거나 기능을 변경할 수 있습니다.
                이 예시에서는 제거했습니다. 만약 추가 버튼이 계속 필요하다면,
                handleSave 로직에서 newMed를 다루는 방식과 충돌하지 않도록 조절해야 합니다.
                예: 추가 버튼을 누르면 즉시 editedUser.medicines에 추가되고 newMed를 초기화하는 방식 유지.
                그러면 handleSave에서는 newMed가 비어있는지 아닌지만 확인하면 됩니다.
            */}
          </div>
        )}
      </div>

      {/* 保存ボタン */}
      <div className="modify_button">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            style={{ cursor: "pointer" }}
          >
            修正
          </button>
        ) : (
          <button onClick={handleSave} style={{ cursor: "pointer" }}>
            保存
          </button>
        )}
      </div>
    </div>
  );
}
