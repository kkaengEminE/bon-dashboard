"use client";

import { useState, useCallback } from "react";
import ProjectGrid from "@/components/dashboard/ProjectGrid";
import AddProjectModal from "@/components/dashboard/AddProjectModal";
import UserNameInput from "@/components/ui/UserNameInput";
import ProjectIframe from "@/components/project/ProjectIframe";
import ProjectInfo from "@/components/project/ProjectInfo";
import LikeButton from "@/components/project/LikeButton";
import EditProjectModal from "@/components/project/EditProjectModal";
import CommentSection from "@/components/comments/CommentSection";
import { useUser } from "@/context/UserContext";
import { getProject, incrementViewCount, type Project } from "@/lib/storage";

export default function DashboardPage() {
  const { userName } = useUser();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const isOwner = selectedProject?.createdBy === userName;

  const handleSelectProject = useCallback(async (id: string) => {
    await incrementViewCount(id);
    const project = await getProject(id);
    if (project) setSelectedProject(project);
  }, []);

  const handleBack = () => {
    setSelectedProject(null);
    window.dispatchEvent(new Event("project-updated"));
  };

  const refreshProject = async () => {
    if (selectedProject) {
      const updated = await getProject(selectedProject.id);
      if (updated) setSelectedProject(updated);
    }
  };

  // Detail View
  if (selectedProject) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-4 sm:px-6">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center gap-3">
                <button onClick={handleBack} className="text-gray-400 hover:text-gray-600 transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h1 className="text-lg font-bold text-gray-900 truncate">{selectedProject.name}</h1>
              </div>
              <div className="flex items-center gap-2">
                {selectedProject.testUrl && (
                  <a href={selectedProject.testUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    새 탭
                  </a>
                )}
                {isOwner && (
                  <button onClick={() => setShowEdit(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    수정
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <div className="flex-1 p-4 min-h-[400px] lg:min-h-0">
            <ProjectIframe testUrl={selectedProject.testUrl} status={selectedProject.status} />
          </div>
          <div className="w-full lg:w-[400px] bg-white border-t lg:border-t-0 lg:border-l border-gray-200 overflow-y-auto">
            <div className="p-5 space-y-5">
              <ProjectInfo project={selectedProject} />
              <div className="flex items-center gap-3">
                <LikeButton projectId={selectedProject.id} initialCount={selectedProject.likeCount} />
              </div>
              <hr className="border-gray-100" />
              <CommentSection projectId={selectedProject.id} />
            </div>
          </div>
        </div>

        {isOwner && (
          <EditProjectModal
            project={selectedProject}
            open={showEdit}
            onClose={() => setShowEdit(false)}
            onUpdated={() => {
              refreshProject();
              window.dispatchEvent(new Event("project-updated"));
            }}
            onDeleted={handleBack}
          />
        )}
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-bold text-gray-900">BON Dashboard</h1>
              <span className="text-xs text-gray-400 hidden sm:inline">프로젝트 검토 플랫폼</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowAddModal(true)} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                새 프로젝트
              </button>
              <UserNameInput />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProjectGrid onSelectProject={handleSelectProject} />
      </main>

      <AddProjectModal open={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}
