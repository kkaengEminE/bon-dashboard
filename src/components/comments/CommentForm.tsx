"use client";

import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { addComment } from "@/lib/storage";

interface CommentFormProps {
  projectId: string;
  parentId?: string | null;
  onSubmitted: () => void;
  onCancel?: () => void;
  placeholder?: string;
}

export default function CommentForm({ projectId, parentId, onSubmitted, onCancel, placeholder = "의견을 남겨주세요..." }: CommentFormProps) {
  const { userName } = useUser();
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !userName) return;
    await addComment({ projectId, userName, content: content.trim(), parentId: parentId || null });
    setContent("");
    onSubmitted();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold shrink-0">{userName ? userName[0].toUpperCase() : "?"}</span>
        <span className="text-sm font-medium text-gray-700">{userName}</span>
      </div>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder={placeholder} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" rows={parentId ? 2 : 3} />
      <div className="flex justify-end gap-2">
        {onCancel && (<button type="button" onClick={onCancel} className="px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-100 rounded-lg transition">취소</button>)}
        <button type="submit" disabled={!content.trim()} className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 disabled:opacity-40 transition">{parentId ? "답글 작성" : "의견 작성"}</button>
      </div>
    </form>
  );
}
