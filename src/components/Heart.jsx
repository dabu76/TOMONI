import { useEffect, useState } from "react";
// お気に入りボタン（ハート）コンポーネント
export function HeartButton({ caregiverId, user }) {
  // ハートの状態管理（true: お気に入り済み）
  const [liked, setLiked] = useState(false);
  // ユーザーが以前にお気に入りしていた場合、初期表示でハートを赤にする
  useEffect(() => {
    if (user.favorite.includes(caregiverId)) {
      setLiked(true);
    }
  }, [user, caregiverId]);

  // ハートのカウント（将来的な機能拡張用）
  const [count, setCount] = useState(0);
  // ハートをクリックした時の処理
  const toggleLike = () => {
    setCount(liked ? count - 1 : count + 1);
    setLiked(!liked);
    // ユーザーのお気に入りリストに含まれていれば削除、なければ追加
    if (user.favorite.includes(caregiverId)) {
      user.favorite = user.favorite.filter((num) => num !== caregiverId);
    } else {
      user.favorite.push(caregiverId);
    }
    console.log(user.favorite);
  };
  // UI：ハートアイコン（状態に応じて切り替え）
  return (
    <button className="heart" onClick={toggleLike}>
      {liked ? "❤️" : "🤍"}
    </button>
  );
}
