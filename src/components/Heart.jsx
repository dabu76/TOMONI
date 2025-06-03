import { useState } from "react";

export function HeartButton({ caregiverId, user }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const toggleLike = () => {
    setCount(liked ? count - 1 : count + 1);
    setLiked(!liked);
    if (user.favorite.includes(caregiverId)) {
      user.favorite = user.favorite.filter((num) => num !== caregiverId);
      console.log(user.favorite);
    } else {
      user.favorite.push(caregiverId);
      console.log(user.favorite);
    }
  };

  return (
    <button className="heart" onClick={toggleLike}>
      {liked ? "❤️" : "🤍"} {count}
    </button>
  );
}
