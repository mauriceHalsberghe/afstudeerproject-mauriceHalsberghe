"use client";

import { useState } from "react";

type LikeButtonProps = {
  recipeId: number;
  initialLiked: boolean;
  initialLikeCount: number;
  userId?: number;
};

export default function LikeButton({
  recipeId,
  initialLiked,
  initialLikeCount,
  userId,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [loading, setLoading] = useState(false);

  const toggleLike = async () => {
    if (!userId) {
      console.log("log in to like");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      if (!liked) {
        //like
        await fetch("http://localhost:5041/api/likes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            recipeId,
          }),
        });

        setLiked(true);
        setLikeCount((prev) => prev + 1);
      } else {
        //unlike
        await fetch(
          `http://localhost:5041/api/likes?userId=${userId}&recipeId=${recipeId}`,
          {
            method: "DELETE",
          }
        );

        setLiked(false);
        setLikeCount((prev) => Math.max(prev - 1, 0));
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={toggleLike} disabled={loading}>
      {liked ? "❤️" : "🤍"} {likeCount}
    </button>
  );
}