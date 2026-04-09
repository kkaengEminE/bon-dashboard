"use client";

export default function ProjectIframe({
  testUrl,
  status,
}: {
  testUrl: string | null;
  status: string;
}) {
  if (!testUrl || status === "developing") {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
        <div className="text-center">
          <div className="text-5xl mb-4">
            {status === "developing" ? "🚧" : "🔗"}
          </div>
          <h3 className="text-lg font-semibold text-gray-500 mb-1">
            {status === "developing"
              ? "개발 진행 중"
              : "테스트 URL이 없습니다"}
          </h3>
          <p className="text-sm text-gray-400">
            {status === "developing"
              ? "테스트 URL이 등록되면 여기에서 확인할 수 있습니다."
              : "프로젝트 정보를 수정하여 URL을 추가해주세요."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <iframe
      src={testUrl}
      className="w-full h-full rounded-xl border border-gray-200"
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
    />
  );
}
