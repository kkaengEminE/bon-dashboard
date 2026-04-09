"use client";

import { useState } from "react";
import StatusBadge from "@/components/ui/StatusBadge";

interface Project {
  id: string;
  name: string;
  description: string | null;
  techSpec: string | null;
  usageGuide: string | null;
  status: string;
  testUrl: string | null;
  viewCount: number;
  likeCount: number;
  createdBy: string;
}

export default function ProjectInfo({ project }: { project: Project }) {
  const [copied, setCopied] = useState(false);

  const copyUrl = () => {
    if (project.testUrl) {
      navigator.clipboard.writeText(project.testUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-xl font-bold text-gray-900">{project.name}</h1>
          <StatusBadge status={project.status} />
        </div>
        {project.description && (
          <p className="text-sm text-gray-600 leading-relaxed">{project.description}</p>
        )}
      </div>

      {project.testUrl && (
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-500">테스트 URL</span>
            <button
              onClick={copyUrl}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition"
            >
              {copied ? "복사됨!" : "복사"}
            </button>
          </div>
          <a
            href={project.testUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-indigo-600 hover:underline break-all"
          >
            {project.testUrl}
          </a>
        </div>
      )}

      {project.techSpec && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">기능/기술 스펙</h3>
          <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
            {project.techSpec}
          </p>
        </div>
      )}

      {project.usageGuide && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">사용법</h3>
          <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
            {project.usageGuide}
          </p>
        </div>
      )}

      <div className="flex items-center gap-4 text-sm text-gray-500">
        {project.createdBy && (
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">{project.createdBy[0].toUpperCase()}</span>
            {project.createdBy}
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          조회 {project.viewCount}
        </span>
      </div>
    </div>
  );
}
