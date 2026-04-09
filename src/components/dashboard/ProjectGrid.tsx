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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onSelect={onSelectProject}
        />
      ))}
    </div>
  );
}
