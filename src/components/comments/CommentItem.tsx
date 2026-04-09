"use client";

import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { timeAgo } from "@/lib/utils";
import { updateComment, deleteComment } from "@/lib/storage";
import CommentForm from "./CommentForm";

interface Comment {
  id: string;
  projectId: string;
  parentId: string | null;
  userName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface CommentItemProps {
  comment: Comment;
  replies: Comment[];
  projectId: string;
  onRefresh: () => void;
  depth?: number;
}

export default function CommentItem({ comment, replies, projectId, onRefresh, depth = 0 }: CommentItemProps) {
  const { userName } = useUser();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const isAuthor = userName === comment.userName;
  const isEdited = comment.createdAt !== comment.updatedAt;

  const handleEdit = () => {
    if (!editContent.trim()) return;
    updateComment(comment.id, editContent.trim());
    setEditing(false);
    onRefresh();
  };

  const handleDelete = () => {
    if (!confirm("이 의견을 삭제하시겠습니까?")) return;
    deleteComment(comment.id);
    onRefresh();
  };

  return (
    <div className={`${depth > 0 ? "ml-8 border-l-2 border-gray-100 pl-4" : ""}`}>
      <div className="py-3">
        <div className="flex items-start gap-2.5">
          <span className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{comment.userName[0].toUpperCase()}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-gray-800">{comment.userName}</span>
              <span className="text-xs text-gray-400">{timeAgo(comment.createdAt)}</span>
              {isEdited && <span className="text-xs text-gray-400">(수정됨)</span>}
            </div>
            {editing ? (
              <div className="space-y-2">
                <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" rows={2} />
                <div className="flex gap-2">
                  <button onClick={handleEdit} disabled={!editContent.trim()} className="px-3 py-1 bg-indigo-600 text-white rounded text-xs font-medium hover:bg-indigo-700 disabled:opacity-40 transition">저장</button>
                  <button onClick={() => { setEditing(false); setEditContent(comment.content); }} className="px-3 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded transition">취소</button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
            )}
            {!editing && (
              <div className="flex items-center gap-3 mt-2">
                {depth === 0 && <button onClick={() => setShowReplyForm(!showReplyForm)} className="text-xs text-gray-400 hover:text-indigo-600 transition">답글</button>}
                {isAuthor && (
                  <>
                    <button onClick={() => { setEditContent(comment.content); setEditing(true); }} className="text-xs text-gray-400 hover:text-indigo-600 transition">수정</button>
                    <button onClick={handleDelete} className="text-xs text-gray-400 hover:text-red-500 transition">삭제</button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        {showReplyForm && (
          <div className="ml-9 mt-3">
            <CommentForm projectId={projectId} parentId={comment.id} onSubmitted={() => { setShowReplyForm(false); onRefresh(); }} onCancel={() => setShowReplyForm(false)} placeholder={`${comment.userName}님에게 답글...`} />
          </div>
        )}
      </div>
      {replies.map((reply) => (
        <CommentItem key={reply.id} comment={reply} replies={[]} projectId={projectId} onRefresh={onRefresh} depth={depth + 1} />
      ))}
    </div>
  );
}
