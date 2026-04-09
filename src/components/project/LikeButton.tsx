"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { isLiked as checkLiked, toggleLike } from "@/lib/storage";

export default function LikeButton({
  projectId,
  initialCount,
}: {
  projectId: string;
  initialCount: number;
}) {
  const { userName } = useUser();
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    if (!userName) return;
    setLiked(checkLiked(projectId, userName));
  }, [projectId, userName]);

  const handleToggle = () => {
    if (!userName) return;
    const result = toggleLike(projectId, userName);
    setLiked(result.liked);
    setCount((c) => (result.liked ? c + 1 : Math.max(c - 1, 0)));
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition ${
        liked
          ? "border-red-300 bg-red-50 text-red-600"
          : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
      }`}
    >
      <svg className="w-5 h-5" fill={liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      <span>좋아요 {count}</span>
    </button>
  );
}
