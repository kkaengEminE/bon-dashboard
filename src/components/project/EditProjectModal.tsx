"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { updateProject, deleteProject as removeProject, type Project } from "@/lib/storage";

interface EditProjectModalProps {
  project: Project;
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
  onDeleted: () => void;
}

export default function EditProjectModal({ project, open, onClose, onUpdated, onDeleted }: EditProjectModalProps) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    techSpec: "",
    usageGuide: "",
    status: "developing" as Project["status"],
    testUrl: "",
  });

  useEffect(() => {
    if (open) {
      setForm({
        name: project.name,
        description: project.description || "",
        techSpec: project.techSpec || "",
        usageGuide: project.usageGuide || "",
        status: project.status,
        testUrl: project.testUrl || "",
      });
    }
  }, [open, project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    await updateProject(project.id, { ...form, testUrl: form.testUrl.trim() || null });
    onUpdated();
    onClose();
  };

  const handleDelete = async () => {
    if (!confirm("이 프로젝트를 삭제하시겠습니까? 모든 의견과 좋아요도 함께 삭제됩니다.")) return;
    await removeProject(project.id);
    onDeleted();
  };

  return (
    <Modal open={open} onClose={onClose} title="프로젝트 수정">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">프로젝트 이름 *</label>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" rows={2} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">기능/기술 스펙</label>
          <textarea value={form.techSpec} onChange={(e) => setForm({ ...form, techSpec: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" rows={3} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">사용법</label>
          <textarea value={form.usageGuide} onChange={(e) => setForm({ ...form, usageGuide: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" rows={2} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Project["status"] })} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="developing">개발중</option>
              <option value="testable">테스트가능</option>
              <option value="completed">완료</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">테스트 URL</label>
            <input type="url" value={form.testUrl} onChange={(e) => setForm({ ...form, testUrl: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="https://..." />
          </div>
        </div>
        <div className="flex items-center justify-between pt-2">
          <button type="button" onClick={handleDelete} className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition">프로젝트 삭제</button>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">취소</button>
            <button type="submit" disabled={!form.name.trim()} className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-40 transition">저장</button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
