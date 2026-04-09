"use client";

import { useState, useEffect, useCallback } from "react";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import { getComments, type Comment } from "@/lib/storage";

export default function CommentSection({ projectId }: { projectId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);

  const refresh = useCallback(async () => {
    setComments(await getComments(projectId));
  }, [projectId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const topLevel = comments.filter((c) => !c.parentId);
  const repliesMap = new Map<string, Comment[]>();
  comments.forEach((c) => {
    if (c.parentId) {
      const existing = repliesMap.get(c.parentId) || [];
      existing.push(c);
      repliesMap.set(c.parentId, existing);
    }
  });

  return (
    <div>
      <h3 className="text-sm font-bold text-gray-800 mb-4">의견 {comments.length > 0 && `(${comments.length})`}</h3>
      <CommentForm projectId={projectId} onSubmitted={refresh} />
      <div className="mt-4 divide-y divide-gray-100">
        {topLevel.length === 0 ? (
          <div className="py-6 text-center text-sm text-gray-400">아직 의견이 없습니다. 첫 의견을 남겨보세요!</div>
        ) : (
          topLevel.map((comment) => (
            <CommentItem key={comment.id} comment={comment} replies={repliesMap.get(comment.id) || []} projectId={projectId} onRefresh={refresh} />
          ))
        )}
      </div>
    </div>
  );
}
