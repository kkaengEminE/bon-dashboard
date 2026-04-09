"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { addProject, type Project } from "@/lib/storage";

interface AddProjectModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddProjectModal({ open, onClose }: AddProjectModalProps) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    techSpec: "",
    usageGuide: "",
    status: "developing" as Project["status"],
    testUrl: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    addProject({
      ...form,
      testUrl: form.testUrl.trim() || null,
    });

    setForm({
      name: "",
      description: "",
      techSpec: "",
      usageGuide: "",
      status: "developing",
      testUrl: "",
    });

    window.dispatchEvent(new Event("project-updated"));
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="새 프로젝트 추가">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            프로젝트 이름 *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="프로젝트 이름"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            rows={2}
            placeholder="프로젝트 간단 설명"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">기능/기술 스펙</label>
          <textarea
            value={form.techSpec}
            onChange={(e) => setForm({ ...form, techSpec: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            rows={3}
            placeholder="주요 기능, 기술 스택, 아키텍처 등"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">사용법</label>
          <textarea
            value={form.usageGuide}
            onChange={(e) => setForm({ ...form, usageGuide: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            rows={2}
            placeholder="테스트 시 참고할 사용법"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as Project["status"] })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="developing">개발중</option>
              <option value="testable">테스트가능</option>
              <option value="completed">완료</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">테스트 URL</label>
            <input
              type="url"
              value={form.testUrl}
              onChange={(e) => setForm({ ...form, testUrl: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">취소</button>
          <button type="submit" disabled={!form.name.trim()} className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-40 transition">추가</button>
        </div>
      </form>
    </Modal>
  );
}
