"use client";

import { useState } from "react";
import { PREVIEW_IMAGES } from "@/lib/previewImages";

export default function ProjectPreview({ repository, title, status }: { repository: string; title: string; status: string }) {
  const [failed, setFailed] = useState(false);
  if (status === "developing") return (
    <div className="construction-preview" role="img" aria-label="개발 중: 미래 도시 건설 애니메이션">
      <div className="construction-grid" />
      <svg viewBox="0 0 600 300" aria-hidden="true">
        <g className="city-frame" fill="rgba(34,211,238,.07)" stroke="#35c9ed" strokeWidth="1.5">
          <path d="M120 235V165L165 140L210 165V235M120 165L165 190L210 165M165 190V260M120 235L165 260L210 235" />
          <path d="M235 240V105L290 75L345 105V240L290 270ZM235 105L290 135L345 105M290 135V270M235 150L290 180L345 150M235 195L290 225L345 195" />
          <path d="M370 235V150L410 125L450 150V235L410 260ZM370 150L410 175L450 150M410 175V260" />
        </g>
        <g fill="none" stroke="#94efff" strokeWidth="3">
          <path d="M455 220V45H205M455 45L410 15L345 45M438 220V45M438 80L455 110L438 140L455 170L438 200" />
          <g className="crane-cargo"><path d="M270 45V85"/><path fill="#103749" d="M248 85H292V110H248Z"/></g>
        </g>
        <path className="build-scan" d="M80 150H505" stroke="#67e8f9" strokeWidth="2" />
        <g className="build-sparks" fill="#d7fbff"><circle cx="290" cy="76" r="3"/><circle cx="340" cy="106" r="2"/><circle cx="410" cy="126" r="3"/></g>
      </svg>
      <span className="construction-label"><i /> 개발 중 · 공간을 짓고 있어요</span>
    </div>
  );
  const available = PREVIEW_IMAGES.has(repository) && !failed;
  return (
    <div className="actual-preview">
      {available ? (
        // Static screenshots are served from the same Pages deployment.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`/bon-dashboard/previews/${repository}.jpg`} alt={`${title} 첫 진입 화면`} loading="lazy" onError={() => setFailed(true)} />
      ) : <div className="preview-unavailable">{["serene-zen-journey", "kitty-arcade-haven"].includes(repository) ? "접속 오류 · 미리보기 확인 필요" : "등록된 첫 화면이 없습니다"}</div>}
      {available && <span className="capture-label">첫 화면 스크린샷</span>}
    </div>
  );
}
