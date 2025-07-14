import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";

export default function MyPage() {
  const { user, loading } = useContext(UserContext);

  if (loading) return <p>読み込み中...</p>;
  if (!user) return <p>ログインしてください。</p>;

  return (
    <div className="mypage_container">
      <h2>マイページ</h2>

      <section className="profile-section">
        <h3>基本情報</h3>
        <ul>
          <li>
            <strong>ユーザーID:</strong> {user.userId}
          </li>
          <li>
            <strong>名前:</strong> {user.name}
          </li>
          <li>
            <strong>年齢:</strong> {user.age}歳
          </li>
          <li>
            <strong>疾患:</strong> {user.disease}
          </li>
          <li>
            <strong>メモ:</strong> {user.notes}
          </li>
        </ul>
      </section>

      <section className="medicine-section">
        <h3>服薬情報</h3>
        {user.medicines && user.medicines.length > 0 ? (
          <ul>
            {user.medicines.map((med, idx) => (
              <li key={idx}>
                {med.name} を {med.time} に服用（アラーム:{" "}
                {med.alarm ? "あり" : "なし"}）
              </li>
            ))}
          </ul>
        ) : (
          <p>服薬情報がありません。</p>
        )}
      </section>
    </div>
  );
}
