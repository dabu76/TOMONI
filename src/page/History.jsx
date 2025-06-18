import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function History() {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <p>ユーザー情報を読み込み中...</p>;
  }

  return (
    <div>
      <h2>予約履歴ページ</h2>
      {user.reservations?.length > 0 ? (
        user.reservations.map((r, i) => <p>{r.caregiverName}</p>)
      ) : (
        <p>予約記録がありません。</p>
      )}
    </div>
  );
}
