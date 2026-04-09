"use client";

import { useState } from "react";
import { useUser } from "@/context/UserContext";
import Modal from "./Modal";

export default function UserNameInput() {
  const { userName, setUserName, showNameModal, setShowNameModal } = useUser();
  const [input, setInput] = useState(userName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    setUserName(trimmed);
    setShowNameModal(false);
  };

  return (
    <>
      <button
        onClick={() => {
          setInput(userName);
          setShowNameModal(true);
        }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition text-sm"
      >
        <span className="w-7 h-7 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold">
          {userName ? userName[0].toUpperCase() : "?"}
        </span>
        <span className="text-gray-700 font-medium">
          {userName || "이름 설정"}
        </span>
      </button>

      <Modal
        open={showNameModal}
        onClose={() => {
          if (userName) setShowNameModal(false);
        }}
        title="이름 입력"
      >
        <form onSubmit={handleSubmit}>
          <p className="text-sm text-gray-500 mb-4">
            검토 의견을 남길 때 표시될 이름을 입력해주세요.
          </p>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="이름을 입력하세요"
            className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            autoFocus
          />
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              확인
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
