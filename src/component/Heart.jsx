import { useState } from "react";

export function HeartButton() {
  const [liked, setLiked] = useState(false);

  return (
    <button
      onClick={() => setLiked(!liked)}
      className={liked ? "heart active" : "heart"}
    >
      {liked ? "❤️" : "🤍"}
    </button>
  );
}
