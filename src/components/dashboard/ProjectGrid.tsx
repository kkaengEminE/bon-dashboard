"use client";

import { useState, useEffect, useCallback } from "react";
import ProjectCard from "./ProjectCard";
import { getProjects, type Project } from "@/lib/storage";

export default function ProjectGrid({
  onSelectProject,
}: {
  onSelectProject: (id: string) => void;
}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState<"all" | "developing" | "testable" | "completed">("all");

  const refresh = useCallback(async () => {
    setProjects(await getProjects());
    setLoaded(true);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const handler = () => refresh();
    window.addEventListener("project-updated", handler);
    return () => window.removeEventListener("project-updated", handler);
  }, [refresh]);

  if (!loaded) return null;

  if (projects.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          등록된 프로젝트가 없습니다
        </h3>
        <p className="text-sm text-gray-400">
          &quot;+ 새 프로젝트&quot; 버튼을 눌러 프로젝트를 추가해보세요.
        </p>
      </div>
    );
  }

  const visibleProjects = projects
    .filter((project) => filter === "all" || project.status === filter || (filter === "testable" && project.status === "deploying"))
    .sort((a, b) => a.name.localeCompare(b.name, "ko"));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="프로젝트 상태 필터">
          {[
            ["all", "전체 보기"],
            ["developing", "개발 중"],
            ["testable", "테스트 가능"],
            ["completed", "완료"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value as typeof filter)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${filter === value ? "border-indigo-600 bg-indigo-600 text-white" : "border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:text-indigo-600"}`}
              aria-pressed={filter === value}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="text-sm text-gray-400">이름순 · {visibleProjects.length}개</span>
      </div>
      {visibleProjects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center text-gray-400">
          해당 상태의 프로젝트가 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleProjects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onSelect={onSelectProject}
        />
          ))}
        </div>
      )}
    </div>
  );
}
