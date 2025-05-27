import { useState } from "react";

export function HeartButton() {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);

  const toggleLike = () => {
    setCount(liked ? count - 1 : count + 1);
    setLiked(!liked);
  };

  return (
    <button className="heart" onClick={toggleLike}>
      {liked ? "❤️" : "🤍"} {count}
    </button>
  );
}
